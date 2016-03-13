(function () {
    'use strict';

    angular.module('TrainScheduleModule')
        .controller('MainPageController', MainPageController);

    MainPageController.$inject = ['TrainService', 'TRAIN_STATIONS', '$filter', 'ServiceWorkerService', 'ToastService', '$document', 'IndexDBService'];

    function MainPageController(TrainService, TRAIN_STATIONS, $filter, ServiceWorkerService, ToastService, $document, IndexDBService) {
        var vm = this,
            selectedArrivalStation,
            selectedDepartureStation,
            toastPosition = $document[0].querySelector('#toastPosition');


        vm.foundTrainsCollection;
        vm.selectedTripDate = null;
        vm.selectedArrivalStation = '';
        vm.selectedDepartureStation = '';
        vm.selectedSearchArrivalStation = '';
        vm.selectedSearchDepartureStation = '';
        vm.showLoading = false;
        vm.arrivalStationRequired = true;


        function getDurationPeriod(seconds) {
            return Math.floor(seconds / 3600);
        }

        function getSearchResult(data, dbResponse) {
            data = data || {};

            var threadsCollection = data.threads || [],
                result = [];

            result = threadsCollection.map(function (item) {
                return {
                    caption: item.thread.number + ' ' + item.thread.title,
                    arrival: item.arrival,
                    departure: item.departure,
                    duration: getDurationPeriod(item.duration)
                }
            });

            function getResultCaption(dbMode) {
                if (dbMode) {
                    return "Can't get data from server"
                }

                return 'Search result is empty. Please, try another date or change station'
            }

            if (!result.length) {
                result.push({
                    caption: getResultCaption(dbResponse)
                });
            } else {
                IndexDBService.addRequestToDB(data, vm.selectedArrivalStation.station_code, vm.selectedDepartureStation.station_code, getSelectedScheduleDate(vm.selectedTripDate));
            }

            return result;
        }

        function getSelectedScheduleDate(date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        }


        vm.arrivalSelectedItemChange = function (item) {
            selectedArrivalStation = item;
        }

        vm.stationSearch = function (searchQuery) {
            searchQuery = searchQuery.toLowerCase();

            return TRAIN_STATIONS.filter(function (item) {
                return item.name.toLowerCase().indexOf(searchQuery) != -1;
            });
        }

        vm.departureSelectedItemChange = function (item) {
            selectedDepartureStation = item;
        }

        vm.swapButton_clickHandler = function () {
            var temp;

            if (vm.selectedArrivalStation && vm.selectedDepartureStation) {
                temp = vm.selectedDepartureStation;
                vm.selectedDepartureStation = vm.selectedArrivalStation;
                vm.selectedArrivalStation = temp;
            }
        }

        vm.findButton_clickHandler = function () {
            if (vm.findTrainScheduleForm.$valid) {
                vm.showLoading = true;
                TrainService.findRoute(vm.selectedArrivalStation.station_code, vm.selectedDepartureStation.station_code, getSelectedScheduleDate(vm.selectedTripDate))
                    .then(
                        function (response) {
                            if (response) {
                                vm.showLoading = false;
                                vm.foundTrainsCollection = getSearchResult(response.data);
                            }
                        },
                        function () {
                            IndexDBService.getTrainRequest(vm.selectedArrivalStation.station_code, vm.selectedDepartureStation.station_code, getSelectedScheduleDate(vm.selectedTripDate))
                                .then(
                                    function(responseDB) {
                                        responseDB = responseDB  || {};
                                        vm.showLoading = false;
                                        vm.foundTrainsCollection = getSearchResult(responseDB.requestBody, true);
                                    },
                                    function (error) {
                                        vm.showLoading = false;
                                        ToastService.show('Error occur, please try again', toastPosition);
                                    }
                                );
                            }
                        );
            } else {
                ToastService.show('Please, fill required data', toastPosition);
            }
        }

        ServiceWorkerService.registerServiceWorker('./js/ServiceWorker.js');
        IndexDBService.openDB();
    }

    module.exports = MainPageController;
}());