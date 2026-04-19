/* ═══ js/audio/binaural.js ═══ */
// ═══ 2. BREATH SCREEN AUDIO (Binaural + Ocean + Wind) ═══
// --- Enhanced for neurodiverse users with Brain.fm quality synthesis ---

var breathAudioOn = false;
var breathAudioNodes = null;

// --- Helper: Generate high‑quality noise buffers (improved algorithms) ---
function makeBrownNoise(ac) {
  // Brown noise via integrated white noise (better low‑frequency energy)
  var bufferSize = 2 * ac.sampleRate;
  var buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  var output = buffer.getChannelData(0);
  var lastOut = 0.0;
  for (var i = 0; i < bufferSize; i++) {
    var white = Math.random() * 2 - 1;
    output[i] = (lastOut + (0.02 * white)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5; // scale to reasonable amplitude
  }
  return buffer;
}

function makePinkNoise(ac) {
  // Pink noise via Paul Kellet's refined method (more natural wind)
  var bufferSize = 2 * ac.sampleRate;
  var buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  var output = buffer.getChannelData(0);
  var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (var i = 0; i < bufferSize; i++) {
    var white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    output[i] *= 0.11; // normalize
    b6 = white * 0.115926;
  }
  return buffer;
}

// --- Binaural core with entrainment pulse and rich detuning ---
function buildBreathAudio() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // ---- ALPHA BINAURAL (10 Hz) with enhanced carrier & pulse ----
  var baseF = 220;        // Optimal for Alpha perception
  var beatF = 10;         // 10 Hz beat (Alpha)

  // Entrainment LFO (pulses the binaural amplitude at the beat frequency)
  var pulseLFO = ac.createOscillator();
  pulseLFO.type = 'sine';
  pulseLFO.frequency.value = beatF;
  var pulseGain = ac.createGain();
  pulseGain.gain.value = 0.18; // subtle amplitude modulation
  pulseLFO.connect(pulseGain);
  pulseLFO.start();

  // Left channel – two detuned oscillators for richer timbre
  var oscL1 = ac.createOscillator(); oscL1.type = 'sine'; oscL1.frequency.value = baseF - 0.6;
  var oscL2 = ac.createOscillator(); oscL2.type = 'sine'; oscL2.frequency.value = baseF + 0.6;
  var gL = ac.createGain(); gL.gain.value = 0.4;
  pulseGain.connect(gL.gain); // pulse modulates gain
  var pL = ac.createStereoPanner(); pL.pan.value = -1;
  oscL1.connect(gL); oscL2.connect(gL);
  gL.connect(pL).connect(master);

  // Right channel – frequency offset by beatF, also detuned
  var oscR1 = ac.createOscillator(); oscR1.type = 'sine'; oscR1.frequency.value = baseF + beatF - 0.6;
  var oscR2 = ac.createOscillator(); oscR2.type = 'sine'; oscR2.frequency.value = baseF + beatF + 0.6;
  var gR = ac.createGain(); gR.gain.value = 0.4;
  pulseGain.connect(gR.gain);
  var pR = ac.createStereoPanner(); pR.pan.value = 1;
  oscR1.connect(gR); oscR2.connect(gR);
  gR.connect(pR).connect(master);

  // Start binaural oscillators
  oscL1.start(); oscL2.start(); oscR1.start(); oscR2.start();

  // ---- Harmonic drone pad (warm, evolving) ----
  var padG = ac.createGain(); padG.gain.value = 0.07;
  var padFreqs = [baseF * 0.5, baseF * 1.5, baseF * 2.0];
  var padGains = [0.5, 0.25, 0.15];
  // Add slow LFO to pad amplitude for subtle movement
  var padLFO = ac.createOscillator(); padLFO.type = 'sine'; padLFO.frequency.value = 0.03;
  var padLFOgain = ac.createGain(); padLFOgain.gain.value = 0.05;
  padLFO.connect(padLFOgain).connect(padG.gain);
  padLFO.start();

  padFreqs.forEach(function(f, idx) {
    var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var g = ac.createGain(); g.gain.value = padGains[idx];
    o.connect(g).connect(padG);
    o.start();
  });
  padG.connect(master);

  // ---- OCEAN (dynamic brown noise with wave motion) ----
  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac); oceanSrc.loop = true;
  var oceanG = ac.createGain(); oceanG.gain.value = 0.25;
  var oceanLP = ac.createBiquadFilter(); oceanLP.type = 'lowpass'; oceanLP.frequency.value = 700; oceanLP.Q.value = 0.4;

  // LFO for wave motion (frequency moves like tide)
  var waveLFO = ac.createOscillator(); waveLFO.type = 'sine'; waveLFO.frequency.value = 0.08; // 12.5 sec cycle
  var waveDepth = ac.createGain(); waveDepth.gain.value = 250; // Hz swing
  waveLFO.connect(waveDepth).connect(oceanLP.frequency);
  waveLFO.start();

  // Stereo panning for wave movement
  var oceanPan = ac.createStereoPanner(); oceanPan.pan.value = 0;
  var panLFO = ac.createOscillator(); panLFO.type = 'sine'; panLFO.frequency.value = 0.12;
  var panDepth = ac.createGain(); panDepth.gain.value = 0.4;
  panLFO.connect(panDepth).connect(oceanPan.pan);
  panLFO.start();

  oceanSrc.connect(oceanLP).connect(oceanG).connect(oceanPan).connect(master);
  oceanSrc.start();

  // ---- WIND (multi‑band filtered pink noise with gusts) ----
  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac); windSrc.loop = true;
  var windG = ac.createGain(); windG.gain.value = 0.09;

  // Multi‑band processing for natural wind texture
  var windHP = ac.createBiquadFilter(); windHP.type = 'highpass'; windHP.frequency.value = 400;
  var windLP = ac.createBiquadFilter(); windLP.type = 'lowpass'; windLP.frequency.value = 3000;

  // Additional band‑pass for mid‑range detail
  var windBP = ac.createBiquadFilter(); windBP.type = 'bandpass'; windBP.frequency.value = 1200; windBP.Q.value = 0.8;
  var windBPgain = ac.createGain(); windBPgain.gain.value = 0.4;

  windSrc.connect(windHP).connect(windLP).connect(windG).connect(master);
  windSrc.connect(windBP).connect(windBPgain).connect(master); // blend in midrange

  // Gust LFO – random‑like amplitude modulation
  var gustLFO = ac.createOscillator(); gustLFO.type = 'sine'; gustLFO.frequency.value = 0.18;
  var gustDepth = ac.createGain(); gustDepth.gain.value = 0.06;
  gustLFO.connect(gustDepth).connect(windG.gain);
  gustLFO.start();

  windSrc.start();

  // ---- Store nodes for external control ----
  breathAudioNodes = {
    master: master,
    oceanG: oceanG,
    windG: windG,
    // Store LFOs for possible cleanup (not strictly necessary)
    _lfoWave: waveLFO, _lfoPan: panLFO, _lfoGust: gustLFO, _lfoPulse: pulseLFO
  };

  return breathAudioNodes;
}

