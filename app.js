const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');
const xmlConvert = require('xml-js');

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
        if(!req.files) {
            res.status(400).send({
                error: true,
                message: 'No file uploaded'
            });
        } else {
            // Get uploaded document
            let xmlUpload = req.files.xmlUpload // .xmlUpload needs to be name of input field in HTML

            xmlUpload.mv(__dirname + '/file_storage/' + xmlUpload.name);
            
            res.send({
                message: "file saved"
            })
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);