const CURRENT_CACHE_NAME = "v1";
const ALLOWED_CACHES = ["v1"];
const FILES_TO_CACHE_JSON_FILE = "sw_files_to_cache_json.json"



self.addEventListener("install", event => {
    console.log("Service Worker Installed !");
    event.waitUntil(
        caches.open(CURRENT_CACHE_NAME)
            .then(cache => cache.addAll([FILES_TO_CACHE_JSON_FILE]))
            .then(() => caches.match(FILES_TO_CACHE_JSON_FILE)
                .then(r => r.json())
            )
            .then(files => caches.open(CURRENT_CACHE_NAME)
                .then(cache => cache.addAll(files))
            )
    );
});
self.addEventListener("activate", event => {
    console.log("Service Worker Activated !");
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (!ALLOWED_CACHES.includes(key)) {
                    return caches.delete(key);
                }
            })
        ))
    );
    self.skipWaiting();
})
self.addEventListener("fetch", event => {event.respondWith(
    caches.match(event.request)
        .then(response => response || fetch(event.request))
    )})