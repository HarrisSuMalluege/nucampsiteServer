/*
2020-07-16
This is file is to create Mongoose User Schema and Model
by: harris.su.malluege@gmail.com
*/

const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

// Create user schema
const userSchema = new Schema({
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    facebookId: String,
    admin: {
        type: Boolean,
        default: false
    }
});

// To use plugin method to plug in user schema
userSchema.plugin(passportLocalMongoose);

// Creating a module and exporting
module.exports = mongoose.model('User', userSchema);