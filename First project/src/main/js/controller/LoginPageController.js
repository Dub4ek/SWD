angular.module('Event_builder_app').controller('LoginPageController', ['$scope', 'FirebaseAuth', '$location', '$mdToast', '$document', function ($scope, FirebaseAuth, $location, $mdToast, $document) {
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
            email: $scope.emailTextCU,
            password: $scope.passwordTextCU
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
