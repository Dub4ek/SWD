'use strict';

var fs = require('fs');
var angular = require('angular'),
    eventBuilderModule = angular.module('Event_builder_app', [require('angular-route'), require('angular-material')]);


eventBuilderModule.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : '/manePage.html',
            controller  : 'EventOverviewController'
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

eventBuilderModule.controller('MainPageCtrl', function($scope, $location) {
    $scope.appHeader = 'Event Builder';
    $scope.loginButtonHeader = 'Log in / Sign up';


    $scope.loginButton_clickHandler = function(item) {
        $location.path('/login');
    }
});


eventBuilderModule.controller('EventOverviewController', function($scope, $location) {
    $scope.createEventButtonCaption = 'Create Event';
    $scope.upcomingEventsCollection = ['First', 'Second', 'Third', 'Fourth', 'Five', 'Six', 'Seven'];

    $scope.myCheckbox_clickHandler = function(item) {
        console.log('Selected my');
    }
    $scope.allCheckbox_clickHandler = function(item) {
        console.log('Selected All');
    }
    $scope.createEventButton_clickHandler = function (item) {
        $location.path('/createEvent');
    }
});

eventBuilderModule.controller('CreateEventPageController', function($scope) {
    $scope.eventTypeCollection = ['Party', 'Dinner'];
    $scope.selectedEventType = '';
    $scope.selectedEndtDate = '';
});

eventBuilderModule.controller('LoginPageController', function($scope) {
    $scope.createAccountButtonHeader = 'Create an account';
    $scope.signupButtonHeader = 'Sign up';
});




