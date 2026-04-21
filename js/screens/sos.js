/* ═══════════════════════════════════════════
   sos.js — SOS Emergency Calm Mode (v2 — fixed)
   
   Fixes from v1:
   1. Shows SOS-specific warning modal on first use
   2. Auto-selects 4-7-8 pattern AND starts breathing
   3. Warning explains theta waves + headphones needed
   4. Proper stop: switching pattern, leaving screen, or tapping SOS again
   
   Quad-sensory: Ears (theta 6Hz) + Eyes (blue-teal) + Body (4-7-8) + Touch (haptic tick)
   ═══════════════════════════════════════════ */

var sosActive = false;
var sosAudioNodes = null;
var sosAudioStarted = false;

// ═══ REGISTER SOS PATTERN ═══
function registerSOSPattern() {
  if (typeof B_PATTERNS === 'undefined') return;
  if (B_PATTERNS['sos']) return;

  B_PATTERNS['sos'] = {
    name_el: 'SOS — Ηρεμία Τώρα', name_en: 'SOS — Calm Now',
    purpose_el: 'Έκτακτη Ηρεμία', purpose_en: 'Emergency Calm',
    desc_el: 'Theta 6Hz + αναπνοή 4-7-8 + ηρεμιστικό φως + haptic ρυθμός',
    desc_en: 'Theta 6Hz + 4-7-8 breath + calming light + haptic rhythm',
    isSOS: true,
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 7000, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 8000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 1000, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  };
}

// ═══ THETA BINAURAL AUDIO (6 Hz) ═══
function buildSOSAudio() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;
  master.connect(ac.destination);

  var baseF = 200;
  var beatF = 6;

  var binL = ac.createOscillator(); binL.type = 'sine'; binL.frequency.value = baseF;
  var gL = ac.createGain(); gL.gain.value = 0.3;
  var pL = ac.createStereoPanner(); pL.pan.value = -1;
  binL.connect(gL).connect(pL).connect(master);

  var binR = ac.createOscillator(); binR.type = 'sine'; binR.frequency.value = baseF + beatF;
  var gR = ac.createGain(); gR.gain.value = 0.3;
  var pR = ac.createStereoPanner(); pR.pan.value = 1;
  binR.connect(gR).connect(pR).connect(master);

  var padG = ac.createGain(); padG.gain.value = 0.04;
  [baseF * 0.5, baseF * 1.5].forEach(function(f, i) {
    var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var g = ac.createGain(); g.gain.value = [0.3, 0.15][i];
    o.connect(g).connect(padG); o.start();
  });
  padG.connect(master);

  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac); oceanSrc.loop = true;
  var oceanG = ac.createGain(); oceanG.gain.value = 0.3;
  var oceanLP = ac.createBiquadFilter(); oceanLP.type = 'lowpass'; oceanLP.frequency.value = 400; oceanLP.Q.value = 0.3;
  oceanSrc.connect(oceanLP).connect(oceanG).connect(master);

  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac); windSrc.loop = true;
  var windG = ac.createGain(); windG.gain.value = 0.04;
  var windHP = ac.createBiquadFilter(); windHP.type = 'highpass'; windHP.frequency.value = 600;
  var windLP = ac.createBiquadFilter(); windLP.type = 'lowpass'; windLP.frequency.value = 2000;
  windSrc.connect(windHP).connect(windLP).connect(windG).connect(master);

  binL.start(); binR.start(); oceanSrc.start(); windSrc.start();

  return { master: master, oceanG: oceanG };
}

