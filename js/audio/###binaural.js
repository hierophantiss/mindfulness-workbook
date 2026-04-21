/* ═══ js/audio/binaural.js — Professional grade with real ocean MP3s ═══ */
/* Uses: solarmusic-ocean-waves-112906.mp3, kaydream321-ocean-waves-white-noise1-13752.mp3 */

var breathAudioOn = false;
var breathAudioNodes = null;

// Helper: get audio context (assumes window.audioCtx exists from main)
function getAC() { return window.audioCtx || (window.audioCtx = new (window.AudioContext || window.webkitAudioContext)()); }

// Smooth parameter setter
function setParamRamp(param, value, time = 0.2) {
    if (!param) return;
    const now = getAC().currentTime;
    param.cancelScheduledValues(now);
    param.linearRampToValueAtTime(value, now + time);
}

// Create limiter / compressor
function createLimiter(ac, thresholdDb = -3, kneeDb = 6) {
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = thresholdDb;
    comp.knee.value = kneeDb;
    comp.ratio.value = 12;
    comp.attack.value = 0.003;
    comp.release.value = 0.025;
    return comp;
}

// Cross-feed (Blumlein shuffle) for natural binaural perception
function createCrossFeed(ac, inputL, inputR) {
    const dryL = ac.createGain();
    const dryR = ac.createGain();
    const crossGain = ac.createGain();
    crossGain.gain.value = 0.15;
    const delayL = ac.createDelay();
    const delayR = ac.createDelay();
    delayL.delayTime.value = 0.0012;
    delayR.delayTime.value = 0.0012;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    inputL.connect(dryL);
    inputR.connect(dryR);
    inputL.connect(crossGain).connect(filter).connect(delayL).connect(dryR);
    inputR.connect(crossGain).connect(filter).connect(delayR).connect(dryL);
    const outL = ac.createGain();
    const outR = ac.createGain();
    dryL.connect(outL);
    dryR.connect(outR);
    return { left: outL, right: outR };
}

// Binaural layer (left/right oscillators)
function createBinauralLayer(ac, baseFreq, beatFreq, gainVal = 0.3, panOffset = 0) {
    const leftOsc = ac.createOscillator();
    const rightOsc = ac.createOscillator();
    leftOsc.type = 'sine';
    rightOsc.type = 'sine';
    leftOsc.frequency.value = baseFreq;
    rightOsc.frequency.value = baseFreq + beatFreq;
    const leftGain = ac.createGain();
    const rightGain = ac.createGain();
    leftGain.gain.value = gainVal;
    rightGain.gain.value = gainVal;
    const leftPan = ac.createStereoPanner();
    const rightPan = ac.createStereoPanner();
    leftPan.pan.value = -0.8 + panOffset * 0.4;
    rightPan.pan.value = 0.8 + panOffset * 0.4;
    leftOsc.connect(leftGain).connect(leftPan);
    rightOsc.connect(rightGain).connect(rightPan);
    leftOsc.start();
    rightOsc.start();
    return { left: leftPan, right: rightPan, leftOsc, rightOsc, leftGain, rightGain };
}

