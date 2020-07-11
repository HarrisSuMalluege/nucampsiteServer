/*
2020-07-11
This is to defined promotion's schema and the model for all documents in our databases partners collection
By: harris.su.malluege@gmail.com
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema; // Making a shorthand instead of mongoose.Schema.

// To require mongoose-currency from the library
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// Creating promotion schema
const promotionSchema = new Schema({
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
        trye: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
},{
    timestamps: true
});

// Using the schema to create a promotion model
const Promotion = mongoose.model('Promotion', promotionSchema);

// Exporting the model
module.exports = Promotion;