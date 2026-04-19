/* ═══ js/audio/binaural.js ═══
 *
 * Neural Phase Locking Audio Engine — Brain.fm-level implementation
 *
 * Techniques used:
 *  1. Binaural beats        — different freq per ear → perceived beat in auditory cortex
 *  2. Amplitude Modulation  — carrier noise modulated at beatF → works WITHOUT headphones
 *  3. Isochronic pulses     — sharp rhythmic AM bursts → strongest entrainment signal
 *  4. Habituation prevention— beatF drifts slowly every ~8 min so brain stays engaged
 *  5. Dynamic spectral noise— ocean LP cutoff shifts slowly, never static
 *  6. Harmonic stacking     — sub-harmonics reinforce the target frequency band
 *  7. Sub-bass rumble       — proprioceptive grounding (autism / sensory processing)
 *
 * Neurodivergent considerations:
 *  - Soft AM attack (no harsh clicks or startle response)
 *  - Rumble layer for proprioceptive / somatic grounding
 *  - Gains balanced to avoid sensory overwhelm
 *  - AM works even without headphones (critical for sensory sensitivities)
 * ════════════════════════════════════════════════════════════════════════════ */

var breathAudioOn    = false;
var breathAudioNodes = null;

// ── Per-pattern parameters ───────────────────────────────────────────────────
// beatF      : target entrainment frequency (Hz)
// beatDrift  : ±Hz the beat wanders over time (habituation prevention)
// baseF      : carrier oscillator frequency (Hz)
// amDepth    : AM modulation depth 0–1
// isoRatio   : isochronic sharpness 0–1 (0 = gentle sine, 1 = sharp pulse)
// noiseColor : 'brown' | 'pink'
// rumble     : sub-bass grounding gain
// ─────────────────────────────────────────────────────────────────────────────
var B_BINAURAL_MAP = {

  'sleep-delta': {
    beatF: 2, beatDrift: 0.5, baseF: 180,
    amDepth: 0.65, isoRatio: 0.3,
    noiseColor: 'brown', rumble: 0.08,
    band_el: 'Δέλτα (0.5–4 Hz)', band_en: 'Delta (0.5–4 Hz)',
    desc_el: 'ζώνη Δέλτα (0.5–4 Hz) — βαθύς ύπνος και αποκατάσταση.',
    desc_en: 'Delta range (0.5–4 Hz) — deep sleep and restoration.'
  },

  'sleep-classical': {
    beatF: 2, beatDrift: 0.5, baseF: 180,
    amDepth: 0.60, isoRatio: 0.25,
    noiseColor: 'brown', rumble: 0.06,
    band_el: 'Δέλτα (0.5–4 Hz)', band_en: 'Delta (0.5–4 Hz)',
    desc_el: 'ζώνη Δέλτα (0.5–4 Hz) — βαθύς ύπνος και αποκατάσταση.',
    desc_en: 'Delta range (0.5–4 Hz) — deep sleep and restoration.'
  }
};

var B_BINAURAL_DEFAULT = {
  beatF: 10, beatDrift: 1.5, baseF: 220,
  amDepth: 0.55, isoRatio: 0.45,
  noiseColor: 'brown', rumble: 0.04,
  band_el: 'Alpha (8–12 Hz)', band_en: 'Alpha (8–12 Hz)',
  desc_el: 'ζώνη Alpha (8–12 Hz) — ήρεμη εγρήγορση και παρουσία.',
  desc_en: 'Alpha range (8–12 Hz) — calm alertness and presence.'
};

function getBinauralParams() {
  var pattern = (typeof bCurrentPattern !== 'undefined') ? bCurrentPattern : '';
  return B_BINAURAL_MAP[pattern] || B_BINAURAL_DEFAULT;
}

// Separate ack key per band — Delta users see Delta warning even if they've already seen Alpha
function getBinauralAckKey() {
  var band = getBinauralParams().band_en.split(' ')[0].toLowerCase(); // 'alpha' | 'delta'
  return 'binaural_ack_' + band;
}


