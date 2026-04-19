/* ═══ js/audio/focus.js ═══ */
// ═══ 1b. FOCUS MUSIC (light electronic, uplifting, concentration) ═══
// Enhanced with richer timbres, spatial depth and evolving textures.

var focusOn = false;
var focusNodes = null;

// --- Helper: high‑quality stereo reverb (convolution) ---
function createFocusReverb(ac, duration, decay) {
  var sampleRate = ac.sampleRate;
  var length = sampleRate * duration;
  var impulse = ac.createBuffer(2, length, sampleRate);
  var left = impulse.getChannelData(0);
  var right = impulse.getChannelData(1);

  for (var i = 0; i < length; i++) {
    var n = i / length;
    var envelope = Math.pow(1 - n, decay);
    left[i] = (Math.random() * 2 - 1) * envelope;
    right[i] = (Math.random() * 2 - 1) * envelope;
  }
  var convolver = ac.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

function buildFocusMusic() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;

  // ---- Global reverb send (adds space without muddying) ----
  var reverb = createFocusReverb(ac, 2.2, 1.8);
  var reverbGain = ac.createGain(); reverbGain.gain.value = 0.35;
  reverb.connect(reverbGain).connect(ac.destination);

  // Direct output (dry mix)
  var dryGain = ac.createGain(); dryGain.gain.value = 1.0;
  master.connect(dryGain).connect(ac.destination);
  master.connect(reverb);  // send to reverb

  // ---- Stereo width enhancement (mid/side processing) ----
  var splitter = ac.createChannelSplitter(2);
  var merger = ac.createChannelMerger(2);
  dryGain.connect(splitter);
  // Mid = (L+R)/2, Side = (L-R)/2
  var midGain = ac.createGain(); midGain.gain.value = 0.8;
  var sideGain = ac.createGain(); sideGain.gain.value = 0.6;
  splitter.connect(midGain, 0, 0);  // left to mid
  splitter.connect(midGain, 1, 0);  // right to mid
  // For side: left - right (approximate with gain inversion)
  var sideLeft = ac.createGain(); sideLeft.gain.value = 1;
  var sideRight = ac.createGain(); sideRight.gain.value = -1;
  splitter.connect(sideLeft, 0);
  splitter.connect(sideRight, 1);
  sideLeft.connect(sideGain);
  sideRight.connect(sideGain);
  // Recombine
  midGain.connect(merger, 0, 0); // mid to left
  midGain.connect(merger, 0, 1); // mid to right
  sideGain.connect(merger, 0, 0); // side to left
  sideGain.connect(merger, 0, 1); // side to right (inverted on right already)
  merger.connect(ac.destination);
  dryGain.disconnect(ac.destination); // reroute through M/S
  dryGain.connect(merger);

  // ---- Warm bass (subtle movement) ----
  var bassOsc = ac.createOscillator(); bassOsc.type = 'sine';
  bassOsc.frequency.value = 65.4; // C2
  var bassG = ac.createGain(); bassG.gain.value = 0.09;
  // Slow amplitude modulation for breathing effect
  var bassLFO = ac.createOscillator(); bassLFO.type = 'sine'; bassLFO.frequency.value = 0.12;
  var bassLFOgain = ac.createGain(); bassLFOgain.gain.value = 0.03;
  bassLFO.connect(bassLFOgain).connect(bassG.gain);
  bassLFO.start();
  bassOsc.connect(bassG).connect(master);
  bassOsc.start();

  // ---- Evolving pad (warm, moving, Cmaj7 spread) ----
  var padG = ac.createGain(); padG.gain.value = 0.04;
  var padFreqs = [130.81, 164.81, 196.0, 246.94, 329.6];
  // Each pad oscillator has its own slow detune LFO for organic movement
  padFreqs.forEach(function(f) {
    var o = ac.createOscillator(); o.type = 'triangle';
    o.frequency.value = f;
    var detuneLFO = ac.createOscillator(); detuneLFO.type = 'sine'; detuneLFO.frequency.value = 0.08 + Math.random() * 0.1;
    var detuneDepth = ac.createGain(); detuneDepth.gain.value = 4;
    detuneLFO.connect(detuneDepth).connect(o.detune);
    detuneLFO.start();
    o.connect(padG);
    o.start();
  });
  // Pad filter (low‑pass with slow sweep)
  var padFilter = ac.createBiquadFilter(); padFilter.type = 'lowpass'; padFilter.frequency.value = 2000;
  var filterLFO = ac.createOscillator(); filterLFO.type = 'sine'; filterLFO.frequency.value = 0.05;
  var filterDepth = ac.createGain(); filterDepth.gain.value = 600;
  filterLFO.connect(filterDepth).connect(padFilter.frequency);
  filterLFO.start();
  padG.connect(padFilter).connect(master);

  // ---- Soft noise bed (adds texture, like tape hiss / air) ----
  var noiseBuffer = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
  var noiseData = noiseBuffer.getChannelData(0);
  for (var i = 0; i < noiseData.length; i++) noiseData[i] = Math.random() * 2 - 1;
  var noiseSrc = ac.createBufferSource(); noiseSrc.buffer = noiseBuffer; noiseSrc.loop = true;
  var noiseG = ac.createGain(); noiseG.gain.value = 0.008;
  var noiseLP = ac.createBiquadFilter(); noiseLP.type = 'lowpass'; noiseLP.frequency.value = 8000;
  noiseSrc.connect(noiseLP).connect(noiseG).connect(master);
  noiseSrc.start();

  // Store nodes for external use
  focusNodes = {
    master: master,
    ac: ac,
    // Additional references for potential future control
    _bassG: bassG,
    _padG: padG,
    _reverbGain: reverbGain
  };

  return focusNodes;
}

