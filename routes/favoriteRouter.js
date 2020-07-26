/**
 * 2020-07-25
 * This file is adding favorites
 * By: harris.su.malluege@gmail.com
 */

const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Campsite = require("../models/campsite");
const campsiteRouter = require("./campsiteRouter");
const { response } = require("express");

//  Create the favoriteRouter
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

//  Set up favoriteRouter route
favoriteRouter
  .route("/")
  // Set up an options routing method to handle a pre-filght request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  //  Retrieve the list of favorites for the that user
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })

  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((favoriteId) => {
            if (!favorite.campsites.includes(favoriteId._id)) {
              favorite.campsites.push(favoriteId._id);
              favorite.save()
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                })
                .catch((err) => next(err));
            } else {
             const err = new Error('That campsite is already in the list of favorites!');
             err.status = 401;
             return next(err);
            }
          });
        } else if (!favorite) {
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported!");
  })

  /**
   * Delete the favorite document, if there is any for the user
   */
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

/**
 * Set up favoriteRouter for campsite Id
 */

favoriteRouter
  .route("/:campsiteId")
  // Set up an options routing method to handle a pre-filght request
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))

  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `GET operation is not supported for the campsiteId ${req.params.campsiteId}`
    );
  })

  // req.params.campsiteId
  /**
   * Check if favorite document exists for user
   * if so, only add campsiteId if not already in favorite document
   * if no campsite document for user, add one and add the campsite for the URL parameter to its array of campsites
   */
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // if there is a user then add the fovorite document into campsites array
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        // Add a favorite if the use exists and didn't make it as favorite yet
        if (favorite) {
          req.body.forEach((favoriteId) => {
            if (!favorite.campsites.includes(favoriteId._id)) {
              favorite.campsites.push(favoriteId._id);
              favorite
                .save()
                .then((favorite) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(favorite);
                })
                .catch((err) => next(err));
            } else {
              const err = new Error(
                `That campsite ${req.params.campsiteId} is already in the list of favorites!`
              );
              err.status = 401;
              return next(err);
            }
          });
        } else if (!favorite) {
          // If there no user and favorites, then create both
          Favorite.create({ user: req.user._id, campsites: req.body })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  })

  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported!");
  })

  /**
   * If there is a favorite document for the user, check if campsiteId from URL param is in its campsite array, then delete it
   */

  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          favorite.campsites.forEach((favoriteId) => {
            if (favorite.campsites.includes(req.params.campsiteId)) {
              favorite.campsites.remove(favoriteId);
            }
          });
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  });


module.exports = favoriteRouter;
