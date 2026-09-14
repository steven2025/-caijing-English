/* 财经基础英语可视化学习集 · Service Worker */
const CACHE = 'vfe-learn-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/hero.jpg',
  './assets/icons/icon.svg',
  './assets/icons/icon-512.png',
  './assets/icons/icon-192.png',
  './assets/icons/apple-touch-icon.png',
  './chapters/chapter3.html',
  './chapters/chapter6.html',
  './chapters/chapter7.html'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => {
      const fetched = fetch(e.request)
        .then(res => {
          if (res && res.ok && e.request.url.startsWith(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fetched;
    })
  );
});