// Build the full audio graph
function buildBreathAudio() {
    const ac = getAC();
    const master = ac.createGain();
    master.gain.value = 0;

    // Pattern configuration (same as before)
    const beatConfigs = {
        '4-2-6-1': { base: 170, beat: 6, pulse: 6, name: 'Theta' },
        '4-7-8':   { base: 140, beat: 5, pulse: 5, name: 'Theta' },
        '5-5':     { base: 180, beat: 10, pulse: 10, name: 'Alpha' },
        'sleep-delta': { base: 110, beat: 2.5, pulse: 2.5, name: 'Delta' },
        'sleep-classical': { base: 110, beat: 2.5, pulse: 2.5, name: 'Delta' }
    };
    const cfg = beatConfigs[bCurrentPattern] || beatConfigs['5-5'];
    let baseFreq = cfg.base;
    let beatFreq = cfg.beat;

    // Dynamic beat modulation (random walk)
    const beatLFO = ac.createOscillator();
    beatLFO.type = 'sine';
    beatLFO.frequency.value = 0.03;
    const beatMod = ac.createGain();
    beatMod.gain.value = 0.4;
    const beatSum = ac.createConstantSource();
    beatSum.offset.value = beatFreq;
    beatSum.start();
    const finalBeatFreq = ac.createGain();
    beatLFO.connect(beatMod).connect(finalBeatFreq);
    beatSum.connect(finalBeatFreq);
    finalBeatFreq.gain.value = 1;
    beatLFO.start();

    // Multi-layer binaural (low, mid, high)
    const layerLow  = createBinauralLayer(ac, baseFreq * 0.5, beatFreq, 0.15, -0.3);
    const layerMid  = createBinauralLayer(ac, baseFreq,     beatFreq, 0.35,  0);
    const layerHigh = createBinauralLayer(ac, baseFreq * 2, beatFreq, 0.10,  0.3);
    const leftSum = ac.createGain();
    const rightSum = ac.createGain();
    layerLow.left.connect(leftSum); layerLow.right.connect(rightSum);
    layerMid.left.connect(leftSum);  layerMid.right.connect(rightSum);
    layerHigh.left.connect(leftSum); layerHigh.right.connect(rightSum);

    // Cross-feed
    const { left: crossL, right: crossR } = createCrossFeed(ac, leftSum, rightSum);
    crossL.connect(master);
    crossR.connect(master);

    // Pulse modulation (entrainment)
    const pulseLFO = ac.createOscillator();
    pulseLFO.type = 'sine';
    pulseLFO.frequency.value = cfg.pulse;
    const pulseDepth = ac.createGain();
    pulseDepth.gain.value = 0.6;
    const pulseOffset = ac.createConstantSource();
    pulseOffset.offset.value = 0.4;
    pulseOffset.start();
    const pulseGain = ac.createGain();
    pulseLFO.connect(pulseDepth).connect(pulseGain.gain);
    pulseOffset.connect(pulseGain.gain);
    pulseLFO.start();
    const masterPre = ac.createGain();
    master.connect(masterPre);
    masterPre.connect(pulseGain);

    // Limiter
    const limiter = createLimiter(ac, -2, 8);
    pulseGain.connect(limiter);
    limiter.connect(ac.destination);

    // Harmonic pad
    const padGain = ac.createGain();
    padGain.gain.value = 0.06;
    const harmonics = [0.5, 1, 1.5, 2, 3];
    harmonics.forEach((mult, idx) => {
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = baseFreq * mult;
        const g = ac.createGain();
        g.gain.value = [0.4, 0.25, 0.15, 0.08, 0.03][idx];
        osc.connect(g).connect(padGain);
        osc.start();
    });
    padGain.connect(master);

    // ---------- REAL OCEAN MP3s (with fallback) ----------
    const oceanUrls = [
        'solarmusic-ocean-waves-112906.mp3',
        'kaydream321-ocean-waves-white-noise1-13752.mp3'
    ];
    const oceanGain = ac.createGain();
    oceanGain.gain.value = 0.22;
    const oceanFilter = ac.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.value = 400;
    oceanFilter.Q.value = 0.7;
    // LFO for filter sweep
    const oceanLFO = ac.createOscillator();
    oceanLFO.frequency.value = 0.07;
    const oceanLFOAmp = ac.createGain();
    oceanLFOAmp.gain.value = 100;
    oceanLFO.connect(oceanLFOAmp).connect(oceanFilter.frequency);
    oceanLFO.start();
    // Amplitude swell
    const swellLFO = ac.createOscillator();
    swellLFO.frequency.value = 0.12;
    const swellAmp = ac.createGain();
    swellAmp.gain.value = 0.08;
    swellLFO.connect(swellAmp).connect(oceanGain.gain);
    swellLFO.start();

    // We'll create two buffer sources and mix them
    const oceanSrc1 = ac.createBufferSource();
    const oceanSrc2 = ac.createBufferSource();
    oceanSrc1.loop = true;
    oceanSrc2.loop = true;
    let loadedCount = 0;
    function tryStart() {
        if (loadedCount === 2 && oceanSrc1.buffer && oceanSrc2.buffer) {
            oceanSrc1.start();
            oceanSrc2.start();
        }
    }
    function loadOcean(url, srcNode) {
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => ac.decodeAudioData(buf))
            .then(audioBuf => {
                srcNode.buffer = audioBuf;
                loadedCount++;
                tryStart();
            })
            .catch(err => {
                console.warn(`Failed to load ${url}, using brown noise fallback`, err);
                // Fallback: brown noise buffer
                const sampleRate = ac.sampleRate;
                const len = sampleRate * 4;
                const buffer = ac.createBuffer(1, len, sampleRate);
                const data = buffer.getChannelData(0);
                let last = 0;
                for (let i = 0; i < len; i++) {
                    let white = Math.random() * 2 - 1;
                    let brown = (last + 0.02 * white) / 1.02;
                    last = brown;
                    data[i] = brown * 0.6;
                }
                srcNode.buffer = buffer;
                loadedCount++;
                tryStart();
            });
    }
    loadOcean(oceanUrls[0], oceanSrc1);
    loadOcean(oceanUrls[1], oceanSrc2);
    // Mix both sources
    const oceanMix = ac.createGain();
    oceanSrc1.connect(oceanMix);
    oceanSrc2.connect(oceanMix);
    oceanMix.connect(oceanFilter).connect(oceanGain).connect(master);

    // ---------- Wind (gentle pink noise, kept as backup or additional layer) ----------
    const windSrc = ac.createBufferSource();
    // Pink noise generator
    const makePink = () => {
        const sampleRate = ac.sampleRate;
        const len = sampleRate * 6;
        const buffer = ac.createBuffer(1, len, sampleRate);
        const data = buffer.getChannelData(0);
        let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
        for (let i=0; i<len; i++) {
            let white = Math.random()*2-1;
            b0 = 0.99886*b0 + white*0.0555179;
            b1 = 0.99332*b1 + white*0.0750759;
            b2 = 0.96900*b2 + white*0.1538520;
            b3 = 0.86650*b3 + white*0.3104856;
            b4 = 0.55000*b4 + white*0.5329522;
            b5 = -0.7616*b5 - white*0.0168980;
            let pink = b0+b1+b2+b3+b4+b5+b6+white*0.5362;
            b6 = white*0.115926;
            data[i] = pink*0.4;
        }
        return buffer;
    };
    windSrc.buffer = makePink();
    windSrc.loop = true;
    const windGain = ac.createGain();
    windGain.gain.value = 0.07;
    const windHP = ac.createBiquadFilter();
    windHP.type = 'highpass';
    windHP.frequency.value = 600;
    const windBP = ac.createBiquadFilter();
    windBP.type = 'bandpass';
    windBP.frequency.value = 1800;
    windBP.Q.value = 1.2;
    const windLFO = ac.createOscillator();
    windLFO.frequency.value = 0.04;
    const windMod = ac.createGain();
    windMod.gain.value = 400;
    windLFO.connect(windMod).connect(windBP.frequency);
    windLFO.start();
    windSrc.connect(windHP).connect(windBP).connect(windGain).connect(master);
    windSrc.start();

    // Classical placeholder (unused)
    const classicalGain = ac.createGain();
    classicalGain.gain.value = 0;
    classicalGain.connect(master);

    // Sidechain ducking: pulseGain modulates ocean + wind gain
    // We'll create a ducking amount that follows the pulse envelope
    const duckAmount = ac.createGain();
    duckAmount.gain.value = 1;
    // Invert pulse? Actually we want background to dip when pulse is high.
    // Simpler: use a second gain node after oceanGain and windGain that is inversely modulated.
    const oceanDuck = ac.createGain();
    const windDuck = ac.createGain();
    oceanGain.connect(oceanDuck);
    windGain.connect(windDuck);
    oceanDuck.connect(master);
    windDuck.connect(master);
    // Create inverse modulation: pulseGain.gain (0.4 to 1.0) -> we want duck gain = 1 - (pulse-0.4)*0.6 roughly
    const duckControl = ac.createGain();
    const duckOffset = ac.createConstantSource();
    duckOffset.offset.value = 1;
    duckOffset.start();
    const duckInv = ac.createGain();
    duckInv.gain.value = -0.8; // negative scale
    pulseGain.gain.connect(duckInv);
    duckInv.connect(duckControl);
    duckOffset.connect(duckControl);
    duckControl.connect(oceanDuck.gain);
    duckControl.connect(windDuck.gain);
    // Clamp between 0.5 and 1.0
    oceanDuck.gain.value = 1;
    windDuck.gain.value = 1;

    // Return controls
    return {
        master: master,
        masterPre: masterPre,
        pulseGain: pulseGain,
        oceanGain: oceanGain,
        windGain: windGain,
        oceanDuck: oceanDuck,
        windDuck: windDuck,
        layerLow, layerMid, layerHigh,
        finalBeatFreq, beatLFO,
        oceanFilter, windBP,
        cfg
    };
}

