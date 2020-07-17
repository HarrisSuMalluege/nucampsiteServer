/*
2020-07-16
This file is centralizing server configuration information.
by: harris.su.malluege@gmail.com
*/


// Export the secret key for using to sign the JSON web token
module.exports = {
    'secretKey': '12345-67890-09876-543212',
    'mongoUrl': 'mongodb://localhost:27017/nucampsite'
}
