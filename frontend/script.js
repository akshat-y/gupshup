document.getElementById('login_button').addEventListener('click', () => {

    const login_button = document.getElementById('login_button')
    login_button.classList.add("loading")
    login_button.disabled = true

    const username_field = document.getElementById('username_input')
    const password_field = document.getElementById('password_input')

    username_field.disabled = true
    password_field.disables = true

    const username = username_field.value
    const password = password_field.value

    if (!validateLoginForm(username, password)) {
        document.getElementById('login_button').classList.remove("loading")
        username_field.disabled = false
        password_field.disables = false
        login_button.disabled = false
        return
    }

    login(username, password)
})

function login(username, password) {
    console.log("trying to login")
    fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: new URLSearchParams({
            'username': username,
            'password': password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.message === 'Login successful') {
            // Redirect or show success message
        }
    })
    .catch(error => {
        console.log("Failed -- ", error);        
    })
}

function validateLoginForm(username, password) {

    let error_message = ''
    if (!username)
        error_message = 'Username Required'
    else if (!password)
        error_message = 'Password Required'

    const error_field = document.getElementById('form_error_info')
    if (error_message) {
        error_field.classList.add("visible")
        error_field.textContent = error_message
        return false
    }

    error_field.classList.remove("visible")
    return true
}


// document.getElementById('rootButton').addEventListener('click', () => {
//     fetch('http://127.0.0.1:8000/')
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('rootResult').innerText = JSON.stringify(data);
//         })
//         .catch(error => {
//             document.getElementById('rootResult').innerText = 'Error: ' + error;
//         });
// });

// document.getElementById('itemButton').addEventListener('click', () => {
//     const itemId = document.getElementById('itemId').value;
//     const query = document.getElementById('query').value;
//     let url = `http://127.0.0.1:8000/items/${itemId}`;
//     if (query) {
//         url += `?q=${encodeURIComponent(query)}`;
//     }

//     fetch(url)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById('itemResult').innerText = JSON.stringify(data);
//         })
//         .catch(error => {
//             document.getElementById('itemResult').innerText = 'Error: ' + error;
//         });
// });
