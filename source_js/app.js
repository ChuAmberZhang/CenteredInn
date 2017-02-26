var app = angular.module('hotel', ['ngRoute', 'hotelControllers', 'firebase', 'hotelServices','720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

    when('/settings', {
      templateUrl: 'partials/settings.html',
      controller: 'SettingsController'
    }).

  when('/task/:_id', {
    templateUrl: 'partials/task.html',
    controller: 'TaskController'
  }).
  when('/main', {
      templateUrl: 'partials/main.html',
      controller: 'MainController'
  }).

    otherwise({
     redirectTo: '/settings'
   });
}]);
