'use strict';

angular.module('myApp.forgotPassword', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forgot-password', {
    templateUrl: 'forgotPassword/index.html',
    controller: 'ForgotPasswordCtrl'
  });
}])

.controller('ForgotPasswordCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.email = 'lazstar1127@gmail.com';

  $scope.init = function () {
    
  }

  $scope.init();

  $scope.forgotPassword = function () {
    let req = {
      method: 'POST',
      url: 'http://localhost:3002/auth/forgot-password',
      data: {
        role: 2
      }
    };

    $http(req).then(function (res) {
      alert('Email Sent. Please check your email.')
    }, function () {
      alert('Reset Password failed');
    })
  }
}]);
