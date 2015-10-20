'use strict';

/**
 * @ngdoc function
 * @name keeboo.controller:TripdetailCtrl
 * @description
 * # TripdetailCtrl
 * Controller of the keeboo
 */
 angular.module('keeboo')
     .controller('UsersCtrl', function($scope) {

         //same marker clusterer car icon for different zoom levels
         var styles = [{
             url: '../images/car.png',
             height: 30,
             width: 30,
             textColor: 'orange',
             textSize: 20
         }, {
             url: '../images/car.png',
             height: 30,
             width: 30,
             textColor: 'orange',
             textSize: 20
         }, {
             url: '../images/car.png',
             height: 30,
             width: 30,
             textColor: 'orange',
             textSize: 20
         }];

         //Vancouver coordinates for drawing polygon
         var vancouverCoordinates = [
           {lat: 49.221942, lng: -123.023572},
           {lat: 49.293225, lng: -123.023186},
           {lat: 49.295968, lng: -123.136225},
           {lat: 49.276037, lng: -123.214674},
           {lat: 49.276037, lng: -123.214674},
           {lat: 49.258451, lng: -123.215446},
           {lat: 49.258002, lng: -123.197079},
           {lat: 49.234581, lng: -123.196821},
           {lat: 49.202794, lng: -123.134251},
           {lat: 49.210981, lng: -123.101807},
           {lat: 49.225221, lng: -123.101635},
           {lat: 49.22197,  lng: -123.023529}
         ];

         var mapOptions = {
             zoom: 11,
             styles: styles,
             center: new google.maps.LatLng(49.2648809977945, -123.01776962890625),
             mapTypeId: google.maps.MapTypeId.TERRAIN
         };

         $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

         $scope.markers = [];

         var infoWindow = new google.maps.InfoWindow();

         var createMarker = function(info) {

             var marker = new google.maps.Marker({
                 map: $scope.map,
                 position: new google.maps.LatLng(info.lat, info.long),
                 //car icon for a individual marker
                 icon: 'http://icons.iconarchive.com/icons/iconshock/real-vista-transportation/32/vintage-car-icon.png'
             });

             marker.content = '<div class="infoWindowContent">' + info.location + '</div>';

             google.maps.event.addListener(marker, 'click', function() {
                 infoWindow.setContent('<h2>' + info.number + '</h2>' + marker.content);
                 infoWindow.open($scope.map, marker);
             });

             $scope.markers.push(marker);
         }

         for (var i = 0; i < coordinates.length; i++) {
             createMarker(coordinates[i]);
         }

         // Start Marker Clusterer
         $scope.markerCluster = new MarkerClusterer($scope.map, $scope.markers, mapOptions);

          // Construct the polygon.
          var vancouver = new google.maps.Polygon({
            paths: vancouverCoordinates,
            strokeColor: '#18FC4D',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            fillColor: '#18FC4D',
            fillOpacity: 0.10
          });
          vancouver.setMap($scope.map);

         $scope.openInfoWindow = function(e, selectedMarker) {
             e.preventDefault();
             google.maps.event.trigger(selectedMarker, 'click');
         }


     });