// ── CORE BUILDER ─────────────────────────────────────────────────────────────
function buildBreathAudio() {
  var ac     = getAC();
  var params = getBinauralParams();

  // Master bus
  var master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // ── 1. BINAURAL BEATS (headphones required for this layer) ───────────────
  var binL = ac.createOscillator(); binL.type = 'sine';
  binL.frequency.value = params.baseF;
  var binR = ac.createOscillator(); binR.type = 'sine';
  binR.frequency.value = params.baseF + params.beatF;

  var gBinL = ac.createGain(); gBinL.gain.value = 0.28;
  var gBinR = ac.createGain(); gBinR.gain.value = 0.28;
  var pL = ac.createStereoPanner(); pL.pan.value = -1;
  var pR = ac.createStereoPanner(); pR.pan.value =  1;
  binL.connect(gBinL).connect(pL).connect(master);
  binR.connect(gBinR).connect(pR).connect(master);

  // ── 2. AMPLITUDE MODULATION — Neural Phase Locking ──────────────────────
  // LFO at beatF modulates noise amplitude.
  // The brain entrains to the rhythmic envelope — no headphones needed.
  var amLFO = ac.createOscillator();
  amLFO.type = 'sine';
  amLFO.frequency.value = params.beatF;

  var amGainMod = ac.createGain();
  amGainMod.gain.value = params.amDepth * 0.5;

  var amCarrierGain = ac.createGain();
  amCarrierGain.gain.value = 1 - params.amDepth * 0.5; // DC offset → always > 0

  amLFO.connect(amGainMod);
  amGainMod.connect(amCarrierGain.gain);

  var amNoiseSrc = ac.createBufferSource();
  amNoiseSrc.buffer = (params.noiseColor === 'pink') ? makePinkNoise(ac) : makeBrownNoise(ac);
  amNoiseSrc.loop = true;

  var amBP = ac.createBiquadFilter();
  amBP.type = 'bandpass';
  amBP.frequency.value = params.baseF * 1.5;
  amBP.Q.value = 0.8;

  var amOutGain = ac.createGain();
  amOutGain.gain.value = 0.32;

  amNoiseSrc.connect(amBP).connect(amCarrierGain).connect(amOutGain).connect(master);

  // ── 3. ISOCHRONIC PULSES — strongest single-ear entrainment ─────────────
  // Square LFO gates a tone. Blend is soft so it's felt more than heard.
  var isoLFO = ac.createOscillator();
  isoLFO.type = 'square';
  isoLFO.frequency.value = params.beatF;

  var isoShape = ac.createWaveShaper();
  var isoCurve = new Float32Array(256);
  for (var i = 0; i < 256; i++) {
    var x = (i * 2) / 256 - 1;
    isoCurve[i] = (Math.tanh(x * (2 + params.isoRatio * 4)) + 1) * 0.5;
  }
  isoShape.curve = isoCurve;

  var isoTone = ac.createOscillator();
  isoTone.type = 'sine';
  isoTone.frequency.value = params.baseF * 0.75;

  var isoEnv = ac.createGain();
  isoEnv.gain.value = 0;

  var isoOutGain = ac.createGain();
  isoOutGain.gain.value = params.isoRatio * 0.18;

  isoLFO.connect(isoShape);
  isoShape.connect(isoEnv.gain);
  isoTone.connect(isoEnv).connect(isoOutGain).connect(master);

  // ── 4. HARMONIC PAD — reinforces target band harmonically ───────────────
  var padG = ac.createGain(); padG.gain.value = 0.045;
  [params.baseF * 0.5, params.baseF * 1.5, params.baseF * 2.0].forEach(function(f, idx) {
    var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var g = ac.createGain(); g.gain.value = [0.35, 0.18, 0.08][idx];
    o.connect(g).connect(padG); o.start();
  });
  padG.connect(master);

  // ── 5. SUB-BASS RUMBLE — proprioceptive grounding ───────────────────────
  // Felt rather than heard. Especially grounding for sensory processing differences.
  var rumbleSrc = ac.createBufferSource();
  rumbleSrc.buffer = makeBrownNoise(ac); rumbleSrc.loop = true;
  var rumbleLP = ac.createBiquadFilter(); rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 80;
  var rumbleG  = ac.createGain(); rumbleG.gain.value = params.rumble;
  rumbleSrc.connect(rumbleLP).connect(rumbleG).connect(master);

  // ── 6. OCEAN — dynamic spectral texture, synced to breath ───────────────
  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac); oceanSrc.loop = true;
  var oceanG  = ac.createGain(); oceanG.gain.value = 0.20;
  var oceanLP = ac.createBiquadFilter();
  oceanLP.type = 'lowpass'; oceanLP.frequency.value = 500; oceanLP.Q.value = 0.6;
  // Very slow LFO shifts the LP cutoff (20-sec cycle) — never static
  var oceanLFO  = ac.createOscillator(); oceanLFO.type = 'sine'; oceanLFO.frequency.value = 0.05;
  var oceanLFOG = ac.createGain(); oceanLFOG.gain.value = 120;
  oceanLFO.connect(oceanLFOG);
  oceanLFOG.connect(oceanLP.frequency);
  oceanSrc.connect(oceanLP).connect(oceanG).connect(master);

  // ── 7. WIND — high-frequency texture ────────────────────────────────────
  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac); windSrc.loop = true;
  var windG  = ac.createGain(); windG.gain.value = 0.05;
  var windHP = ac.createBiquadFilter(); windHP.type = 'highpass'; windHP.frequency.value = 900;
  var windLP = ac.createBiquadFilter(); windLP.type = 'lowpass';  windLP.frequency.value = 2800;
  windSrc.connect(windHP).connect(windLP).connect(windG).connect(master);

  // ── START ALL ────────────────────────────────────────────────────────────
  binL.start(); binR.start();
  amLFO.start(); amNoiseSrc.start();
  isoLFO.start(); isoTone.start();
  oceanSrc.start(); oceanLFO.start();
  windSrc.start(); rumbleSrc.start();

  // ── HABITUATION PREVENTION — drift beatF every 8 minutes ────────────────
  var driftInterval = setInterval(function() {
    if (!breathAudioOn) { clearInterval(driftInterval); return; }
    var drift   = (Math.random() * 2 - 1) * params.beatDrift;
    var newBeat = params.beatF + drift;
    var t = ac.currentTime + 30; // 30-sec glide
    binR.frequency.linearRampToValueAtTime(params.baseF + newBeat, t);
    amLFO.frequency.linearRampToValueAtTime(newBeat, t);
    isoLFO.frequency.linearRampToValueAtTime(newBeat, t);
  }, 8 * 60 * 1000);

  return { master: master, oceanG: oceanG, driftInterval: driftInterval };
}


