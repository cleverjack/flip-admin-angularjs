'use strict';

angular.module('myApp.resetPassword', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/reset-password', {
    templateUrl: 'resetPassword/index.html',
    controller: 'ResetPasswordCtrl'
  });
}])

.controller('ResetPasswordCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
  $scope.confirm_password = null;
  $scope.password = null;
  $scope.token = null;
  $scope.baseUrl = config.backendBaseUrl;

  
  $scope.getParameterByName = function (name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  $scope.init = function () {
    $scope.token = $scope.getParameterByName('token');
    console.log($scope.token);
  }

  $scope.init();

  $scope.resetPassword = function () {
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
      url: config.backendBaseUrl + 'auth/reset-password',
      data: {
        password: $scope.password,
        token: $scope.token,
        role: 2
      }
    };

    $http(req).then(function (res) {
      window.location.href = "#!/login";
    }, function () {
      alert('Reset Password failed');
    })
  }
}]);