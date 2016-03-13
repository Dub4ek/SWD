(function () {
    'use strict';

    angular.module('TrainScheduleModule')
        .service('ToastService', ToastService);

    ToastService.$inject = ['$mdToast'];

    function ToastService($mdToast) {
        this.show = function (text, parent) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .parent(parent)
                    .position('top left')
                    .hideDelay(6000)
            );
        }
    }

    module.exports = ToastService;
}());
