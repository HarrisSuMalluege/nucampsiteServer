/*
2020-07-10
This file is to handle get, put , post and delete (CRUD) endpoints
*/

const express = require('express');
const bodyParser = require('body-parser');
const Campsite = require('../models/campsite');
const { response } = require('express');

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
  .then(campsites => {
    res.statusCode = 200;
    res.setHeader ('Content-Type', 'application/json');
    res.json(campsites);
  })
  .catch(err => next(err));
})

// Use body-parser to handle user create request
.post((req, res, next) => {
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
.put((req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /campsites");
})

// To delete user request
.delete((req, res, next) => {
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
  .then(campsite => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json');
    res.json(campsite);
  })
  .catch(err => next(err));
})

// Use body-parser to handle user create request
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

// To handle user updates
.put((req, res, next) => {
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
.delete((req, res) => {
  Campsite.findByIdAndDelete(req.params.campsiteId)
  .then(response => {
    res.statusCode = 200,
    res.setHeader('Content-Type', 'application/json');
    res.json(response);
  })
  .catch(err => next(err));
});


module.exports = campsiteRouter;