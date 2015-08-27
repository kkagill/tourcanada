'use strict';

/**
 * @ngdoc overview
 * @name socialdriveApp
 * @description
 * # socialdriveApp
 *
 * Main module of the application.
 */
angular
  .module('socialdriveApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'uiGmapgoogle-maps'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/trips', {
        templateUrl: 'views/tripslist.html',
        controller: 'TripsListCtrl'
      })
      .when('/trips/:tripId', {
        templateUrl: 'views/tripdetail.html',
        controller: 'TripDetailCtrl'
      })
      .when('/friends', {
        templateUrl: 'views/friends.html',
        controller: 'FriendsCtrl'
      })
      .when('/start', {
        templateUrl: 'views/start.html',
        controller: 'StartCtrl'
      })
      .when('/friends/:friendId', {
        templateUrl: 'views/frienddetail.html',
        controller: 'FriendDetailCtrl'
      })
      .when('/me', {
        templateUrl: 'views/userhome.html',
        controller: 'UserHomeCtrl'
      })
      .when('/account', {
        templateUrl: 'views/useraccount.html',
        controller: 'UserAccountCtrl'
      })
      .when('/driving', {
        templateUrl: 'views/userdriving.html',
        controller: 'UserDrivingCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDU7aoIXI88Ncy6B6A6XQSbi868o7JiUbY',
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
  })
  .run(function($rootScope, $location){
    $rootScope.$on('$routeChangeStart', function (event) {
        var currentUser = Parse.User.current();
        if (!currentUser)
            $location.path("/");
    })
  });
