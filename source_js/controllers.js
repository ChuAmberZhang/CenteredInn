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
    $scope.spots;
    $scope.hotels;

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
            for(var i=0; i<10; i++) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: $scope.spots[i].location.latitude,
                        lng: $scope.spots[i].location.longitude
                    },
                    map: map
                });
                marker.addListener('click', function() {
                    var str="<div style='padding:10px;'><p style='font-weight: 400;font-size:30px' >"+movie['title']+"("+movie.year+")"+"<a onclick = like() style='color:red' >   <i class='fa fa-heart' aria-hidden='true'></i></a></p>"
                            +"<img class='col-sm-6' src='"+"spots["+i+"].main_image"+"' alt='https://pbs.twimg.com/profile_images/600060188872155136/st4Sp6Aw.jpg' style='width:auto;height:160px;margin-bottom: 20px'>"
/*
                            +"<div style='font-weight: 400'>Rating: <span style='font-weight: 200'>"+movie.idbrating+"</span></div>"
                            +"<div style='font-weight: 400'>Director: <span style='font-weight: 200'>"+movie.director+"</span>"
                            +"<div style='font-weight: 400'>Actors: <span style='font-weight: 200'>"+movie.actors+"</span>"

                            +"<div style='font-weight: 400'>Genre: <span style='font-weight: 200'>"+movie.genre+"</span></div>"

                            +"<div style='font-weight: 400'>Location: <span style='font-weight: 200'>"+movie.address+"</span></div>*/+"</div>"
                        ;
                    console.log(str);

                    infowindow.setContent(str);
                    infowindow.open(map, marker);
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

    $scope.searchHotels = function(e) {
        console.log("entered search hotels");
        $scope.checkedArray = [];
        angular.forEach($scope.spots, function(spot){
            if (!!spot.selected) $scope.checkedArray.push(spot);
        })
        console.log($scope.checkedArray);

        var hotelDict = {};
        console.log("Before calling hotels");

        for (var it = 0; it < $scope.checkedArray.length; it++) {
            var checked = $scope.checkedArray[it];
            if ("location" in checked) {
                Amadeus.getHotelsAPI(checked.location.latitude, checked.location.longitude, "2017-03-01", "2017-03-07").success(function (data) {
                    var hotels = data.results;
                    //console.log(hotels);

                    for (var i = 0; i < hotels.length; i++) {
                        var code = hotels[i].property_code;
                        if (code in hotelDict)
                            hotelDict[code].count = hotelDict[code].count+1;
                        else hotelDict[code] = {count:1, details:hotels[i]};
                    }

                    if (it == $scope.checkedArray.length) {
                        var items = [];
                        for (var h in hotelDict) {
                            //console.log("in create own list: ");
                            //console.log(h);
                            //console.log(hotelDict[h]);
                            items.push([h, hotelDict[h]]);
                        }
                        //console.log(items);

                        items.sort(function(first, second) {
                            return second[1].count - first[1].count;
                        });

                        $scope.hotels = items.map(function(element) {
                           return element[1];
                        });
                        console.log($scope.hotels);
                    }
                }).error(function (data) {
                    console.log(data.message);
                });
            }
        }

        //console.log(hotelDict);
    }

}]);

