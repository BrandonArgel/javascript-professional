const VERSION = "v1";

self.addEventListener("install", (event) => {
	event.waitUntil(precache());
});

self.addEventListener("fetch", (event) => {
	const request = event.request;
	// get
	if (request.method !== "GET") {
		return;
	}

	// buscar en cache
	event.respondWith(cachedResponse(request));

	// actualizar el cache
	event.waitUntil(updateCache(request));
});

async function precache() {
	// Fix  Failed to execute 'addAll' on 'Cache'
	// https://stackoverflow.com/questions/52724095/failed-to-execute-addall-on-cache
	const cache = await caches.open(VERSION);
	return cache.addAll([
		// "/",
		// "/index.html",
		// "/assets/index.js",
		// "/assets/MediaPlayer.js",
		// "/assets/plugins/AutoPlay.js",
		// "/assets/plugins/AutoPause.js",
		// "/assets/index.css",
		// "/assets/song.mp4",
	]);
}

async function cachedResponse(request) {
	const cache = await caches.open(VERSION);
	const response = await cache.match(request);
	return response || fetch(request);
}

async function updateCache(request) {
	const cache = await caches.open(VERSION);
	const response = await fetch(request);
	console.log(`Code: ${response.status} | Messsage: ${response.statusText}`);
	if (response.status === 206) {
		console.log("Respuesta parcial, no se actualiza caché ...");
	} else {
		cache.put(request, response.clone());
	}
	return cache;
}