// ── TOGGLE / START / STOP ────────────────────────────────────────────────────
function toggleBreathAudio() {
  // Dispatch to pattern-specific audio engine
  if ((typeof bCurrentPattern !== 'undefined') && bCurrentPattern === 'sleep-classical') {
    toggleClassicalAudio();
    return;
  }
  if (!breathAudioOn) {
    if (!localStorage.getItem(getBinauralAckKey())) { showBinauralModal(); return; }
    startBreathAudio();
  } else {
    stopBreathAudio();
  }
}

function startBreathAudio() {
  var ac  = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (!breathAudioNodes) breathAudioNodes = buildBreathAudio();
  breathAudioNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 3);
  breathAudioOn = true;
  if (btn) {
    btn.style.color       = 'rgba(168,213,220,0.9)';
    btn.style.borderColor = 'rgba(168,213,220,0.4)';
    btn.style.background  = 'rgba(42,93,94,0.5)';
  }
}

function stopBreathAudio() {
  var ac  = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (breathAudioNodes) {
    breathAudioNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
    if (breathAudioNodes.driftInterval) clearInterval(breathAudioNodes.driftInterval);
  }
  breathAudioOn = false;
  if (btn) {
    btn.style.color       = 'rgba(168,213,220,0.35)';
    btn.style.borderColor = 'rgba(168,213,220,0.12)';
    btn.style.background  = 'rgba(0,0,0,0.3)';
  }
}