// ═══ SOS WARNING MODAL ═══
function showSOSModal(onAccept) {
  var existing = document.getElementById('sosModal');
  if (existing) existing.remove();

  var isEl = (typeof LANG !== 'undefined') ? LANG === 'el' : true;

  var modal = document.createElement('div');
  modal.id = 'sosModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease';

  modal.innerHTML = '<div style="max-width:380px;width:100%;background:#0d1b2a;border:1px solid rgba(100,180,210,0.2);border-radius:16px;padding:28px 24px;text-align:center;font-family:Literata,Georgia,serif">'
    + '<div style="font-size:40px;margin-bottom:12px">🆘</div>'
    + '<h2 style="font-family:Fraunces,serif;font-size:20px;color:rgba(100,180,210,0.8);margin-bottom:12px;font-weight:700">'
    + (isEl ? 'SOS — Έκτακτη Ηρεμία' : 'SOS — Emergency Calm')
    + '</h2>'
    + '<p style="font-size:13px;color:rgba(168,213,220,0.5);line-height:1.7;margin-bottom:14px">'
    + (isEl
      ? 'Το SOS mode συνδυάζει 4 κανάλια ηρεμίας ταυτόχρονα: αναπνοή 4-7-8, κύματα Theta 6Hz, ηρεμιστικό μπλε φως και ρυθμική δόνηση.'
      : 'SOS mode combines 4 calming channels: 4-7-8 breathing, Theta 6Hz waves, calming blue light and rhythmic vibration.')
    + '</p>'
    + '<div style="background:rgba(100,180,210,0.08);border:1px solid rgba(100,180,210,0.15);border-radius:10px;padding:14px;margin-bottom:14px;text-align:left">'
    + '<p style="font-size:12px;color:rgba(100,180,210,0.6);line-height:1.7;margin-bottom:8px;font-weight:600">'
    + (isEl ? '🎧 Σημαντικό:' : '🎧 Important:')
    + '</p>'
    + '<ul style="font-size:11px;color:rgba(168,213,220,0.4);line-height:1.8;padding-left:16px;margin:0">'
    + '<li>' + (isEl ? 'Χρησιμοποιεί <strong style="color:rgba(100,180,210,0.7)">κύματα Theta (6Hz)</strong> — βοηθούν το νευρικό σύστημα να ηρεμήσει' : 'Uses <strong style="color:rgba(100,180,210,0.7)">Theta waves (6Hz)</strong> — help the nervous system calm down') + '</li>'
    + '<li>' + (isEl ? 'Απαιτούνται <strong style="color:rgba(100,180,210,0.7)">ακουστικά (stereo)</strong> για σωστή λειτουργία' : '<strong style="color:rgba(100,180,210,0.7)">Stereo headphones</strong> required') + '</li>'
    + '<li>' + (isEl ? 'Αν έχεις <strong style="color:rgba(100,180,210,0.7)">επιληψία</strong>, συμβουλεύσου γιατρό πριν τη χρήση' : 'If you have <strong style="color:rgba(100,180,210,0.7)">epilepsy</strong>, consult a doctor first') + '</li>'
    + '<li>' + (isEl ? 'Κράτα τον ήχο σε <strong style="color:rgba(100,180,210,0.7)">χαμηλή ένταση</strong>' : 'Keep volume at a <strong style="color:rgba(100,180,210,0.7)">low level</strong>') + '</li>'
    + '</ul>'
    + '</div>'
    + '<div style="display:flex;gap:10px;flex-direction:column">'
    + '<button id="sosAcceptFull" style="background:rgba(42,93,94,0.6);color:rgba(168,213,220,0.9);border:1px solid rgba(100,180,210,0.3);padding:14px;border-radius:10px;font-family:inherit;font-size:14px;font-weight:600;cursor:pointer">'
    + (isEl ? '🎧 Κατάλαβα — Ξεκίνα με ήχο' : '🎧 I understand — Start with sound')
    + '</button>'
    + '<button id="sosAcceptSilent" style="background:rgba(168,213,220,0.06);color:rgba(168,213,220,0.5);border:1px solid rgba(168,213,220,0.15);padding:12px;border-radius:10px;font-family:inherit;font-size:13px;cursor:pointer">'
    + (isEl ? '🔇 Χωρίς ήχο — μόνο αναπνοή + φως' : '🔇 No sound — breathing + light only')
    + '</button>'
    + '<button id="sosCancel" style="background:transparent;color:rgba(168,213,220,0.3);border:none;padding:10px;font-family:inherit;font-size:12px;cursor:pointer">'
    + (isEl ? 'Ακύρωση' : 'Cancel')
    + '</button>'
    + '<label style="display:flex;align-items:center;justify-content:center;gap:8px;font-size:10px;color:rgba(168,213,220,0.25);cursor:pointer;margin-top:2px">'
    + '<input type="checkbox" id="sosRemember" style="accent-color:rgba(42,93,94,0.8)">'
    + (isEl ? 'Να μην εμφανιστεί ξανά' : 'Don\'t show again')
    + '</label>'
    + '</div>'
    + '</div>';

  document.body.appendChild(modal);

  document.getElementById('sosAcceptFull').onclick = function() {
    if (document.getElementById('sosRemember').checked) {
      localStorage.setItem('sos_ack', 'full');
    }
    modal.remove();
    onAccept(true); // with audio
  };

  document.getElementById('sosAcceptSilent').onclick = function() {
    if (document.getElementById('sosRemember').checked) {
      localStorage.setItem('sos_ack', 'silent');
    }
    modal.remove();
    onAccept(false); // without audio
  };

  document.getElementById('sosCancel').onclick = function() {
    modal.remove();
  };

  modal.onclick = function(e) {
    if (e.target === modal) modal.remove();
  };
}

