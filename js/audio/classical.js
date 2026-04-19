/* ═══ js/audio/classical.js ═══
 *
 * Sleep Classical — FM Synthesis Orchestra + Delta Binaural Entrainment
 *
 * Architecture (8 layers):
 *  1. FM Piano         — soft, slow Chopin/Satie-style melodic phrases
 *  2. String Pad       — warm sustained strings (triangle + sawtooth FM)
 *  3. Cello Bass       — deep bowed bass line, root motion
 *  4. Convolution Reverb — large hall space (same IR engine as bowls.js)
 *  5. Delta Binaural   — 2 Hz L/R oscillators for deep sleep entrainment
 *  6. Delta AM         — amplitude-modulated brown noise at 2 Hz (no headphones needed)
 *  7. Rain/Nature      — soft brown noise bed, lower than ocean (sleep context)
 *  8. Sub Rumble       — proprioceptive grounding layer <80 Hz
 *
 * Musical key: D major (restful, warm, classically associated with sleep)
 * Phrases drawn from: Gymnopédie-like intervals, slow Nocturne contour
 *
 * Neurodivergent considerations:
 *  - No sudden dynamic changes — all envelopes are long and smooth
 *  - Melodic phrases are pentatonic-adjacent (low harmonic tension)
 *  - Rain bed masks environmental noise (helpful for auditory sensitivity)
 *  - AM depth lower than alpha (0.50) — gentler pulse for sleep onset
 * ════════════════════════════════════════════════════════════════════════════ */

var classicalOn    = false;
var classicalNodes = null;

// ── D major scale frequencies across 3 octaves (piano range) ─────────────────
// D3=146.8  E3=164.8  F#3=185.0  G3=196.0  A3=220.0  B3=246.9  C#4=277.2  D4=293.7
// D4=293.7  E4=329.6  F#4=370.0  G4=392.0  A4=440.0  B4=493.9  D5=587.3
var CL_BASS  = [73.4,  82.4,  98.0,  110.0, 123.5, 146.8];          // D2–D3
var CL_MID   = [146.8, 185.0, 196.0, 220.0, 246.9, 277.2, 293.7];   // D3–D4
var CL_HIGH  = [293.7, 370.0, 392.0, 440.0, 493.9, 554.4, 587.3];   // D4–D5

// Slow Nocturne-inspired phrase patterns (intervals in semitones from root)
// These create gentle, sleep-inducing melodic contours
var CL_PHRASES = [
  [0, 4, 7, 12, 7, 4],           // D maj arpeggio up and back
  [12, 9, 7, 4, 2, 0],           // descending — falling asleep contour
  [0, 2, 4, 7, 4, 2, 0],         // Satie-like stepwise
  [7, 9, 12, 9, 7, 4, 2],        // arch phrase
  [0, 4, 7, 11, 9, 7],           // maj7 colour
  [12, 7, 4, 0],                 // simple falling
];

// Semitone to freq multiplier
function semitoneRatio(s) { return Math.pow(2, s / 12); }


// ── CONVOLUTION REVERB (large hall) ──────────────────────────────────────────
function createHallReverb(ac) {
  var sr     = ac.sampleRate;
  var decay  = 4.5;   // seconds — long hall
  var len    = Math.floor(sr * decay);
  var buf    = ac.createBuffer(2, len, sr);

  for (var ch = 0; ch < 2; ch++) {
    var d = buf.getChannelData(ch);
    for (var i = 0; i < len; i++) {
      var t    = i / sr;
      var env  = Math.exp(-t * 1.8) * Math.max(0, 1 - t / decay);
      var noise = (Math.random() * 2 - 1);
      // Early reflections (first 80ms) slightly louder
      var early = (t < 0.08) ? 1.4 : 1.0;
      // High-frequency damping over time (room absorption)
      var damp  = Math.exp(-t * 2.5);
      d[i] = noise * env * early * (0.65 + 0.35 * damp);
    }
  }

  var conv = ac.createConvolver();
  conv.buffer = buf;
  return conv;
}


