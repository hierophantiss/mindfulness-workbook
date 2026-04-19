/* ═══ js/audio/binaural.js ═══ */
// ═══ 2. BREATH SCREEN AUDIO (Binaural + Ocean + Wind) ═══
// Professional-grade audio quality upgrade — all functions, names, and behaviors preserved.
var breathAudioOn = false;
var breathAudioNodes = null;

function buildBreathAudio() {
  var ac = getAC();
  var now = ac.currentTime;

  // ── MASTER CHAIN ─────────────────────────────────────────────
  // master (gain) → softLimiter (compressor) → destination
  // The compressor acts as a gentle "glue" + safety limiter so peaks
  // never clip and the mix feels cohesive at low listening levels.
  var master = ac.createGain();
  master.gain.value = 0;

  var softLimiter = ac.createDynamicsCompressor();
  softLimiter.threshold.value = -12;   // start gentle compression here
  softLimiter.knee.value = 18;         // soft knee = musical, not obvious
  softLimiter.ratio.value = 3;         // light ratio — transparent
  softLimiter.attack.value = 0.008;
  softLimiter.release.value = 0.25;

  master.connect(softLimiter).connect(ac.destination);

  // ── ALPHA BINAURAL BEATS (10 Hz, carrier 136.1 Hz "OM") ──────
  // 136.1 Hz is the classic meditative carrier — warmer and less fatiguing
  // than 160 Hz for long sessions. A tiny detune (±0.15 Hz) on top of the
  // 10 Hz offset gives the tone a slightly living, non-sterile quality
  // without breaking the binaural effect.
  var baseF = 136.1;
  var beatF = 10;

  var binL = ac.createOscillator();
  binL.type = 'sine';
  binL.frequency.value = baseF;
  binL.detune.value = -0.15;

  // Per-channel soft highpass removes DC / sub rumble that headphones waste energy on
  var binLHP = ac.createBiquadFilter();
  binLHP.type = 'highpass';
  binLHP.frequency.value = 40;
  binLHP.Q.value = 0.5;

  var gL = ac.createGain();
  gL.gain.value = 0.28; // slightly lower — compressor will bring it forward cleanly
  var pL = ac.createStereoPanner();
  pL.pan.value = -1;
  binL.connect(binLHP).connect(gL).connect(pL).connect(master);

  var binR = ac.createOscillator();
  binR.type = 'sine';
  binR.frequency.value = baseF + beatF;
  binR.detune.value = 0.15;

  var binRHP = ac.createBiquadFilter();
  binRHP.type = 'highpass';
  binRHP.frequency.value = 40;
  binRHP.Q.value = 0.5;

  var gR = ac.createGain();
  gR.gain.value = 0.28;
  var pR = ac.createStereoPanner();
  pR.pan.value = 1;
  binR.connect(binRHP).connect(gR).connect(pR).connect(master);

  // Very slow shared tremolo on the binaural pair (0.07 Hz ≈ 14s cycle).
  // Keeps the beat from feeling mechanical. Depth is tiny so the
  // entrainment effect is preserved.
  var binLFO = ac.createOscillator();
  binLFO.type = 'sine';
  binLFO.frequency.value = 0.07;
  var binLFOGain = ac.createGain();
  binLFOGain.gain.value = 0.025; // ±0.025 around base gain
  binLFO.connect(binLFOGain);
  binLFOGain.connect(gL.gain);
  binLFOGain.connect(gR.gain);
  binLFO.start();

  // ── HARMONIC PAD (proper harmonic series + slow shimmer) ─────
  // Using octave-below (0.5×), perfect fifth (1.5×), octave-above (2×),
  // and a subtle 3× partial for air. Each partial is slightly detuned
  // (chorus-like) so the pad sounds wider and more organic.
  var padG = ac.createGain();
  padG.gain.value = 0.05;

  // Gentle highpass on the pad cleans low-mid mud that can fight the binaural carrier
  var padHP = ac.createBiquadFilter();
  padHP.type = 'highpass';
  padHP.frequency.value = 60;
  padHP.Q.value = 0.5;

  // Gentle lowpass takes the edge off higher partials — silky, not bright
  var padLP = ac.createBiquadFilter();
  padLP.type = 'lowpass';
  padLP.frequency.value = 2200;
  padLP.Q.value = 0.6;

  var padPartials = [
    { mult: 0.5, gain: 0.38, detune: -4 },
    { mult: 1.5, gain: 0.22, detune: 3 },
    { mult: 2.0, gain: 0.12, detune: -2 },
    { mult: 3.0, gain: 0.05, detune: 5 }
  ];
  padPartials.forEach(function(p) {
    var o = ac.createOscillator();
    o.type = 'sine';
    o.frequency.value = baseF * p.mult;
    o.detune.value = p.detune;
    var g = ac.createGain();
    g.gain.value = p.gain;
    o.connect(g).connect(padHP);
    o.start();
  });
  padHP.connect(padLP).connect(padG);

  // Slight stereo spread on the pad via a tiny pan offset — adds width
  // without collapsing the binaural image in the center.
  var padPan = ac.createStereoPanner();
  padPan.pan.value = 0; // keep centered; width comes from detuned partials
  padG.connect(padPan).connect(master);

  // Very slow amplitude breathing on the pad (0.05 Hz ≈ 20s) — subtle life
  var padLFO = ac.createOscillator();
  padLFO.type = 'sine';
  padLFO.frequency.value = 0.05;
  var padLFOGain = ac.createGain();
  padLFOGain.gain.value = 0.015;
  padLFO.connect(padLFOGain).connect(padG.gain);
  padLFO.start();

  // ── OCEAN WAVES (two-layer brown noise with breathing filter) ─
  // Layer 1: deep body (low-passed heavy, slight stereo)
  // Layer 2: foam/surf (band-passed higher, adds texture)
  // A slow LFO sweeps the main lowpass cutoff — this is what makes
  // the waves sound like they're actually rolling in and out instead
  // of static noise.
  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac);
  oceanSrc.loop = true;

  var oceanLP = ac.createBiquadFilter();
  oceanLP.type = 'lowpass';
  oceanLP.frequency.value = 500;
  oceanLP.Q.value = 0.7;

  // Shelving boost for warmth in the low end (the "body" of a wave)
  var oceanLowShelf = ac.createBiquadFilter();
  oceanLowShelf.type = 'lowshelf';
  oceanLowShelf.frequency.value = 180;
  oceanLowShelf.gain.value = 3;

  var oceanG = ac.createGain();
  oceanG.gain.value = 0.22;

  oceanSrc.connect(oceanLowShelf).connect(oceanLP).connect(oceanG).connect(master);

  // Wave-breathing LFO on the cutoff frequency (0.08 Hz ≈ 12.5s per wave)
  var oceanLFO = ac.createOscillator();
  oceanLFO.type = 'sine';
  oceanLFO.frequency.value = 0.08;
  var oceanLFOGain = ac.createGain();
  oceanLFOGain.gain.value = 180; // sweeps cutoff ±180 Hz around 500
  oceanLFO.connect(oceanLFOGain).connect(oceanLP.frequency);
  oceanLFO.start();

  // Foam/surf layer — pink noise, bandpassed for that subtle "sss" of cresting waves
  var surfSrc = ac.createBufferSource();
  surfSrc.buffer = makePinkNoise(ac);
  surfSrc.loop = true;

  var surfBP = ac.createBiquadFilter();
  surfBP.type = 'bandpass';
  surfBP.frequency.value = 1800;
  surfBP.Q.value = 0.8;

  var surfG = ac.createGain();
  surfG.gain.value = 0.035;

  surfSrc.connect(surfBP).connect(surfG).connect(master);

  // Surf amplitude follows a slightly offset LFO — peaks just after wave peaks
  var surfLFO = ac.createOscillator();
  surfLFO.type = 'sine';
  surfLFO.frequency.value = 0.08;
  var surfLFOGain = ac.createGain();
  surfLFOGain.gain.value = 0.025;
  surfLFO.connect(surfLFOGain).connect(surfG.gain);
  surfLFO.start();

  // ── WIND (pink noise, moving bandpass for natural gusts) ──────
  // A slow LFO modulates the bandpass center frequency, creating the
  // natural "breath" of wind through trees instead of static hiss.
  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac);
  windSrc.loop = true;

  var windHP = ac.createBiquadFilter();
  windHP.type = 'highpass';
  windHP.frequency.value = 700;
  windHP.Q.value = 0.5;

  var windBP = ac.createBiquadFilter();
  windBP.type = 'bandpass';
  windBP.frequency.value = 1600;
  windBP.Q.value = 1.2;

  var windLP = ac.createBiquadFilter();
  windLP.type = 'lowpass';
  windLP.frequency.value = 3200;
  windLP.Q.value = 0.5;

  var windG = ac.createGain();
  windG.gain.value = 0.055;

  windSrc.connect(windHP).connect(windBP).connect(windLP).connect(windG).connect(master);

  // Wind gust LFO — slow, irregular-feeling sweep of bandpass center
  var windLFO = ac.createOscillator();
  windLFO.type = 'sine';
  windLFO.frequency.value = 0.11;
  var windLFOGain = ac.createGain();
  windLFOGain.gain.value = 500;
  windLFO.connect(windLFOGain).connect(windBP.frequency);
  windLFO.start();

  // Wind amplitude LFO — gentle swell & recede
  var windAmpLFO = ac.createOscillator();
  windAmpLFO.type = 'sine';
  windAmpLFO.frequency.value = 0.06;
  var windAmpLFOGain = ac.createGain();
  windAmpLFOGain.gain.value = 0.02;
  windAmpLFO.connect(windAmpLFOGain).connect(windG.gain);
  windAmpLFO.start();

  // Start sources
  binL.start();
  binR.start();
  oceanSrc.start();
  surfSrc.start();
  windSrc.start();

  // Preserve original return shape so downstream code (bUpdatePhase) keeps working
  return { master: master, oceanG: oceanG };
}

