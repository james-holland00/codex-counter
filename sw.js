const CACHE = "counted-v36";
const ASSETS = [
  "index.html",
  "privacy.html",
  "support.html",
  "styles.css?v=36",
  "counted-core.js?v=36",
  "app.js?v=36",
  "manifest.webmanifest",
  "assets/icon.svg",
  "assets/icon-192.png",
  "assets/icon-512.png",
  "assets/apple-touch-icon.png",
  "assets/fonts/dm-sans-400.ttf",
  "assets/fonts/dm-sans-500.ttf",
  "assets/fonts/dm-sans-600.ttf",
  "assets/fonts/dm-sans-700.ttf",
  "assets/fonts/fraunces-600.ttf",
  "assets/fonts/fraunces-700.ttf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("index.html")));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
