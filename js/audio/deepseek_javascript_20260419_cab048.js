/* ═══ js/audio/engine.js ═══ */

// SERVICE WORKER (όπως ήταν, χωρίς αλλαγές)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('data:application/javascript,' + encodeURIComponent(`
      const CACHE_NAME = 'mindfulness-v1';
      self.addEventListener('install', event => { self.skipWaiting(); });
      self.addEventListener('activate', event => { self.clients.claim(); });
      self.addEventListener('fetch', event => {
        if (event.request.method !== 'GET') return;
        event.respondWith(
          caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).then(response => {
              if (!response || response.status !== 200) return response;
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => { cache.put(event.request, responseToCache); });
              return response;
            }).catch(() => caches.match(event.request));
          })
        );
      });
    `)).catch(err => console.log('Service Worker failed:', err));
  });
}

// ═══════════════════════════════════════════════════════
// AUDIO ENGINE — Ambient Drone (FM + LFO + Convolution Reverb)
// ═══════════════════════════════════════════════════════

var audioCtx = null;
function getAC() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// ── NOISE GENERATORS (διατηρούνται για πιθανή χρήση, αλλά δεν χρησιμοποιούνται στο drone)
function makeBrownNoise(ac) { /* unchanged */ var len = ac.sampleRate * 4; var buf = ac.createBuffer(2, len, ac.sampleRate); for (var ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch); var last = 0; for (var i = 0; i < len; i++) { d[i] = (last + 0.02 * (Math.random()*2-1)) / 1.02; last = d[i]; d[i] *= 3.5; } } return buf; }
function makePinkNoise(ac) { /* unchanged */ var len = ac.sampleRate * 4; var buf = ac.createBuffer(2, len, ac.sampleRate); for (var ch = 0; ch < 2; ch++) { var d = buf.getChannelData(ch); var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; for (var i = 0; i < len; i++) { var w = Math.random()*2-1; b0=.99886*b0+w*.0555179; b1=.99332*b1+w*.0750759; b2=.969*b2+w*.153852; b3=.8665*b3+w*.3104856; b4=.55*b4+w*.5329522; b5=-.7616*b5-w*.016898; d[i]=(b0+b1+b2+b3+b4+b5+b6+w*.5362)*.11; b6=w*.115926; } } return buf; }

// ═══ NEW: Convolution reverb για ambient (πλούσιος χώρος)
function createAmbientReverb(ac, decay = 3.5, roomSize = 0.7) {
  var length = Math.floor(ac.sampleRate * decay);
  var impulse = ac.createBuffer(2, length, ac.sampleRate);
  var left = impulse.getChannelData(0);
  var right = impulse.getChannelData(1);
  for (var i = 0; i < length; i++) {
    var t = i / ac.sampleRate;
    var env = Math.exp(-t * 2.2) * (1 - t/decay);
    var mod = Math.sin(2 * Math.PI * 80 * t) * 0.2 + Math.sin(2 * Math.PI * 210 * t) * 0.1;
    var val = (Math.random() * 0.2 + mod) * env;
    left[i] = val * (0.8 + 0.2 * Math.sin(t * Math.PI * 2));
    right[i] = val * (0.8 + 0.2 * Math.cos(t * Math.PI * 2.3));
  }
  var convolver = ac.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

// ═══ Ambient drone state
var droneOn = false;
var droneNodes = null;
var droneLFOs = [];

function buildAmbientDrone() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;
  
  // Reverb (σχεδόν 100% wet για αίσθηση ατέρμονου χώρου)
  var reverb = createAmbientReverb(ac, 4.2, 0.9);
  var dryGain = ac.createGain();
  var wetGain = ac.createGain();
  dryGain.gain.value = 0.2;
  wetGain.gain.value = 0.85;
  master.connect(dryGain).connect(ac.destination);
  master.connect(reverb);
  reverb.connect(wetGain).connect(ac.destination);
  
  // Δημιουργία 4 στρωμάτων drone (πολυφωνία)
  var layers = [];
  var baseFreqs = [55, 82.4, 110, 164.8]; // Υπο-χαμηλές έως μεσαίες
  
  for (var idx = 0; idx < baseFreqs.length; idx++) {
    var f = baseFreqs[idx];
    // FM pair: carrier + modulator
    var carrier = ac.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = f;
    
    var modulator = ac.createOscillator();
    modulator.type = 'triangle'; // πιο μαλακή διαμόρφωση
    var modRatio = 1.618 + (idx * 0.2); // χρυσή τομή
    modulator.frequency.value = f * modRatio;
    
    var modGain = ac.createGain();
    modGain.gain.value = f * 1.2;
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    
    // LFO για πανάρισμα
    var panner = ac.createStereoPanner();
    var lfoPan = ac.createOscillator();
    lfoPan.type = 'sine';
    lfoPan.frequency.value = 0.12 + idx * 0.03;
    var lfoPanGain = ac.createGain();
    lfoPanGain.gain.value = 0.9;
    lfoPan.connect(lfoPanGain);
    lfoPanGain.connect(panner.pan);
    
    // LFO για μικρο-μετατόπιση συχνότητας (beating)
    var lfoFreq = ac.createOscillator();
    lfoFreq.type = 'sine';
    lfoFreq.frequency.value = 0.07 + idx * 0.02;
    var lfoFreqGain = ac.createGain();
    lfoFreqGain.gain.value = 1.5;
    lfoFreq.connect(lfoFreqGain);
    lfoFreqGain.connect(carrier.frequency);
    
    // Gain envelope (σταθερό fade in/out)
    var gainNode = ac.createGain();
    gainNode.gain.value = 0.18 / (idx+1); // μικρότερη στάθμη για υψηλότερες
    
    carrier.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(master);
    
    layers.push({
      carrier: carrier,
      modulator: modulator,
      modGain: modGain,
      lfoPan: lfoPan,
      lfoFreq: lfoFreq,
      gainNode: gainNode
    });
  }
  
  return { ac: ac, master: master, layers: layers, reverb: reverb };
}

function startAmbientDrone() {
  if (droneOn) return;
  var ac = getAC();
  if (!droneNodes) droneNodes = buildAmbientDrone();
  var now = ac.currentTime;
  droneNodes.master.gain.linearRampToValueAtTime(0.55, now + 2.5);
  
  droneNodes.layers.forEach(function(layer) {
    layer.carrier.start(now);
    layer.modulator.start(now);
    layer.lfoPan.start(now);
    layer.lfoFreq.start(now);
  });
  droneOn = true;
}

function stopAmbientDrone() {
  if (!droneOn) return;
  var ac = getAC();
  droneNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
  droneNodes.layers.forEach(function(layer) {
    layer.carrier.stop(ac.currentTime + 2.2);
    layer.modulator.stop(ac.currentTime + 2.2);
    layer.lfoPan.stop(ac.currentTime + 2.2);
    layer.lfoFreq.stop(ac.currentTime + 2.2);
  });
  droneOn = false;
}

// ── Συνάρτηση toggleAmbient που περίμενε ο υπάρχων κώδικας ──
function toggleAmbient() {
  if (!droneOn) startAmbientDrone();
  else stopAmbientDrone();
}

// Επίσης έκθεση για κουμπιά (προαιρετικά)
window.toggleAmbient = toggleAmbient;