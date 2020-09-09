((d, w) => {

    let form = d.getElementById('uploadForm');
    let input = d.getElementById('xmlInput');
    let feedback = d.getElementById('invalid-feedback');
    let button = d.getElementById('submitBtn');
    let display = d.getElementById('display-list');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        input.classList.remove('is-invalid');

        // TODO do something here to show user that form is being submitted
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json")

        fetch(e.target.action, {
            method: 'POST',
            headers: myHeaders,
            body: new FormData(e.currentTarget) // event.currentTarget is the form
        })
        .then((data) => {
            display = d.getElementById('display-list'); // get updated display
            if (display.children.length > 0) {
                Array.from(display.children).forEach((child) => display.removeChild(child));
            }
            return data
        })
        .then(handleResponse)
        .then((data) => {
            // TODO handle success
            form.classList.add('is-valid');
            fetch('http://localhost:3000/iatidoc/activity-identifiers/' + data.identifier, {
                method: 'GET',
                headers: myHeaders,
            })
                .then(handleResponse)
                .then((data) => {
                    let fragment = d.createDocumentFragment();
                    let header = d.createElement("h3");
                    header.textContent = "Activity Identifiers";
                    fragment.prepend(header);
                    data.data.forEach((identifier) => {
                        let el = d.createElement("li")
                        let key = Object.keys(identifier).join('')
                        el.textContent = identifier[key];
                        fragment.append(el);
                    })
                    display.append(fragment);

                    button.setAttribute('disabled', true); // disable submit button
                    button.setAttribute('aria-disabled', true); // disable submit button
                })
        })
        .catch((error) => {
            //  handle error
            input.classList.add('is-invalid');
            feedback.textContent = "Error uploading XML: " + error.message;
            e.stopPropagation();
            input.focus();

            button.setAttribute('disabled', true); // disable submit button
            button.setAttribute('aria-disabled', true); // disable submit button
        });
    });
    
    input.addEventListener('change', (e) => {
        // enable submit button once the input is clicked
        button.removeAttribute('disabled'); // enable submit button
        button.setAttribute('aria-disabled', false); // enable submit button

        // Checking file type 
        let allowedExtensions =  
        /(\.xml)$/i; 
  
        if (!allowedExtensions.exec(e.currentTarget.value)) { 
            alert('Invalid file type, please choose an .xml file'); 
            input.value = ''; 
            return false; 
        }
    })

})(document, window)

// Handle fetch response 
const handleResponse = (response) => {
    if (!response.ok) {
        return response.json().then(json => {
            throw new Error(json.message)
        });
    }
    return response.json();
}