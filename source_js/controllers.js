var hotelControllers = angular.module('hotelControllers', []);



hotelControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {


}]);

hotelControllers.controller('MainController', ['$scope' , '$window' , 'Amadeus', function($scope, Amadeus,$window) {
    $window.map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    });
    $scope.spots=[{
        "name": "The Great Wall"

    },{
        "name": "Tokyo Tower"
    }];
    $scope.hotels=[{
        "name": "Hilton"

    },{
        "name": "Marriot"
    }];

    $scope.getSpots = function(city) {
        console.log(city);
        //return;
        Amadeus.getSpotsAPI(city).success(function (data) {
            //getTen();
        }).error(function (data) {
            $scope.spots = data.message;
        });
    }

    window.onload = function() {
        $('.accordion').foundation();
        $('a', '.accordion-item').on('click', function(e) {
            console.log(e.target, e.currentTarget);
        });
    }

}]);

