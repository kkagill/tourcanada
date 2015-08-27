var express = require('express');
var trips = express.Router();

// middleware specific to this router
trips.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});
// define the home page route
trips.get('/', function(req, res) {
  res.send('list of trips');
});
// define the about route
trips.get('/:id', function(req, res) {
  var tripId = req.params.id;
  res.send(tripId);
});

module.exports = trips;