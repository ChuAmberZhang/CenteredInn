/* This file is part of CenteredInn.

    CenteredInn is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

    CenteredInn is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>. */


var app = angular.module('hotel', ['ngRoute', 'hotelControllers', 'firebase', 'hotelServices','720kb.datepicker']);



app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.

    when('/settings', {
      templateUrl: 'partials/settings.html',
      controller: 'SettingsController'
    }).

    when('/account', {
    templateUrl: 'partials/account.html',
    controller: 'AccountController'
    }).

    when('/main', {
      templateUrl: 'partials/main.html',
      controller: 'MainController'
    }).

    otherwise({
     redirectTo: '/settings'
   });
}]);
