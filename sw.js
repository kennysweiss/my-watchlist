const CACHE = 'watchlist-v10';
const STATIC = ['/manifest.json', '/icon-192.svg', '/icon-512.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname === '/' || url.pathname.endsWith('.html') || url.pathname.includes('netlify/functions')) return;
  if (url.hostname.includes('tvmaze') || url.hostname.includes('supabase')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
