'use strict';

/**
 * @ngdoc overview
 * @name keeboo
 * @description
 * # keeboo
 *
 * Main module of the application.
 */
angular
  .module('keeboo', [
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
      .when('/stats', {
        templateUrl: 'views/stats.html',
        controller: 'StatsCtrl'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl'
      })
      .when('/cars', {
        templateUrl: 'views/cars.html',
        controller: 'CarsCtrl'
      })
      .when('/cars/:id', {
        templateUrl: 'views/cardetail.html',
        controller: 'CarDetailCtrl'
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
