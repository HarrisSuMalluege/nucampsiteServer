/**
 * 2020-07-25
 * This file is to create Mongoose Favorite Schema and module
 * By: harris.su.malluege@gmail.com
 */

 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const favoriteSchema = new Schema ({
     user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
     },
    //  Using square brackets to enable to store an array of campsite IDs in this field
     campsites: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Campsite'
     }]},
     {
         timestamps: true
 });

 const Favorite = mongoose.model('Favorite', favoriteSchema);
 module.exports = Favorite;