// ── SAFETY MODAL ─────────────────────────────────────────────────────────────
function showBinauralModal() {
  var existing = document.getElementById('binauralModal');
  if (existing) existing.remove();

  var isEl      = LANG === 'el';
  var params    = getBinauralParams();
  var bandLabel = isEl ? params.band_el : params.band_en;
  var bandDesc  = isEl ? params.desc_el : params.desc_en;

  var modal = document.createElement('div');
  modal.id = 'binauralModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease';

  modal.innerHTML =
    '<div style="max-width:380px;width:100%;background:#111820;border:1px solid #1e2a34;border-radius:16px;padding:28px 24px;text-align:center;font-family:DM Sans,sans-serif">'
    + '<div style="font-size:40px;margin-bottom:16px">🎧</div>'
    + '<h2 style="font-family:Cormorant Garamond,serif;font-size:22px;color:#5cbcbf;margin-bottom:12px;font-weight:600">'
    + bandLabel + ' Binaural Beats'
    + '</h2>'
    + '<p style="font-size:14px;color:#9aa4aa;line-height:1.7;margin-bottom:16px">'
    + (isEl
      ? 'Ήχος neural entrainment στη ζώνη ' + bandDesc + ' Συνδυάζει binaural beats, amplitude modulation και isochronic pulses για μέγιστη αποτελεσματικότητα.'
      : 'Neural entrainment sound for the ' + bandDesc + ' Combines binaural beats, amplitude modulation and isochronic pulses for maximum effect.')
    + '</p>'
    + '<div style="background:rgba(200,146,42,0.1);border:1px solid rgba(200,146,42,0.25);border-radius:10px;padding:14px;margin-bottom:16px;text-align:left">'
    + '<p style="font-size:13px;color:#c8922a;line-height:1.6;margin-bottom:8px;font-weight:600">'
    + (isEl ? '⚠️ Σημαντική ενημέρωση:' : '⚠️ Important notice:')
    + '</p>'
    + '<ul style="font-size:12px;color:#9a938c;line-height:1.7;padding-left:16px;margin:0">'
    + '<li>' + (isEl ? '<strong style="color:#c8922a">Ακουστικά</strong> για πλήρη εφέ binaural — χωρίς αυτά το AM εξακολουθεί να λειτουργεί' : '<strong style="color:#c8922a">Headphones</strong> for full binaural effect — without them AM still works') + '</li>'
    + '<li>' + (isEl ? '<strong style="color:#c8922a">Επιληψία</strong> ή σπασμοί: συμβουλευτείτε γιατρό πρώτα' : '<strong style="color:#c8922a">Epilepsy</strong> or seizure history: consult a doctor first') + '</li>'
    + '<li>' + (isEl ? 'Σε <strong style="color:#c8922a">ζάλη ή δυσφορία</strong>, σταματήστε αμέσως' : 'If <strong style="color:#c8922a">dizzy or uncomfortable</strong>, stop immediately') + '</li>'
    + '<li>' + (isEl ? 'Όχι κατά την <strong style="color:#c8922a">οδήγηση</strong>' : 'Not while <strong style="color:#c8922a">driving</strong>') + '</li>'
    + '<li>' + (isEl ? 'Ένταση σε <strong style="color:#c8922a">χαμηλό επίπεδο</strong> — λιγότερο είναι περισσότερο' : 'Keep volume <strong style="color:#c8922a">low</strong> — less is more') + '</li>'
    + '</ul>'
    + '</div>'
    + '<p style="font-size:11px;color:#5a6268;line-height:1.6;margin-bottom:20px;font-style:italic">'
    + (isEl
      ? 'Δεν υποκαθιστά ιατρική ή ψυχολογική υποστήριξη. Χρησιμοποιήστε ως συμπληρωματικό εργαλείο.'
      : 'Does not replace medical or psychological support. Use as a complementary tool.')
    + '</p>'
    + '<div style="display:flex;gap:10px;flex-direction:column">'
    + '<button id="binauralAccept" style="background:#2a6b6e;color:white;border:none;padding:14px;border-radius:10px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer">'
    + (isEl ? '🎧 Κατάλαβα — Ξεκίνα' : '🎧 I understand — Start')
    + '</button>'
    + '<button id="binauralCancel" style="background:transparent;color:#6a7580;border:1px solid #1e2a34;padding:12px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer">'
    + (isEl ? 'Ακύρωση' : 'Cancel')
    + '</button>'
    + '<label style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;color:#5a6268;cursor:pointer;margin-top:4px">'
    + '<input type="checkbox" id="binauralRemember" style="accent-color:#2a6b6e">'
    + (isEl ? 'Να μην εμφανιστεί ξανά' : "Don't show again")
    + '</label>'
    + '</div>'
    + '</div>';

  document.body.appendChild(modal);

  document.getElementById('binauralAccept').addEventListener('click', function() {
    if (document.getElementById('binauralRemember').checked) {
      localStorage.setItem(getBinauralAckKey(), '1');
    }
    modal.style.display = 'none';
    startBreathAudio();
  });
  document.getElementById('binauralCancel').addEventListener('click', function() {
    modal.style.display = 'none';
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });
}


// ── SYNC OCEAN TO BREATH PHASE ───────────────────────────────────────────────
var _origBUpdatePhase = bUpdatePhase;
bUpdatePhase = function(now) {
  _origBUpdatePhase(now);
  if (breathAudioOn && breathAudioNodes && audioCtx) {
    var target = 0.10 + bArmPos * 0.28;
    breathAudioNodes.oceanG.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
  }
};


// ── AUTO-STOP WHEN LEAVING BREATH SCREEN ────────────────────────────────────
var _origShowScreen = showScreen;
showScreen = function(id) {
  if (breathAudioOn && id !== 'breath') toggleBreathAudio();
  _origShowScreen(id);
};


// Pattern switching and audio stop handled directly in breath.js switchPattern()
