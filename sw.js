const CURRENT_CACHE_NAME = "v1";
const ALLOWED_CACHES = ["v1"];
const FILES_TO_CACHE = [
    "/",
    "/sw.js",
    "/index.html",
    "/manifest.json",
    "/assets/icons/base_icon.png",
    "/assets/icons/icon512_maskable.png",
    "/assets/icons/icon512_rounded.png",
    "/assets/fonts/Jost-Regular.woff2",
    "/assets/fonts/Jura-Light.woff2",
    "/style/style.css",
    "/style/colors.css",
    "/style/typography.css",
    "/style/pages/index.css",
    "/js/app.js"
]

self.addEventListener("install", event => {
    console.log("Service Worker Installed !");
    event.waitUntil(
        caches.open(CURRENT_CACHE_NAME)
            .then(cache => cache.addAll(FILES_TO_CACHE))
    )
})
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
