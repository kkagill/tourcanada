'use strict';

/**
 * @ngdoc function
 * @name keeboo.controller:TripdetailCtrl
 * @description
 * # TripdetailCtrl
 * Controller of the keeboo
 */
angular.module('keeboo')
  .controller('CarDetailCtrl', function ($scope) {
    
    var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(40.0000, -98.0000)
    };
    
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var trip = function (id, name, desc, avgEcon, distance, date){
        this.name = name;
        this.id = id;
        this.date = date;
        this.desc = desc;
        this.avgEcon = avgEcon;
        this.distance = distance;
    };
    
    $scope.car = new trip(1, "Vancouver Trip", "This is our Vancouver trip", "10.1L/100Km", 12, null);

    var cities = [
        {
            city : 'Toronto',
            desc : 'This is the best city in the world!',
            lat : 43.7000,
            long : -79.4000
        },
        {
            city : 'New York',
            desc : 'This city is aiiiiite!',
            lat : 40.6700,
            long : -73.9400
        },
        {
            city : 'Chicago',
            desc : 'This is the second best city in the world!',
            lat : 41.8819,
            long : -87.6278
        },
        {
            city : 'Los Angeles',
            desc : 'This city is live!',
            lat : 34.0500,
            long : -118.2500
        },
        {
            city : 'Las Vegas',
            desc : 'Sin City...\'nuff said!',
            lat : 36.0800,
            long : -115.1522
        }
    ];
    
    $scope.markers = [];
    
    var infoWindow = new google.maps.InfoWindow();
    
    var createMarker = function (info){
        
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';
        
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        
        $scope.markers.push(marker);
    }
    
    for (var i = 0; i < cities.length; i++){
        createMarker(cities[i]);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
    
  });
