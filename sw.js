var CACHE = 'qawi-v1';
var STATIC = [
  '/',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg',
  '/qawi-tokens.jsx',
  '/qawi-countries.jsx',
  '/qawi-ornaments.jsx',
  '/qawi-food-db.jsx',
  '/qawi-workouts.jsx',
  '/qawi-progress-photos.jsx',
  '/qawi-meals.jsx',
  '/qawi-notebook.jsx',
  '/qawi-bell.jsx',
  '/qawi-dashboard.jsx',
  '/qawi-landing.jsx',
  '/qawi-prayer.jsx',
  '/qawi-squad.jsx',
  '/qawi-finders.jsx',
  '/qawi-onboard.jsx',
  '/qawi-manager.jsx',
  '/qawi-athkar.jsx',
  '/qawi-personalize.jsx',
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(STATIC); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Network-first for API calls (prayer times)
  if (e.request.url.includes('aladhan.com') || e.request.url.includes('fonts.googleapis')) {
    e.respondWith(fetch(e.request).catch(function() { return caches.match(e.request); }));
    return;
  }
  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        return caches.open(CACHE).then(function(c) { c.put(e.request, res.clone()); return res; });
      });
    }).catch(function() { return caches.match('/'); })
  );
});

self.addEventListener('push', function(e) {
  var data = e.data ? JSON.parse(e.data.text()) : {};
  e.waitUntil(self.registration.showNotification(data.title || 'QAWI', {
    body: data.body || 'Time to strengthen yourself.',
    icon: '/icon-192.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = e.notification.data ? e.notification.data.url : '/';
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(ws) {
      for (var i = 0; i < ws.length; i++) {
        if (ws[i].url.includes(self.location.origin) && 'focus' in ws[i]) return ws[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
