/*
2020-07-16
This is file is to create Mongoose User Schema and Model
by: harris.su.malluege@gmail.com
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create user schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    }
});

// Creating a module and exporting
module.exports = mongoose.model('User', userSchema);