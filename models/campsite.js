/*
2020-07-09
This is to defined campsite's schemas and the model for all documents in our databases campsites collection
By: harris.su.malluege@gmail.com
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Making a shorthand instead of mongoose.Schema.

// To require mongoose-currency from the library
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// Creating comment Schema (subdocuments).
const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    }
},{
    timestamps: true
});

// Creating a Schema, and include two agruments, the first argument is required.
const campsiteSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }, 
    image: {
        type: String,
        required: true
    },
    elevation: {
        type: Number,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    // Adding array of subdocuments to campsite document.
    comments: [commentSchema]
}, {
    timestamps: true
});

// Using the Schema to create a campsite model.
const Campsite = mongoose.model("Campsite", campsiteSchema);

// Exporting the model
module.exports = Campsite;