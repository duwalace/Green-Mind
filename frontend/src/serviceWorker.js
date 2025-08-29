// Este arquivo implementa um service worker para cache de recursos estáticos
/* eslint-disable no-restricted-globals */

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

const CACHE_NAME = 'green-mind-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.*.js',
  '/static/css/main.*.css',
  '/static/media/*',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
  '/banner1.png',
  '/banner2.png',
  '/banner3.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        // Pré-cache de recursos estáticos
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Limpa caches antigos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Estratégia de cache: Cache First, then Network
self.addEventListener('fetch', (event) => {
  // Ignora requisições não GET
  if (event.request.method !== 'GET') return;
  
  // Ignora requisições de API
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta do cache
        if (response) {
          return response;
        }
        
        // Clone da requisição
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Verifica se recebemos uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone da resposta
            const responseToCache = response.clone();
            
            // Adiciona ao cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          });
      })
      .catch(() => {
        // Fallback para recursos offline
        if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return caches.match('/logo192.png');
        }
      })
  );
});

// Sincronização em background quando online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// Função para sincronizar dados quando online
async function syncData() {
  // Implementação de sincronização de dados
  console.log('Sincronizando dados em background');
}

// Notificações push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/favicon.ico',
    data: {
      url: data.url
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Ação ao clicar na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      self.clients.openWindow(event.notification.data.url)
    );
  }
});

/* eslint-disable no-undef */

// Export functions for registering and unregistering the service worker
// These functions are called from index.js

export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('ServiceWorker registrado com sucesso:', registration);
        })
        .catch(error => {
          console.error('Erro ao registrar ServiceWorker:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}