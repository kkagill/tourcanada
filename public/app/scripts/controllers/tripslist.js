'use strict';

/**
 * @ngdoc function
 * @name socialdriveApp.controller:TriplistCtrl
 * @description
 * # TriplistCtrl
 * Controller of the socialdriveApp
 */
angular.module('socialdriveApp')
  .controller('TripsListCtrl', function ($scope, $http) {
    var trip = function (id, name, date){
        this.name = name;
        this.id = id;
        this.date = date;
    };
    
    $scope.trips = [];
    $scope.trips.push(new trip(1, "Seatle", Date.now()));
    $scope.trips.push(new trip(2, "Calgary", Date.now()));
    $scope.trips.push(new trip(3, "UBC", Date.now()));
    
    $http.get('index').
    then(function(response) {
        console.log(response);
    }, function(response) {
        console.log(response);
    });
  });
