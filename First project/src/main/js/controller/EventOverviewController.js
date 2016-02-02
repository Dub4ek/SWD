angular.module('Event_builder_app').controller('EventOverviewController', ['$scope', '$location', 'currentAuth', 'mySharedService', '$firebaseArray', '$mdDialog', function ($scope, $location, currentAuth, sharedService, $firebaseArray, $mdDialog) {
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

    $scope.listItem_clickHandler = function (item) {
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
    }
}]);
