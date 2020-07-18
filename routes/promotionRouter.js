/*
2020-07-11
This file is to handle get, put, post and delete (CRUD) endpoints
By: harris.su.malluege@gmail.com
*/

const express = require("express");
const bodyParser = require("body-parser");
const Promotion = require("../models/promotion");
const authenticate = require('../authenticate');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route("/")

  //To get access document of promotions 
  .get((req, res, next) => {
    Promotion.find()
    .then(promotions => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(promotions);
    })
    .catch( err => next(err));
  })

  // To handle user create request
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
    .then( promotion => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    })
    .catch( err => next(err));
  })

  // To handle user updates request
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })

  // To delete user request
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.deleteMany()
    .then(response => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch( err => next(err));
  });

// To handle promotion document by id
promotionRouter.route("/:promotionId")

// Accessing the document by id
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
    .then( promotion => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    })
    .catch( err => next(err));
  })


  // To handle user's create by document's id
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })

   // To handle user's update by document's id
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(req.params.promotionId, {
      $set: req.body }, 
      {new: true})
    .then( promotion => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(promotion);
    })
    .catch(err => next(err));
  })

  // To handle user's delete request
  .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
    .then(response => {
      res.statusCode = 200,
      res.setHeader('Content-Type', 'application/json');
      res.json(response);
    })
    .catch( err => next(err));
  });

module.exports = promotionRouter;
