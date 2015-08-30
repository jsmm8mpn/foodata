angular.module('foodata').controller('SearchCtrl', ['$scope', '$http', '$q', function($scope, $http, $q) {
  $scope.search = function(text) {
    $http.get('/search?text=' + text).then(function(response) {
      $scope.results = response.data;
    });
  };
}]);