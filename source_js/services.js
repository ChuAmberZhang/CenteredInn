var hotelServices = angular.module('hotelServices', []);

hotelServices.factory('CommonData', function(){
    var city = "";
    var startDate = "";
    var endDate = "";
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
        setCity : function(newData){
            city = newData;
        },
        setStartDate : function(newData){
            startDate = newData;
        },
        setEndDate : function(newData){
            endDate = newData;
        }
    }
});
var secret ="ZPGkwBBoUtCzfTTNFDCW555e6ZNVxv1W";
hotelServices.factory('Amadeus', function($http, $window) {
    return {
        getSpotsAPI : function(city,cate) {

            var baseUrl = "https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-text?apikey="+secret+"&city_name="
            +city+"&category="
            +cate+"&number_of_images=1&number_of_results=8";
            console.log(baseUrl);
            return $http.get(baseUrl);
        }
    }
});
