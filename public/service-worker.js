// Emergency service worker replacement - unregisters itself immediately
self.addEventListener('install', (event) => {
  console.log('Emergency service worker: Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Emergency service worker: Activating and unregistering...');
  event.waitUntil(
    self.registration.unregister().then(() => {
      console.log('Emergency service worker: Unregistered successfully');
      return self.clients.matchAll();
    }).then((clients) => {
      clients.forEach(client => {
        console.log('Emergency service worker: Reloading client');
        client.navigate(client.url);
      });
    })
  );
});

// Don't intercept any requests
self.addEventListener('fetch', (event) => {
  // Do nothing - let requests pass through normally
});