// Melodic notes — pentatonic C major across 3 octaves
var FOCUS_HI = [523.3, 587.3, 659.3, 784.0, 880.0];
var FOCUS_MID = [261.6, 293.7, 329.6, 392.0, 440.0];
var FOCUS_LOW = [130.8, 146.8, 164.8, 196.0, 220.0];
var focusArpInterval = null;

// Enhanced single note with better envelope and stereo placement
function focusSingleNote(ac, dest, freq, amp, decay, now) {
  // Use a mix of sine and triangle for warmth, with slight detuning
  var osc1 = ac.createOscillator();
  osc1.type = freq < 300 ? 'triangle' : 'sine';
  osc1.frequency.value = freq;

  var osc2 = ac.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = freq * 2.0; // octave harmonic
  var osc2Gain = ac.createGain(); osc2Gain.gain.value = 0.2;

  // Detune LFO for subtle shimmer
  var shimmerLFO = ac.createOscillator(); shimmerLFO.type = 'sine'; shimmerLFO.frequency.value = 5 + Math.random() * 3;
  var shimmerDepth = ac.createGain(); shimmerDepth.gain.value = 3;
  shimmerLFO.connect(shimmerDepth).connect(osc1.detune);
  shimmerLFO.start();

  // Envelope
  var env = ac.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(amp, now + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, now + decay);

  // Panning with slight width
  var pan = ac.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 0.8;

  // Connections
  osc1.connect(env);
  osc2.connect(osc2Gain).connect(env);
  env.connect(pan).connect(dest);

  // Start/stop
  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + decay + 0.2);
  osc2.stop(now + decay + 0.2);
  // Clean up LFO after use (stop after decay)
  shimmerLFO.stop(now + decay + 0.2);
}

