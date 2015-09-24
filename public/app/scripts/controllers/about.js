'use strict';

/**
 * @ngdoc function
 * @name keeboo.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the keeboo
 */
angular.module('keeboo')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
