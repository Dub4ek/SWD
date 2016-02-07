(function () {
    'use strict';

    angular
        .module('Event_builder_app')
        .controller('CreateEventPageController', CreateEventPageController);

    CreateEventPageController.$inject = ['FirebaseArray', '$location', 'currentAuth', '$mdToast', '$document'];

    function CreateEventPageController(FirebaseArray, $location, auth, $mdToast, $document) {
        var vm = this;
        
        vm.eventTypeCollection = ['Party', 'Dinner', 'Breakfast', 'Picnic', 'Company party', 'Other'];
        vm.selectedEventType = '';
        vm.endDateTime = '';
        vm.startDateTime = '';
        vm.eventNameText = '';
        vm.eventHostText = '';
        vm.addedFriendList = [];
        vm.countryText = '';
        vm.cityText = '';
        vm.addressText = '';
        vm.currentStep = 0;
        vm.friendNameText = '';
        vm.friendEmailText = '';
        vm.incorrectDate = false;


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
            event.friendList = vm.addedFriendList.concat();
            event.country = vm.countryText;
            event.city = vm.cityText;
            event.address = vm.addressText;
            event.userId = getAuthUserData(auth);

            return event;
        }

        function saveEvent() {
            FirebaseArray.$add(getCreatedEvent()).then(function () {
                $location.path('/');
            });
        }

        vm.completeButton_clickHandler = function () {
            if (vm.locationForm.$valid) {
                saveEvent();
            }
        }

        vm.nextButton_clickHandler = function () {
            var validResult = false;

            function checkEnteredDates() {
                return new Date(vm.startDateTime) < new Date(vm.endDateTime)
            }

            if (vm.currentStep === 0) {
                validResult = vm.describeEventForm.$valid && checkEnteredDates();

                if (vm.describeEventForm.$valid && !checkEnteredDates()) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('End date should be greater, than start date')
                            .parent($document[0].querySelector('#toastPositionEvent'))
                            .position('bottom right')
                            .hideDelay(6000)
                    );
                }
            } else if (vm.currentStep === 1) {
                validResult = vm.addedFriendList.length > 0;

                if (!validResult) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Please, add at least one friend')
                            .parent($document[0].querySelector('#toastPositionFriends'))
                            .position('bottom right')
                            .hideDelay(6000)
                    );
                }
            }

            if (validResult) {
                vm.currentStep += 1;
            }
        }

        vm.prevButton_clickHandler = function () {
            vm.currentStep -= 1;
        }

        vm.addFriendButton_clickHandler = function () {
            if (vm.inviteFriendsForm.$valid) {
                vm.addedFriendList.push(new FriendData(vm.friendNameText, vm.friendEmailText));
                vm.friendNameText = '';
                vm.friendEmailText = '';
            }
        }
    }
})();
