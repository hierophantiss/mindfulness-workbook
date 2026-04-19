/* ═══ js/audio/binaural.js ═══ */
// ═══ 2. BREATH SCREEN AUDIO (Binaural + Ocean + Wind) ═══
var breathAudioOn = false;
var breathAudioNodes = null;

function buildBreathAudio() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  // Alpha binaural beats (10 Hz)
  var baseF = 160;
  var beatF = 10;
  var binL = ac.createOscillator(); binL.type = 'sine'; binL.frequency.value = baseF;
  var gL = ac.createGain(); gL.gain.value = 0.35;
  var pL = ac.createStereoPanner(); pL.pan.value = -1;
  binL.connect(gL).connect(pL).connect(master);

  var binR = ac.createOscillator(); binR.type = 'sine'; binR.frequency.value = baseF + beatF;
  var gR = ac.createGain(); gR.gain.value = 0.35;
  var pR = ac.createStereoPanner(); pR.pan.value = 1;
  binR.connect(gR).connect(pR).connect(master);

  // Harmonic pad
  var padG = ac.createGain(); padG.gain.value = 0.06;
  [baseF*0.5, baseF*1.5, baseF*2].forEach(function(f, i) {
    var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var g = ac.createGain(); g.gain.value = [0.4, 0.2, 0.1][i];
    o.connect(g).connect(padG); o.start();
  });
  padG.connect(master);

  // Ocean waves (brown noise, low-passed)
  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac); oceanSrc.loop = true;
  var oceanG = ac.createGain(); oceanG.gain.value = 0.25;
  var oceanLP = ac.createBiquadFilter(); oceanLP.type = 'lowpass'; oceanLP.frequency.value = 600; oceanLP.Q.value = 0.5;
  oceanSrc.connect(oceanLP).connect(oceanG).connect(master);

  // Wind (pink noise, band-passed)
  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac); windSrc.loop = true;
  var windG = ac.createGain(); windG.gain.value = 0.07;
  var windHP = ac.createBiquadFilter(); windHP.type = 'highpass'; windHP.frequency.value = 800;
  var windLP = ac.createBiquadFilter(); windLP.type = 'lowpass'; windLP.frequency.value = 3000;
  windSrc.connect(windHP).connect(windLP).connect(windG).connect(master);

  binL.start(); binR.start(); oceanSrc.start(); windSrc.start();

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
