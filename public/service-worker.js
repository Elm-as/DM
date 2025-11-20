// Service Worker de base pour PWA DaloaMarket (network-first pour HTML)
const CACHE_NAME = 'daloamarket-cache-v4'; // bump pour invalider anciens caches
const urlsToCache = [
  '/',
  '/logo.svg',
  '/apple-touch-icon.png',
  '/manifest.json',
  '/web-app-manifest-192x192.png',
  '/web-app-manifest-512x512.png',
  // Ajoutez ici d'autres ressources statiques si besoin
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // Active immédiatement la nouvelle version du SW
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  // Prend le contrôle des clients ouverts (onglets)
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // En développement (localhost), ne rien intercepter pour éviter les erreurs avec Vite
  try {
    const u = new URL(request.url);
    const isLocal = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
    const isDevAsset = u.pathname.startsWith('/@vite') || u.pathname.startsWith('/@react-refresh') || u.pathname.startsWith('/src/');
    if (isLocal || isDevAsset) {
      return; // laisser Vite gérer toutes les requêtes en dev
    }
  } catch {}

  // Ne jamais intercepter les requêtes JS/CSS du build Vite (assets/)
  if (request.url.includes('/assets/')) {
    return;
  }

  // Laisser passer sans interception toute requête non-GET (POST, PUT, etc.)
  if (request.method !== 'GET') {
    return; // on ne cache pas et on évite Cache.put sur POST
  }

  const acceptHeader = request.headers.get('accept') || '';
  const isNavigation = request.mode === 'navigate' || acceptHeader.includes('text/html');

  if (isNavigation) {
    // Pour l'HTML: stratégie network-first pour éviter un index.html périmé
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Met en cache la nouvelle version de la page
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Fallback offline sur la version en cache
          return caches.match(request).then((cached) => cached || caches.match('/index.html'));
        })
    );
    return;
  }

  // Pour le reste: cache-first basique (icônes, manifest, etc.)
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          // Sécurité: uniquement cache des réponses GET OK
          if (request.method === 'GET' && response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
      );
    })
  );
});
