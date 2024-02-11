const CACHE_NAME = "my-medical-shop-cache-v1";
const urlsToCache = [
  "/",
  "/medical/index.html", // Update with your main HTML file
  "/medical/viewProduct.html",
  "/medical/sellProduct.html",
  "/medical/css/addProduct.css", // Update with your CSS file path
  "/medical/css/style2.css",
  "/medical/js/addProduct.js", // Update with your JavaScript file path
  "/medical/js/sellProduct.js",
  "/medical/js/viewProduct.js",
  "/medical/img/medi.png",
  "/medical/img/medimini.png"
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
