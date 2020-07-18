/*
2020-07-10
This file is to handle get, put , post and delete (CRUD) endpoints
*/

const express = require('express');
const bodyParser = require('body-parser');
const Campsite = require('../models/campsite');
const authenticate = require('../authenticate');

const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

campsiteRouter.route('/')
// .all((req, res, next) => {
//   res.statusCode = 200;
//   res.setHeader("Content-Type", "text/plain");
//   next(); // the next function is passed control of the application routing to the next relevant routing method after this one, otherwise it would just stop here and not go any further
// })

.get((req, res, next) => {
  Campsite.find()
  // Using .populate() method to retureve for get requests 
  .populate('comments.author')
  .then(campsites => {
    res.statusCode = 200;
    res.setHeader ('Content-Type', 'application/json');
    res.json(campsites);
  })
  .catch(err => next(err));
})

// Use body-parser to handle user create request
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.create(req.body)
  .then(campsite => {
    console.log('Campsite Created ', campsite);
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })
  .catch(err => next(err));
})

// To handle user updates
.put(authenticate.verifyUser,(req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /campsites");
})

// To delete user request
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.deleteMany()
  .then(response => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});

// Workshop assignment task 1
campsiteRouter.route('/:campsiteId')
.get((req, res, next) => {
  Campsite.findById(req.params.campsiteId)
    .populate("comments.author")
    .then((campsite) => {
      (res.statusCode = 200), res.setHeader("Content-Type", "application/json");
      res.json(campsite);
    })
    .catch((err) => next(err));
})

// Use body-parser to handle user create request
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

// To handle user updates
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.findByIdAndUpdate(req.params.campsiteId, {
    $set: req.body },
    { new: true })
    .then(campsite => {
      res.statusCode =200,
      res.setHeader('Content-Type', 'application/json');
      res.json(campsite);
    })
    .catch(err => next(err));
})

// To delete user request
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
  Campsite.findByIdAndDelete(req.params.campsiteId)
  .then(response => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});


// Handling comments
campsiteRouter.route('/:campsiteId/comments')
.get((req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  // Using .populate() method to retureve for get requests 
  .populate('comments.author')
  .then(campsite => {
    if(campsite) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(campsite.comments);
    } else {
      err = new Error(`Campsite ${req.params.campsiteId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})

// Use body-parser to handle user create request
.post(authenticate.verifyUser, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
  .then(campsite => {
    if(campsite) {
      req.body.author = req.user._id; // To update the user id when the author submitted
      campsite.comments.push(req.body);
      campsite.save()
      .then( campsite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(campsite);
      })
      .catch( err => next(err));
    } else {
      err = new Error(`Campsite ${req.params.campsiteId} not found`);
      err.status = 404;
      return next(err);
    }
  })
  .catch(err => next(err));
})

// To handle user updates
.put(authenticate.verifyUser, (req, res) => {
  res.statusCode = 403;
  res.end(`PUT operation not supported on /campsites/${req.params.campsiteId}/comments`);
})

// Removing comments
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
  Campsite.findById(req.params.campsiteId)
    .then((campsite) => {
      if (campsite) {
        for (let i = (campsite.comments.length-1); i >= 0; i--) {
          campsite.comments.id(campsite.comments[i]._id).remove();
        }
        campsite.save()
        .then((campsite) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite);
        })
        .catch((err) => next(err));
      } else {
        err = new Error(`Campsite ${req.params.campsiteId} not found`);
        err.status = 404;
        return next(err);
      }
    })
    .catch((err) => next(err));
});

// Handling Comments ID request
campsiteRouter
  .route("/:campsiteId/comments/:commentId")
  .get((req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      // Using .populate() method to retureve for get requests
      .populate("comments.author")
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(campsite.comments.id(req.params.commentId));
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  // Use body-parser to handle user create request
  .post(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /campsites/${req.params.campsiteId}/comments/${req.params.commentId}`
    );
  })

  // To handle user updates
  .put(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          console.log(campsite.comments.id(req.params.commentId).author);
          console.log(req.user._id);
          if ( req.user._id.equals( campsite.comments.id(req.params.commentId).author )) {
            if (req.body.rating) {
              campsite.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.text) {
              campsite.comments.id(req.params.commentId).text = req.body.text;
            }
            campsite
              .save()
              .then((campsite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(campsite);
              })
              .catch((err) => next(err));
          } else {
            const err = new Error("Sorry! User is not authrized!");
            err.status = 403;
            return next(err);
          }
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })

  // Removing comments ID
  .delete(authenticate.verifyUser, (req, res, next) => {
    Campsite.findById(req.params.campsiteId)
      .then((campsite) => {
        if (campsite && campsite.comments.id(req.params.commentId)) {
          if ( req.user._id.equals( campsite.comments.id(req.params.commentId).author )) {
          campsite.comments.id(req.params.commentId).remove();
          campsite
            .save()
            .then((campsite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(campsite);
            })
            .catch((err) => next(err));
          } else {
            const err = new Error("Sorry! User is not authrized!");
            err.status = 403;
            return next(err);
          } 
        } else if (!campsite) {
          err = new Error(`Campsite ${req.params.campsiteId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = campsiteRouter;