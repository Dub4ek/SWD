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
        vm.countryText = '';
        vm.cityText = '';
        vm.addressText = '';
        vm.currentStep = 0;
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
            function checkEnteredDates() {
                return new Date(vm.startDateTime) < new Date(vm.endDateTime)
            }

            if (vm.describeEventForm.$valid && !checkEnteredDates()) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('End date should be greater, than start date')
                        .parent($document[0].querySelector('#toastPositionEvent'))
                        .position('top right')
                        .hideDelay(6000)
                );
            } else {
                saveEvent();
            }
        }
    }
})();
