(function () {
    'use strict';

    angular
        .module('Event_builder_app')
        .controller('EventOverviewController', EventOverviewController);

    EventOverviewController.$inject = ['$location', 'currentAuth', 'mySharedService', '$firebaseArray', '$mdDialog'];


    function EventOverviewController($location, currentAuth, sharedService, $firebaseArray, $mdDialog) {
        var vm = this;

        vm.createEventButtonCaption = 'Create Event';
        vm.upcomingEventsCollection = getUpcomingEventsList();
        vm.pastEventsCollection = getPastEventsList();
        vm.upcomingEventsSelectedType = 'ALL';
        vm.pastEventsSelectedType = 'ALL';
        vm.authInfo = currentAuth;
        vm.userAuthenticated = false;

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

        vm.createEventButton_clickHandler = function () {
            $location.path('/createEvent');
        }

        vm.listItem_clickHandler = function (item) {
            function getItemInfoText(data) {
                return data.friendList.reduce(function (prev, cur) {
                    return prev + ' ' + cur.fullName + ' (' + cur.email + ')';
                }, '');
            }

            $mdDialog.show(
                $mdDialog.alert()
                    .title('List of invited friends to the ' + item.name + ' event')
                    .clickOutsideToClose(true)
                    .textContent(getItemInfoText(item))
                    .ariaLabel('Event information')
                    .ok('Close')
                    .targetEvent(event)
            );
        }

        if (currentAuth) {
            sharedService.prepForBroadcast(currentAuth);
            vm.userAuthenticated = true;
        } else {
            vm.userAuthenticated = false;
        }
    }
})();