// ═══ START/STOP SOS AUDIO ═══
function _startSOSAudio() {
  var ac = getAC();
  if (!sosAudioNodes) sosAudioNodes = buildSOSAudio();
  sosAudioNodes.master.gain.linearRampToValueAtTime(0.4, ac.currentTime + 4);
  sosAudioStarted = true;
}

function _stopSOSAudio() {
  if (!sosAudioNodes || !sosAudioStarted) return;
  var ac = getAC();
  sosAudioNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2);
  sosAudioStarted = false;
  // Destroy nodes after fade out
  setTimeout(function() {
    if (!sosAudioStarted && sosAudioNodes) {
      try { sosAudioNodes.master.disconnect(); } catch(e) {}
      sosAudioNodes = null;
    }
  }, 3000);
}

// ═══ VISUALS ═══
function _activateSOSVisuals() {
  var screen = document.getElementById('screen-breath');
  if (screen) screen.classList.add('sos-mode');
}

function _deactivateSOSVisuals() {
  var screen = document.getElementById('screen-breath');
  if (screen) screen.classList.remove('sos-mode');
}

// ═══ ACTIVATE SOS (main entry point) ═══
function activateSOS() {
  // If SOS is already active, toggle it OFF
  if (sosActive) {
    deactivateSOS();
    // Switch back to default pattern
    if (typeof _origSwitchPattern === 'function') {
      _origSwitchPattern('4-2-6-1');
    } else if (typeof switchPattern === 'function') {
      switchPattern('4-2-6-1');
    }
    return;
  }

  registerSOSPattern();

  // Check if first time — show modal
  var ack = localStorage.getItem('sos_ack');
  if (!ack) {
    showSOSModal(function(withAudio) {
      _doActivateSOS(withAudio);
    });
    return;
  }

  // Already acknowledged
  _doActivateSOS(ack === 'full');
}

function _doActivateSOS(withAudio) {
  sosActive = true;

  // Stop existing breath binaural if running
  if (typeof breathAudioOn !== 'undefined' && breathAudioOn) {
    toggleBreathAudio();
  }

  // Switch to SOS pattern (which is 4-7-8)
  if (typeof _origSwitchPattern === 'function') {
    _origSwitchPattern('sos');
  }

  // Activate visuals (blue screen)
  _activateSOSVisuals();

  // Start theta audio if user wants it
  if (withAudio) {
    _startSOSAudio();
  }

  // Auto-start breathing
  setTimeout(function() {
    if (typeof bStart === 'function' && !bRunning) {
      bStart();
    }
  }, 300);

  // Update SOS button appearance
  _updateSOSButtonState();
}

function deactivateSOS() {
  if (!sosActive) return;
  sosActive = false;

  // Stop audio
  _stopSOSAudio();

  // Remove visuals
  _deactivateSOSVisuals();

  // Pause breathing if running
  if (typeof bPause === 'function' && bRunning) {
    bPause();
  }

  // Update button
  _updateSOSButtonState();
}

function _updateSOSButtonState() {
  var btn = document.querySelector('[data-pattern="sos"]');
  if (!btn) return;
  var isEl = (typeof LANG !== 'undefined') ? LANG === 'el' : true;
  
  if (sosActive) {
    btn.classList.add('active');
    btn.innerHTML = '<span style="font-size:12px;font-weight:700">■ STOP</span><br><span class="bp-purpose" style="font-size:8px;opacity:0.6;font-weight:400">'
      + (isEl ? 'Σταμάτα SOS' : 'Stop SOS') + '</span>';
  } else {
    btn.classList.remove('active');
    btn.innerHTML = '<span style="font-size:12px;font-weight:700">SOS</span><br><span class="bp-purpose" style="font-size:8px;opacity:0.6;font-weight:400">'
      + (isEl ? 'Έκτακτη Ηρεμία' : 'Emergency Calm') + '</span>';
  }
}

