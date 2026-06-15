const CACHE_NAME = 'microcoach-v1';
const ASSETS = [
    './',
    './index.html',
    './icon.svg',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap',
    'https://unpkg.com/lucide@latest',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
