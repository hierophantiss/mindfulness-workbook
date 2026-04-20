/* ═══ js/audio/focus.js ═══ */
// ═══ 1b. FOCUS MUSIC (light electronic, uplifting, concentration) ═══
var focusOn = false;
var focusNodes = null;

function buildFocusMusic() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;
  
  // Neural Entrainment — 12Hz Beta/High Alpha Pulse for Focus
  var pulse = createPulse(ac, 12);
  var pulseGain = ac.createGain();
  pulseGain.gain.value = 1.0;
  pulse.connect(pulseGain.gain);
  master.connect(pulseGain);
  pulseGain.connect(ac.destination);

  // Focus Spatializer
  var panner = ac.createStereoPanner();
  applySpatialMovement({ ac: ac }, panner, 0.15);
  
  // High-Quality Reverb + Limiter
  var reverb = ac.createConvolver();
  reverb.buffer = createImpulseResponse(ac, 3, 2);
  var rMix = ac.createGain(); rMix.gain.value = 0.3;
  var limiter = createLimiter(ac);

  pulseGain.connect(panner);
  panner.connect(limiter);
  panner.connect(reverb).connect(rMix).connect(limiter);
  limiter.connect(ac.destination);

  // Warm bass — soft sine, slow subtle movement
  var bassOsc = ac.createOscillator(); bassOsc.type = 'sine';
  bassOsc.frequency.value = 65.4; // C2
  var bassG = ac.createGain(); bassG.gain.value = 0.08;
  bassOsc.connect(bassG).connect(master);
  bassOsc.start();

  // Soft pad — triangle waves, Cmaj7 spread across octaves
  var padG = ac.createGain(); padG.gain.value = 0.035;
  [130.81, 164.81, 196.0, 246.94, 329.6].forEach(function(f) {
    var o = ac.createOscillator(); o.type = 'triangle';
    o.frequency.value = f;
    o.detune.value = (Math.random() - 0.5) * 12;
    o.connect(padG); o.start();
  });
  padG.connect(master);

  return { master: master, ac: ac, panner: panner };
}

// Melodic notes — pentatonic C major across 3 octaves
var FOCUS_HI = [523.3, 587.3, 659.3, 784.0, 880.0];
var FOCUS_MID = [261.6, 293.7, 329.6, 392.0, 440.0];
var FOCUS_LOW = [130.8, 146.8, 164.8, 196.0, 220.0];
var focusArpInterval = null;

function focusSingleNote(ac, dest, freq, amp, decay, now) {
  var osc = ac.createOscillator();
  osc.type = freq < 200 ? 'sine' : (Math.random() > 0.4 ? 'sine' : 'triangle');
  osc.frequency.value = freq;
  osc.detune.value = (Math.random() - 0.5) * 6;
  var env = ac.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(amp, now + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, now + decay);
  var pan = ac.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 0.7;
  osc.connect(env).connect(pan).connect(dest);
  osc.start(now);
  osc.stop(now + decay + 0.1);
}

function playFocusNote(nodes) {
  var ac = nodes.ac;
  var now = ac.currentTime;
  // Choose register: 35% mid, 30% high, 20% bass, 15% soft chord
  var r = Math.random();
  if (r < 0.35) {
    var f = FOCUS_MID[Math.floor(Math.random() * FOCUS_MID.length)];
    focusSingleNote(ac, nodes.master, f, 0.05 + Math.random()*0.03, 1.5 + Math.random()*2, now);
  } else if (r < 0.65) {
    var f2 = FOCUS_HI[Math.floor(Math.random() * FOCUS_HI.length)];
    focusSingleNote(ac, nodes.master, f2, 0.04 + Math.random()*0.03, 1.2 + Math.random()*2, now);
  } else if (r < 0.85) {
    var f3 = FOCUS_LOW[Math.floor(Math.random() * FOCUS_LOW.length)];
    focusSingleNote(ac, nodes.master, f3, 0.055, 3 + Math.random()*3, now);
  } else {
    // Soft chord — 2-3 notes from mid register
    var count = 2 + Math.floor(Math.random()*2);
    for (var ci = 0; ci < count; ci++) {
      var fc = FOCUS_MID[Math.floor(Math.random() * FOCUS_MID.length)];
      focusSingleNote(ac, nodes.master, fc, 0.03, 2.5 + Math.random()*2, now + ci*0.05);
    }
  }
}

function toggleFocus() {
  var btn = document.getElementById('focusToggle');
  var icon = document.getElementById('focusIcon');
  var ac = getAC();

  // If bowls are playing, stop them first
  stopBowlsOnly();

  if (!focusOn) {
    if (!focusNodes) focusNodes = buildFocusMusic();
    focusNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 3);
    focusOn = true;
    btn.classList.add('active');
    icon.textContent = '♫';

    // Play notes at random intervals
    function scheduleNote() {
      if (!focusOn) return;
      playFocusNote(focusNodes);
      // Sometimes play 2 quick notes (little melody fragments)
      if (Math.random() > 0.6) {
        setTimeout(function() { if (focusOn) playFocusNote(focusNodes); }, 200 + Math.random() * 300);
      }
      focusArpInterval = setTimeout(scheduleNote, 800 + Math.random() * 2200);
    }
    scheduleNote();

  } else {
    focusOn = false;
    focusNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
    btn.classList.remove('active');
    icon.textContent = '♪';
    if (focusArpInterval) { clearTimeout(focusArpInterval); focusArpInterval = null; }
  }
}

// Stop helpers (no mutual calls — avoids recursion)
function stopBowlsOnly() {
  if (!bowlsOn) return;
  bowlsOn = false;
  var ac = getAC();
  bowlNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 1);
  document.getElementById('bowlToggle').classList.remove('active');
  document.getElementById('bowlIcon').textContent = '🔇';
  if (bowlInterval) { clearTimeout(bowlInterval); bowlInterval = null; }
}
function stopFocusOnly() {
  if (!focusOn) return;
  focusOn = false;
  var ac = getAC();
  focusNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 1);
  document.getElementById('focusToggle').classList.remove('active');
  document.getElementById('focusIcon').textContent = '♪';
  if (focusArpInterval) { clearTimeout(focusArpInterval); focusArpInterval = null; }
}

// Update toggleBowls to stop focus music if playing
var _origToggleBowls = toggleBowls;
toggleBowls = function() {
  stopFocusOnly();
  _origToggleBowls();
};

