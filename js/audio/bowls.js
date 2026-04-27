/* ═══ js/audio/bowls.js ═══ */
// ═══ 1. TIBETAN SINGING BOWLS ═══
var bowlsOn = false;
var bowlNodes = null;
var bowlInterval = null;

function buildBowls() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;

  // Immersive Spatialization
  var panner = ac.createStereoPanner();
  applySpatialMovement({ ac: ac }, panner, 0.05); // Very slow movement

  // 1. High-Quality Convolution Reverb (Mindfulness Hall)
  var reverb = ac.createConvolver();
  reverb.buffer = createImpulseResponse(ac, 4, 3); // 4 second hall, decay 3
  
  var reverbMix = ac.createGain();
  reverbMix.gain.value = 0.45;

  // 2. Master Limiter (Professional Finish)
  var limiter = createLimiter(ac);

  // Routing: Source -> Panner -> Master
  //         Master -> Reverb -> ReverbMix -> Limiter
  //         Master -> Limiter
  master.connect(panner);
  panner.connect(limiter); // Dry
  panner.connect(reverb).connect(reverbMix).connect(limiter); // Wet
  
  limiter.connect(ac.destination);

  return { master: master, ac: ac, panner: panner };
}

// Bowl frequencies — real singing bowl harmonics
var BOWL_FREQS = [
  { f: 110,   harmonics: [1, 2.76, 4.72, 6.83] },   // Large bowl — deep
  { f: 164,   harmonics: [1, 2.71, 4.58, 6.92] },   // Medium bowl
  { f: 220,   harmonics: [1, 2.83, 4.95, 7.15] },   // Small bowl
  { f: 293,   harmonics: [1, 2.68, 5.12, 7.43] },   // Tiny bowl
  { f: 146.8, harmonics: [1, 2.72, 4.81, 6.67] },   // Medium-low
];

function strikeOneBowl(nodes) {
  var ac = nodes.ac;
  var now = ac.currentTime;

  // Pick a random bowl
  var bowl = BOWL_FREQS[Math.floor(Math.random() * BOWL_FREQS.length)];

  // Each bowl has harmonics that decay at different rates
  bowl.harmonics.forEach(function(h, i) {
    var osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = bowl.f * h;

    // Slight random detuning for organic feel
    osc.detune.value = (Math.random() - 0.5) * 8;

    var env = ac.createGain();
    // Harmonics: lower = louder + longer decay
    var amp = [0.3, 0.12, 0.06, 0.03][i] || 0.02;
    var decay = [6, 4, 2.5, 1.5][i] || 1;

    // Add randomness
    amp *= 0.7 + Math.random() * 0.6;
    decay *= 0.8 + Math.random() * 0.4;

    // Sharp attack, long natural decay
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(amp, now + 0.005);
    env.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(env).connect(nodes.master);
    osc.start(now);
    osc.stop(now + decay + 0.1);
  });
}

function bowlLoop() {
  if (!bowlsOn || !bowlNodes) return;
  strikeOneBowl(bowlNodes);
}

function toggleBowls() {
  var btn = document.getElementById('bowlToggle');
  var icon = document.getElementById('bowlIcon');
  var ac = getAC();

  if (!bowlsOn) {
    if (!bowlNodes) bowlNodes = buildBowls();
    bowlNodes.master.gain.linearRampToValueAtTime(0.5, ac.currentTime + 2);
    bowlsOn = true;
    if (btn) btn.classList.add('active');
    if (icon) icon.textContent = '🔔';

    // Strike first bowl immediately
    strikeOneBowl(bowlNodes);

    // Then every 4-8 seconds (random, organic spacing)
    function scheduleBowl() {
      if (!bowlsOn) return;
      var delay = 4000 + Math.random() * 5000; // 4-9 seconds
      bowlInterval = setTimeout(function() {
        bowlLoop();
        scheduleBowl();
      }, delay);
    }
    scheduleBowl();

  } else {
    bowlsOn = false;
    if (bowlNodes) bowlNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 3);
    if (btn) btn.classList.remove('active');
    if (icon) icon.textContent = '🔇';
    if (bowlInterval) { clearTimeout(bowlInterval); bowlInterval = null; }
  }

  if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
  else if (window.App && typeof window.App.updateHeroBtnUI === 'function') window.App.updateHeroBtnUI();
}

window.toggleBowls = toggleBowls;
window.toggleAmbient = toggleAmbient;
window.bowlsOn = bowlsOn;

// Cleanup: remove mixed up toggleAmbient and provide a focus-based one if needed
function toggleAmbient() { if(typeof toggleFocus === 'function') toggleFocus(); }

