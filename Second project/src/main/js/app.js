var angular = require('angular');

angular.module('TrainScheduleModule', [require('angular-material'), require('angular-messages')]);

require('./controller/MainPageController');
require('./service/TrainService');
require('./service/ServiceWorkerService');
require('./service/ToastService');
require('./service/IndexDBService');
require('./constant/TrainStations');