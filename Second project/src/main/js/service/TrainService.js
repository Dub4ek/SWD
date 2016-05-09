(function () {
    'use strict';

    angular.module('TrainScheduleModule')
        .service('TrainService', TrainService);

    TrainService.$inject = ['$http'];

    function TrainService($http) {
        var API_KEY = 'f8a1237e-72f1-48de-b60d-bbaef1e8c994',
            REQUEST_URL = 'https://api.rasp.yandex.net/v1.0/search/';

        function getRequestParams(from, to, page, date) {
            return {
                apikey: API_KEY,
                format: 'json',
                from: from,
                to: to,
                transport_types: 'train',
                lang: 'ru',
                page: page || 1,
                date: date,
                system: 'express'
            }
        }

        this.findRoute = function (stationFrom, stationTo, date) {
            return $http.get(REQUEST_URL, {
                params: getRequestParams(stationFrom, stationTo, 1, date),
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Credentials': true
                }
            });
        }

        this.getStations = function () {

        }
    }

    module.exports = TrainService;
}());