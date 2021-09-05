importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const urlsToCache = [
	// pages
	'/',
	'/nav.html',
	'/index.html',
	"/team.html",
	'/favorite.html',

	// css
	'/css/style.css',
	'/css/materialize.min.css',

	// js
	'/js/materialize.min.js',
	'/js/script.js',
	"/js/index.js",
	"/js/team.js",
	"/js/fav.js",
	"/js/db.js",
	"/js/idb.js",
	"/js/api.js",
	'/manifest.json',

	// images
	'/icon.png'
];

if (workbox) {
	console.log(`Workbox berhasil dimuat`);
}
else {
	console.log(`Workbox gagal dimuat`);
}

workbox.precaching.precacheAndRoute(urlsToCache.map(url => {
	return {
		url,
		revision: '1'
	}
}), {
	ignoreUrlParametersMatching: [/.*/]
});


self.addEventListener('push', function (event) {
	var body;
	if (event.data) {
		body = event.data.text();
	} else {
		body = 'Push message no payload';
	}
	var options = {
		body: body,
		icon: 'img/icon.png',
		vibrate: [100, 50, 100],
		data: {
			dateOfArrival: Date.now(),
			primaryKey: 1
		}
	};
	event.waitUntil(
		self.registration.showNotification('Push Notification', options)
	);
});

workbox.routing.registerRoute(
	/^https:\/\/api\.football-data\.org\/v2\//,
	workbox.strategies.cacheFirst({
		cacheName: 'api-cache',
		plugins: [
			new workbox.cacheableResponse.Plugin({
				statuses: [0, 200],
			}),
			new workbox.expiration.Plugin({
				maxAgeSeconds: 60 * 60 * 24 * 365,
				maxEntries: 30,
			}),
		],
	})
);