function playFocusNote(nodes) {
  var ac = nodes.ac;
  var now = ac.currentTime;
  var r = Math.random();

  // Adjusted probabilities for more varied yet coherent phrases
  if (r < 0.3) {
    // Mid register melody
    var f = FOCUS_MID[Math.floor(Math.random() * FOCUS_MID.length)];
    focusSingleNote(ac, nodes.master, f, 0.07, 1.8 + Math.random() * 2.5, now);
  } else if (r < 0.55) {
    // High register sparkle
    var f2 = FOCUS_HI[Math.floor(Math.random() * FOCUS_HI.length)];
    focusSingleNote(ac, nodes.master, f2, 0.05, 1.2 + Math.random() * 2.0, now);
  } else if (r < 0.75) {
    // Bass note (occasional anchor)
    var f3 = FOCUS_LOW[Math.floor(Math.random() * FOCUS_LOW.length)];
    focusSingleNote(ac, nodes.master, f3, 0.065, 3.0 + Math.random() * 3.0, now);
  } else {
    // Soft chord fragment (2-3 notes from mid/high)
    var count = 2 + Math.floor(Math.random() * 2);
    var pool = Math.random() > 0.5 ? FOCUS_MID : FOCUS_HI;
    for (var ci = 0; ci < count; ci++) {
      var fc = pool[Math.floor(Math.random() * pool.length)];
      focusSingleNote(ac, nodes.master, fc, 0.04, 2.5 + Math.random() * 2.0, now + ci * 0.06);
    }
  }

  // Occasionally add a subtle percussive click (like a muted metronome)
  if (Math.random() < 0.15) {
    var clickEnv = ac.createGain();
    clickEnv.gain.setValueAtTime(0.02, now);
    clickEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    var clickOsc = ac.createOscillator(); clickOsc.type = 'sine'; clickOsc.frequency.value = 880;
    clickOsc.connect(clickEnv).connect(nodes.master);
    clickOsc.start(now);
    clickOsc.stop(now + 0.03);
  }
}

function toggleFocus() {
  var btn = document.getElementById('focusToggle');
  var icon = document.getElementById('focusIcon');
  var ac = getAC();

  // If bowls are playing, stop them first (using the existing helper)
  stopBowlsOnly();

  if (!focusOn) {
    if (!focusNodes) focusNodes = buildFocusMusic();
    // Fade in a bit slower for smoother transition
    focusNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 2.5);
    focusOn = true;
    btn.classList.add('active');
    icon.textContent = '♫';

    // Schedule notes with a variable interval (humanized)
    function scheduleNote() {
      if (!focusOn) return;
      playFocusNote(focusNodes);
      // Sometimes play a quick second note (melodic fragment)
      if (Math.random() > 0.55) {
        setTimeout(function() {
          if (focusOn) playFocusNote(focusNodes);
        }, 180 + Math.random() * 350);
      }
      var nextInterval = 900 + Math.random() * 2000;
      focusArpInterval = setTimeout(scheduleNote, nextInterval);
    }
    scheduleNote();

  } else {
    focusOn = false;
    focusNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2.2);
    btn.classList.remove('active');
    icon.textContent = '♪';
    if (focusArpInterval) {
      clearTimeout(focusArpInterval);
      focusArpInterval = null;
    }
  }
}

// Stop helpers (unchanged — ensure they match existing definitions)
function stopBowlsOnly() {
  if (typeof bowlsOn !== 'undefined' && bowlsOn) {
    bowlsOn = false;
    var ac = getAC();
    if (bowlNodes && bowlNodes.master) {
      bowlNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 1);
    }
    var bowlBtn = document.getElementById('bowlToggle');
    if (bowlBtn) bowlBtn.classList.remove('active');
    var bowlIcon = document.getElementById('bowlIcon');
    if (bowlIcon) bowlIcon.textContent = '🔇';
    if (typeof bowlInterval !== 'undefined' && bowlInterval) {
      clearTimeout(bowlInterval);
      bowlInterval = null;
    }
  }
}

function stopFocusOnly() {
  if (!focusOn) return;
  focusOn = false;
  var ac = getAC();
  if (focusNodes && focusNodes.master) {
    focusNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 1);
  }
  var btn = document.getElementById('focusToggle');
  if (btn) btn.classList.remove('active');
  var icon = document.getElementById('focusIcon');
  if (icon) icon.textContent = '♪';
  if (focusArpInterval) {
    clearTimeout(focusArpInterval);
    focusArpInterval = null;
  }
}

// Update toggleBowls to stop focus music if playing
var _origToggleBowls = toggleBowls;
toggleBowls = function() {
  stopFocusOnly();
  _origToggleBowls();
};
