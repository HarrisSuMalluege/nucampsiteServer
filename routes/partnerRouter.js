/*
2020-07-11
This file is to handle get, put, post and delete (CRUD) endpoints
By: harris.su.malluege@gmail.com
*/

const express = require("express");
const bodyParser = require("body-parser");
const Partner = require('../models/partner');
const authenticate = require('../authenticate');
const cors = require('./cors');

const partnerRouter = express.Router();

partnerRouter.use(bodyParser.json());

partnerRouter.route("/")
  // Set up an options routing method to handle a pre-filght request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Partner.find()
    .then(partners => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(partners);
    })
    .catch( err => next(err));
  })
  // Use body-parser to handle user create request
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.create(req.body)
    .then( partner => {
      console.log('Partner Created', partner);
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(partner);
    })
    .catch( err => next(err));
  })

  // To handle user updates request
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /partners.");
  })

  // To delete user request
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.deleteMany()
    .then( response => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch( err => next(err));
  });

// To handle partner document by id
partnerRouter.route("/:partnerId")
  // Set up an options routing method to handle a pre-filght request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// Accessing the document by id
  .get(cors.cors, (req, res, next) => {
    Partner.findById(req.params.partnerId)
    .then( partner => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(partner);
    })
    .catch( err => next(err));
  })

  // To handle user's create by document's id
  .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /partners/${req.params.partnerId}`
    );
  })

  // To handle user's update by document's id
  .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(req.params.partnerId, {
      $set: req.body },
      { new: true })
      .then(partner => {
        res.statusCode = 200,
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch( err => next(err));
  })

  // To handle user's delete request
  .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
    .then(response => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch( err => next(err));
  });

module.exports = partnerRouter;
