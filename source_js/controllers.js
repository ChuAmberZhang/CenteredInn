var hotelControllers = angular.module('hotelControllers', ['firebase']);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDNFewR2r5GX-yMHSp76iqYLZe1l8QlT2k",
    authDomain: "centeredinn.firebaseapp.com",
    databaseURL: "https://centeredinn.firebaseio.com",
    storageBucket: "centeredinn.appspot.com",
    messagingSenderId: "530961530635"
};
firebase.initializeApp(config);

hotelControllers.controller('SettingsController', ['$scope' , '$window' , '$location', '$firebaseAuth', 'CommonData', function($scope, $window, $location, $firebaseAuth, CommonData) {

    $scope.loggedIn = true;
    $scope.isLogin = true;
    $scope.failed = false;
    $scope.switchMessage = "New user? Sign up here!";
    $scope.buttonLabel = "Login";
    $scope.search = {city:"", start:"", end:""};
    $scope.login = {email:"", pwd:""};
    $scope.signup = {name:"", email:"", pwd:""};
    $scope.fail = {message:""};

    $scope.switch = function(e) {
        if ($scope.isLogin) {
            $scope.switchMessage = "Already a user? Login here!";
            $scope.buttonLabel = "Sign Up";
        }
        else {
            $scope.switchMessage = "New user? Sign up here!";
            $scope.buttonLabel = "Login";
        }
        $scope.isLogin = ! ($scope.isLogin);
    }

    // Auth Logic is here
    $scope.login = function(e) {
        $scope.authObj = $firebaseAuth();

        if ($scope.isLogin) {
            var email = $scope.login.email;
            var password = $scope.login.pwd;
            $scope.authObj.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.loggedIn = true;
                $window.sessionStorage.setItem("uid", firebaseUser.uid);
            }).catch(function(error) {
                console.error("Authentication failed:", error);
                $scope.failed = true;
                $scope.fail.message = error.message;
            });
        }
        else {
            var username = $scope.signup.name;
            var email = $scope.signup.email;
            var password = $scope.signup.pwd;
            $scope.authObj.$createUserWithEmailAndPassword(email, password)
                .then(function(firebaseUser) {
                    console.log("User " + firebaseUser.uid + " " + username + " created successfully!");
                    $scope.loggedIn = true;
                    $window.sessionStorage.setItem("uid", firebaseUser.uid);
                }).catch(function(error) {
                console.error("Error: ", error);
                $scope.failed = true;
                $scope.fail.message = error.message;
            });
        }
    }

    $scope.searchSpots = function(e) {
        //console.log($scope.search.start);
        //console.log($scope.search.end);
        var city = $scope.search.city;
        CommonData.setCity(city);
        CommonData.setStartDate($scope.search.start);
        CommonData.setEndDate($scope.search.end);
        //need validation before redirecting pages
        $location.path("/main");
    }
}]);

hotelControllers.controller('MainController', ['$scope' ,  'Amadeus', '$window' ,'CommonData', function($scope, Amadeus,$window, CommonData) {
    $scope.markers = [];
    $scope.currCity;
    $window.map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 40.1147412,
            lng: -88.3471495
        },
        zoom: 8
    });
    $scope.spots;
    $scope.hotels;
    var infowindow = new google.maps.InfoWindow({
        content: null,
        disableAutoPan: true
    });

    //console.log(CommonData.getCity());
    var cityParam = CommonData.getCity();
    var startParam = CommonData.getStartDate();
    var endParam = CommonData.getEndDate();



    $scope.getSpots = function(city, cate) {
        console.log(city,cate);
        Amadeus.getSpotsAPI(city,cate).success(function (data) {
            $scope.spots = data.points_of_interest;
            $scope.currCity = data.current_city;
            $window.map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat:$scope.currCity.location.latitude,
                    lng:$scope.currCity.location.longitude
                },
                zoom: 12
            });
            refresh(false);
        }).error(function (data) {

            $scope.spots = data.message;
        });
    }
    function refresh(hotelIcon){
        deleteMarkers();
        for (var i = 0; i < $scope.spots.length; i++) {
            console.log($scope.spots[i]);
            var icon;
            if(hotelIcon == true)
                icon = '../media/hotel.png';
            else
                icon = '../media/spot.png';
            addMarker($scope.spots[i],icon);
        }
        showMarkers();
    }
    function addMarker(spot,iconLink) {
        var marker = new google.maps.Marker({
            position: {lat: spot.location.latitude,
                lng: spot.location.longitude},
            map: map,
            icon: iconLink
        });
        jQuery(document).ready(function($){
            marker.addListener('mouseover', function($event){
                    var str="<div style='padding:10px;'>"
                            +"<h6>"+spot.title+"</h6>"
                            +"<img class='col-sm-6' src='"+spot.main_image+"' alt='https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg' style='width:80px;height:auto;margin-bottom: 20px'>"
                            +"</div>"
                        ;
                    infowindow.setContent(str);
                    infowindow.open(map, marker);
                    var list_item = document.getElementById("geo"+spot.geoname_id);
                    $(list_item).css("background-color", "#a8c6e4");

                }
            );
            marker.addListener('mouseout', function($event){
                    infowindow.close();
                    var list_item = document.getElementById("geo"+spot.geoname_id);
                    $(list_item).css("background-color", "white");

                }
            );
        });

        $scope.markers.push(marker);
    }
    function setMapOnAll(map) {
        for (var i = 0; i < $scope.markers.length; i++) {
            $scope.markers[i].setMap(map);
        }
    }
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }
    // Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }
    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        $scope.markers.length = 0;
    }
    $('a').on('click', function(e) {
        console.log($(this).parents());
    });
    $scope.expand = function(){
        //console.log($(this).parents());
    }
    window.onload = function() {
        $('.accordion').foundation();

    }



}]);

