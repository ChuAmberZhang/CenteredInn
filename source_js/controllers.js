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

hotelControllers.controller('SettingsController', ['$scope' , '$window' , '$firebaseAuth', function($scope, $window, $firebaseAuth) {

    $scope.loggedIn = true;
    $scope.isLogin = true;
    $scope.switchMessage = "New user? Sign up here!";
    $scope.buttonLabel = "Login";

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
        var email = $scope.login.email;
        var password = $scope.login.pwd;
        $scope.authObj = $firebaseAuth();

        if ($scope.isLogin) {
            $scope.authObj.$signInWithEmailAndPassword(email, password).then(function(firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.loggedIn = true;
            }).catch(function(error) {
                console.error("Authentication failed:", error);
                $scope.failed = true;
                $scope.login.failMessage = error.message;
            });
        }
        else {
            $scope.authObj.$createUserWithEmailAndPassword($signup.email, $signup.password)
                .then(function(firebaseUser) {
                    console.log("User " + firebaseUser.uid + " created successfully!");
                    $scope.loggedIn = true;
                }).catch(function(error) {
                console.error("Error: ", error);
                $scope.failed = true;
                $scope.login.failMessage = error.message;
            });
        }
    }

    $scope.searchSpots = function(e) {
        e.preventDefault();
        //console.log($scope.search.start);
        //console.log($scope.search.end);
        var city = $scope.search.city;
        console.log(city)
    }
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

