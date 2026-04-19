/* ═══ js/audio/engine.js ═══ */

// ══════════════════════════════════════════════
// SERVICE WORKER — OFFLINE SUPPORT
// ══════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('data:application/javascript,' + encodeURIComponent(`
      const CACHE_NAME = 'mindfulness-v1';
      
      self.addEventListener('install', event => {
        self.skipWaiting();
      });
      
      self.addEventListener('activate', event => {
        self.clients.claim();
      });
      
      self.addEventListener('fetch', event => {
        if (event.request.method !== 'GET') return;
        event.respondWith(
          caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).then(response => {
              if (!response || response.status !== 200) return response;
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
              return response;
            }).catch(() => {
              return caches.match(event.request);
            });
          })
        );
      });
    `)).catch(err => {
      console.log('Service Worker failed:', err);
    });
  });
}

// ═══════════════════════════════════════════════════════
// AUDIO ENGINE — Ambient Drone + Breath Binaural/Ocean
// ═══════════════════════════════════════════════════════

var audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ── NOISE GENERATORS ──
function makeBrownNoise(ac) {
  var len = ac.sampleRate * 4;
  var buf = ac.createBuffer(2, len, ac.sampleRate);
  for (var ch = 0; ch < 2; ch++) {
    var d = buf.getChannelData(ch); var last = 0;
    for (var i = 0; i < len; i++) {
      d[i] = (last + 0.02 * (Math.random()*2-1)) / 1.02;
      last = d[i]; d[i] *= 3.5;
    }
  }
  return buf;
}
function makePinkNoise(ac) {
  var len = ac.sampleRate * 4;
  var buf = ac.createBuffer(2, len, ac.sampleRate);
  for (var ch = 0; ch < 2; ch++) {
    var d = buf.getChannelData(ch);
    var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
    for (var i = 0; i < len; i++) {
      var w = Math.random()*2-1;
      b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759;
      b2=.969*b2+w*.153852; b3=.8665*b3+w*.3104856;
      b4=.55*b4+w*.5329522; b5=-.7616*b5-w*.016898;
      d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11; b6=w*.115926;
    }
  }
  return buf;
}

