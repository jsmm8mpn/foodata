angular.module('foodata', ['ngAnimate', 'ngRoute', 'ngMaterial', 'ngAria'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      }).
      when('/search', {
        templateUrl: 'views/search.html',
        controller: 'SearchCtrl'
      }).
      otherwise({
        redirectTo: '/home'
      });
  }]);