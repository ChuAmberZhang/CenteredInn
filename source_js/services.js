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
        getSpotsAPI : function() {
            var city = "New%20York";
            var baseUrl = "https://api.sandbox.amadeus.com/v1.2/points-of-interest/yapq-search-text?city_name="+city+"&image_size=small&category=zoo&;apikey="+secret;
            console.log(baseUrl);
            return "ads"//;$http.get(baseUrl+'/api/users');
        }
    }
});
