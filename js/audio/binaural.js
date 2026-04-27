/* ═══ js/audio/binaural.js ═══ */
// ═══ 2. BREATH SCREEN AUDIO (Binaural + Ocean + Wind) ═══
var breathAudioOn = false;
var breathAudioNodes = null;

async function buildBreathAudio() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;

  // Spatial Panner for movement
  var panner = ac.createStereoPanner();
  applySpatialMovement({ ac: ac }, panner, 0.08);
  // 2. Master Limiter (Professional Finish)
  var limiter = createLimiter(ac);
  
  master.connect(panner);
  panner.connect(limiter).connect(ac.destination);

  // Binaural Beat Configurations
  // Theta (4-8Hz) -> Relaxation, Mindfulness, SOS -> Fireplace
  // Alpha (8-13Hz) -> Focus, Sharp Presence -> Waterfall
  // Delta (0.5-4Hz) -> Deep Sleep -> Ocean Waves
  var beatConfigs = {
    '4-2-6-1': { base: 180, beat: 6, pulse: 6, layer: 'fireplace.mp3' },
    '4-7-8': { base: 140, beat: 5, pulse: 5, layer: 'fireplace.mp3' },
    '5-5': { base: 180, beat: 10, pulse: 10, layer: 'waterfall.mp3' },
    'sleep-delta': { base: 110, beat: 2.5, pulse: 2.5, layer: 'oceanwaves.mp3' },
    'sleep-classical': { base: 110, beat: 2.5, pulse: 2.5, layer: 'oceanwaves.mp3' } 
  };
  var config = beatConfigs[bCurrentPattern] || { base: 160, beat: 10, pulse: 10, layer: 'waterfall.mp3' };
  var baseF = config.base;
  var beatF = config.beat;

  // Track the HQ Layer
  var hqLayer = null;
  if (config.layer) {
    try {
      const buffer = await loadAudioFile('js/audio/' + config.layer);
      if (buffer && breathAudioOn) {
        hqLayer = createAudioLayer(ac, buffer, 0); // Start at 0 gain
        hqLayer.src.connect(hqLayer.gain).connect(master);
        hqLayer.src.start();
        // Fade in HQ layer
        hqLayer.gain.gain.setValueAtTime(0, ac.currentTime);
        hqLayer.gain.gain.linearRampToValueAtTime(0.4, ac.currentTime + 4);
      }
    } catch (e) {
      console.warn("Failed to load nature layer:", config.layer, e);
    }
  }

  // Neural Entrainment Volume Modulation
  var pulse = createPulse(ac, config.pulse);
  var pulseGain = ac.createGain();
  pulseGain.gain.value = 1.0;
  pulse.connect(pulseGain.gain);
  master.disconnect(); // re-route
  master.connect(pulseGain);
  pulseGain.connect(panner);

  var binL = ac.createOscillator(); binL.type = 'sine'; binL.frequency.value = baseF;
  var gL = ac.createGain(); gL.gain.value = 0.4;
  var pL = ac.createStereoPanner(); pL.pan.value = -1;
  binL.connect(gL).connect(pL).connect(master);

  var binR = ac.createOscillator(); binR.type = 'sine'; binR.frequency.value = baseF + beatF;
  var gR = ac.createGain(); gR.gain.value = 0.4;
  var pR = ac.createStereoPanner(); pR.pan.value = 1;
  binR.connect(gR).connect(pR).connect(master);

  // Deep Harmonic Pad
  var padG = ac.createGain(); padG.gain.value = 0.08;
  [baseF*0.5, baseF*1.5, baseF*2, baseF*3].forEach(function(f, i) {
    var o = ac.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var g = ac.createGain(); g.gain.value = [0.5, 0.25, 0.15, 0.05][i] || 0.02;
    o.connect(g).connect(padG); o.start();
  });
  padG.connect(master);
  
  // Conditionally add Classical Music
  var classicalG = ac.createGain(); classicalG.gain.value = 0;
  classicalG.connect(master);

  // Improved Ocean waves (brown noise, low-passed + very slow LFO)
  var oceanSrc = ac.createBufferSource();
  oceanSrc.buffer = makeBrownNoise(ac); oceanSrc.loop = true;
  var oceanG = ac.createGain(); oceanG.gain.value = 0.25;
  var oceanLP = ac.createBiquadFilter(); oceanLP.type = 'lowpass'; oceanLP.frequency.value = 450; oceanLP.Q.value = 0.5;
  
  // Wave movement LFO
  var waveLFO = ac.createOscillator(); waveLFO.frequency.value = 0.05; 
  var waveDepth = ac.createGain(); waveDepth.gain.value = 150;
  waveLFO.connect(waveDepth).connect(oceanLP.frequency);
  waveLFO.start();

  oceanSrc.connect(oceanLP).connect(oceanG).connect(master);

  // Wind (pink noise, band-passed with movement)
  var windSrc = ac.createBufferSource();
  windSrc.buffer = makePinkNoise(ac); windSrc.loop = true;
  var windG = ac.createGain(); windG.gain.value = 0.08;
  var windHP = ac.createBiquadFilter(); windHP.type = 'highpass'; windHP.frequency.value = 700;
  var windLP = ac.createBiquadFilter(); windLP.type = 'lowpass'; windLP.frequency.value = 2500;
  
  var windLFO = ac.createOscillator(); windLFO.frequency.value = 0.03;
  var windDepth = ac.createGain(); windDepth.gain.value = 500;
  windLFO.connect(windDepth).connect(windLP.frequency);
  windLFO.start();

  windSrc.connect(windHP).connect(windLP).connect(windG).connect(master);

  binL.start(); binR.start(); oceanSrc.start(); windSrc.start();

  return { master: master, oceanG: oceanG, panner: panner, hqLayer: hqLayer };
}