// ── FM PIANO NOTE ─────────────────────────────────────────────────────────────
// Soft piano timbre: carrier + two modulators (even + odd harmonics)
function playPianoNote(ac, dest, freq, amp, duration, now) {
  var softness = 0.015; // attack time — slow = soft, like pressing key gently

  // Carrier
  var car  = ac.createOscillator(); car.type = 'sine';
  car.frequency.value = freq;

  // Modulator 1 — gives piano body (ratio 2:1)
  var mod1     = ac.createOscillator(); mod1.type = 'sine';
  mod1.frequency.value = freq * 2.0;
  var mod1Gain = ac.createGain();
  mod1Gain.gain.setValueAtTime(freq * 1.8, now);
  mod1Gain.gain.exponentialRampToValueAtTime(freq * 0.05, now + duration * 0.7);
  mod1.connect(mod1Gain);
  mod1Gain.connect(car.frequency);

  // Modulator 2 — brightness on attack (ratio 3:1)
  var mod2     = ac.createOscillator(); mod2.type = 'sine';
  mod2.frequency.value = freq * 3.1;
  var mod2Gain = ac.createGain();
  mod2Gain.gain.setValueAtTime(freq * 0.6, now);
  mod2Gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.25);
  mod2.connect(mod2Gain);
  mod2Gain.connect(car.frequency);

  // Amplitude envelope — piano-like: quick attack, long exponential decay
  var env = ac.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(amp, now + softness);
  env.gain.exponentialRampToValueAtTime(amp * 0.3, now + duration * 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Subtle stereo position
  var pan = ac.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 0.5;

  car.connect(env).connect(pan).connect(dest);

  car.start(now);  mod1.start(now);  mod2.start(now);
  car.stop(now + duration + 0.1);
  mod1.stop(now + duration + 0.1);
  mod2.stop(now + duration + 0.1);
}


// ── FM STRING NOTE ────────────────────────────────────────────────────────────
// Bowed string timbre: slow attack, sustained, warm vibrato
function playStringNote(ac, dest, freq, amp, duration, now) {
  var car = ac.createOscillator(); car.type = 'sawtooth';
  car.frequency.value = freq;

  // Vibrato LFO (5.5 Hz, narrow — classical string style)
  var vib  = ac.createOscillator(); vib.type = 'sine';
  vib.frequency.value = 5.5;
  var vibG = ac.createGain(); vibG.gain.value = freq * 0.008; // ±0.8% pitch
  vib.connect(vibG); vibG.connect(car.frequency);

  // Soft lowpass — remove harshness from sawtooth
  var lp = ac.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.value = freq * 3.5; lp.Q.value = 0.5;

  // Bowed envelope: slow attack (100ms), long sustain, slow release
  var env = ac.createGain();
  env.gain.setValueAtTime(0, now);
  env.gain.linearRampToValueAtTime(amp, now + 0.12);
  env.gain.setValueAtTime(amp, now + duration - 0.3);
  env.gain.linearRampToValueAtTime(0, now + duration);

  var pan = ac.createStereoPanner();
  pan.pan.value = (Math.random() - 0.5) * 0.6;

  car.connect(lp).connect(env).connect(pan).connect(dest);
  vib.start(now); car.start(now);
  vib.stop(now + duration + 0.1);
  car.stop(now + duration + 0.1);
}


