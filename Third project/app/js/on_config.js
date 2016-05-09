function OnConfig($stateProvider, $locationProvider, $urlRouterProvider) {
    'ngInject';

    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home', {
            url: '/home',
            controller: 'HomePageController as vm',
            templateUrl: 'home.html'
        })
        .state('home.map', {
            url: '/map',
            views: {
                'viewType@home': {
                    templateUrl: 'mapView.html'
                }
            }
        })
        .state('home.grid', {
            url: '/grid',
            views: {
                'viewType@home': {
                    templateUrl: 'gridView.html'
                }
            }
        })
        .state('restaurantDetail', {
            url: '/details/',
            controller: 'RestaurantDetailsController as vm',
            templateUrl: 'details.html',
        })

    $urlRouterProvider.otherwise('/home/grid');

    /*uiGmapGoogleMapApiProvider.configure({
        //    key: 'your api key',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });*/

}

export default OnConfig;