async function toggleBreathAudio() {
  if (!breathAudioOn) {
    if (!localStorage.getItem('binaural_ack')) {
      showBinauralModal();
      return;
    }
    await startBreathAudio();
  } else {
    stopBreathAudio();
  }
}

async function startBreathAudio() {
  var ac = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (!breathAudioNodes) breathAudioNodes = await buildBreathAudio();
  breathAudioNodes.master.gain.linearRampToValueAtTime(0.45, ac.currentTime + 3);
  breathAudioOn = true;
  if (typeof window !== 'undefined') window.breathAudioOn = true;
  if (btn) btn.setAttribute('aria-pressed', 'true');
  if (typeof bUpdateMainControls === 'function') bUpdateMainControls();
  if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
}

function stopBreathAudio() {
  if (!breathAudioOn || !breathAudioNodes) return;
  var ac = getAC();
  var btn = document.getElementById('breathAudioBtn');
  breathAudioNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 1.2);
  
  // Set to false immediately so UI reacts
  breathAudioOn = false;
  if (typeof window !== 'undefined') window.breathAudioOn = false;

  setTimeout(function() {
    try { 
      if (breathAudioNodes) {
        if (breathAudioNodes.hqLayer && breathAudioNodes.hqLayer.src) {
          breathAudioNodes.hqLayer.src.stop();
        }
        if (breathAudioNodes.master) {
          breathAudioNodes.master.disconnect();
        }
      }
    } catch(e) {}
    breathAudioNodes = null;
    if (typeof bUpdateMainControls === 'function') bUpdateMainControls();
    if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
  }, 1200);

  if (btn) btn.setAttribute('aria-pressed', 'false');
  if (typeof bUpdateMainControls === 'function') bUpdateMainControls();
  if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
}

