var CACHE_NAME = 'trainScheduleCache',
    urlCacheCollection = [
        '/css/app.css',
        '/images/icon/swap_horiz_24px.svg',
        '/js/all.js'
    ];

this.oninstall = function (event) {
    event.waitUntil(caches.open(CACHE_NAME)
        .then(function (cache) {
            return cache.addAll(urlCacheCollection);
        }));
};

this.onfetch = function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request);
                }
            )
    );
};
