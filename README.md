# Getting Started

1. Unzip or clone repo and navigate to that directory `cd <directory>`
2. Run `npm install` in the terminal to install dependencies
3. Run `node app.js` in the terminal to start the web server
4. 

# API Documentation

## `POST /iatidoc`

### Request
- XML file

### Responses

### Success
```json
{
    "file_id": "<unique document identifier>"
}
```

### Failure(s)
#### Invalid XML Document
```json
{
    "message": ""
}
```

#### Root element is not `<iati-activities>`
```json
{
    "message": ""
}
```

## `GET /iatidoc/activity-identifiers/<id>`

## Response

### Success
- JSON array of the values of all iati-identifier elements within the document that has unique ID
```json
{
    "message": "EXAMPLE HERE"
}
```

### Failure
#### No document exists with that identifier
```json
{
    "message": "FAILURE MESSAGE HERE"
}
```



# Planning

# Part 1 - Backend
- Tech: Node.js, express, express-fileupload, xml-js
- [ ] POST - Upload file
    - [x] recieve file from POST request
    - [ ] Validation
        - [x] Valid XML 
        - [x] Root element is `<iati-activities>`
        - [ ] validate against Schema??
    - [x] Store file
    - [x] Response w/ unique identifier
- [x] GET - Parse 
    - [x] Get .xml from storage and return JSON array

# Part 2 - SPA Front End
- Tech: HTML, JavaScript, axiom, DOM
- [ ] Form for uploading - makes POST request
    - [ ] Validation
    - [ ] Error display
- [ ] Async action to perform GET request for the JSON array
    - [ ] Error display
    - [ ] Display of JSON array