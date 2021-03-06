'use strict';

angular.module('myApp.view', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view', {
    templateUrl: 'view/view.html',
    controller: 'ViewCtrl'
  });
}])

.controller('ViewCtrl', ['$scope', '$http', 'config', function($scope, $http, config) {
  $scope.baseUrl = config.backendBaseUrl;
  
  $scope.file = null;
  $scope.audioFile = null;
  $scope.videoFile = null;

  $scope.pdfFiles = [];
  $scope.audio = null;
  $scope.videos = [];

  $scope.showVideoList = false;
  $scope.showBookList = false;

  $scope.init = function () {
    let token = localStorage.getItem('token');
    if (!token || token == "") {
      window.location.href = '#!/login';
      return;
    }

    let req = {
      method: 'GET',
      url: config.backendBaseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };

    $http(req).then(function (res) {
      $scope.pdfFiles = res.data;
    }, function () {

    })

    let req2 = {
      method: 'GET',
      url: config.backendBaseUrl + 'get-audio',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };

    $http(req2).then(function (res) {
      $scope.audio = res.data;
    }, function () {

    })
    
    let req3 = {
      method: 'GET',
      url: config.backendBaseUrl + 'videos',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    };

    $http(req3).then(function (res) {
      $scope.videos = res.data;
    }, function () {

    })
  }

  $scope.init();

  $scope.changeFile = function (el) {
    $scope.file = el.files[0];
    console.log($scope.file);
  }

  $scope.changeAudioFile = function (el) {
    $scope.audioFile = el.files[0];
  }

  $scope.changeVideoFile = function (el) {
    $scope.videoFile = el.files[0];
  }

  $scope.uploadFile = function () {
    console.log('submit');
    let formdata = new FormData();

    if (!$scope.file) {
      alert('Select PDF File First');
      return;
    }

    formdata.append('file', $scope.file);

    var req = {
      method: 'POST',
      url: config.backendBaseUrl + 'upload',
      headers: {
        'Content-Type': undefined,
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      data: formdata
     }
     
     $http(req).then(function(res){
      $scope.pdfFiles.push(res.data);
     }, function(){
       
     });
  }

  $scope.uploadAudioFile = function () {
    console.log('submit');
    let formdata = new FormData();

    if (!$scope.audioFile) {
      alert('Select Audio File First');
      return;
    }

    formdata.append('file', $scope.audioFile);

    var req = {
      method: 'POST',
      url: config.backendBaseUrl + 'upload-audio',
      headers: {
        'Content-Type': undefined,
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      data: formdata
     }
     
     $http(req).then(function(res){
      $scope.audio = res.data;
     }, function(){
       
     });
  }

  $scope.uploadVideoFile = function () {
    console.log('submit');
    let formdata = new FormData();

    if (!$scope.videoFile) {
      alert('Select Video File First');
      return;
    }

    formdata.append('file', $scope.videoFile);

    var req = {
      method: 'POST',
      url: config.backendBaseUrl + 'upload-video',
      headers: {
        'Content-Type': undefined,
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      data: formdata
     }
     
     $http(req).then(function(res){
      $scope.videos.push(res.data);
     }, function(){
       
     });
  }

  $scope.deletePdf = function (file) {
    var req = {
      method: 'DELETE',
      url: config.backendBaseUrl + 'delete-pdf/' + file._id,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    }

    $http(req).then(function (res) {
      let index = $scope.pdfFiles.indexOf(file);
      $scope.pdfFiles.splice(index, 1);
    }, function () {

    })
  }

  $scope.deleteVideo = function (video) {
    var req = {
      method: 'DELETE',
      url: config.backendBaseUrl + 'delete-video/' + video._id,
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
    }

    $http(req).then(function (res) {
      let index = $scope.videos.indexOf(video);
      $scope.videos.splice(index, 1);
    }, function () {

    })
  }

  $scope.createFlipBook = function () {
  }

  $scope.logout = function () {
    localStorage.removeItem('token');
    window.location.href="#!/login";
  }
}]);