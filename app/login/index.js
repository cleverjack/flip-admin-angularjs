'use strict';

angular.module('myApp.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/index.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', function($scope, $http) {

  $scope.email = null;
  $scope.password = null;

  $scope.init = function () {
    let token = localStorage.getItem('token');
    if (token && token != "") {
      window.location.href = '#!/view';
    }
  }

  $scope.init();

  $scope.login = function () {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!$scope.email) {
      alert('Email is requied');
      return ;
    }

    if (!re.test($scope.email)) {
      alert('Email is invalid');
      return ;
    }

    if (!$scope.password) {
      alert('Password is requied');
      return ;
    }

    let req = {
      method: 'POST',
      url: 'http://localhost:3002/auth/login',
      data: {
        email: $scope.email,
        password: $scope.password,
        role: 2
      }
    };

    $http(req).then(function (res) {
      console.log(res);
      let token = res.data.accessToken;
      localStorage.setItem('token', token);
      window.location.href = "#!/view";
    }, function () {
      alert('Login failed');
    })
  }
}]);