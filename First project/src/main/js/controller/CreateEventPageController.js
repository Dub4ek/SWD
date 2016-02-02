angular.module('Event_builder_app').controller('CreateEventPageController', ['$scope', 'FirebaseArray', '$location', 'currentAuth', function ($scope, FirebaseArray, $location, auth) {
    $scope.eventTypeCollection = ['Party', 'Dinner', 'Breakfast', 'Picnic', 'Company party', 'Other'];
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


    function getAuthUserData(auth) {
        return auth ? auth.uid : '';
    }

    function getCreatedEvent() {
        var event = new EventItem();

        event.name = $scope.eventNameText;
        event.type = $scope.selectedEventType;
        event.host = $scope.eventHostText;
        event.startDate = $scope.selectedStartDate.toUTCString();
        event.endDate = $scope.selectedEndDate.toUTCString();
        event.friendList = $scope.addedFriendList.concat();
        event.country = $scope.countryText;
        event.city = $scope.cityText;
        event.address = $scope.addressText;
        event.userId = getAuthUserData(auth);

        return event;
    }

    function saveEvent() {
        FirebaseArray.$add(getCreatedEvent()).then(function () {
            $location.path('/');
        });
    }

    $scope.completeButton_clickHandler = function () {
        if ($scope.locationForm.$valid) {
            saveEvent();
        }
    }

    $scope.nextButton_clickHandler = function () {
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

    $scope.prevButton_clickHandler = function () {
        $scope.currentStep -= 1;
    }

    $scope.addFriendButton_clickHandler = function () {
        if ($scope.inviteFriendsForm.$valid) {
            $scope.addedFriendList.push(new FriendData($scope.friendNameText, $scope.friendEmailText));
            $scope.friendNameText = '';
            $scope.friendEmailText = '';
        }
    }
}]);
