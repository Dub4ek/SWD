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
            return items.filter(function(item) {
                return item.endDate > currentDate;
            });
        } else if (type === 'MY') {
            return items.filter(function(item) {
                return item.endDate > currentDate && item.userId === auth.uid;
            });
        }
    };
});

eventBuilderModule.filter('pastDateFilter', function () {
    return function (items, type, auth) {
        var currentDate = new Date();

        if (type === 'ALL') {
            return items.filter(function(item) {
                return item.endDate < currentDate;
            });
        } else if (type === 'MY') {
            return items.filter(function(item) {
                return item.endDate < currentDate && item.userId === auth.uid;
            });
        }
    };
});

eventBuilderModule.factory('mySharedService', function($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function(msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function() {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});


eventBuilderModule.run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        if (error === "AUTH_REQUIRED") {
            $location.path("/login");
        }
    });
}]);


eventBuilderModule.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/manePage.html',
            controller: 'EventOverviewController',
            resolve: {
                currentAuth: ["FirebaseAuth", function (FirebaseAuth) {
                    return FirebaseAuth.$requireAuth();
                }]
            }
        })
        .when('/createEvent', {
            templateUrl: '/createEventPage.html',
            controller: 'CreateEventPageController',
            resolve: {
                "currentAuth": ["FirebaseAuth", function(FirebaseAuth) {
                    return FirebaseAuth.$waitForAuth();
                }]
            }
        })
        .when('/login', {
            templateUrl: '/loginPage.html',
            controller: 'LoginPageController'
        });
});


eventBuilderModule.controller('MainPageCtrl', ['$scope', '$location', 'mySharedService', 'FirebaseAuth', '$window', function ($scope, $location, sharedService, FirebaseAuth, $window) {
    $scope.appHeader = 'Event Builder';
    $scope.loginButtonHeader = 'Log in / Sign up';
    $scope.logoutButtonHeader = 'Log out';
    $scope.userLogined = false;
    $scope.userEmail = '';

    $scope.loginButton_clickHandler = function () {
        $location.path('/login');
    }

    $scope.logoutButton_clickHandler = function () {
        FirebaseAuth.$unauth();
        $window.location.reload();
    }

    $scope.home_clickHandler = function () {
        $location.path('/');
    }

    $scope.$on('handleBroadcast', function() {
        var loginUserData = sharedService.message ? sharedService.message.password : null,
            loginUserEmail = loginUserData ? loginUserData.email : '';


        if (loginUserEmail) {
            $scope.userEmail = loginUserEmail;
            $scope.userLogined = true;
        } else {
            $scope.userLogined = false;
        }
    });
}]);


eventBuilderModule.controller('EventOverviewController', ['$scope', '$location', 'currentAuth', 'mySharedService', '$firebaseArray', function ($scope, $location, currentAuth, sharedService, $firebaseArray) {
    $scope.createEventButtonCaption = 'Create Event';
    $scope.upcomingEventsCollection = getUpcomingEventsList();
    $scope.pastEventsCollection = getPastEventsList();
    $scope.upcomingEventsSelectedType = 'ALL';
    $scope.pastEventsSelectedType = 'ALL';
    $scope.authInfo = currentAuth;

    function getUpcomingEventsList() {
        var Firebase = require('firebase'),
        baseRef = new Firebase('https://intense-heat-1833.firebaseio.com/'),
        query = baseRef.orderByChild('startDate')

        return $firebaseArray(query);
    }

    function getPastEventsList() {
        var Firebase = require('firebase'),
            baseRef = new Firebase('https://intense-heat-1833.firebaseio.com/'),
            query = baseRef.orderByChild('startDate')

        return $firebaseArray(query);
    }

    $scope.createEventButton_clickHandler = function () {
        $location.path('/createEvent');
    }

    if (currentAuth) {
        sharedService.prepForBroadcast(currentAuth);
    }
}]);