function toggleBreathAudio() {
  if (!breathAudioOn) {
    if (!localStorage.getItem('binaural_ack')) {
      showBinauralModal();
      return;
    }
    startBreathAudio();
  } else {
    stopBreathAudio();
  }
}

function startBreathAudio() {
  var ac = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (!breathAudioNodes) breathAudioNodes = buildBreathAudio();
  // Smooth fade in
  breathAudioNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 3);
  breathAudioOn = true;
  btn.style.color = 'rgba(168,213,220,0.9)';
  btn.style.borderColor = 'rgba(168,213,220,0.4)';
  btn.style.background = 'rgba(42,93,94,0.5)';
}

function stopBreathAudio() {
  var ac = getAC();
  var btn = document.getElementById('breathAudioBtn');
  breathAudioNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
  breathAudioOn = false;
  btn.style.color = 'rgba(168,213,220,0.35)';
  btn.style.borderColor = 'rgba(168,213,220,0.12)';
  btn.style.background = 'rgba(0,0,0,0.3)';
}

// ── BINAURAL SAFETY MODAL (unchanged) ──
function showBinauralModal() {
  // ... keep exactly as in original file ...
  // (I have not repeated the long HTML here for brevity,
  //  but you should keep the existing showBinauralModal function.)
  // The original modal code is fine; no changes needed.
}

// Sync ocean volume to breath phase — called from bUpdatePhase
var _origBUpdatePhase = bUpdatePhase;
bUpdatePhase = function(now) {
  _origBUpdatePhase(now);
  if (breathAudioOn && breathAudioNodes && audioCtx) {
    var target = 0.1 + bArmPos * 0.3;
    breathAudioNodes.oceanG.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
  }
};

// Auto‑stop breath audio when leaving breath screen
var _origShowScreen = showScreen;
showScreen = function(id) {
  if (breathAudioOn && id !== 'breath') {
    toggleBreathAudio();
  }
  _origShowScreen(id);
};