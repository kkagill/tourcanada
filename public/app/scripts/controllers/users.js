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

        var mapOptions = {
            zoom: 11,
            styles: stylesCar,
            center: new google.maps.LatLng(49.2648809977945, -123.01776962890625)
        };
        var mapOptionsGas = {
            styles: stylesGas
        };
        var mapOptionsRestaurant = {
            styles: stylesRestaurant
        };
        var mapOptionsParty = {
            styles: stylesParty
        };
        var mapOptionsMusic = {
            styles: stylesMusic
        };
        var mapOptionsMovie = {
            styles: stylesMovie
        };
        var mapOptionsOpera = {
            styles: stylesOpera
        };

        $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        $scope.markersCar = [];
        $scope.markersGas = [];
        $scope.markersRestaurant = [];
        $scope.markersParty = [];
        $scope.markersMusic = [];
        $scope.markersMovie = [];
        $scope.markersOpera = [];

        var infoWindow = new google.maps.InfoWindow();

        $scope.openInfoWindow = function(e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

        var createMarker = function(info) {
            var icon = "";
            var data = markers[i];
            switch (data.type) {
                case "car":
                    icon = '../images/car.png';
                    break;
                case "gas":
                    icon = '../images/gas.png';
                    break;
                case "restaurant":
                    icon = '../images/restaurant.png';
                    break;
                case "party":
                    icon = '../images/party.png';
                    break;
                case "music":
                    icon = '../images/music.png';
                    break;
                case "movie":
                    icon = '../images/movie.png';
                    break;
                case "opera":
                    icon = '../images/opera.png';
                    break;
            }

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                // Individual marker
                icon: new google.maps.MarkerImage(icon)
            });
            marker.content = '<div class="infoWindowContent">' + info.location + '</div>';
            google.maps.event.addListener(marker, 'click', function() {
                infoWindow.setContent('<h2>' + info.number + '</h2>' + marker.content);
                infoWindow.open($scope.map, marker);
            });

            switch (data.type) {
                case "car":
                    $scope.markersCar.push(marker);
                    break;
                case "gas":
                    $scope.markersGas.push(marker);
                    break;
                case "restaurant":
                    $scope.markersRestaurant.push(marker);
                    break;
                case "party":
                    $scope.markersParty.push(marker);
                    break;
                case "music":
                    $scope.markersMusic.push(marker);
                    break;
                case "movie":
                    $scope.markersMovie.push(marker);
                    break;
                case "opera":
                    $scope.markersOpera.push(marker);
                    break;
            }
        };

        for (var i = 0; i < markers.length; i++) {
            createMarker(markers[i]);
        }

        // Start Marker Clusterer for each point-of-interest
        $scope.markerClusterCar = new MarkerClusterer($scope.map, $scope.markersCar, mapOptions);
        $scope.markerClusterGas = new MarkerClusterer($scope.map, $scope.markersGas, mapOptionsGas);
        $scope.markerClusterRestaurant = new MarkerClusterer($scope.map, $scope.markersRestaurant, mapOptionsRestaurant);
        $scope.markerClusterParty = new MarkerClusterer($scope.map, $scope.markersParty, mapOptionsParty);
        $scope.markerClusterMusic = new MarkerClusterer($scope.map, $scope.markersMusic, mapOptionsMusic);
        $scope.markerClusterMovie = new MarkerClusterer($scope.map, $scope.markersMovie, mapOptionsMovie);
        $scope.markerClusterOpera = new MarkerClusterer($scope.map, $scope.markersOpera, mapOptionsOpera);

        // Construct the polygon
        var vancouver = new google.maps.Polygon({
            paths: vancouverCoordinates,
            strokeColor: '#18FC4Deeboo',
            strokeOpacity: 0.6,
            strokeWeight: 3,
            fillColor: '#18FC4D',
            fillOpacity: 0.10
        });
        vancouver.setMap($scope.map);

        // Retrieves the data from data.json, and counts the number of active cars for each city
        $scope.countVanCars = 0;
        $scope.countBurCars = 0;
        $scope.countCoqCars = 0;

        angular.forEach(markers, function(value, key) {
            // If the value of number in a markers array is car
            if (value.number.match(/car/g)) {
                if (value.location == 'vancouver') {
                    $scope.countVanCars++;
                } else if (value.location == 'burnaby') {
                    $scope.countBurCars++;
                } else if (value.location == 'coquitlam') {
                    $scope.countCoqCars++;
                }
            }
        });
    });
