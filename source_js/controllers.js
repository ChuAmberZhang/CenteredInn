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
        e.preventDefault();
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
        e.preventDefault();
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
        e.preventDefault();
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
    $scope.spots=new Array(10);
    $scope.hotels=new Array(10);

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
                zoom: 9
            });
            for(var i=0; i<10; i++) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: $scope.spots[i].location.latitude,
                        lng: $scope.spots[i].location.longitude
                    },
                    map: map
                });
                $scope.markers.push(marker);
                marker.setMap($window.map);
            }


        }).error(function (data) {

            $scope.spots = data.message;
        });
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