// Public functions (identical interface)
function startBreathAudio() {
    const ac = getAC();
    if (ac.state === 'suspended') ac.resume();
    const btn = document.getElementById('breathAudioBtn');
    if (!breathAudioNodes) breathAudioNodes = buildBreathAudio();
    setParamRamp(breathAudioNodes.master.gain, 0.45, 6);
    breathAudioOn = true;
    window.breathAudioOn = true;
    if (btn) btn.setAttribute('aria-pressed', 'true');
    if (typeof bUpdateMainControls === 'function') bUpdateMainControls();
    if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
}

function stopBreathAudio() {
    if (!breathAudioOn || !breathAudioNodes) return;
    const ac = getAC();
    const btn = document.getElementById('breathAudioBtn');
    setParamRamp(breathAudioNodes.master.gain, 0, 5);
    breathAudioOn = false;
    window.breathAudioOn = false;
    setTimeout(() => {
        try {
            if (breathAudioNodes && breathAudioNodes.master) {
                breathAudioNodes.master.disconnect();
            }
        } catch(e) {}
        breathAudioNodes = null;
        if (typeof bUpdateMainControls === 'function') bUpdateMainControls();
        if (typeof updateHeroBtnUI === 'function') updateHeroBtnUI();
    }, 5000);
    if (btn) btn.setAttribute('aria-pressed', 'false');
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

// Modal (same as before but improved text)
function showBinauralModal() {
    if (document.getElementById('binauralModal')) return;
    const isEl = (typeof LANG !== 'undefined' && LANG === 'el');
    const isSleep = (bCurrentPattern === 'sleep-delta' || bCurrentPattern === 'sleep-classical');
    const isFocus = (bCurrentPattern === '5-5');
    let beatType = isSleep ? 'Delta' : (isFocus ? 'Alpha' : 'Theta');
    let beatDesc = isEl ? 
        (isSleep ? 'Προάγει βαθύ ύπνο με ήχους ωκεανού.' : (isFocus ? 'Ήρεμη εστίαση, μείωση υπερδιέγερσης.' : 'Χαλάρωση και συναισθηματική ρύθμιση.')) :
        (isSleep ? 'Promotes deep sleep with ocean sounds.' : (isFocus ? 'Calm focus, reduces overstimulation.' : 'Relaxation & emotional regulation.'));
    const modal = document.createElement('div');
    modal.id = 'binauralModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:300;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);';
    modal.innerHTML = `
        <div style="max-width:360px;background:#0f151c;border-radius:24px;padding:28px;text-align:center;font-family:system-ui,-apple-system,sans-serif;border:1px solid #2c3e40;">
            <div style="font-size:48px;margin-bottom:12px;">🎧🧠</div>
            <h2 style="font-size:22px;color:#7fcdcd;margin-bottom:12px;">${beatType} Binaural Beats</h2>
            <p style="font-size:14px;color:#b0bec5;margin-bottom:20px;">${beatDesc}</p>
            <div style="background:#1a242c;border-radius:16px;padding:14px;margin-bottom:20px;text-align:left;">
                <p style="color:#ffb74d;font-size:13px;margin-bottom:8px;">⚠️ ${isEl ? 'Σημαντικό' : 'Important'}</p>
                <ul style="font-size:12px;color:#90a4ae;margin:0;padding-left:18px;">
                    <li>${isEl ? 'Χρησιμοποιήστε ακουστικά' : 'Use headphones'}</li>
                    <li>${isEl ? 'Χαμηλή ένταση προτείνεται' : 'Low volume recommended'}</li>
                    <li>${isEl ? 'Δεν προορίζεται για άτομα με επιληψία' : 'Not intended for epilepsy'}</li>
                </ul>
            </div>
            <button id="binauralAccept" style="background:#2a6b6e;color:white;border:none;padding:14px;border-radius:40px;width:100%;font-weight:bold;cursor:pointer;">${isEl ? 'Κατάλαβα, ξεκίνα' : 'I understand, start'}</button>
            <button id="binauralCancel" style="background:transparent;color:#7f8c8d;border:none;margin-top:12px;cursor:pointer;">${isEl ? 'Ακύρωση' : 'Cancel'}</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('binauralAccept').onclick = () => {
        localStorage.setItem('binaural_ack', 'true');
        modal.remove();
        startBreathAudio();
    };
    document.getElementById('binauralCancel').onclick = () => modal.remove();
}

// Preserve existing hooks (bUpdatePhase, showScreen)
const _origBUpdatePhase = window.bUpdatePhase || function(){};
window.bUpdatePhase = function(now) {
    _origBUpdatePhase(now);
    if (breathAudioOn && breathAudioNodes && window.audioCtx) {
        let target = 0.12 + (typeof bArmPos !== 'undefined' ? bArmPos * 0.25 : 0.2);
        setParamRamp(breathAudioNodes.oceanGain.gain, target, 0.3);
        if (breathAudioNodes.pulseGain && breathAudioNodes.pulseGain.gain) {
            let pulseTarget = 0.5 + (typeof bArmPos !== 'undefined' ? bArmPos * 0.4 : 0.6);
            setParamRamp(breathAudioNodes.pulseGain.gain, pulseTarget, 0.5);
        }
    }
};

const _origShowScreen = window.showScreen || function(id){};
window.showScreen = function(id) {
    if (breathAudioOn && id !== 'breath' && id !== 'home') stopBreathAudio();
    _origShowScreen(id);
};
