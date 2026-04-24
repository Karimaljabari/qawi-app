var CACHE = 'thegrind-v1';
var ASSETS = ['/', '/css/style.css', '/manifest.json', '/icon-192.svg', '/icon-512.svg'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  if(e.request.url.includes('/api/')) { e.respondWith(fetch(e.request)); return; }
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(res) {
        return caches.open(CACHE).then(function(c){ c.put(e.request,res.clone()); return res; });
      });
    }).catch(function(){ return caches.match('/'); })
  );
});

self.addEventListener('push', function(e) {
  var data = e.data ? JSON.parse(e.data.text()) : {};
  e.waitUntil(self.registration.showNotification(data.title || 'THE GRIND', {
    body: data.body || 'Time to get moving.',
    icon: '/icon-192.svg',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200]
  }));
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = e.notification.data ? e.notification.data.url : '/';
  e.waitUntil(clients.matchAll({ type:'window' }).then(function(ws) {
    for(var i=0;i<ws.length;i++){ if(ws[i].url.includes(self.location.origin) && 'focus' in ws[i]) return ws[i].focus(); }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
