const CACHE_NAME = "v3";
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/js/app.js",
    "/assets/icons/icon.png",
    "/style/style.css",
    "/manifest.json",
    "/sw.js"
]

self.addEventListener("install", event => {
    console.log("Service Worker Installed !");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    )
})
self.addEventListener("activate", event => {
    console.log("Service Worker Activated !");
    const ALLOWED_CACHES = ["v3"];
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
self.addEventListener("fetch", event => { event.respondWith(
    caches.match(event.request)
        .then(response => response || fetch(event.request))
)})