function showBinauralModal() {
  var existing = document.getElementById('binauralModal');
  if (existing) { existing.remove(); } // Fix: Remove old modal to refresh content for different patterns
  var isEl = LANG === 'el';
  var isSleep = bCurrentPattern === 'sleep-delta' || bCurrentPattern === 'sleep-classical';
  var isFocus = bCurrentPattern === '5-5';
  
  var beatType = isSleep ? 'Delta' : (isFocus ? 'Alpha' : 'Theta');
  var beatRange = isSleep ? ' (0.5-4 Hz)' : (isFocus ? ' (8-12 Hz)' : ' (4-8 Hz)');
  var beatPurpose = isSleep ? t('bpDeltaSub') : (isFocus ? t('bp55Sub') : t('bp4261Sub'));

  var beatDesc = '';
  if (isSleep) {
    beatDesc = isEl 
      ? 'Τα binaural beats στέλνουν διαφορετική συχνότητα σε κάθε αυτί, δημιουργώντας ήχο στη ζώνη Delta' + beatRange + ' που ενισχύει τον βαθύ ύπνο.' 
      : 'Binaural beats send a different frequency to each ear, creating a tone in the Delta range' + beatRange + ' that promotes deep sleep.';
  } else if (isFocus) {
    beatDesc = isEl 
      ? 'Τα binaural beats στέλνουν διαφορετική συχνότητα σε κάθε αυτί, δημιουργώντας ήχο στη ζώνη Alpha' + beatRange + ' που ενισχύει την ήρεμη εστίαση και εγρήγορση.' 
      : 'Binaural beats send a different frequency to each ear, creating a tone in the Alpha range' + beatRange + ' that promotes calm focus and alertness.';
  } else {
    beatDesc = isEl 
      ? 'Τα binaural beats στέλνουν διαφορετική συχνότητα σε κάθε αυτί, δημιουργώντας ήχο στη ζώνη Theta' + beatRange + ' που ενισχύει τη χαλάρωση και την ενσυνειδητότητα.' 
      : 'Binaural beats send a different frequency to each ear, creating a tone in the Theta range' + beatRange + ' that promotes relaxation and mindfulness.';
  }

  var modal = document.createElement('div');
  modal.id = 'binauralModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease';
  modal.innerHTML = '<div style="max-width:380px;width:100%;background:#111820;border:1px solid #1e2a34;border-radius:16px;padding:28px 24px;text-align:center;font-family:inherit">'
    + '<div style="font-size:40px;margin-bottom:16px">🎧</div>'
    + '<h2 style="font-family:inherit;font-size:22px;color:#5cbcbf;margin-bottom:12px;font-weight:600">' + beatType + ' (' + beatPurpose + ')</h2>'
    + '<p style="font-size:14px;color:#9aa4aa;line-height:1.7;margin-bottom:16px">' + beatDesc + '</p>'
    + '<div style="background:rgba(200,146,42,0.1);border:1px solid rgba(200,146,42,0.25);border-radius:10px;padding:14px;margin-bottom:16px;text-align:left">'
    + '<p style="font-size:13px;color:#c8922a;line-height:1.6;margin-bottom:8px;font-weight:600">' + (isEl ? '⚠️ Σημαντική ενημέρωση:' : '⚠️ Important notice:') + '</p>'
    + '<ul style="font-size:12px;color:#9a938c;line-height:1.7;padding-left:16px;margin:0"><li>' + (isEl ? 'Απαιτούνται <strong>ακουστικά</strong> για σωστή λειτουργία' : '<strong>Headphones</strong> required for proper function') + '</li><li>' + (isEl ? 'Αν έχετε επιληψία, συμβουλευτείτε γιατρό' : 'If you have epilepsy, consult a doctor') + '</li></ul>'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:20px;justify-content:center;cursor:pointer" id="binauralRememberWrapper">'
    + '<input type="checkbox" id="binauralRemember" style="accent-color:#2a6b6e;width:16px;height:16px;cursor:pointer">'
    + '<label for="binauralRemember" style="font-size:13px;color:#9aa4aa;cursor:pointer">' + (isEl ? 'Να μην εμφανιστεί ξανά' : "Don't show this again") + '</label>'
    + '</div>'
    + '<div style="display:flex;gap:10px;flex-direction:column">'
    + '<button id="binauralAccept" style="background:#2a6b6e;color:white;border:none;padding:14px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">🎧 ' + (isEl ? 'Κατάλαβα — Ξεκίνα' : 'I Understood — Start') + '</button>'
    + '<button id="binauralCancel" style="background:transparent;color:#9aa4aa;border:1px solid #1e2a34;padding:12px;border-radius:10px;font-size:13px;cursor:pointer">' + (isEl ? 'Ακύρωση' : 'Cancel') + '</button>'
    + '</div></div>';
  document.body.appendChild(modal);
  
  document.getElementById('binauralRememberWrapper').onclick = function(e) {
    if (e.target.id !== 'binauralRemember') {
      var cb = document.getElementById('binauralRemember');
      cb.checked = !cb.checked;
    }
  };

  document.getElementById('binauralAccept').addEventListener('click', async function() { 
    if (document.getElementById('binauralRemember').checked) {
      localStorage.setItem('binaural_ack', 'true');
    }
    modal.style.display = 'none'; 
    await startBreathAudio(); 
  });
  document.getElementById('binauralCancel').addEventListener('click', function() { modal.style.display = 'none'; });
}

window.toggleBreathAudio = toggleBreathAudio;
window.startBreathAudio = startBreathAudio;
window.stopBreathAudio = stopBreathAudio;
window.breathAudioOn = breathAudioOn;

var _origBUpdatePhase = window.bUpdatePhase;
window.bUpdatePhase = function(now) {
  if (typeof _origBUpdatePhase === 'function') _origBUpdatePhase(now);
  if (breathAudioOn && breathAudioNodes && audioCtx) {
    if (typeof bArmPos !== 'undefined') {
        var target = 0.1 + bArmPos * 0.3;
        breathAudioNodes.oceanG.gain.linearRampToValueAtTime(target, audioCtx.currentTime + 0.2);
    }
  }
};
var _origShowScreen = window.showScreen;
window.showScreen = function(id) {
  if (breathAudioOn && id !== 'breath' && id !== 'home') stopBreathAudio();
  if (typeof _origShowScreen === 'function') _origShowScreen(id);
};
