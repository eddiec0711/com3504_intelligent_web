// this.addEventListener('install', function(event) {
//     event.waitUntil(
//         caches.open('v1').then(function(cache) {
//             return cache.addAll([
//                 '/'
//             ]);
//         })
//     );
// });
//
//
//

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache =
    [
// add the files you want to cache here
    '/',
    'javascripts/canvas.js',
    'javascripts/database.js',
    'javascripts/idb.js',
    'javascripts/image.js',
    'javascripts/index.js',
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
// it checks if the requested page is among the cached ones
        caches.match(event.request)
            .then(function(response) {
// Cache hit - return the cache response (the cached page)
                if (response) {
                    return response;
                } //cache does not have the page — go to the server
                return fetch(event.request);
            }) );});