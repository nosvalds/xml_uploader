# Getting Started

## Requirements

- [node.js](https://nodejs.org/en/download/)
    - Install with [homebrew](https://formulae.brew.sh/formula/node) on Mac
      - `brew install node`

## Steps
1. Unzip the provided file or clone [github repo](git@github.com:nosvalds/xml_uploader.git) and navigate to the new directory `cd <directory>`
    - It's currently a private repo so ask me for access if you want to go that way
2. Run `npm install` in the terminal to install dependencies
3. Run `node app.js` in the terminal to start the web server
4. Navigate to http://localhost:3000/ in your favourite browser

# API Documentation

## Headers
- Accept: application/json
## `POST /iatidoc`

### Request
- Header: Content-Type: multipart/form-data
- XML file from form with name="xmlUpload"

### Responses

### Success
```json
{
    "message": "file uploaded",
    "identifier": "9d03613dd895dcb1dbca361dad776562"
}
```

### Failures
#### No file
```json
{
    "error": "Error uploading xml file",
    "message": "No file uploaded"
}
```
#### Invalid XML Document
```json
{
    "error": "Error uploading xml file",
    "message": "<depends on parsing error>"
}
```

#### Root element is not `<iati-activities>`
```json
{
    "error": "Error uploading xml file",
    "message": "Root element is not <iati-activities>"
}
```

## `GET /iatidoc/activity-identifiers/<id>`

## Response

### Success
- JSON array of the values of all iati-identifier elements within the document that has unique ID
```json
{
    "data": [
        {
            "iati-identifier": "AA-AAA-123456789-ABC123"
        },
        {
            "iati-identifier": "BB-BBB-123456789-ABC123"
        }
    ]
}
```

### Failure
#### No document exists with that identifier
```json
{
    "error": "Error loading or parsing xml file",
    "message": "ENOENT: no such file or directory, open '/Users/nosvalds/Projects/IATIDevTest/XML_uploader/file_storage/9d03613dd895dcb1dbca361dad7765.xml'"
}
```



# Planning

# Part 1 - Backend
- Tech: Node.js, express, express-fileupload, xml-js
- [x] POST - Upload file
    - [x] recieve file from POST request
    - [x] Validation
        - [x] Valid XML 
        - [x] Root element is `<iati-activities>`
    - [x] Store file
    - [x] Response w/ unique identifier
- [x] GET - Parse 
    - [x] Get .xml from storage and return JSON array

# Part 2 - SPA Front End
- Tech: HTML, JavaScript, DOM
- [x] Form for uploading - makes POST request
    - [x] Validation
    - [x] Error display
- [x] Async action to perform GET request for the JSON array
    - [x] Error display
    - [x] Display of JSON array

# To Dos
- [x] Update documentation
- [x] Test from .zip