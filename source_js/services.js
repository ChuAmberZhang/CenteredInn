var hotelServices = angular.module('hotelServices', []);

hotelServices.factory('CommonData', function(){
    var city = "";
    var startDate = "";
    var endDate = "";
    var uid = "";
    return{
        getCity : function(){
            return city;
        },
        getStartDate : function(){
            return startDate;
        },
        getEndDate : function(){
            return endDate;
        },
        getUID : function(){
            return uid;
        },
        setCity : function(newData){
            city = newData;
        },
        setStartDate : function(newData){
            startDate = newData;
        },
        setEndDate : function(newData){
            endDate = newData;
        },
        setUID : function(newData){
            setUID = newData;
        }
    }
});

var secret ="<AmadeusAPIKey>";
hotelServices.factory('Amadeus', function($http, $window) {
    return {
        getSpotsAPI : function(city) {

            var baseUrl = "https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-text?apikey="+secret+"&city_name="
            +city+"&number_of_images=1&number_of_results=8";
            console.log(baseUrl);
            return $http.get(baseUrl);
        },

        getHotelsAPI : function(lat, long, checkin, checkout) {
            console.log("Calling hotels");
            var baseUrl = "http://api.sandbox.amadeus.com/v1.2/hotels/search-circle?"
                +"latitude="+lat
                +"&longitude="+long+"&radius=50&"
                +"check_in="+checkin
                +"&check_out="+checkout
                +"&number_of_results=10&apikey="+secret;
            return $http.get(baseUrl);
        }
    }
});
