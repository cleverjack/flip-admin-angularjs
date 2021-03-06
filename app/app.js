'use strict';

// Declare app level module which depends on views, and core components
angular.module('myApp', [
  'ngRoute',
  'myApp.login',
  'myApp.forgotPassword',
  'myApp.resetPassword',
  'myApp.view',
  'myApp.pdfProcess',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]).constant('config', {  
  backendBaseUrl: 'http://localhost:3002/',  
  appVersion: 2.0  
});
