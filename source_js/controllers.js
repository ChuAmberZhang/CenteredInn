var hotelControllers = angular.module('hotelControllers', ['firebase']);

// Initialize Firebase
var config = {
    apiKey: "<FirebaseAPIKEY>",
    authDomain: "centeredinn.firebaseapp.com",
    databaseURL: "https://centeredinn.firebaseio.com",
    storageBucket: "centeredinn.appspot.com",
    messagingSenderId: "530961530635"
};
firebase.initializeApp(config);

hotelControllers.controller('SettingsController', ['$scope' , '$window' , '$location', '$firebaseAuth', 'CommonData',
    function($scope, $window, $location, $firebaseAuth, CommonData) {


    $scope.loggedIn = false;
    $scope.isLogin = true;
    $scope.failed = false;
    $scope.switchMessage = "New user? Sign up here!";
    $scope.buttonLabel = "Login";
    $scope.search = {city:"", start:"", end:""};
    $scope.login = {email:"", pwd:""};
    $scope.signup = {name:"", email:"", pwd:""};
    $scope.fail = {message:""};

    $scope.openAccountinSettings = function() {
        console.log("account");
        if ($scope.loggedIn) $location.path('/account');
    }

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
                CommonData.setUID(firebaseUser.uid);
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
                    CommonData.setUID(firebaseUser.uid);
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

    $scope.openAccountinMain = function() {
        console.log("account");
        if (CommonData.getUID().length != 0) $location.path('/account');
        else $location.path('/#');
    }

    if (cityParam.length != 0) {
        console.log(cityParam);
        Amadeus.getSpotsAPI(cityParam).success(function (data) {
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
        var icon;
        if(hotelIcon == true){
            for (var i = 0; i < $scope.hotels.length; i++) {
                console.log($scope.hotels[i].details);
                addMarker($scope.hotels[i].details,hotelIcon);


            }

        }
        else{
            deleteMarkers();
            for (var i = 0; i < $scope.spots.length; i++) {
                console.log($scope.spots[i]);
                addMarker($scope.spots[i],hotelIcon);
            }

        }
        console.log($scope.markers.length);
        showMarkers();
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < $scope.markers.length; i++) {
            bounds.extend($scope.markers[i].getPosition());
        }

        map.fitBounds(bounds);
    }
    function addMarker(spot,hotelIcon) {
        var iconLink;
        if(hotelIcon){
            iconLink = '../media/hotel.png';
        }
        else{
            iconLink = '../media/spot.png';
        }
        console.log("add")
        var marker = new google.maps.Marker({
            position: {lat: spot.location.latitude,
                lng: spot.location.longitude},
            map: $window.map,
            icon: iconLink
        });

        jQuery(document).ready(function($){
            if(hotelIcon) {
                console.log(spot.property_name);
                marker.addListener('mouseover', function ($event) {
                    var imglink = '../media/hotelAlt.png';
                    if(spot.image!=undefined){
                        imglink = "spot.image[0]";
                    }
                        var str = "<div style='padding:10px;'>"
                                + "<h6>" + spot.property_name + "</h6>"
                                + "<img class='col-sm-6' src = '" + imglink + "' style='width:80px;height:auto;margin-bottom: 20px'>"
                                + "</div>"
                            ;
                        infowindow.setContent(str);
                        infowindow.open($window.map, marker);
                        var list_item = document.getElementById("geo" + spot.property_name);
                        $(list_item).css("background-color", "#a8c6e4");

                    }
                );
                /*marker.addListener('mouseout', function($event){
                        infowindow.close();
                        var list_item = document.getElementById("geo"+spot.property_name);
                        $(list_item).css("background-color", "white");

                    }
                );*/
            }
            else{
                marker.addListener('mouseover', function ($event) {
                    var imglink = '../media/hotelAlt.png';
                    if(spot.main_image!=undefined){
                        imglink = spot.main_image;
                    }
                        var str = "<div style='padding:10px;'>"
                                + "<h6>" + spot.title + "</h6>"
                                + "<img class='col-sm-6' src='" + spot.main_image + "' alt='../media/sceneAlt.png' style='width:80px;height:auto;margin-bottom: 20px'>"
                                + "</div>"
                            ;
                        infowindow.setContent(str);
                        infowindow.open($window.map, marker);
                        var list_item = document.getElementById("geo" + spot.geoname_id);
                        $(list_item).css("background-color", "#a8c6e4");

                    }
                );
                marker.addListener('mouseout', function($event){
                        infowindow.close();
                        var list_item = document.getElementById("geo"+spot.geoname_id);
                        $(list_item).css("background-color", "white");

                    }
                );
            }

        });

        $scope.markers.push(marker);
        setMapOnAll($window.map);
        console.log($scope.markers.length);
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

    $('#accountLink').on('click', function(e) {
        $(location).attr('href', '/#/account');
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
                var startDate = CommonData.getStartDate();
                var endDate = CommonData.getEndDate();
                Amadeus.getHotelsAPI(checked.location.latitude, checked.location.longitude, startDate, endDate).success(function (data) {
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
                    refresh(true);
                }).error(function (data) {
                    console.log(data.message);
                });
            }
        }

        //console.log(hotelDict);
    }

}]);

hotelControllers.controller('AccountController', ['$scope' , '$window' , '$location', '$firebaseArray', 'CommonData', function($scope, $window, $location, $firebaseArray, CommonData) {
    console.log("in account controller");
    console.log(CommonData.getUID());
    if (CommonData.getUID().length == 0) $location.path('/#');
    else console.log("yeah");
}]);

