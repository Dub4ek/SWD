(function () {
    'use strict';

    angular.module('TrainScheduleModule')
        .service('ServiceWorkerService', ServiceWorkerService);

    ServiceWorkerService.$inject = ['$window'];

    function ServiceWorkerService($window) {
        this.getServiceWorker = function () {
            return $window.navigator.serviceWorker;
        }

        this.checkServiceWorker = function () {
            return 'serviceWorker' in $window.navigator;
        };

        this.registerServiceWorker = function (worker) {
            if (this.checkServiceWorker()) {
                this.getServiceWorker().register(worker);
            }
        };
    }

    module.exports = ServiceWorkerService;
}());