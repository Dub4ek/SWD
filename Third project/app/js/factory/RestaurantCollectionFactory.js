function RestaurantCollectionFactory($firebaseArray) {
    'ngInject';

    const factory = {};

    factory.get = function () {
        let baseRef = new Firebase('https://restaurant-review.firebaseio.com/');

        return $firebaseArray(baseRef);
    };

    return factory;
}

    RestaurantCollectionFactory.$inject = ['$firebaseArray'];

export default {
    name: 'RestaurantCollectionFactory',
    fn: RestaurantCollectionFactory
};
