(function () {
    'use strict';

    angular.module('TrainScheduleModule')
        .service('IndexDBService', IndexDBService);

    IndexDBService.$inject = ['$window', '$q'];

    function IndexDBService($window, $q) {
        var db = null,
            lastIndex = 0;

        this.getIndexDB = function () {
            return $window.indexedDB || undefined;
        }

        this.checkIndexedDB = function () {
            return 'indexedDB' in $window;
        }

        this.openDB = function () {
            var deferred = $q.defer(),
                version = 1,
                indexedDB = this.getIndexDB(),
                request;

            if (!this.checkIndexedDB()) {
                deferred.reject();
            } else {
                request = indexedDB.open("trainScheduleRequest", version)
                request.onerror = function (err) {
                    console.log(err);
                }
            }

            request.onupgradeneeded = function (e) {
                var store;

                db = e.target.result;
                e.target.transaction.onerror = indexedDB.onerror;

                if (db.objectStoreNames.contains("scheduleRequest")) {
                    db.deleteObjectStore("scheduleRequest");
                }

                store = db.createObjectStore("scheduleRequest", {
                    keyPath: "id"
                });
            };

            request.onsuccess = function (e) {
                db = e.target.result;
                deferred.resolve();
            };

            request.onerror = function () {
                deferred.reject();
            };

            return deferred.promise;
        };

        this.getTrainRequest = function (from, to, date) {
            var deferred = $q.defer();

            if (db === null) {
                deferred.reject("IndexDB is not opened yet!");
            } else {
                var trans = db.transaction(["scheduleRequest"], "readwrite"),
                    store = trans.objectStore("scheduleRequest"),
                    trainRequest,
                    keyRange = IDBKeyRange.lowerBound(0),
                    cursorRequest = store.openCursor(keyRange);

                cursorRequest.onsuccess = function (e) {
                    var result = e.target.result;

                    function checkRequest(value) {
                        return value.from === from &&
                               value.to === to &&
                               value.date === date;
                    }

                    if (result === null || result === undefined) {
                        deferred.resolve(trainRequest);
                    } else {
                        if (!checkRequest(result.value)) {
                            if (result.value.id > lastIndex) {
                                lastIndex = result.value.id;
                            }
                        } else {
                            trainRequest = result.value;
                        }
                        result.continue();
                    }
                };

                cursorRequest.onerror = function (e) {
                    deferred.reject("Something went wrong!!!");
                };
            }

            return deferred.promise;
        };

        this.addRequestToDB = function (requestData, from, to, date) {
            var deferred = $q.defer();

            if (db === null) {
                deferred.reject("IndexDB is not opened yet!");
            } else {
                this.getTrainRequest(from, to, date)
                    .then(
                        function (response) {
                            var index;

                            if (!response) {
                                lastIndex++;
                                index = lastIndex;
                            } else {
                                index = response.id || lastIndex;
                            }

                            var trans = db.transaction(["scheduleRequest"], "readwrite"),
                                store = trans.objectStore("scheduleRequest");

                            var request = store.put({
                                id: index,
                                requestBody: requestData,
                                date: date,
                                from: from,
                                to: to
                            });

                            request.onsuccess = function (e) {
                                deferred.resolve();
                            };

                            request.onerror = function (e) {
                                deferred.reject("scheduleRequest item couldn't be added!");
                            };
                        },
                        function () {
                            deferred.reject("scheduleRequest item couldn't be added!");
                        }
                    );
            }
            return deferred.promise;
        };
    }

    module.exports = IndexDBService;
}());