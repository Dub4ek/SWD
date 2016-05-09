import angular from 'angular';

// angular modules
import constants from './constants';
import onConfig  from './on_config';
import onRun     from './on_run';
import 'angular-ui-router';
import 'angular-material';
import 'angular-aria';
import 'angular-google-maps';
import 'angularfire';
import 'firebase';
import './templates';
import './factory';
import './controllers';

// create and bootstrap application
const requires = [
    'ui.router',
    'ngMaterial',
    'ngAria',
    'templates',
    'firebase',
    'app.controllers',
    'app.factories'
];

// mount on window for testing
window.app = angular.module('app', requires);

angular.module('app').constant('AppSettings', constants);

angular.module('app').config(onConfig);

angular.module('app').run(onRun);

angular.bootstrap(document, ['app'], {
    strictDi: true
});
