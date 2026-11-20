/*
 * ============================================================================
 * Activity Board - Service Worker Version History
 * ============================================================================
 * v1.1 (2026-11-20) - Updated app icon to blue circle with white runner.
 * v1.0 (2026-11-20) - Initial PWA release with Firestore live sync, mobile
 *                     card layout, bottom nav, and offline asset caching.
 * ============================================================================
 */

const CACHE_NAME = 'activity-board-v1.2';
const ASSETS = [
  './',
  './index.html',
  './icon.svg',
  './manifest.json'
];

// Install and cache assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Serve cached content when offline (Firestore requests pass straight through to network)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
      ),
      clients.claim() // Takes control of all open pages immediately
    ])
  );
});