function toggleBreathAudio() {
  if (!breathAudioOn) {
    // Show safety modal first if not already acknowledged
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
  // Smoother, slightly longer fade-in for a more cinematic entry
  breathAudioNodes.master.gain.cancelScheduledValues(ac.currentTime);
  breathAudioNodes.master.gain.setValueAtTime(breathAudioNodes.master.gain.value, ac.currentTime);
  breathAudioNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 4);
  breathAudioOn = true;
  btn.style.color = 'rgba(168,213,220,0.9)';
  btn.style.borderColor = 'rgba(168,213,220,0.4)';
  btn.style.background = 'rgba(42,93,94,0.5)';
}

function stopBreathAudio() {
  var ac = getAC();
  var btn = document.getElementById('breathAudioBtn');
  breathAudioNodes.master.gain.cancelScheduledValues(ac.currentTime);
  breathAudioNodes.master.gain.setValueAtTime(breathAudioNodes.master.gain.value, ac.currentTime);
  breathAudioNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2.5);
  breathAudioOn = false;
  btn.style.color = 'rgba(168,213,220,0.35)';
  btn.style.borderColor = 'rgba(168,213,220,0.12)';
  btn.style.background = 'rgba(0,0,0,0.3)';
}

// ── BINAURAL SAFETY MODAL ──
function showBinauralModal() {
  var existing = document.getElementById('binauralModal');
  if (existing) { existing.style.display = 'flex'; return; }

  var isEl = LANG === 'el';
  var modal = document.createElement('div');
  modal.id = 'binauralModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease';

  modal.innerHTML = '<div style="max-width:380px;width:100%;background:#111820;border:1px solid #1e2a34;border-radius:16px;padding:28px 24px;text-align:center;font-family:DM Sans,sans-serif">'
    + '<div style="font-size:40px;margin-bottom:16px">🎧</div>'
    + '<h2 style="font-family:Cormorant Garamond,serif;font-size:22px;color:#5cbcbf;margin-bottom:12px;font-weight:600">'
    + (isEl ? 'Alpha Binaural Beats' : 'Alpha Binaural Beats')
    + '</h2>'
    + '<p style="font-size:14px;color:#9aa4aa;line-height:1.7;margin-bottom:16px">'
    + (isEl
      ? 'Τα binaural beats στέλνουν διαφορετική συχνότητα σε κάθε αυτί, δημιουργώντας ήχο στη ζώνη Alpha (8-12 Hz) που ενισχύει την ήρεμη εγρήγορση.'
      : 'Binaural beats send a different frequency to each ear, creating a tone in the Alpha range (8-12 Hz) that promotes calm alertness.')
    + '</p>'
    + '<div style="background:rgba(200,146,42,0.1);border:1px solid rgba(200,146,42,0.25);border-radius:10px;padding:14px;margin-bottom:16px;text-align:left">'
    + '<p style="font-size:13px;color:#c8922a;line-height:1.6;margin-bottom:8px;font-weight:600">'
    + (isEl ? '⚠️ Σημαντική ενημέρωση:' : '⚠️ Important notice:')
    + '</p>'
    + '<ul style="font-size:12px;color:#9a938c;line-height:1.7;padding-left:16px;margin:0">'
    + '<li>' + (isEl ? 'Απαιτούνται <strong style="color:#c8922a">ακουστικά</strong> (stereo) για σωστή λειτουργία' : '<strong style="color:#c8922a">Headphones</strong> (stereo) required for proper function') + '</li>'
    + '<li>' + (isEl ? 'Αν έχετε <strong style="color:#c8922a">επιληψία</strong> ή ιστορικό σπασμών, συμβουλευτείτε γιατρό πριν τη χρήση' : 'If you have <strong style="color:#c8922a">epilepsy</strong> or seizure history, consult a doctor first') + '</li>'
    + '<li>' + (isEl ? 'Αν νιώσετε <strong style="color:#c8922a">ζάλη, δυσφορία ή ναυτία</strong>, σταματήστε αμέσως' : 'If you feel <strong style="color:#c8922a">dizzy, uncomfortable, or nauseous</strong>, stop immediately') + '</li>'
    + '<li>' + (isEl ? 'Δεν συνιστάται κατά την <strong style="color:#c8922a">οδήγηση</strong> ή χειρισμό μηχανημάτων' : 'Not recommended while <strong style="color:#c8922a">driving</strong> or operating machinery') + '</li>'
    + '<li>' + (isEl ? 'Κρατήστε την ένταση σε <strong style="color:#c8922a">χαμηλό επίπεδο</strong>' : 'Keep volume at a <strong style="color:#c8922a">low level</strong>') + '</li>'
    + '</ul>'
    + '</div>'
    + '<p style="font-size:11px;color:#5a6268;line-height:1.6;margin-bottom:20px;font-style:italic">'
    + (isEl
      ? 'Τα binaural beats δεν υποκαθιστούν ιατρική ή ψυχολογική υποστήριξη. Χρησιμοποιήστε τα ως συμπληρωματικό εργαλείο χαλάρωσης.'
      : 'Binaural beats do not replace medical or psychological support. Use them as a complementary relaxation tool.')
    + '</p>'
    + '<div style="display:flex;gap:10px;flex-direction:column">'
    + '<button id="binauralAccept" style="background:#2a6b6e;color:white;border:none;padding:14px;border-radius:10px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s">'
    + (isEl ? '🎧 Κατάλαβα — Ξεκίνα' : '🎧 I understand — Start')
    + '</button>'
    + '<button id="binauralCancel" style="background:transparent;color:#6a7580;border:1px solid #1e2a34;padding:12px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer;transition:all .2s">'
    + (isEl ? 'Ακύρωση' : 'Cancel')
    + '</button>'
    + '<label style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:11px;color:#5a6268;cursor:pointer;margin-top:4px">'
    + '<input type="checkbox" id="binauralRemember" style="accent-color:#2a6b6e">'
    + (isEl ? 'Να μην εμφανιστεί ξανά' : 'Don\'t show again')
    + '</label>'
    + '</div>'
    + '</div>';

  document.body.appendChild(modal);

  document.getElementById('binauralAccept').addEventListener('click', function() {
    if (document.getElementById('binauralRemember').checked) {
      localStorage.setItem('binaural_ack', '1');
    }
    modal.style.display = 'none';
    startBreathAudio();
  });

  document.getElementById('binauralCancel').addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) modal.style.display = 'none';
  });
}

// Sync ocean volume to breath phase — called from bUpdatePhase
var _origBUpdatePhase = bUpdatePhase;
bUpdatePhase = function(now) {
  _origBUpdatePhase(now);
  // Shape ocean to breath arm position
  if (breathAudioOn && breathAudioNodes && audioCtx) {
    var target = 0.1 + bArmPos * 0.3; // arms up = wave up
    breathAudioNodes.oceanG.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
  }
};

// Auto-stop breath audio when leaving breath screen
var _origShowScreen = showScreen;
showScreen = function(id) {
  // If leaving breath and audio is on, fade it
  if (breathAudioOn && id !== 'breath') {
    toggleBreathAudio();
  }
  _origShowScreen(id);
};
