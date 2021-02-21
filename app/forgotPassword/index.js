'use strict';

angular.module('myApp.forgotPassword', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/forgot-password', {
    templateUrl: 'forgotPassword/index.html',
    controller: 'ForgotPasswordCtrl'
  });
}])

.controller('ForgotPasswordCtrl', ['$scope', '$http', function($scope, $http) {
  $scope.name = null;
  $scope.confirm_password = null;
  $scope.email = null;
  $scope.password = null;
  $scope.phone = null;

  $scope.init = function () {
    
  }

  $scope.init();

  $scope.resetPassword = function () {
    // if (!$scope.email) {
    //   alert('Email is requied');
    //   return ;
    // }

    // if (!$scope.name) {
    //   alert('Name is requied');
    //   return ;
    // }

    // if (!$scope.phone) {
    //   alert('Phone is requied');
    //   return ;
    // }

    if (!$scope.password) {
      alert('Password is requied');
      return ;
    }

    if (!$scope.confirm_password) {
      alert('Confirm Password is required');
      return ;
    }
    
    if ($scope.password != $scope.confirm_password) {
      alert('Password Confirm is mismatch');
      return ;
    }

    let req = {
      method: 'POST',
      url: 'http://localhost:3002/auth/reset-password',
      data: {
        password: $scope.password,
      }
    };

    $http(req).then(function (res) {
      window.location.href = "#!/login";
    }, function () {
      alert('Reset Password failed');
    })
  }
}]);