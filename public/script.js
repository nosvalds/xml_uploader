((d, w) => {
    // select elements
    let form = d.getElementById('uploadForm');
    let input = d.getElementById('xmlInput');
    let feedback = d.getElementById('invalid-feedback');
    let button = d.getElementById('submitBtn');
    let display = d.getElementById('display-list');

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json")

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        input.classList.remove('is-invalid');

        try {
            // POST XML to Backend API
            let postResult = await fetch(d.URL + 'iatidoc', {
                method: 'POST',
                headers: myHeaders,
                body: new FormData(e.currentTarget) // e.currentTarget is the form
            })
            .then((data) => {
                cleanDisplay();
                return data
            })
            .then(handleResponse)

            // if we get here it's valid XML
            form.classList.add('is-valid');

            // if POST was successfull GET information about identifiers
            let getResult = await fetch(e.target.action +'iatidoc/activity-identifiers/' + postResult.identifier, {
                method: 'GET',
                headers: myHeaders,
            })
            .then(handleResponse)
            
            // insert identifiers into the page
            instertIdentifiers(getResult.data);
            
            disableSubmit(true);
        } catch (error) {
            //  handle error
            input.classList.add('is-invalid');
            feedback.textContent = "Error uploading XML: " + error.message;
            e.stopPropagation();

            disableSubmit(true);
        };
        
    });
    
    input.addEventListener('change', (e) => {
        // enable submit btn once file is in input
        disableSubmit(false);

        // validating file extension 
        let allowedExtensions =  
        /(\.xml)$/i; 
  
        if (!allowedExtensions.exec(e.currentTarget.value)) { 
            alert('Invalid file type, please choose an .xml file'); 
            input.value = ''; 
            return false; 
        }
    });

    const instertIdentifiers = (identifiers) => {
        let fragment = d.createDocumentFragment();
        let header = d.createElement("h3");
        header.textContent = "Activity Identifiers";
        fragment.prepend(header);
        identifiers.forEach((identifier) => {
            let el = d.createElement("li")
            let key = Object.keys(identifier).join('')
            el.textContent = identifier[key];
            fragment.append(el);
        })
        display.append(fragment);
    }

    const disableSubmit = (boolean) => {
        if (boolean) {
            button.setAttribute('disabled', boolean); // disable/enable submit button
            button.setAttribute('aria-disabled', boolean); // disable/enable submit button
        } else {
            // enable submit button 
            button.removeAttribute('disabled'); // enable submit button
            button.setAttribute('aria-disabled', false); // enable submit button
        }
    }

    const cleanDisplay = () => {
        display = d.getElementById('display-list'); // get updated display
        // remove previous results if we had any
        if (display.children.length > 0) {
            Array.from(display.children).forEach((child) => display.removeChild(child));
        }
    }

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