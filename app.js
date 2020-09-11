const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const fs = require('fs');
const fsPromises = fs.promises;

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

// set port 
const port = process.env.PORT || 3000;

// serve the public folder for the front end
app.use(express.static('public'))

// POST /iatidoc
app.post('/iatidoc', async (req, res) => {
    try {
        if (!req.files) {
            throw new Error('No file uploaded')
        } else {
            // Get uploaded document from request
            let xmlIn = req.files.xmlUpload // .xmlUpload is the name of input field in HTML
            // valdation using xml2js parser
            let parsed = await parser.parseStringPromise(xmlIn.data)

            // Check root element is <iati-activities>
            if (Object.keys(parsed).join('') !== 'iati-activities') {
                throw new Error("Root element is not <iati-activities>")
            };
            
            // store document
            let filePath = __dirname + '/file_storage/' + xmlIn.md5 + '.xml';
            await xmlIn.mv(filePath);

            res.send({
                message: "file uploaded",
                identifier: xmlIn.md5
            })
        }
    } catch (err) {
        res.status(422).send({
            "error": "Error uploading xml file",
            "message": err.message
        });
    }
})

app.get('/iatidoc/activity-identifiers/:documentId', async (req, res) => {
    try {
        let filePath = __dirname + '/file_storage/' + req.params.documentId + '.xml';

        // read file from storage
        let data = await fsPromises.readFile(filePath)
            
        // parse xml to a js object
        let result = await parser.parseStringPromise(data)

        // return a JSON array of iati-identifier elements
        res.send({ 
            "data": [...result["iati-activities"]["iati-activity"]]
                .map((val) => (
                    {"iati-identifier": val["iati-identifier"].join('')}
                ))
        })
    } catch (err) {
        res.status(422).send({
            "error": "Error loading or parsing xml file",
            "message": err.message
        });
    }
});

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);