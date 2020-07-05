const express = require('express');
const bodyParser = require('body-parser');

const campsiteRouter = express.Router();

campsiteRouter.use(bodyParser.json());

campsiteRouter.route('/')
.all((req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next(); // the next function is passed control of the application routing to the next relevant routing method after this one, otherwise it would just stop here and not go any further
})

.get((req, res) => {
  res.end("Will send all the campsites to you");
})

// Use body-parser to handle user create request
.post((req, res) => {
  res.end(
    `Will add the campsite: ${req.body.name} with description: ${req.body.description}`
  );
})

// To handle user updates
.put((req, res) => {
  res.statusCode = 403;
  res.end("PUT operation not supported on /campsites");
})

// To delete user request
.delete((req, res) => {
  res.end('Deleting all campsites');
});

// Workshop assignment task 1
campsiteRouter.route('/:campsiteId')
.get((req, res) => {
  res.end(`Will send details of the campsite: ${req.params.campsiteId} to you`);
})

// Use body-parser to handle user create request
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /campsites/${req.params.campsiteId}`);
})

// To handle user updates
.put((req, res) => {
  res.write(`Updating the campsite: ${req.params.campsiteId}\n`);
  res.end(`Will update the campsite: ${req.body.name}
    with description: ${req.body.description}`);
})

// To delete user request
.delete((req, res) => {
  res.end(`Deleteing campsite: ${req.params.campsiteId}`);
});


module.exports = campsiteRouter;