// ── BUILDER ───────────────────────────────────────────────────────────────────
function buildClassicalAudio() {
  var ac = getAC();

  // ── Master bus ──
  var master = ac.createGain(); master.gain.value = 0;
  master.connect(ac.destination);

  // ── Hall reverb bus ──
  var hall    = createHallReverb(ac);
  var dryG    = ac.createGain(); dryG.gain.value = 0.55;
  var wetG    = ac.createGain(); wetG.gain.value = 0.45;
  master.connect(dryG).connect(ac.destination);
  master.connect(hall); hall.connect(wetG).connect(ac.destination);

  // ── 1. Piano melody ──────────────────────────────────────────────────────
  // Schedules Nocturne-like phrases with long inter-note gaps (sleep tempo)
  var pianoActive = true;
  var pianoRoot   = CL_MID[0]; // D3 = 146.8 Hz

  function schedulePianoPhrase() {
    if (!classicalOn) return;
    var ac2  = getAC();
    var now  = ac2.currentTime;
    var phrase = CL_PHRASES[Math.floor(Math.random() * CL_PHRASES.length)];
    // Very slow — one note every 2.5–5 seconds
    var noteSpacing = 2.5 + Math.random() * 2.5;

    phrase.forEach(function(semi, idx) {
      var t    = now + idx * noteSpacing;
      var freq = pianoRoot * semitoneRatio(semi);
      var amp  = 0.045 + Math.random() * 0.025;
      var dur  = 3.5 + Math.random() * 2.5; // long sustain
      playPianoNote(ac2, master, freq, amp, dur, t);
    });

    // Silence between phrases: 6–14 seconds
    var phraseDur = phrase.length * noteSpacing;
    var silence   = 6000 + Math.random() * 8000;
    classicalNodes.pianoTimer = setTimeout(schedulePianoPhrase, (phraseDur * 1000) + silence);
  }

  // ── 2. String pad — slow chord swells ────────────────────────────────────
  // D major triad sustained underneath, swells every ~20 sec
  var STRING_CHORD = [146.8, 220.0, 293.7, 370.0]; // D3 A3 D4 F#4

  function scheduleStringChord() {
    if (!classicalOn) return;
    var ac2 = getAC();
    var now = ac2.currentTime;
    STRING_CHORD.forEach(function(freq, i) {
      var amp = [0.06, 0.05, 0.04, 0.03][i];
      playStringNote(ac2, master, freq, amp, 14 + Math.random() * 6, now + i * 0.08);
    });
    classicalNodes.stringTimer = setTimeout(scheduleStringChord, 18000 + Math.random() * 8000);
  }

  // ── 3. Cello bass — root + fifth, very slow bowing ───────────────────────
  function scheduleCello() {
    if (!classicalOn) return;
    var ac2  = getAC();
    var now  = ac2.currentTime;
    var note = CL_BASS[Math.floor(Math.random() * 3)]; // D2, E2, or F#2
    playStringNote(ac2, master, note, 0.08, 8 + Math.random() * 4, now);
    classicalNodes.celloTimer = setTimeout(scheduleCello, 10000 + Math.random() * 6000);
  }

  // ── 4. Delta Binaural (2 Hz) — deep sleep entrainment ────────────────────
  var binL = ac.createOscillator(); binL.type = 'sine'; binL.frequency.value = 180;
  var binR = ac.createOscillator(); binR.type = 'sine'; binR.frequency.value = 182; // 2 Hz diff
  var gBL  = ac.createGain(); gBL.gain.value = 0.22;
  var gBR  = ac.createGain(); gBR.gain.value = 0.22;
  var pL   = ac.createStereoPanner(); pL.pan.value = -1;
  var pR   = ac.createStereoPanner(); pR.pan.value =  1;
  binL.connect(gBL).connect(pL).connect(master);
  binR.connect(gBR).connect(pR).connect(master);

  // ── 5. Delta AM — 2 Hz amplitude modulation on noise carrier ─────────────
  var amLFO  = ac.createOscillator(); amLFO.type = 'sine'; amLFO.frequency.value = 2;
  var amMod  = ac.createGain(); amMod.gain.value = 0.25;        // depth: 0.50 * 0.5
  var amDC   = ac.createGain(); amDC.gain.value  = 0.75;        // DC: 1 - 0.50*0.5
  amLFO.connect(amMod); amMod.connect(amDC.gain);
  var amNoise = ac.createBufferSource();
  amNoise.buffer = makeBrownNoise(ac); amNoise.loop = true;
  var amBP   = ac.createBiquadFilter(); amBP.type = 'bandpass';
  amBP.frequency.value = 270; amBP.Q.value = 0.7;
  var amOut  = ac.createGain(); amOut.gain.value = 0.28;
  amNoise.connect(amBP).connect(amDC).connect(amOut).connect(master);

  // ── 6. Rain bed — soft brown noise, sleep texture ─────────────────────────
  var rainSrc = ac.createBufferSource();
  rainSrc.buffer = makeBrownNoise(ac); rainSrc.loop = true;
  var rainG   = ac.createGain(); rainG.gain.value = 0.18;
  var rainLP  = ac.createBiquadFilter(); rainLP.type = 'lowpass';
  rainLP.frequency.value = 400; rainLP.Q.value = 0.5;
  // Very slow spectral drift (0.03 Hz = 33 sec cycle)
  var rainLFO  = ac.createOscillator(); rainLFO.type = 'sine'; rainLFO.frequency.value = 0.03;
  var rainLFOG = ac.createGain(); rainLFOG.gain.value = 90;
  rainLFO.connect(rainLFOG); rainLFOG.connect(rainLP.frequency);
  rainSrc.connect(rainLP).connect(rainG).connect(master);

  // ── 7. Sub rumble — proprioceptive grounding ──────────────────────────────
  var rumbleSrc = ac.createBufferSource();
  rumbleSrc.buffer = makeBrownNoise(ac); rumbleSrc.loop = true;
  var rumbleLP  = ac.createBiquadFilter(); rumbleLP.type = 'lowpass'; rumbleLP.frequency.value = 60;
  var rumbleG   = ac.createGain(); rumbleG.gain.value = 0.07;
  rumbleSrc.connect(rumbleLP).connect(rumbleG).connect(master);

  // ── Start continuous nodes ────────────────────────────────────────────────
  binL.start(); binR.start();
  amLFO.start(); amNoise.start();
  rainSrc.start(); rainLFO.start();
  rumbleSrc.start();

  // ── Start musical schedulers ──────────────────────────────────────────────
  // Small delay before first phrase — let the listener settle into the sound
  var pianoTimer  = setTimeout(schedulePianoPhrase, 1500);
  var stringTimer = setTimeout(scheduleStringChord, 800);
  var celloTimer  = setTimeout(scheduleCello, 3000);

  return {
    master: master,
    pianoTimer: pianoTimer,
    stringTimer: stringTimer,
    celloTimer: celloTimer
  };
}


