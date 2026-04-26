const CACHE_NAME = 'mindfulness-v15';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/css/polish.css',
  '/css/sos.css',
  '/css/companion2.css',
  '/js/app.js',
  '/js/stats.js',
  '/js/knowledge.js',
  '/js/breath.js',
  '/js/logger.js',
  '/js/aiClient.js',
  '/js/api.js',
  '/js/data/i18n.js',
  '/js/data/haptics.js',
  '/js/data/notifications.js',
  '/js/data/faq.js',
  '/js/data/concepts.js',
  '/js/companion2.js',
  '/js/data/chapters.js',
  '/js/data/routes.js',
  '/js/data/takeaways.js',
  '/js/screens/chapters.js',
  '/js/screens/practice.js',
  '/js/screens/micro.js',
  '/js/screens/start.js',
  '/js/screens/about.js',
  '/js/screens/downloads.js',
  '/js/screens/journal.js',
  '/js/screens/sos.js',
  '/js/screens/onboarding.js',
  '/js/audio/engine.js',
  '/js/audio/bowls.js',
  '/js/audio/focus.js',
  '/js/audio/binaural.js',
  '/hero.png',
  '/hero.webp',
  '/breath_hero.png',
  '/exercises_icon.png',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/apple-touch-icon.png',
  '/widget-manifest.json'
];

const EXERCISE_PAGES = [
  '/gravity_thoughts.html',
  '/eswterikhafh.html',
  '/camera_exercise.html',
  '/cameraexercise.html',
  '/three_attention.html',
  '/samatha_attention.html',
  '/attention_dispersion.html',
  '/metronomos.html',
  '/treepose.html',
  '/openawareness.html',
  '/racing_mind.html',
  '/journey.html'
];

const REDIRECT_PAGES = [
  '/gravity_thhots.html'
];

const INSTALL_CACHE = [...CORE_ASSETS, ...EXERCISE_PAGES, ...REDIRECT_PAGES];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(INSTALL_CACHE))
      .then(() => self.skipWaiting())
      .catch(err => { console.warn('SW install failed', err); return self.skipWaiting(); })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('.png')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});