var hotelServices = angular.module('hotelServices', []);

hotelServices.factory('CommonData', function(){
    var data = "";
    return{
        getData : function(){
            return data;
        },
        setData : function(newData){
            data = newData;
        }

    }
});

hotelServices.factory('Amadeus', function($http, $window) {
    return {
        getUsers : function() {
            var baseUrl = $window.sessionStorage.baseurl;
            console.log(baseUrl+'/api/users');
            return $http.get(baseUrl+'/api/users');
        }
    }
});
