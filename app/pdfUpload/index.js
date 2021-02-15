'use strict';

angular.module('myApp.pdfProcess', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/create-flip-book', {
    templateUrl: 'pdfUpload/index.html',
    controller: 'PdfUploadCtrl'
  });
  $routeProvider.when('/edit-flip-book/:id', {
    templateUrl: 'pdfUpload/index.html',
    controller: 'PdfUploadCtrl'
  });
}])

.controller('PdfUploadCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

  $scope.file = null;
  $scope.audioFile = null;
  $scope.videoFile = null;
  $scope.totalPageNum = 0;
  $scope.currentPageNum = 1;
  $scope.flipBook = null;
  $scope.pdfData = null;
  $scope.bgAudioFile = null;
  $scope.pageAudioFile = null;
  $scope.bgAudio = null;
  $scope.pageAudios = [];

  $scope.pdfId = $routeParams.id;

  $scope.isPageMute = false;
  $scope.isBgMute = true;

  $scope.pageAudioObj = new Audio();
  $scope.bgAudioObj = new Audio();

  $scope.loading = false;

  $scope.init = function () {
    if ($scope.pdfId) {
      let req = {
        method: 'GET',
        url: 'http://localhost:3002/pdf/' + $scope.pdfId
      };
  
      $http(req).then(function (res) {
        $scope.pdfData = res.data;
        $scope.renderFlipPage($scope.pdfData);
      }, function () {
  
      })
  
      let req2 = {
        method: 'GET',
        url: 'http://localhost:3002/pdf-audios/' + $scope.pdfId
      };
  
      $http(req2).then(function (res) {
        $scope.bgAudio = res.data.bgAudio;
        $scope.pageAudios = res.data.pageAudios;

        if ($scope.bgAudio) {
          $scope.bgAudioObj.src = "http://localhost:3002/audio/" + $scope.bgAudio.url;
          if (!$scope.isBgMute) {
            $scope.bgAudioObj.play();
          }
        }
      }, function () {
  
      })
    }
  }

  $scope.init();

  $scope.changeFile = function (el) {
    $scope.file = el.files[0];
    console.log($scope.file);
  }

  $scope.uploadFile = function () {
    console.log('submit');
    let formdata = new FormData();

    if (!$scope.file) {
      alert('Select PDF File First');
      return;
    }

    formdata.append('file', $scope.file);
    if ($scope.pdfData) {
      formdata.append('_id', $scope.pdfData._id);
    }

    var req = {
      method: 'POST',
      url: 'http://localhost:3002/upload',
      headers: {
        'Content-Type': undefined
      },
      data: formdata
     }
     
     $http(req).then(function(res){
      $scope.pdfData = res.data;
      $scope.renderFlipPage($scope.pdfData);
     }, function(){
       
     });
  }

  $scope.changeBackgroundAudioFile = function (el) {
    $scope.bgAudioFile = el.files[0];
  }

  $scope.changePageAudioFile = function (el) {
    $scope.pageAudioFile = el.files[0];
  }

  $scope.uploadAudioFile = function (type) {
    console.log('submit');
    let formdata = new FormData();

    if (!$scope.pdfData || !$scope.pdfData._id) {
      alert("need to upload pdf first");
      return;
    }

    if (type == 0 && !$scope.bgAudioFile) {
      alert('Select Audio File First');
      return;
    }

    if (type == 1 && !$scope.pageAudioFile) {
      alert('Select Audio File First');
      return;
    }

    if (type == 0) {
      formdata.append('file', $scope.bgAudioFile);
    } else {
      formdata.append('file', $scope.pageAudioFile);
      formdata.append('pageNum', $scope.currentPageNum);
    }
    formdata.append('type', type);
    formdata.append('pdfId', $scope.pdfData._id);

    var req = {
      method: 'POST',
      url: 'http://localhost:3002/upload-audio',
      headers: {
        'Content-Type': undefined
      },
      data: formdata
     }
     
     $http(req).then(function(res){
       if (type == 0) {
        $scope.bgAudio = res.data;
        if ($scope.bgAudio) {
          $scope.bgAudioObj.src = "http://localhost:3002/audio/" + $scope.bgAudio.url;
          if (!$scope.isBgMute) {
            $scope.bgAudioObj.play();
          }
        }
       } else {
        let item = $scope.pageAudios.find(it => it.pageNum == $scope.currentPageNum);
        if (item) {
          let index = $scope.pageAudios.indexOf(item);
          $scope.pageAudios[index] = res.data;
        } else {
          $scope.pageAudios.push(res.data);
        }
       }
     }, function(){
       
     });
  }

  $scope.publishPdf = function () {
    if (!$scope.pdfData || !$scope.pdfData._id) {
      alert("need to upload pdf first");
      return;
    }

    let formdata = new FormData();
    formdata.append('published', !!!$scope.pdfData.published);

    var req = {
      method: 'POST',
      url: 'http://localhost:3002/publish-pdf/' + $scope.pdfData._id,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        published: !!!$scope.pdfData.published
      }
     }
     
     $http(req).then(function(res){
      $scope.pdfData = res.data;
      window.location = '#!/view';
     }, function(){
       
     });
  }
  
  $scope.deleteAudio = (item) => {
    var req = {
      method: 'DELETE',
      url: 'http://localhost:3002/delete-audio/' + item._id,
    }

    $http(req).then(function (res) {
      if (item.type == 0) {
        $scope.bgAudio = null;
      } else {
        let index = $scope.pageAudios.indexOf(item);
        $scope.pageAudios.splice(index, 1);
      }
    }, function () {

    })
  }

  $scope.prevPage = () => {
    if ($scope.flipBook) {
      $scope.flipBook.flipPrev('bottom');
    }
  }

  $scope.nextPage = () => {
    if ($scope.flipBook) {
      $scope.flipBook.flipNext('bottom');
    }
  }

  $scope.$watch('isPageMute', function () {
    console.log($scope.isPageMute);
    if ($scope.isPageMute) {
      if ($scope.pageAudioObj && $scope.pageAudioObj.readyState != 0) {
        $scope.pageAudioObj.pause();
      }
    } else {
        if ($scope.pageAudioObj && $scope.pageAudioObj.readyState != 0) {
          $scope.pageAudioObj.play();
        }
    }
  });

  $scope.$watch('isBgMute', function () {
    if ($scope.isBgMute) {
      if ($scope.bgAudioObj && $scope.bgAudioObj.readyState != 0) {
        $scope.bgAudioObj.pause();
      }
    } else {
        if ($scope.bgAudioObj && $scope.bgAudioObj.readyState != 0) {
          $scope.bgAudioObj.play();
        }
    }
  });

  $scope.renderFlipPage = (pdfObject) => {
    // if ($scope.flipBook) {
    //   $scope.flipBook.destroy();
    $scope.totalPageNum = pdfObject.totalPageNum;

      const flipPageRoot = document.createElement('div');
      flipPageRoot.id = "flip-book";

      let flipPageWrapperElement = document.getElementById("flip-book-wrapper");
      flipPageWrapperElement.prepend(flipPageRoot);
    // }
    $scope.flipBook = new St.PageFlip(document.getElementById('flip-book'),
        {
            width: 300, // required parameter - base page width
            height: 500,  // required parameter - base page height
            showCover: true
        }
    );

      let imageUrls = [];
      for (let i=0; i<$scope.totalPageNum; i++) {
        let url = 'http://localhost:3002/pages/' + pdfObject.baseName + '-' + i + '.png';
        imageUrls.push(url);
      }

      console.log(imageUrls);
      $scope.flipBook.loadFromImages(imageUrls);
      $scope.flipBook.on('flip', (e) => {
          $scope.currentPageNum = e.data + 1;
          $scope.$apply();
          console.log($scope.currentPageNum);

          let pageAudio = $scope.pageAudios.find(it => it.pageNum == $scope.currentPageNum);
          if ($scope.pageAudioObj.readyState != 0)
          $scope.pageAudioObj.pause();

          if (pageAudio) {
            $scope.pageAudioObj.src="http://localhost:3002/audio/" + pageAudio.url;
            if (!$scope.isPageMute)
              $scope.pageAudioObj.play();
          }
          // audioObj.play();
      });
  }
}]);