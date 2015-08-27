'use strict';

/**
 * @ngdoc function
 * @name socialdriveApp.controller:FriendsCtrl
 * @description
 * # FriendsCtrl
 * Controller of the socialdriveApp
 */
angular.module('socialdriveApp')
  .controller('FriendsCtrl', function ($scope) {
    var trip = function (id, name, date, econ){
        this.name = name;
        this.id = id;
        this.date = date;
        this.econ = econ;
    };
    
    $scope.trips = [];
    $scope.trips.push(new trip(1, "Seatle", Date.now(), "13.5L/100km"));
    $scope.trips.push(new trip(2, "UBC", Date.now(), "13.5L/100km"));
    
    var friend = function(id, name, car, avgEcon, imgUrl){
        this.id = id;
        this.name = name;
        this.car = car;
        this.avgEcon = avgEcon;
        this.imgUrl = imgUrl;
    }
    
    $scope.friends = [];
    $scope.friends.push(new friend(1, "Nam", "Hyundai Sonata 2014", "13.5L/100km", "http://friend.img.url"));
    $scope.friends.push(new friend(2, "Giang", "Mercedes E 2010", "13.5L/100km", "http://friend.img.url"));
    $scope.friends.push(new friend(2, "Ky", "BMW 2020", "13.5L/100km", "http://friend.img.url"));
    
    
  });
