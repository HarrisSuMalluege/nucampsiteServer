/*
2020-07-16
This file is centralizing server configuration information.
by: harris.su.malluege@gmail.com
*/


// Export the secret key for using to sign the JSON web token
module.exports = {
    'secretKey': '12345-67890-09876-543212',
    'mongoUrl': 'mongodb://localhost:27017/nucampsite',
    // Using face book to authenticated
    'facebook': {
        clientId: '701196114064168',
        clientSecret: '6bcde005ef93dc1612a0d9712992e74b'
    },
    'google': {
        clientId: '942828781750-a24hd33361nlvfdnapemeqcjq7lribto.apps.googleusercontent.com',
        clientSecret: 'Wf85UQrZDEBaIXK7jdTrcKl3'
    }
}