var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache =
    [
// add the files you want to cache here
    '/',
    'javascripts/canvas.js',
    'javascripts/database.js',
    'javascripts/idb.js',
    'javascripts/upload.js',
    'javascripts/index.js',
    'javascripts/knowledgeG.js',
    'javascripts/room.js',
    'stylesheets/style.css'
];

self.addEventListener('install', function (event) {
// Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then (function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;     // if valid response is found in cache return it
                } else {
                    return fetch(event.request)     //fetch from internet
                        .then(function(res) {
                            return caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request.url, res.clone());    //save the response for future
                                    return res;   // return the fetched data
                                })
                        })
                        .catch(function(err) {       // fallback mechanism
                            return caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    console.log("Cache fall back as internet fetch failed");
                                });
                        });
                }
            })
    );
});