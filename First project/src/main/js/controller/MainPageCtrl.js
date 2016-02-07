(function () {
    'use strict';

    angular
        .module('Event_builder_app')
        .controller('MainPageCtrl', MainPageCtrl);

    MainPageCtrl.$inject = ['$location', 'mySharedService', 'FirebaseAuth', 'FirebaseAccounts', '$window', '$scope', '$mdDialog'];


    function MainPageCtrl($location, sharedService, FirebaseAuth, FirebaseAccounts, $window, $scope, $mdDialog) {
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

        $scope.userName_clickHandler = function() {
            function getUserInformation(userUid) {
                var accounts = FirebaseAccounts;

                if (accounts.hasOwnProperty(userUid)) {
                    return accounts[userUid].name + ' ' + accounts[userUid].birthday;
                }
            }

            $mdDialog.show(
                $mdDialog.alert()
                    .title('User information')
                    .clickOutsideToClose(true)
                    .textContent(getUserInformation(sharedService.message.uid))
                    .ariaLabel('Event information')
                    .ok('Close')
                    .targetEvent(event)
            );
        }

        $scope.$on('handleBroadcast', function () {
            var loginUserData = sharedService.message ? sharedService.message.password : null,
                loginUserEmail = loginUserData ? loginUserData.email : '';

            if (loginUserEmail) {
                $scope.userName = loginUserEmail;
                $scope.userLogined = true;
            } else {
                $scope.userLogined = false;
            }
        });
    }
})();