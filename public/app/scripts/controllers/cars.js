'use strict';

/**
 * @ngdoc function
 * @name keeboo.controller:TriplistCtrl
 * @description
 * # TriplistCtrl
 * Controller of the keeboo
 */
angular.module('keeboo')
  .controller('CarsCtrl', function ($scope, $http) {
    var car = function (id, name, date){
        this.name = name;
        this.id = id;
        this.date = date;
    };
    
    $scope.cars = [];
    $scope.cars.push(new car(1, "Toyota xxx", Date.now()));
    $scope.cars.push(new car(2, "Hyundai yyy", Date.now()));
    $scope.cars.push(new car(3, "GTR zzz", Date.now()));
    
    $http.get('index').
    then(function(response) {
        console.log(response);
    }, function(response) {
        console.log(response);
    });
  });
