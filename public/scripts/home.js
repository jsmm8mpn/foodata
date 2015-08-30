angular.module('foodata').controller('HomeCtrl', ['$scope', '$http', '$q', '$filter', function($scope, $http, $q, $filter) {
  
  $scope.selectedItem = {
    value: '01001'
  };
  
  $scope.search = function(text) {
    var deferred = $q.defer();
    $http.get('/search?text=' + text).then(function(response) {
      var results = [];
      for (var i = 0; (i < response.data.length && i < 10); i++) {
        results.push({
          value: response.data[i].id,
          display: response.data[i].desclong
        });
      }
      deferred.resolve(results);
      console.log(results);
    });
    return deferred.promise;
  };
  
  $scope.$watch('selectedItem', function(item) {
    if (item) {
      $q.all([
        $http.get('/nutrients?id=' + item.value),
        $http.get('/sizes?id=' + item.value)
      ]).then(function(responses) {
        $scope.nutrients = responses[0].data;
        angular.forEach($scope.nutrients, function(nutrient) {
          nutrient.compareVal = Number(getCompareVal(nutrient));
        });
        $scope.servingSizes = responses[1].data;
        if ($scope.servingSizes.length > 0) {
          $scope.servingSize = 1; 
        }
      });
    }
  });
  
  function getCompareVal(nut) {
    switch(nut.units) {
      case 'g':
        return nut.nutval;
      case 'mg':
        return nut.nutval/1000;
      case 'ug':
        return nut.nutval/1000000;
      default:
        return 0;
    }
  }
  
  function getWeight() {
    console.log('weight: ' + $scope.servingSizes[$scope.servingSize-1].weight);
    return $scope.servingSizes[$scope.servingSize-1].weight;
  }
  
  function getWeightedValue(val) {
    console.log('weighted value: ' + val/100*getWeight());
    return val/100*getWeight();
  }
  
  function getPercent(val, units) {
    var num = Number(val);
    switch(units) {
      case 'g':
        return num;
      case 'mg':
        return num/1000;
      case 'ug':
        return num/1000000;
    } 
  }
  
  function getDecimals(units) {
    switch(units) {
      case 'g':
        return 2;
      default:
        return 0;
    }
  }
  
  function round(val, units) {
    return $filter('number')(val, getDecimals(units)); 
  }
  
  $scope.getValue = function(id) {
    console.log('original value: ' + $scope.nutrients[id].nutval);
    var nutrient = $scope.nutrients[id];
    var val = round(getWeightedValue(nutrient.nutval), nutrient.units) + nutrient.units;
    console.log(val);
    return val;
  };
  
  $scope.getPercent = function(row) {
    var p = getPercent(row.nutval, row.units);
    if (typeof p !== 'undefined') {
      return $filter('number')(p,2) + '%'; 
    } else {
      return ''; 
    }
  };
}]);