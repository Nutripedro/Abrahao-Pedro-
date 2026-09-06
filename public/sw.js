/**
 * NutriSaaS Progressive Web App (PWA) Service Worker
 * Comprehensive Offline Support, Cache-First Static Assets, Network-First Dynamic Fallback
 */

const CACHE_NAME = 'nutrisaas-cache-v1.0.0';
const RUNTIME_CACHE = 'nutrisaas-runtime-v1.0.0';
const FONTS_CACHE = 'nutrisaas-fonts-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-maskable.svg',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,600;0,8..60,700;1,8..60,400&family=JetBrains+Mono:wght@400;500;600&display=swap'
];

// Install: Precache shell and immediately activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[PWA-SW] Precache notice:', err))
  );
});

// Activate: Clean up previous cache versions and claim clients
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, FONTS_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('[PWA-SW] Removing obsolete cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper to check if request is a font asset
function isFontAsset(url) {
  return (
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.ttf') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  );
}

// Helper to check if request is a static asset
function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  );
}

// Helper to check if request is a clinical API (prontuário, etc.)
function isClinicalApi(url) {
  const clinicalPaths = [
    '/api/clientes',
    '/api/pacientes',
    '/api/atendimentos',
    '/api/prontuarios',
    '/api/exames',
    '/api/suplementos',
    '/api/nutricao'
  ];
  return url.pathname.startsWith('/api/') && clinicalPaths.some(path => url.pathname.includes(path));
}

// Fetch: Caching Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation (SPA routes like /calculadoras, /nutricao, /agenda): Network-first with index.html fallback
  if (request.mode === 'navigate') {
    // Handle Web Share Target POST request
    if (request.method === 'POST' && url.pathname === '/share-target') {
      event.respondWith(
        (async () => {
          const formData = await request.formData();
          const title = formData.get('title');
          const text = formData.get('text');
          const urlParam = formData.get('url');
          const files = formData.getAll('media');

          // Build a search params string to pass to the UI
          const params = new URLSearchParams();
          if (title) params.append('shared_title', title);
          if (text) params.append('shared_text', text);
          if (urlParam) params.append('shared_url', urlParam);
          
          // Note: Files are harder to pass via URL, so we might store them in IndexedDB 
          // or just notify the UI that files are ready if we had a more complex setup.
          // For now, we redirect to the dashboard with the text info.
          return Response.redirect(`/?${params.toString()}`, 303);
        })()
      );
      return;
    }

    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Cache latest response for offline navigation
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback: return cached route or index.html shell, or custom offline page
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;
          
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;

          return caches.match('/offline.html');
        })
    );
    return;
  }

  // 2. Clinical APIs: Stale-While-Revalidate
  // Focus on patient records and clinical data for offline availability with background sync
  if (isClinicalApi(url)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Fonts: Stale-While-Revalidate with dedicated cache
  if (isFontAsset(url)) {
    event.respondWith(
      caches.open(FONTS_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 4. Static Assets: Cache-First with background revalidation
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Revalidate in background to keep cache warm
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {});
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 3. Dynamic / API requests: Network-First with Runtime Cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseToCache));
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // If everything fails, return custom offline JSON response for APIs
        if (request.headers.get('accept')?.includes('application/json')) {
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'Você está no modo offline. As alterações serão sincronizadas quando a conexão retornar.'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      })
  );
});

// Listen for messages from client (e.g. skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * PUSH NOTIFICATIONS
 */

// Handle Push event
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || 'Nova atualização no NutriSaaS',
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      },
      actions: [
        { action: 'open', title: 'Ver Detalhes' },
        { action: 'close', title: 'Fechar' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'NutriSaaS', options)
    );
  } catch (err) {
    console.error('[PWA-SW] Push error:', err);
    // Fallback if data is not JSON
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('NutriSaaS', {
        body: text,
        icon: '/pwa-192x192.png'
      })
    );
  }
});

// Handle Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open and at the right URL
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