eventBuilderModule.controller('CreateEventPageController', ['$scope', 'FirebaseArray', '$location', 'mySharedService', function ($scope, FirebaseArray, $location, sharedService) {
    $scope.eventTypeCollection = ['Party', 'Dinner'];
    $scope.selectedEventType = '';
    $scope.selectedEndDate = '';
    $scope.selectedStartDate = '';
    $scope.eventNameText = '';
    $scope.eventHostText = '';
    $scope.addedFriendList = [];
    $scope.countryText = '';
    $scope.cityText = '';
    $scope.addressText = '';
    $scope.currentStep = 0;
    $scope.friendNameText = '';
    $scope.friendEmailText = '';

    var loginUserUid = '';

    function getCreatedEvent() {
        var event = new EventItem();

        event.name = $scope.eventNameText;
        event.type = $scope.selectedEventType;
        event.host = $scope.eventHostText;
        event.startDate = $scope.selectedStartDate;
        event.endDate = $scope.selectedEndDate;
        event.friendList = $scope.addedFriendList.concat();
        event.country = $scope.countryText;
        event.city = $scope.cityText;
        event.address = $scope.addressText;
        event.userId = loginUserUid;

        return event;
    }

    function saveEvent() {
        FirebaseArray.$add(getCreatedEvent()).then(function() {
            $location.path('/');
        });
    }

    $scope.completeButton_clickHandler = function() {
        if ($scope.locationForm.$valid) {
            saveEvent();
        }
    }

    $scope.nextButton_clickHandler = function() {
        var validResult = false;
        if ($scope.currentStep === 0) {
            validResult = $scope.describeEventForm.$valid;
        } else if ($scope.currentStep === 1) {
            validResult = $scope.addedFriendList.length > 0;
        }

        if (validResult) {
            $scope.currentStep += 1;
        }
    }

    $scope.prevButton_clickHandler = function() {
        $scope.currentStep -= 1;
    }

    $scope.addFriendButton_clickHandler = function() {
        if ($scope.inviteFriendsForm.$valid) {
            $scope.addedFriendList.push(new FriendData($scope.friendNameText, $scope.friendEmailText));
            $scope.friendNameText = '';
            $scope.friendEmailText = '';
        }
    }

    $scope.$on('handleBroadcast', function() {
        var loginUserData = sharedService.message ? sharedService.message.uid : null,

        loginUserUid = loginUserData;
    });
}]);

eventBuilderModule.controller('LoginPageController', ['$scope', 'FirebaseAuth', '$location', '$mdToast', '$document', function ($scope, FirebaseAuth, $location, $mdToast, $document) {
    $scope.createAccountButtonHeader = 'Create an account';
    $scope.signupButtonHeader = 'Sign up';
    $scope.passwordTextCU = '';
    $scope.emailTextCU = '';
    $scope.passwordTextSU = '';
    $scope.emailTextSU = '';
    $scope.confirmPasswordTextCU = '';
    $scope.showValidationError = false;
    $scope.disabledCreateButton = false;


    function registerUser() {
        FirebaseAuth.$createUser({
            email: $scope.emailText,
            password: $scope.passwordText
        }).then(function (userData) {
                $scope.disabledCreateButton = false;
                $location.path('/');
            }).catch(function (error) {
                $scope.disabledCreateButton = false;
                function getErrorText(data) {
                    if (data.hasOwnProperty('code')) {
                        if (data.code === 'EMAIL_TAKEN') {
                            return 'Entered email already exist. Please, use another email address'
                        } else {
                            return 'Something wrong. Please, use another email address'
                        }
                    }
                }

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(getErrorText(error))
                        .parent($document[0].querySelector('#toastPositionCU'))
                        .position('top right')
                        .hideDelay(6000)
                );
            });
    }

    function checkValidationErrors(obj) {
        if (obj.hasOwnProperty('$error')) {
            return Object.keys(obj.$error).length === 0;
        }

        return false;
    }

    $scope.createAccountButton_clickHandler = function ($event) {
        $scope.showValidationError = !($scope.passwordText === $scope.confirmPasswordText);
        $scope.disabledCreateButton = true;

        if (checkValidationErrors($scope.projectForm.email) && checkValidationErrors($scope.projectForm.password) && checkValidationErrors($scope.projectForm.confirmPassword) && !$scope.showValidationError) {
            registerUser();
        } else {
            $scope.disabledCreateButton = false;
        }
    }

    function signupUser() {
        FirebaseAuth.$authWithPassword({
            email: $scope.emailTextSU,
            password: $scope.passwordTextSU
        }).then(function (userData) {
                $location.path('/');
            }).catch(function (error) {

                function getErrorText(data) {
                    if (data.hasOwnProperty('code')) {
                        if (data.code === 'INVALID_PASSWORD') {
                            return 'Incorrect password was entered. Please, try again.'
                        } else {
                            return 'Something wrong. Please, use another account settings'
                        }
                    }
                }

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(getErrorText(error))
                        .parent($document[0].querySelector('#toastPositionSU'))
                        .position('top right')
                        .hideDelay(6000)
                );
            });
    }

    $scope.singupButton_clickHandler = function () {
        if (checkValidationErrors($scope.signupForm.email) && checkValidationErrors($scope.signupForm.password)) {
            signupUser();
        }
    }
}]);




