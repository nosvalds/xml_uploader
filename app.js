const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const fs = require('fs');
const util = require('util');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

//start app 
const port = process.env.PORT || 3000;

// POST /iatidoc
app.post('/iatidoc', async (req, res) => {
    try {
        if (!req.files) {
            throw new Error('No file uploaded')
        } else {
            // Get uploaded document from request
            let xmlIn = req.files.xmlUpload // .xmlUpload needs to be name of input field in HTML
            // valdation 
            parser.parseString(xmlIn.data, (err, result) => {
                if (err) throw err;
                // Check root element is <iati-activities>
                if (Object.keys(result).join('') !== 'iati-activities') {
                    throw new Error("Root element is not <iati-activities>")
                };
            });
            // store document
            let filePath = __dirname + '/file_storage/' + xmlIn.md5 + '.xml';
            xmlIn.mv(filePath, (err) => {
                if (err) throw err;
                res.send({
                    message: "file uploaded",
                    identifier: xmlIn.md5
                })
            });
        }
    } catch (err) {
        res.status(400).send({
            "error": "Error uploading xml file",
            "message": err.message
        });
    }
})

app.get('/iatidoc/activity-identifiers/:documentId', async (req, res) => {
    try {
        if (!req.params.documentId) {
            throw new Error("No documentId provided")
        } else {
            let filePath = __dirname + '/file_storage/' + req.params.documentId + '.xml';

            // read file from storage
            fs.readFile(filePath , (err, data) => {
                if (err) throw err;

                // parse xml to a js object
                parser.parseString(data, (err, result) => {
                    if (err) throw err;

                    // return a JSON array of iati-identifier elements
                    res.send({ 
                        "data": result["iati-activities"]["iati-activity"]
                                .map((val) => (
                                    {"iati-identifier": val["iati-identifier"].join('')}
                                ))
                    })
                });
            });
        }
    } catch (err) {
        res.status(400).send({
            "error": "Error loading or parsing xml file",
            "message": err.message
        });
    }
});

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);