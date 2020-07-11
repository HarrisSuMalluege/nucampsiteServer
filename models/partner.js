/*
2020-07-11
This is to defined partner's schema and the model for all documents in our databases partners collection
By: harris.su.malluege@gmail.com
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Making a shorthand instead of mongoose.Schema.

// Creating Partner Schema
const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps:true
});

// Using the schema to create a promotion model
const Partner = mongoose.model('Partner', partnerSchema);

// Exporting the model
module.exports = Partner;