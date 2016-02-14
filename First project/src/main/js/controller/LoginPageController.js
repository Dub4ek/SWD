(function () {
    'use strict';

    angular
        .module('Event_builder_app')
        .controller('LoginPageController', LoginPageController);

    LoginPageController.$inject = ['FirebaseAuth', 'FirebaseAccounts', '$location', '$mdToast', '$document'];


    function LoginPageController(FirebaseAuth, FirebaseAccounts, $location, $mdToast, $document) {
        var vm = this;

        vm.createAccountButtonHeader = 'Create an account';
        vm.loginButtonHeader = 'Log in';
        vm.passwordTextCU = '';
        vm.emailTextCU = '';
        vm.nameTextCU = '';
        vm.passwordTextSU = '';
        vm.emailTextSU = '';
        vm.confirmPasswordTextCU = '';
        vm.showValidationError = false;
        vm.disabledCreateButton = false;
        vm.myBirthday=null;
        vm.passwordShowError = false;
        vm.confirmPasswordShowError = false;


        function saveUserData(data) {
            var accounts = FirebaseAccounts;

            accounts[data.uid] = {
                name: vm.nameTextCU,
                birthday: vm.myBirthday ? vm.myBirthday.toUTCString() : ''
            };

            accounts.$save()
                .then(function() {
                    signupUser(vm.emailTextCU, vm.passwordTextCU);
                })
                .catch(function() {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Error occurred. Please, refresh page and try again')
                            .parent($document[0].querySelector('#toastPositionCU'))
                            .position('top right')
                            .hideDelay(6000)
                    );
                });
        }

        function registerUser(email, password) {
            FirebaseAuth.$createUser({
                email: email,
                password: password
            }).then(function (userData) {
                    vm.disabledCreateButton = false;
                    saveUserData(userData);
                }).catch(function (error) {
                    vm.disabledCreateButton = false;
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
            if (obj && obj.hasOwnProperty('$error')) {
                return Object.keys(obj.$error).length === 0;
            }

            return false;
        }

        vm.createAccountButton_clickHandler = function ($event) {
            vm.showValidationError = !(vm.passwordTextCU === vm.confirmPasswordTextCU);
            vm.disabledCreateButton = true;

            if (checkValidationErrors(vm.projectForm.emailCU) &&
                checkValidationErrors(vm.projectForm.passwordCU) &&
                checkValidationErrors(vm.projectForm.confirmPasswordCU) &&
                !vm.showValidationError &&
                checkValidationErrors(vm.projectForm.nameInput) &&
                checkValidationErrors(vm.projectForm.myBirthday)) {
                registerUser(vm.emailTextCU, vm.passwordTextCU);
            } else {
                vm.disabledCreateButton = false;
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Please, enter correctly all required data')
                        .parent($document[0].querySelector('#toastPositionCU'))
                        .position('top right')
                        .hideDelay(6000)
                );
            }
        }

        function signupUser(email, password) {
            FirebaseAuth.$authWithPassword({
                email: email,
                password: password
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

        vm.loginButton_clickHandler = function () {
            if (checkValidationErrors(vm.signupForm.emailSU) && checkValidationErrors(vm.signupForm.passwordSU)) {
                signupUser(vm.emailTextSU, vm.passwordTextSU);
            }
        }

        vm.passwordInput_changeHandler = function() {
            vm.passwordShowError = Object.keys(vm.projectForm.passwordCU.$error).length > 0;
        }

        vm.confirmPasswordInput_changeHandler = function() {
            vm.confirmPasswordShowError = Object.keys(vm.projectForm.confirmPasswordCU.$error).length > 0;
        }
    }
})();
