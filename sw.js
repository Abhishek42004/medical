const CACHE_NAME = "my-medical-shop-cache-v1";
const urlsToCache = [
  "/",
  "/index.html", // Update with your main HTML file
  "/viewProduct.html",
  "/sellProduct.html",
  "/css/addProduct.css", // Update with your CSS file path
  "/css/style2.css",
  "/js/addProduct.js", // Update with your JavaScript file path
  "/js/sellProduct.js",
  "/js/viewProduct.js",
  // Add other assets you want to cache
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