// ── TOGGLE / START / STOP ─────────────────────────────────────────────────────
function toggleClassicalAudio() {
  if (!classicalOn) {
    if (!localStorage.getItem('binaural_ack_delta')) {
      showBinauralModal(); // reuses the existing delta modal
      // Override the accept button to start classical instead
      setTimeout(function() {
        var btn = document.getElementById('binauralAccept');
        if (btn) {
          var old = btn.cloneNode(true);
          btn.parentNode.replaceChild(old, btn);
          old.addEventListener('click', function() {
            if (document.getElementById('binauralRemember') &&
                document.getElementById('binauralRemember').checked) {
              localStorage.setItem('binaural_ack_delta', '1');
            }
            document.getElementById('binauralModal').style.display = 'none';
            startClassicalAudio();
          });
        }
      }, 50);
      return;
    }
    startClassicalAudio();
  } else {
    stopClassicalAudio();
  }
}

function startClassicalAudio() {
  var ac  = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (!classicalNodes) classicalNodes = buildClassicalAudio();
  classicalNodes.master.gain.linearRampToValueAtTime(0.42, ac.currentTime + 4); // slow fade in
  classicalOn = true;
  if (btn) {
    btn.style.color       = 'rgba(185,140,85,0.95)';   // warm amber — classical colour
    btn.style.borderColor = 'rgba(185,140,85,0.4)';
    btn.style.background  = 'rgba(70,45,20,0.5)';
  }
}

function stopClassicalAudio() {
  var ac  = getAC();
  var btn = document.getElementById('breathAudioBtn');
  if (classicalNodes) {
    classicalNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 3);
    clearTimeout(classicalNodes.pianoTimer);
    clearTimeout(classicalNodes.stringTimer);
    clearTimeout(classicalNodes.celloTimer);
    classicalNodes = null;
  }
  classicalOn = false;
  if (btn) {
    btn.style.color       = 'rgba(168,213,220,0.35)';
    btn.style.borderColor = 'rgba(168,213,220,0.12)';
    btn.style.background  = 'rgba(0,0,0,0.3)';
  }
}
