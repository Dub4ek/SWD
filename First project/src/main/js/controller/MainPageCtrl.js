angular.module('Event_builder_app').controller('MainPageCtrl', ['$scope', '$location', 'mySharedService', 'FirebaseAuth', '$window', function ($scope, $location, sharedService, FirebaseAuth, $window) {
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

    $scope.$on('handleBroadcast', function () {
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