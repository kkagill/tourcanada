var express = require('express');
var user = express.Router();

// define the home page route
user.get('/', function(req, res) {
  res.send('list of user');
});
// define the about route
user.get('/:id', function(req, res) {
  var tripId = req.params.id;
  res.send(tripId);
});

module.exports = user;