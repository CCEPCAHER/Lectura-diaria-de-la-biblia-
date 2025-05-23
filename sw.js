self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("app-cache").then(cache =>
      cache.addAll([
        "/", 
        "/index.html",
        "/style.css",
        "/script.js",
        "/manifest.json",
        "/icons/icon-192x192.png",
        "/icons/icon-512x512.png"
      ])
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});