// ═══ HOOKS ═══
var _origSwitchPattern = null;

function hookSOSIntoPatternSwitch() {
  if (_origSwitchPattern) return;
  _origSwitchPattern = window.switchPattern;

  window.switchPattern = function(key) {
    // Switching away from SOS
    if (sosActive && key !== 'sos') {
      sosActive = false;
      _stopSOSAudio();
      _deactivateSOSVisuals();
      _updateSOSButtonState();
    }
    _origSwitchPattern(key);
  };
}

function hookSOSHaptics() {
  var origHapticPulse = window.hapticPulse;
  window.hapticPulse = function(durationMs, freq) {
    if (sosActive) {
      durationMs = 25;
      freq = 150;
    }
    origHapticPulse(durationMs, freq);
  };
}

function syncSOSOceanToBreath() {
  var origBUpdate = window.bUpdatePhase;
  var lastSync = 0;
  window.bUpdatePhase = function(now) {
    origBUpdate(now);
    if (sosActive && sosAudioNodes && sosAudioStarted && typeof audioCtx !== 'undefined' && audioCtx) {
      if (now - lastSync > 100) {
        var target = 0.15 + bArmPos * 0.25;
        sosAudioNodes.oceanG.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
        lastSync = now;
      }
    }
  };
}

function patchCompanionForSOS() {
  if (typeof getCompanionMessage !== 'function') return;
  var origGetMsg = window.getCompanionMessage;
  window.getCompanionMessage = function() {
    var msg = origGetMsg();
    var lang = typeof LANG !== 'undefined' ? LANG : 'el';
    var mood = typeof loadMood === 'function' ? loadMood() : -1;
    if (mood >= 0 && mood <= 1) {
      msg.secondary = lang === 'el'
        ? 'Το SOS mode συνδυάζει αναπνοή, ήχο θήτα και ηρεμιστικό φως.'
        : 'SOS mode combines breathing, theta sound and calming light.';
      msg.actions = [
        { label: lang === 'el' ? '🆘 SOS Ηρεμία' : '🆘 SOS Calm', action: "showScreen('breath');setTimeout(activateSOS,400)" }
      ];
    }
    return msg;
  };
}

// ═══ ADD SOS BUTTON ═══
function addSOSButton() {
  var patternSelect = document.getElementById('bPatternSelect');
  if (!patternSelect) return;
  if (document.querySelector('[data-pattern="sos"]')) return;

  registerSOSPattern();

  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  var btn = document.createElement('button');
  btn.className = 'breath-pattern-btn sos-pattern-btn';
  btn.dataset.pattern = 'sos';
  btn.onclick = function(e) {
    e.preventDefault();
    activateSOS();
  };
  btn.innerHTML = '<span style="font-size:12px;font-weight:700">SOS</span><br><span class="bp-purpose" style="font-size:8px;opacity:0.6;font-weight:400">'
    + (lang === 'el' ? 'Έκτακτη Ηρεμία' : 'Emergency Calm') + '</span>';
  patternSelect.appendChild(btn);
}

// ═══ STOP SOS WHEN LEAVING BREATH SCREEN ═══
function hookSOSNavigation() {
  // This hooks into the companion's showScreen override chain
  var currentShow = window.showScreen;
  window.showScreen = function(id) {
    if (sosActive && id !== 'breath') {
      deactivateSOS();
      // Reset to default pattern
      if (typeof B_PATTERNS !== 'undefined') {
        bCurrentPattern = '4-2-6-1';
        B_PHASES = B_PATTERNS['4-2-6-1'].phases;
      }
      // Update pattern buttons
      document.querySelectorAll('.breath-pattern-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.pattern === '4-2-6-1');
      });
    }
    currentShow(id);
  };
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    registerSOSPattern();
    hookSOSIntoPatternSwitch();
    hookSOSHaptics();
    syncSOSOceanToBreath();
    patchCompanionForSOS();
    hookSOSNavigation();

    var origInitBreath = window.initBreathExercise;
    window.initBreathExercise = function() {
      origInitBreath();
      addSOSButton();
      // Restore SOS button state if coming back to breath screen
      if (sosActive) _updateSOSButtonState();
    };

    addSOSButton();
  }, 600);
});
