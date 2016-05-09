function HomePageController($state, RestaurantCollectionFactory) {
    const vm = this;

    vm.restaurantCollection = RestaurantCollectionFactory.get();
    vm.searchQuery = '';

    vm.gridTile_clickHandler = function () {
        $state.go('restaurantDetail');
    }

    vm.viewChange_clickHandler = function () {
        if ($state.is('home.grid')) {
            $state.go('home.map');
        } else {
            $state.go('home.grid');
        }
    }
}

HomePageController.$inject = ['$state', 'RestaurantCollectionFactory'];

export default {
    name: 'HomePageController',
    fn: HomePageController
};
