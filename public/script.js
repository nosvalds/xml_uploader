((d, w) => {

    const form = d.getElementById('uploadForm');
    const input = d.getElementById('xmlInput');
    const feedback = d.getElementById('invalid-feedback');
    const display = d.getElementById('display-list');


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
                })
        })
        .catch((error) => {
            //  handle error
            input.classList.add('is-invalid');
            feedback.textContent = "Error uploading XML: " + error.message;
            e.stopPropagation();
        });
    });
    

    // window.addEventListener('load', function() {
    //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
    //     let forms = document.getElementsByClassName('needs-validation');
    //     // Loop over them and prevent submission
    //     let validation = Array.prototype.filter.call(forms, function(form) {
    //       form.addEventListener('submit', function(event) {
    //         if (form.checkValidity() === false) {
    //           event.preventDefault();
    //           event.stopPropagation();
    //         }
    //         form.classList.add('was-validated');
    //       }, false);
    //     });
    //   }, false);

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