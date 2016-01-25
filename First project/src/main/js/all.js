'use strict'

var fs = require('fs');
var angular = require('angular'),
    eventBuilderModule = angular.module('Event_builder_app', [require('angular-route'), require('angular-material')]);


eventBuilderModule.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '/manePage.html',
            controller  : 'MainPageCtrl'
        })
        .when('/createEvent', {
            templateUrl : '/createEventPage.html',
            controller  : 'CreateEventPageController'
        })
        .when('/login', {
            templateUrl : '/loginPage.html',
            controller  : 'LoginPageController'
        });
});

eventBuilderModule.controller('MainPageCtrl', function($scope) {
    console.log('Controller loading');
});

eventBuilderModule.controller('CreateEventPageController', function($scope) {

});

eventBuilderModule.controller('LoginPageController', function($scope) {

});





/**
 * Created by Dub4ek on 1/19/16.
 */

/**
 * Created by Dub4ek on 1/19/16.
 */

/**
 * Created by Dub4ek on 1/8/16.
 */
