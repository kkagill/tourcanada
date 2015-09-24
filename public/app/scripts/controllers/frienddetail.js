'use strict';

/**
 * @ngdoc function
 * @name keeboo.controller:FrienddetailCtrl
 * @description
 * # FrienddetailCtrl
 * Controller of the keeboo
 */
angular.module('keeboo')
  .controller('FriendDetailCtrl', function ($scope, $routeParams) {
    $scope.friendId = $routeParams.friendId;
    
    var friendDetail = function(id, name, rating, distance, avgEcon, fuelLevel, serviceDate, car, imgUrl){
        this.id = id;
        this.name = name;
        this.imgUrl = imgUrl;
        this.car = car;
        this.avgEcon = avgEcon;
        this.rating = rating;
        this.distance = distance;
        this.fuelLevel = fuelLevel;
        this.serviceDate = serviceDate;
        this.imageUrl = imgUrl;
    }
    
    $scope.friend = new friendDetail(1, "Nam", "A", 13.3, "6.27L/100km", 1.73, "Recommended Next SD: 100 days", null, "http://friend.img.url");
    
  });
