(function () {
    'use strict';

    angular
        .module('Event_builder_app')
        .controller('CreateEventPageController', CreateEventPageController);

    CreateEventPageController.$inject = ['FirebaseArray', '$location', 'currentAuth', '$mdToast', '$document', '$window', '$http'];

    function CreateEventPageController(FirebaseArray, $location, auth, $mdToast, $document, $window, $http) {
        var vm = this;

        vm.eventTypeCollection = ['Party', 'Dinner', 'Breakfast', 'Picnic', 'Company party', 'Other'];
        vm.selectedEventType = '';
        vm.endDateTime = '';
        vm.startDateTime = '';
        vm.eventNameText = '';
        vm.eventHostText = '';
        vm.locationText = '';
        vm.currentStep = 0;
        vm.incorrectDate = false;
        vm.friendNameText = '';
        vm.friendEmailText = '';
        vm.addedFriendList = [];
        vm.messageForGuests = '';


        function getAuthUserData(auth) {
            return auth ? auth.uid : '';
        }

        function getCreatedEvent() {
            var event = new EventItem();

            event.name = vm.eventNameText;
            event.type = vm.selectedEventType;
            event.host = vm.eventHostText;
            event.startDate = vm.startDateTime.toUTCString();
            event.endDate = vm.endDateTime.toUTCString();
            event.friendList = vm.addedFriendList;
            event.location = vm.locationText;
            event.description = vm.messageForGuests;
            event.userId = getAuthUserData(auth);

            return event;
        }

        function showErrorPopup(text, parent) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .parent(parent)
                    .position('top right')
                    .hideDelay(6000)
            );
        }

        function saveEvent() {
            FirebaseArray.$add(getCreatedEvent()).then(function () {
                $location.path('/');
            });
        }

        vm.completeButton_clickHandler = function () {
            function checkEnteredDates() {
                return new Date(vm.startDateTime) < new Date(vm.endDateTime)
            }

            function checkFriendsList() {
                return vm.addedFriendList.length > 0;
            }

            if (!vm.describeEventForm.$valid) {
                return;
            }

            if (!checkEnteredDates()) {
                showErrorPopup('End date should be greater, than start date', $document[0].querySelector('#toastPositionEvent'))
            } else if (!checkFriendsList()) {
                showErrorPopup('Please, add at least one guest to the event', $document[0].querySelector('#toastPositionEvent'));
            } else {
                saveEvent();
            }
        }

        vm.addFriendButton_clickHandler = function () {
            if (vm.friendNameText.length > 0 && vm.friendEmailText.length > 0) {
                vm.addedFriendList.push(new FriendData(vm.friendNameText, vm.friendEmailText));
                vm.friendNameText = '';
                vm.friendEmailText = '';
            } else {
                if (!vm.friendNameText) {
                    showErrorPopup('Please, fill friend name field', $document[0].querySelector('#toastPositionFriends'));
                } else {
                    showErrorPopup('Please, fill friend email field', $document[0].querySelector('#toastPositionFriends'));
                }
            }
        }

        function autocompleteLocation() {

            function fillLocationField(addressData) {
                vm.locationText = addressData.formatted_address;
            }

            function getLocation(position) {
                $http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + ',' + position.coords.longitude + '&sensor=false').then(function (data) {
                    if (data.data.results && data.data.results.length > 0) {
                        fillLocationField(data.data.results[0]);
                    }
                })
            }

            if ($window.navigator.geolocation) {
                $window.navigator.geolocation.getCurrentPosition(getLocation);
            }
        }

        autocompleteLocation();
    }
})();
