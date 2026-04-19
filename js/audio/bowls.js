/* ═══ js/audio/bowls.js ═══ */
// ═══ 1. TIBETAN SINGING BOWLS (FM synthesis + convolution reverb + LFO) ═══

var bowlsOn = false;
var bowlNodes = null;
var bowlInterval = null;

// Βοηθητική συνάρτηση για convolution reverb (συνθετική κρουστική απόκριση)
function createConvolutionReverb(ac, decay = 2.5, damp = 0.5) {
  var sampleRate = ac.sampleRate;
  var length = Math.floor(sampleRate * decay);
  var impulse = ac.createBuffer(2, length, sampleRate);
  var left = impulse.getChannelData(0);
  var right = impulse.getChannelData(1);
  
  for (var i = 0; i < length; i++) {
    var t = i / sampleRate;
    // Εκθετική φθίνουσα κρουστική + θόρυβος για πλούσιο reverb
    var envelope = Math.exp(-t * 3) * (1 - t/decay);
    var noise = (Math.random() * 2 - 1) * 0.15;
    var val = (Math.sin(2 * Math.PI * 120 * t) * 0.3 + noise) * envelope;
    // Damping: low-pass filter απλό (μείωση υψηλών συχνοτήτων με τον χρόνο)
    var dampFactor = Math.exp(-t * damp * 5);
    left[i] = val * (0.7 + 0.3 * dampFactor);
    right[i] = val * (0.7 + 0.3 * dampFactor);
  }
  
  var convolver = ac.createConvolver();
  convolver.buffer = impulse;
  return convolver;
}

function buildBowls() {
  var ac = getAC();
  var master = ac.createGain();
  master.gain.value = 0;

  // Convolution reverb (πολυτελές, βαθύ)
  var reverb = createConvolutionReverb(ac, 3.2, 0.6);
  var dryGain = ac.createGain();
  var wetGain = ac.createGain();
  dryGain.gain.value = 0.6;
  wetGain.gain.value = 0.4;
  
  master.connect(dryGain).connect(ac.destination);
  master.connect(reverb);
  reverb.connect(wetGain).connect(ac.destination);
  
  return { master: master, ac: ac, reverb: reverb };
}

// Συχνότητες bowls + παραμέτρους FM
var BOWL_FREQS = [
  { f: 110,   ratio: 2.4,  index: 3.2, harmonics: [1, 2.76, 4.72] },   // Large
  { f: 164,   ratio: 2.7,  index: 2.9, harmonics: [1, 2.71, 4.58] },   // Medium
  { f: 220,   ratio: 2.2,  index: 3.5, harmonics: [1, 2.83, 4.95] },   // Small
  { f: 293,   ratio: 2.9,  index: 2.7, harmonics: [1, 2.68, 5.12] },   // Tiny
  { f: 146.8, ratio: 2.5,  index: 3.0, harmonics: [1, 2.72, 4.81] },   // Medium-low
];

function strikeOneBowl(nodes) {
  var ac = nodes.ac;
  var now = ac.currentTime;
  
  // Τυχαίο bowl
  var bowl = BOWL_FREQS[Math.floor(Math.random() * BOWL_FREQS.length)];
  var baseFreq = bowl.f;
  var ratio = bowl.ratio * (0.98 + Math.random() * 0.04);
  var fmIndex = bowl.index * (0.8 + Math.random() * 0.6);
  
  // Δημιουργούμε 3 φωνές (harmonics) με δική τους FM
  bowl.harmonics.forEach(function(h, i) {
    // Φορέας
    var carrier = ac.createOscillator();
    carrier.type = 'sine';
    var carrierFreq = baseFreq * h;
    carrier.frequency.value = carrierFreq;
    
    // Διαμόρφωση FM (modulator)
    var modulator = ac.createOscillator();
    modulator.type = 'sine';
    var modFreq = carrierFreq * ratio;
    modulator.frequency.value = modFreq;
    
    var modGain = ac.createGain();
    // Το index μειώνεται εκθετικά με τον χρόνο (πλούσιο attack, μετά πιο καθαρό)
    var initialIndex = fmIndex * (1 / (i+1)) * (0.7 + Math.random() * 0.6);
    modGain.gain.setValueAtTime(initialIndex * carrierFreq, now);
    modGain.gain.exponentialRampToValueAtTime(0.01 * carrierFreq, now + 4);
    
    modulator.connect(modGain);
    modGain.connect(carrier.frequency);
    
    // Amplitude envelope
    var env = ac.createGain();
    var amp = [0.4, 0.18, 0.08][i] || 0.04;
    var decay = [7, 5, 3.5][i] || 2.5;
    amp *= 0.7 + Math.random() * 0.6;
    decay *= 0.8 + Math.random() * 0.4;
    
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(amp, now + 0.008);
    env.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    
    // LFO για μικρο-δονήσεις συχνότητας (ζωντάνια)
    var lfo = ac.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 3.2 + Math.random() * 1.5;
    var lfoGain = ac.createGain();
    lfoGain.gain.value = 1.2;
    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency);

    // Stereo positioning — each harmonic in a different space
    // Fundamental (i=0) centered, overtones spread outward
    var pan = ac.createStereoPanner();
    pan.pan.value = i === 0 ? (Math.random() - 0.5) * 0.3
                            : (Math.random() - 0.5) * 0.85;

    carrier.connect(env).connect(pan).connect(nodes.master);
    carrier.start(now);
    carrier.stop(now + decay + 0.5);
    modulator.start(now);
    modulator.stop(now + decay + 0.5);
    lfo.start(now);
    lfo.stop(now + decay + 0.5);
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
    bowlNodes.master.gain.linearRampToValueAtTime(0.65, ac.currentTime + 2);
    bowlsOn = true;
    if (btn) btn.classList.add('active');
    if (icon) icon.textContent = '🔔';
    
    // Πρώτο χτύπημα αμέσως
    strikeOneBowl(bowlNodes);
    
    // Επόμενα χτυπήματα με τυχαία απόσταση 5-12 δευτ.
    function scheduleBowl() {
      if (!bowlsOn) return;
      var delay = 5000 + Math.random() * 7000;
      bowlInterval = setTimeout(function() {
        bowlLoop();
        scheduleBowl();
      }, delay);
    }
    scheduleBowl();
  } else {
    bowlsOn = false;
    if (bowlNodes) bowlNodes.master.gain.linearRampToValueAtTime(0, ac.currentTime + 2.5);
    if (btn) btn.classList.remove('active');
    if (icon) icon.textContent = '🔇';
    if (bowlInterval) { clearTimeout(bowlInterval); bowlInterval = null; }
  }
}

// Για συμβατότητα
function toggleAmbient() { toggleBowls(); }