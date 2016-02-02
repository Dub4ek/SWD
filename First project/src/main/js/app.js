'use strict';

var fs = require('fs');
var angular = require('angular'),
    eventBuilderModule = angular.module('Event_builder_app', [require('angular-route'), require('angular-material'), require('angularfire')]);

function EventItem() {
    this.name = '';
    this.type = '';
    this.host = '';
    this.startDate = '';
    this.endDate = '';
    this.friendList = [];
    this.country = '';
    this.city = '';
    this.address = '';
    this.userId = '';
}

function FriendData(name, email) {
    this.fullName = name;
    this.email = email;
}

eventBuilderModule.factory("FirebaseAuth", ["$firebaseAuth",
    function ($firebaseAuth) {
        var Firebase = require('firebase');
        var baseRef = new Firebase('https://intense-heat-1833.firebaseio.com/');

        return $firebaseAuth(baseRef);
    }
]);

eventBuilderModule.factory("FirebaseArray", ["$firebaseArray",
    function ($firebaseArray) {
        var Firebase = require('firebase');
        var baseRef = new Firebase('https://intense-heat-1833.firebaseio.com/');

        return $firebaseArray(baseRef);
    }
]);


eventBuilderModule.filter('upcomingDateFilter', function () {
    return function (items, type, auth) {
        var currentDate = new Date();

        if (type === 'ALL') {
            return items.filter(function (item) {
                return new Date(item.endDate) > currentDate;
            });
        } else if (type === 'MY') {
            return items.filter(function (item) {
                return new Date(item.endDate) > currentDate && item.userId === auth.uid;
            });
        }
    };
});

eventBuilderModule.filter('pastDateFilter', function () {
    return function (items, type, auth) {
        var currentDate = new Date();

        if (type === 'ALL') {
            return items.filter(function (item) {
                return new Date(item.endDate) < currentDate;
            });
        } else if (type === 'MY') {
            return items.filter(function (item) {
                return new Date(item.endDate) < currentDate && item.userId === auth.uid;
            });
        }
    };
});

eventBuilderModule.factory('mySharedService', function ($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function (msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});


eventBuilderModule.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function (event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });
}]);


eventBuilderModule.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'template/mainPage.html',
            controller: 'EventOverviewController',
            resolve: {
                currentAuth: ["FirebaseAuth", function (FirebaseAuth) {
                    return FirebaseAuth.$requireAuth();
                }]
            }
        })
        .when('/createEvent', {
            templateUrl: 'template/createEventPage.html',
            controller: 'CreateEventPageController',
            resolve: {
                "currentAuth": ["FirebaseAuth", function (FirebaseAuth) {
                    return FirebaseAuth.$waitForAuth();
                }]
            }
        })
        .when('/login', {
            templateUrl: 'template/loginPage.html',
            controller: 'LoginPageController'
        });
});




