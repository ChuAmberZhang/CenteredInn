var app = angular.module('hotel', ['ngRoute', 'hotelControllers', 'hotelServices','720kb.datepicker']);

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

  otherwise({
    redirectTo: '/settings'
  });
}]);
