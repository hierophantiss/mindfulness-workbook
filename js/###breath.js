/* ═══ js/breath.js ═══ */
// js/breath.js
/* ═══ breath.js — Breathing Engine ═══ */
const B_PATTERNS = {
  '4-2-6-1': {
    name_el: 'Τετραπλός Άξονας 4-2-6-1', name_en: 'Fourfold Axis 4-2-6-1',
    purpose_el: 'Γείωση & Παρουσία', purpose_en: 'Grounding & Presence',
    desc_el: 'Αργή εκπνοή, ενεργοποίηση πνευμονογαστρικού — Gerritsen & Band (2018)',
    desc_en: 'Slow exhale, vagus nerve activation — Gerritsen & Band (2018)',
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 2000, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 6000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 1000, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  },
  '4-7-8': {
    name_el: 'Ηρεμία 4-7-8', name_en: 'Calming 4-7-8',
    purpose_el: 'Βαθιά Ηρεμία & Ύπνος', purpose_en: 'Deep Calm & Sleep',
    desc_el: 'Η μέθοδος Dr. Andrew Weil — βαθιά χαλάρωση νευρικού συστήματος',
    desc_en: 'Dr. Andrew Weil method — deep nervous system relaxation',
    phases: [
      { dur: 4000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 7000, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 8000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 1000, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  },
  '5-5': {
    name_el: 'Συνοχή 5-5', name_en: 'Coherence 5-5',
    purpose_el: 'Εστίαση & Ισορροπία', purpose_en: 'Focus & Balance',
    desc_el: 'Καρδιακή συνοχή — McCraty et al. (2009) HeartMath Institute',
    desc_en: 'Cardiac coherence — McCraty et al. (2009) HeartMath Institute',
    phases: [
      { dur: 5000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 500, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 5000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 500, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  },
  'sleep-delta': {
    name_el: 'Ύπνος Δέλτα', name_en: 'Sleep Delta',
    purpose_el: 'Βαθιά Χαλάρωση & Ύπνος', purpose_en: 'Deep Relaxation & Sleep',
    desc_el: 'Binaural Δέλτα συχνότητα (2Hz) & Ήχοι Φύσης',
    desc_en: 'Binaural Delta frequency (2Hz) & Nature Sounds',
    phases: [
      { dur: 8000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 2000, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 10000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 2000, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  },
  'sleep-classical': {
    name_el: 'Ύπνος Κλασική', name_en: 'Sleep Classical',
    purpose_el: 'Ύπνος με Κλασική Μουσική', purpose_en: 'Sleep with Classical Music',
    desc_el: 'Κλασική Μουσική, Binaural Δέλτα & Ήχοι Φύσης',
    desc_en: 'Classical Music, Binaural Delta & Nature Sounds',
    phases: [
      { dur: 8000, armFrom: 0, armTo: 1, labelKey: 0 },
      { dur: 2000, armFrom: 1, armTo: 1, labelKey: 1 },
      { dur: 10000, armFrom: 1, armTo: 0, labelKey: 2 },
      { dur: 2000, armFrom: 0, armTo: 0, labelKey: 3 }
    ]
  }
};
var bCurrentPattern = '4-2-6-1';
var B_PHASES = B_PATTERNS[bCurrentPattern].phases;
const B_PHASE_LABELS = {
  el: [
    { label: "Εισπνοή", sub: "σήκωσε τα χέρια αργά" },
    { label: "Παύση",   sub: "κράτα ψηλά" },
    { label: "Εκπνοή",  sub: "κατέβασε αργά" },
    { label: "Παύση",   sub: "νιώσε το βάρος" }
  ],
  en: [
    { label: "Inhale", sub: "raise arms slowly" },
    { label: "Hold",   sub: "hold up" },
    { label: "Exhale", sub: "lower arms slowly" },
    { label: "Hold",   sub: "feel the weight" }
  ]
};
const B_CUES = {
  el: ["νιώσε το βάρος σου","συγκέντρωσε το βλέμμα","η γη σε κρατά","άνοιξε την αντίληψη","αφέσου στον ρυθμό","εδώ, τώρα","η αναπνοή ρέει μόνη της","το σώμα ξέρει τον ρυθμό"],
  en: ["feel your weight","soften your gaze","earth holds you","open awareness","surrender to rhythm","here, now","breath flows by itself","body knows the rhythm"]
};
const B_UI_TEXT = {
  el: { play:'▶ Ξεκίνα', pause:'⏸ Παύση', reset:'↺ Επαναφορά', timer:'Χρόνος', cycles:'Κύκλοι', total:'Σύνολο', today:'Σήμερα', streak:'Ημ. Φροντίδας', min:'Λεπτά' },
  en: { play:'▶ Start', pause:'⏸ Pause', reset:'↺ Reset', timer:'Time', cycles:'Cycles', total:'Total', today:'Today', streak:'Care Days', min:'Minutes' }
};

let bRunning = false, bPhaseIdx = 0, bPhaseStart = 0, bArmPos = 0;
let bCycles = 0, bSeconds = 0, bLastTs = 0, bAnimId = null;
let bCues = [], bLastCueTime = 0, bTime = 0;
let bLastCountSec = -1;
let bCanvas, bCtx, bInited = false;

function bEase(x) { return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2,3)/2; }

// ══════════════════════════════════════════════
// METRONOME TICKER — Web Audio based rhythmic feedback
// Replaces voice coach as requested by user.
// ══════════════════════════════════════════════
var bVoiceEnabled = false; // Still using this var name for logic compatibility

function bTick(isPhaseStart, count) {
  if (!bVoiceEnabled) return;
  try {
    const ac = typeof getAC === 'function' ? getAC() : null;
    if (!ac) return;
    
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    
    // Different pitch for phase start vs regular count
    osc.frequency.value = isPhaseStart ? 880 : 440; 
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.08, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    
    osc.connect(gain).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.1);
  } catch(e) {}
}

// Phase name spoken at the start of each phase (uses phase.labelKey index)
// Index: 0=Inhale, 1=Hold, 2=Exhale, 3=Rest
function bVoicePhaseStart(phaseIdx) {
  bTick(true, 1);
}

// Called each second during a phase — speaks the current count
function bVoiceCount(phaseIdx, secondIndex, totalSecs) {
  if (secondIndex === 0) return; // Already handled by bVoicePhaseStart
  bTick(false, secondIndex + 1);
}

// Toggle ticker on/off. Called by the UI button.
function toggleBreathVoice() {
  bVoiceEnabled = !bVoiceEnabled;
  try { localStorage.setItem('breath_voice_enabled', bVoiceEnabled ? '1' : '0'); } catch(e){}
  if (typeof tapFeedback === 'function') tapFeedback();
  bUpdateVoiceBtn();
  
  // First-time explanation hint
  if (bVoiceEnabled && !localStorage.getItem('metronome_hint_seen')) {
    localStorage.setItem('metronome_hint_seen', '1');
    const msg = LANG === 'el' 
      ? 'Μετρονόμος: Ένας ήσυχος ρυθμός "Τικ-Τακ" για να σε βοηθά να μετράς χωρίς να κοιτάς την οθόνη.' 
      : 'Metronome: A soft "Tick-Tock" rhythm to help you count without looking at the screen.';
    showToast(msg, 5000);
  }
}

function bUpdateVoiceBtn() {
  var btn = document.getElementById('breathVoiceBtn');
  if (!btn) return;
  // Use a metronome/timer icon or rhythmic bars
  btn.textContent = bVoiceEnabled ? '⏲️' : '⏱️';
  btn.setAttribute('aria-pressed', bVoiceEnabled ? 'true' : 'false');
  btn.title = LANG === 'el' ? 'Μετρονόμος (Τικ-Τακ)' : 'Metronome Ticker';
}

// Session history
function bLoadHist() { try { return JSON.parse(localStorage.getItem('breath_history')) || {sessions:[],totalMin:0}; } catch { return {sessions:[],totalMin:0}; } }
function bSaveHist(h) { localStorage.setItem('breath_history', JSON.stringify(h)); }
function bTodayStr() { return new Date().toISOString().split('T')[0]; }
function bStreak(sessions) {
  if (!sessions.length) return 0;
  var seen = {};
  sessions.forEach(function(s) { if (s.date) seen[s.date] = true; });
  return Object.keys(seen).length;
}
function bRecordSession(cycles, secs) {
  const h = bLoadHist();
  h.sessions.push({ date:bTodayStr(), cycles, seconds:Math.round(secs), ts:Date.now() });
  h.totalMin = Math.round((h.totalMin||0) + secs/60);
  bSaveHist(h);
  bUpdateHistUI();
  // Also write for journal integration
  try {
    const data = JSON.parse(localStorage.getItem('breath_sessions')||'{}');
    const now = new Date(), day = now.getDay();
    const diff = now.getDate() - day + (day===0?-6:1);
    const monday = new Date(new Date(now).setDate(diff));
    const key = monday.toISOString().split('T')[0] + '_' + ((now.getDay()+6)%7);
    data[key] = (data[key]||0) + 1;
    localStorage.setItem('breath_sessions', JSON.stringify(data));
  } catch(e){}
  // Also update main stats
  recordSession(Math.max(1, Math.round(secs/60)));
}
function bUpdateHistUI() {
  const h = bLoadHist();
  const today = bTodayStr();
  const todayN = h.sessions.filter(s=>s.date===today).length;
  document.getElementById('bHistTotal').textContent = h.sessions.length;
  document.getElementById('bHistToday').textContent = todayN;
  document.getElementById('bHistStreak').textContent = bStreak(h.sessions);
  document.getElementById('bHistMin').textContent = h.totalMin||0;
  const ui = B_UI_TEXT[LANG];
  document.getElementById('bHistTotalLbl').textContent = ui.total;
  document.getElementById('bHistTodayLbl').textContent = ui.today;
  document.getElementById('bHistStreakLbl').textContent = ui.streak;
  document.getElementById('bHistMinLbl').textContent = ui.min;
}

function updateBreathLang() {
  const ui = B_UI_TEXT[LANG];
  document.getElementById('bCyclesLbl').textContent = ui.cycles;
  bUpdateMainControls(); // Use helper to update buttons with icons
  const ph = B_PHASE_LABELS[LANG][B_PHASES[bPhaseIdx].labelKey];
  document.getElementById('bPhaseName').textContent = ph.label;
  document.getElementById('bPhaseSub').textContent = ph.sub;
  // Show initial countdown dots
  const totalSecs = Math.round(B_PHASES[bPhaseIdx].dur / 1000);
  document.getElementById('bcNumber').textContent = bRunning ? '' : '';
  let initDots = '';
  for (let i = 0; i < totalSecs; i++) initDots += '<span class="bc-dot"></span>';
  document.getElementById('bcDots').innerHTML = initDots;
  bUpdateHistUI();
  var safeEl = document.getElementById('bSafetyNote');
  if (safeEl) safeEl.textContent = t('breathSafety') + ' ' + t('pauseAnytime');
  // Update pattern purpose labels and description for current language
  if (typeof updatePatternPurposeLabels === 'function') updatePatternPurposeLabels();
  var p = B_PATTERNS[bCurrentPattern];
  var descEl = document.getElementById('bPatternDesc');
  if (descEl && p) descEl.textContent = LANG === 'el' ? p.desc_el : p.desc_en;
}

function bUpdateMainControls() {
  const ui = B_UI_TEXT[LANG];
  const playBtn = document.getElementById('bPlayBtn');
  const ctrlCard = document.getElementById('breathControls');

  if (playBtn) {
    const iconEl = playBtn.querySelector('.btn-icon');
    const textEl = playBtn.querySelector('.btn-text');
    if (iconEl && textEl) {
      iconEl.textContent = bRunning ? '⏸' : '▶';
      textEl.textContent = bRunning ? (LANG === 'el' ? 'ΣΤΟΠ' : 'STOP') : ui.play;
    }
    // Update card class for collapse/expand
    if (ctrlCard) {
      if (bRunning) ctrlCard.classList.add('collapsed');
      else ctrlCard.classList.remove('collapsed');
    }
  }
  const resetBtn = document.getElementById('bResetBtn');
  if (resetBtn) {
    const iconEl = resetBtn.querySelector('.btn-icon');
    const textEl = resetBtn.querySelector('.btn-text');
    if (iconEl && textEl) {
        iconEl.textContent = '↺';
        textEl.textContent = ui.reset;
    }
  }
}

function bResizeCanvas() {
  if (!bCanvas) return;
  const rect = bCanvas.getBoundingClientRect();
  if (rect.width === 0) return;
  const dpr = Math.min(devicePixelRatio||1, 2);
  bCanvas.width = rect.width * dpr;
  bCanvas.height = rect.height * dpr;
  bCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function bUpdatePhase(now) {
  if (!bRunning) return;
  const elapsed = now - bPhaseStart;
  const phase = B_PHASES[bPhaseIdx];
  const progress = Math.min(elapsed / phase.dur, 1);
  const ep = bEase(progress);
  bArmPos = phase.armFrom + (phase.armTo - phase.armFrom) * ep;
  const ph = B_PHASE_LABELS[LANG][phase.labelKey];
  document.getElementById('bPhaseName').textContent = ph.label;
  document.getElementById('bPhaseSub').textContent = ph.sub;

  // Countdown: total seconds for this phase
  const totalSecs = Math.round(phase.dur / 1000);
  const elapsedSecs = Math.min(Math.floor(elapsed / 1000), totalSecs - 1);
  const currentCount = elapsedSecs + 1;

  // Per-second gentle tick vibration + voice count
  if (typeof bLastCountSec === 'undefined') bLastCountSec = -1;
  if (currentCount !== bLastCountSec) {
    bLastCountSec = currentCount;
    if (!document.body.classList.contains('reduce-motion')) hapticPulse(8, 180);
    // Voice: count this second (skipped for 1-sec phases inside bVoiceCount)
    bVoiceCount(bPhaseIdx, elapsedSecs, totalSecs);
  }

  // Update number
  document.getElementById('bcNumber').textContent = currentCount;

  // Update dots
  const dotsEl = document.getElementById('bcDots');
  let dotsHtml = '';
  for (let i = 0; i < totalSecs; i++) {
    const cls = i < elapsedSecs ? 'bc-dot filled' : (i === elapsedSecs ? 'bc-dot current' : 'bc-dot');
    dotsHtml += '<span class="' + cls + '"></span>';
  }
  dotsEl.innerHTML = dotsHtml;

  if (progress >= 1) {
    bPhaseIdx = (bPhaseIdx + 1) % 4;
    bPhaseStart = now;
    bLastCountSec = -1; // reset so the next phase's count-1 isn't skipped
    if (!document.body.classList.contains('reduce-motion')) {
      // Inhale: gentle rising pulses, Hold: steady, Exhale: long slow, Rest: soft tap
      var vp = [
        [15,40,20,40,25,40,30],  // Inhale — rising intensity
        [20,50,20],               // Hold — calm double
        [40,30,35,30,30,30,25,30,20,30,15], // Exhale — fading wave
        [50]                      // Rest — single grounding pulse
      ];
      breathVibrate(vp[bPhaseIdx]);
    }
    // Speak phase name at phase start
    bVoicePhaseStart(bPhaseIdx);
    if (bPhaseIdx === 0) {
      bCycles++;
      document.getElementById('bCycles').textContent = bCycles;
    }
  }
}

function bUpdateTimer(now) {
  if (!bRunning) return;
  if (bLastTs === 0) { bLastTs = now; return; }
  const d = Math.min(now - bLastTs, 100);
  if (d > 0) {
    bSeconds += d / 1000;
    const m = Math.floor(bSeconds/60), s = Math.floor(bSeconds%60);
    const timerEl = document.getElementById('bTimer');
    if (timerEl) timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  bLastTs = now;
}

// ── Pattern Colors (Research-based: Green for Grounding, Blue for Calm, Gold for Coherence, Purple for Deep Sleep) ──
const B_COLORS = {
  '4-2-6-1': { primary: '#3A5E57', secondary: '#60857D', aura: '70, 130, 120' }, // Teal Earth
  '4-7-8':   { primary: '#2A4D69', secondary: '#4B86B4', aura: '100, 150, 190' }, // Deep Water Calm
  '5-5':     { primary: '#C5A059', secondary: '#E8C547', aura: '220, 190, 90' },  // Golden Coherence
  'sleep-delta': { primary: '#4B2C5E', secondary: '#7F5283', aura: '120, 80, 150' }, // Delta Purple
  'sleep-classical': { primary: '#8B5E3C', secondary: '#B98B53', aura: '185, 140, 85' } // Warm Classical Amber
};

function bDraw() {
  if (!bCanvas || !bCanvas.width || !bCanvas.height) return;
  const dpr = Math.min(devicePixelRatio||1, 2);
  const w = bCanvas.width / dpr, h = bCanvas.height / dpr;
  bCtx.clearRect(0, 0, w, h);
  const cx = w / 2, groundY = h * 0.62;
  const sc = Math.min(w / 220, h / 300);
  const pulse = Math.sin(bTime * 1.5) * 0.5 + 0.5; // Slightly faster pulse for responsiveness
  const breath = Math.sin(bTime * 0.9) * 0.5 + 0.5;
  const pCol = B_COLORS[bCurrentPattern] || B_COLORS['4-2-6-1'];

  // ── Atmospheric background (behind figure, untransformed) ──
  const auraIntense = bRunning ? (0.15 + bArmPos * 0.15 + pulse * 0.05) : 0.08;
  const bgGrad = bCtx.createRadialGradient(cx, groundY - h*0.2, 0, cx, groundY - h*0.2, Math.max(w,h)*0.8);
  bgGrad.addColorStop(0, `rgba(${pCol.aura}, ${auraIntense})`);
  bgGrad.addColorStop(0.4, `rgba(${pCol.aura}, 0.04)`);
  bgGrad.addColorStop(1, 'rgba(0,0,0,0)');
  bCtx.fillStyle = bgGrad; bCtx.fillRect(0, 0, w, h);

  // Spreading Rainbow Aura Effect (spreading across the screen)
  if (bRunning) {
    bCtx.save();
    bCtx.globalCompositeOperation = 'screen';
    for (let i = 0; i < 3; i++) {
        const ringProg = (bTime * 0.4 + i * 0.33) % 1;
        const ringSc = ringProg * 1.5 * Math.max(w, h);
        const ringAlpha = Math.sin(ringProg * Math.PI) * 0.12 * bArmPos;
        const ringGrad = bCtx.createRadialGradient(cx, groundY - 60*sc, ringSc * 0.8, cx, groundY - 60*sc, ringSc);
        ringGrad.addColorStop(0, 'rgba(255,255,255,0)');
        ringGrad.addColorStop(0.5, `rgba(${pCol.aura}, ${ringAlpha})`);
        ringGrad.addColorStop(1, 'rgba(255,255,255,0)');
        bCtx.fillStyle = ringGrad;
        bCtx.beginPath();
        bCtx.arc(cx, groundY - 60*sc, ringSc, 0, Math.PI*2);
        bCtx.fill();
    }
    bCtx.restore();
  }

  // ── Horizon line (subtle, behind the figure) ──
  const horizonY = groundY + 56 * Math.min(w/220, h/300);
  const horG = bCtx.createLinearGradient(0, horizonY, 0, horizonY + 24);
  horG.addColorStop(0, `rgba(${pCol.aura}, 0.15)`);
  horG.addColorStop(1, 'rgba(0,0,0,0)');
  bCtx.fillStyle = horG;
  bCtx.fillRect(0, horizonY, w, 24);
  // thin horizon stroke
  bCtx.strokeStyle = `rgba(${pCol.aura}, 0.10)`;
  bCtx.lineWidth = 1;
  bCtx.beginPath();
  bCtx.moveTo(Math.max(0, cx - 180), horizonY);
  bCtx.lineTo(Math.min(w, cx + 180), horizonY);
  bCtx.stroke();

  bCtx.save();
  bCtx.translate(cx, groundY);
  bCtx.scale(sc, sc);
  bCtx.lineCap = 'round'; bCtx.lineJoin = 'round';

  // ── Ground reflection shadow (elliptical) ──
  const shG = bCtx.createRadialGradient(0, 45, 0, 0, 45, 70);
  shG.addColorStop(0, 'rgba(20,30,40,0.35)');
  shG.addColorStop(0.6, 'rgba(20,30,40,0.12)');
  shG.addColorStop(1, 'rgba(20,30,40,0)');
  bCtx.fillStyle = shG;
  bCtx.beginPath(); bCtx.ellipse(0, 45, 60 + pulse*5, 10 + pulse*2, 0, 0, Math.PI*2); bCtx.fill();

  // ── Gravity axis (vertical light column) ──
  const axTop = -158, axBot = 78;
  // wide soft glow
  const agGlow = bCtx.createLinearGradient(0, axTop, 0, axBot);
  agGlow.addColorStop(0, `rgba(${pCol.aura}, 0)`);
  agGlow.addColorStop(0.5, `rgba(${pCol.aura}, 0.07)`);
  agGlow.addColorStop(1, `rgba(${pCol.aura}, 0)`);
  bCtx.strokeStyle = agGlow; bCtx.lineWidth = 22;
  bCtx.beginPath(); bCtx.moveTo(0, axTop); bCtx.lineTo(0, axBot); bCtx.stroke();
  // core line
  const ag = bCtx.createLinearGradient(0, axTop, 0, axBot);
  ag.addColorStop(0, 'rgba(230,200,90,0)');
  ag.addColorStop(0.5, `rgba(${pCol.aura}, ${0.3 + pulse*0.2})`);
  ag.addColorStop(1, 'rgba(230,200,90,0)');
  bCtx.strokeStyle = ag; bCtx.lineWidth = 2.2;
  bCtx.beginPath(); bCtx.moveTo(0, axTop); bCtx.lineTo(0, axBot); bCtx.stroke();

  // ── Earth globe (richer, with terminator) ──
  const gR=44, gY=0;
  // outer atmosphere
  const atmG = bCtx.createRadialGradient(0, gY, gR, 0, gY, gR+10);
  atmG.addColorStop(0, `rgba(${pCol.aura}, 0.25)`);
  atmG.addColorStop(1, 'rgba(100,170,190,0)');
  bCtx.fillStyle = atmG;
  bCtx.beginPath(); bCtx.arc(0, gY, gR+10, 0, Math.PI*2); bCtx.fill();
  // globe body with directional light
  const gg = bCtx.createRadialGradient(-14, gY-12, 4, 0, gY+4, gR);
  gg.addColorStop(0, 'rgba(200,180,110,0.42)');
  gg.addColorStop(0.35, 'rgba(90,150,130,0.30)');
  gg.addColorStop(0.75, 'rgba(40,90,100,0.26)');
  gg.addColorStop(1, 'rgba(20,50,65,0.22)');
  bCtx.fillStyle = gg;
  bCtx.beginPath(); bCtx.arc(0, gY, gR, 0, Math.PI*2); bCtx.fill();
  // terminator shadow (night side hint)
  bCtx.save();
  bCtx.beginPath(); bCtx.arc(0, gY, gR, 0, Math.PI*2); bCtx.clip();
  const tGrad = bCtx.createLinearGradient(-gR*0.2, 0, gR, 0);
  tGrad.addColorStop(0, 'rgba(10,20,35,0)');
  tGrad.addColorStop(1, 'rgba(10,20,35,0.35)');
  bCtx.fillStyle = tGrad;
  bCtx.fillRect(-gR, -gR, gR*2, gR*2);
  bCtx.restore();
  // continents
  bCtx.fillStyle = 'rgba(180,150,70,0.12)';
  bCtx.beginPath(); bCtx.ellipse(-12, gY-5, 18, 12, -0.2, 0, Math.PI*2); bCtx.fill();
  bCtx.beginPath(); bCtx.ellipse(15, gY+8, 10, 8, 0.3, 0, Math.PI*2); bCtx.fill();
  bCtx.beginPath(); bCtx.ellipse(-8, gY+16, 7, 4, 0.1, 0, Math.PI*2); bCtx.fill();
  // rim highlight
  bCtx.strokeStyle = 'rgba(180,220,220,0.22)'; bCtx.lineWidth = 1.2;
  bCtx.beginPath(); bCtx.arc(0, gY, gR, -Math.PI*0.95, -Math.PI*0.35); bCtx.stroke();
  // specular highlight
  bCtx.fillStyle = 'rgba(255,250,230,0.12)';
  bCtx.beginPath(); bCtx.ellipse(-16, gY-14, 6, 3, -0.4, 0, Math.PI*2); bCtx.fill();

  // ── Phase progress arc (smoother with trail) ──
  if (bRunning) {
    const pP = Math.min((performance.now()-bPhaseStart)/B_PHASES[bPhaseIdx].dur, 1);
    const aS = -Math.PI/2, aE = aS + pP*Math.PI*2;
    bCtx.strokeStyle = `rgba(${pCol.aura}, 0.18)`;
    bCtx.lineWidth = 8;
    bCtx.beginPath(); bCtx.arc(0, gY, gR+7, aS, aE); bCtx.stroke();
    // crisp arc
    bCtx.strokeStyle = `rgba(${pCol.aura}, 0.8)`;
    bCtx.lineWidth = 2.4;
    bCtx.beginPath(); bCtx.arc(0, gY, gR+7, aS, aE); bCtx.stroke();
    // leading dot
    bCtx.shadowBlur = 10;
    bCtx.shadowColor = `rgb(${pCol.aura})`;
    bCtx.fillStyle = 'white';
    bCtx.beginPath();
    bCtx.arc(Math.cos(aE)*(gR+7), gY + Math.sin(aE)*(gR+7), 2.4, 0, Math.PI*2);
    bCtx.fill();
    bCtx.shadowBlur = 0;
  }

  // ── Lotus legs (with fold detail and highlights) ──
  const sY = -gR+5, pY = sY-8;
  // under-shadow
  bCtx.fillStyle = 'rgba(20,35,30,0.4)';
  bCtx.beginPath();
  bCtx.ellipse(0, sY+22, 32, 5, 0, 0, Math.PI*2); bCtx.fill();
  // legs body with subtle gradient
  const legG = bCtx.createLinearGradient(0, sY-5, 0, sY+25);
  legG.addColorStop(0, 'rgba(55,80,70,0.92)');
  legG.addColorStop(1, 'rgba(35,55,48,0.92)');
  bCtx.fillStyle = legG;
  bCtx.beginPath();
  bCtx.moveTo(-32, sY+5);
  bCtx.quadraticCurveTo(-37, sY+18, -27, sY+24);
  bCtx.quadraticCurveTo(-5, sY+27, 0, sY+15);
  bCtx.quadraticCurveTo(5, sY+27, 27, sY+24);
  bCtx.quadraticCurveTo(37, sY+18, 32, sY+5);
  bCtx.quadraticCurveTo(16, sY-2, 0, pY);
  bCtx.quadraticCurveTo(-16, sY-2, -32, sY+5);
  bCtx.fill();
  // fold highlight
  bCtx.strokeStyle = 'rgba(180,200,185,0.12)'; bCtx.lineWidth = 1.2;
  bCtx.beginPath(); bCtx.moveTo(-28, sY+8); bCtx.quadraticCurveTo(0, sY-1, 28, sY+8); bCtx.stroke();
  // seam
  bCtx.strokeStyle = 'rgba(20,35,28,0.35)'; bCtx.lineWidth = 1;
  bCtx.beginPath(); bCtx.moveTo(-22, sY+10); bCtx.quadraticCurveTo(0, sY+22, 22, sY+10); bCtx.stroke();

  // ── Torso (refined robe with drape) ──
  const wY = pY-22, cY = wY-28, shY = cY-12;
  // robe base gradient
  const robeG = bCtx.createLinearGradient(-26, shY, 26, pY);
  robeG.addColorStop(0, 'rgba(48,72,65,0.88)');
  robeG.addColorStop(0.5, 'rgba(68,95,82,0.88)');
  robeG.addColorStop(1, 'rgba(42,65,58,0.88)');
  bCtx.fillStyle = robeG;
  bCtx.beginPath();
  bCtx.moveTo(-24, pY);
  bCtx.quadraticCurveTo(-27, wY, -26, cY);
  bCtx.lineTo(-22, shY);
  bCtx.lineTo(22, shY);
  bCtx.lineTo(26, cY);
  bCtx.quadraticCurveTo(27, wY, 24, pY);
  bCtx.closePath(); bCtx.fill();
  // side shadow
  bCtx.fillStyle = 'rgba(20,35,28,0.22)';
  bCtx.beginPath();
  bCtx.moveTo(12, shY); bCtx.lineTo(22, shY);
  bCtx.lineTo(26, cY); bCtx.quadraticCurveTo(27, wY, 24, pY);
  bCtx.lineTo(14, pY); bCtx.closePath(); bCtx.fill();
  // center drape seam
  bCtx.strokeStyle = 'rgba(20,35,28,0.3)'; bCtx.lineWidth = 1.1;
  bCtx.beginPath(); bCtx.moveTo(0, shY+5); bCtx.lineTo(0, pY); bCtx.stroke();
  // drape folds (chest)
  bCtx.strokeStyle = 'rgba(180,200,185,0.10)'; bCtx.lineWidth = 0.9;
  bCtx.beginPath(); bCtx.moveTo(-14, shY+4); bCtx.quadraticCurveTo(-8, wY-10, -6, wY+2); bCtx.stroke();
  bCtx.beginPath(); bCtx.moveTo(14, shY+4); bCtx.quadraticCurveTo(8, wY-10, 6, wY+2); bCtx.stroke();
  // breath expansion (subtle chest rise)
  if (bArmPos > 0.05) {
    bCtx.fillStyle = `rgba(255,240,210,${bArmPos*0.06})`;
    bCtx.beginPath();
    bCtx.ellipse(0, cY+2, 14 + bArmPos*4, 8 + bArmPos*3, 0, 0, Math.PI*2);
    bCtx.fill();
  }
  // collar
  bCtx.strokeStyle = 'rgba(220,190,140,0.35)'; bCtx.lineWidth = 1.2;
  bCtx.beginPath();
  bCtx.moveTo(-20, shY+1);
  bCtx.quadraticCurveTo(-4, shY+5, 0, shY+7);
  bCtx.quadraticCurveTo(4, shY+5, 20, shY+1);
  bCtx.stroke();

  // ── Arms (more anatomical with elbow joint & shading) ──
  const aAng = bArmPos*Math.PI, aL1 = 30, aL2 = 28;
  for (let side = -1; side <= 1; side += 2) {
    const sx = side*22, sy = shY+3, ang = Math.PI/2 - aAng;
    const eX = sx + Math.cos(ang)*side*aL1*0.7, eY = sy + Math.sin(ang)*aL1;
    const hx = eX + Math.cos(ang)*side*aL2*0.5, hy = eY + Math.sin(ang)*aL2*0.7;
    // sleeve (upper arm) with gradient
    const slG = bCtx.createLinearGradient(sx, sy, eX, eY);
    slG.addColorStop(0, `rgba(58,85,75,${0.72 + bArmPos*0.12})`);
    slG.addColorStop(1, `rgba(45,68,60,${0.72 + bArmPos*0.12})`);
    bCtx.fillStyle = slG;
    bCtx.beginPath();
    bCtx.moveTo(sx - side*5.5, sy);
    bCtx.lineTo(sx + side*5.5, sy);
    bCtx.lineTo(eX + side*4, eY);
    bCtx.lineTo(eX - side*4, eY);
    bCtx.closePath(); bCtx.fill();
    // sleeve highlight
    bCtx.strokeStyle = `rgba(180,200,185,${0.12 + bArmPos*0.08})`;
    bCtx.lineWidth = 0.9;
    bCtx.beginPath();
    bCtx.moveTo(sx - side*4, sy+2);
    bCtx.lineTo(eX - side*3, eY-1);
    bCtx.stroke();
    // elbow joint
    bCtx.fillStyle = `rgba(40,60,52,${0.5 + bArmPos*0.15})`;
    bCtx.beginPath(); bCtx.arc(eX, eY, 4.2, 0, Math.PI*2); bCtx.fill();
    // forearm (skin)
    const faGrad = bCtx.createLinearGradient(eX, eY, hx, hy);
    faGrad.addColorStop(0, `rgba(210,180,130,${0.65 + bArmPos*0.18})`);
    faGrad.addColorStop(1, `rgba(190,160,110,${0.65 + bArmPos*0.18})`);
    bCtx.strokeStyle = faGrad; bCtx.lineWidth = 3.8;
    bCtx.beginPath(); bCtx.moveTo(eX, eY); bCtx.lineTo(hx, hy); bCtx.stroke();
    // hand
    bCtx.fillStyle = `rgba(215,185,135,${0.55 + bArmPos*0.22})`;
    bCtx.beginPath(); bCtx.arc(hx, hy, 5, 0, Math.PI*2); bCtx.fill();
    // hand rim
    bCtx.strokeStyle = `rgba(140,105,65,${0.3 + bArmPos*0.15})`;
    bCtx.lineWidth = 0.7;
    bCtx.beginPath(); bCtx.arc(hx, hy, 5, 0, Math.PI*2); bCtx.stroke();
    // energy trail along arm (during active phases)
    if (bArmPos > 0.1 && bRunning) {
      bCtx.strokeStyle = `rgba(${pCol.aura},${bArmPos*0.10})`;
      bCtx.lineWidth = 8;
      bCtx.beginPath();
      bCtx.moveTo(sx, sy);
      bCtx.quadraticCurveTo(eX, eY, hx, hy);
      bCtx.stroke();
      bCtx.strokeStyle = `rgba(220,240,250,${bArmPos*0.18})`;
      bCtx.lineWidth = 1.2;
      bCtx.beginPath();
      bCtx.moveTo(sx, sy);
      bCtx.quadraticCurveTo(eX, eY, hx, hy);
      bCtx.stroke();
    }
  }

  // ── Mudra (dhyana — hands in lap when arms are down) ──
  if (bArmPos < 0.15) {
    const mY = wY+16;
    // palm gradient
    const mG = bCtx.createRadialGradient(0, mY-1, 1, 0, mY, 10);
    mG.addColorStop(0, 'rgba(220,190,140,0.55)');
    mG.addColorStop(1, 'rgba(180,150,100,0.3)');
    bCtx.fillStyle = mG;
    bCtx.beginPath(); bCtx.ellipse(0, mY, 10, 6, 0, 0, Math.PI*2); bCtx.fill();
    // thumb line
    bCtx.strokeStyle = 'rgba(150,115,75,0.35)'; bCtx.lineWidth = 1;
    bCtx.beginPath(); bCtx.arc(0, mY, 6, 0.15, Math.PI-0.15); bCtx.stroke();
    // soft glow on mudra during pause
    bCtx.fillStyle = `rgba(255,220,150,${0.08 + pulse*0.05})`;
    bCtx.beginPath(); bCtx.ellipse(0, mY, 16, 8, 0, 0, Math.PI*2); bCtx.fill();
  }

  // ── INFINITY SYMBOL (The Pulsing Heart) ──
  const iY = cY+9, iR = 9, iW = 16;
  const iPulse = 0.5 + 0.5 * Math.sin(bTime * 3); // Faster, energetic blink
  
  // Infinity Glow
  const iGlow = bCtx.createRadialGradient(0, iY, 0, 0, iY, iR * 2);
  iGlow.addColorStop(0, `rgba(${pCol.aura}, ${0.4 * iPulse})`);
  iGlow.addColorStop(1, 'rgba(255,255,255,0)');
  bCtx.fillStyle = iGlow;
  bCtx.beginPath(); bCtx.ellipse(0, iY, iW, iR, 0, 0, Math.PI*2); bCtx.fill();

  // Infinity Rainbow Path
  bCtx.save();
  bCtx.translate(0, iY);
  bCtx.lineWidth = 1.6;
  const colors = ['#E8704A', '#E8A030', '#C8C040', '#50B870', '#40A0A8', '#6070C0', '#9860A8'];
  for (let i = 0; i < colors.length; i++) {
    const offset = (i - 3) * 0.5;
    bCtx.strokeStyle = colors[i];
    bCtx.globalAlpha = (0.3 + 0.7 * pulse) * (1 - Math.abs(i-3)/7);
    bCtx.beginPath();
    bCtx.moveTo(0, offset);
    bCtx.bezierCurveTo(-iR*1.3, -iR+offset, -iR*1.3, iR+offset, 0, offset);
    bCtx.bezierCurveTo(iR*1.3, -iR+offset, iR*1.3, iR+offset, 0, offset);
    bCtx.stroke();
  }
  bCtx.restore();

  // ── Halo (behind head during practice) ──
  const nY = shY-9, hdY = nY-20, hdR = 17, htop = hdY-hdR-7;
  if (bRunning) {
    const haloA = 0.10 + bArmPos*0.12 + pulse*0.03;
    const haloG = bCtx.createRadialGradient(0, hdY, 0, 0, hdY, hdR+22);
    haloG.addColorStop(0, `rgba(${pCol.aura}, ${haloA})`);
    haloG.addColorStop(0.5, `rgba(${pCol.aura}, ${haloA*0.5})`);
    haloG.addColorStop(1, 'rgba(220,200,140,0)');
    bCtx.fillStyle = haloG;
    bCtx.beginPath(); bCtx.arc(0, hdY, hdR+22, 0, Math.PI*2); bCtx.fill();
    // thin halo ring
    bCtx.strokeStyle = `rgba(${pCol.aura}, ${0.18 + pulse*0.08})`;
    bCtx.lineWidth = 0.8;
    bCtx.beginPath(); bCtx.arc(0, hdY-2, hdR+6, -Math.PI*0.85, -Math.PI*0.15); bCtx.stroke();
  }

  // ── Head, neck & hood (refined) ──
  // neck with gradient
  const nkG = bCtx.createLinearGradient(-6, nY, 6, shY);
  nkG.addColorStop(0, 'rgba(210,180,130,0.78)');
  nkG.addColorStop(1, 'rgba(175,145,100,0.78)');
  bCtx.fillStyle = nkG;
  bCtx.fillRect(-5.5, nY, 11, shY-nY);
  // neck shadow
  bCtx.fillStyle = 'rgba(100,70,45,0.25)';
  bCtx.fillRect(2, nY, 3.5, shY-nY);
  // hood (outer)
  const hoodG = bCtx.createLinearGradient(-26, hdY, 26, shY);
  hoodG.addColorStop(0, 'rgba(50,72,65,0.88)');
  hoodG.addColorStop(0.5, 'rgba(70,95,82,0.88)');
  hoodG.addColorStop(1, 'rgba(45,68,60,0.88)');
  bCtx.fillStyle = hoodG;
  bCtx.beginPath();
  bCtx.moveTo(-24, shY);
  bCtx.quadraticCurveTo(-26, nY-5, -22, hdY);
  bCtx.quadraticCurveTo(-17, htop, 0, htop-3);
  bCtx.quadraticCurveTo(17, htop, 22, hdY);
  bCtx.quadraticCurveTo(26, nY-5, 24, shY);
  bCtx.fill();
  // hood fold outline
  bCtx.strokeStyle = 'rgba(20,35,28,0.25)'; bCtx.lineWidth = 1.2;
  bCtx.beginPath();
  bCtx.moveTo(-20, shY-2);
  bCtx.quadraticCurveTo(-22, hdY+5, -15, hdY-5);
  bCtx.quadraticCurveTo(0, hdY-hdR-2, 15, hdY-5);
  bCtx.quadraticCurveTo(22, hdY+5, 20, shY-2);
  bCtx.stroke();
  // hood inner highlight
  bCtx.strokeStyle = 'rgba(180,200,185,0.12)'; bCtx.lineWidth = 0.9;
  bCtx.beginPath();
  bCtx.moveTo(-17, hdY-2);
  bCtx.quadraticCurveTo(0, hdY-hdR-1, 17, hdY-2);
  bCtx.stroke();
  // face with lighting
  const faceG = bCtx.createRadialGradient(-3, hdY-4, 2, 0, hdY, hdR);
  faceG.addColorStop(0, 'rgba(230,200,155,0.78)');
  faceG.addColorStop(0.65, 'rgba(200,170,120,0.72)');
  faceG.addColorStop(1, 'rgba(160,125,80,0.65)');
  bCtx.fillStyle = faceG;
  bCtx.beginPath(); bCtx.arc(0, hdY, hdR-3, -0.3, Math.PI+0.3); bCtx.fill();
  // face rim shadow (right side)
  bCtx.fillStyle = 'rgba(90,60,35,0.18)';
  bCtx.beginPath(); bCtx.arc(0, hdY, hdR-3, -0.3, Math.PI*0.4); bCtx.fill();
  // closed eyes with eyelash hint
  bCtx.strokeStyle = 'rgba(60,40,25,0.55)'; bCtx.lineWidth = 1.4;
  bCtx.beginPath(); bCtx.moveTo(-8, hdY+1); bCtx.quadraticCurveTo(-5.5, hdY+3.5, -3, hdY+1); bCtx.stroke();
  bCtx.beginPath(); bCtx.moveTo(3, hdY+1); bCtx.quadraticCurveTo(5.5, hdY+3.5, 8, hdY+1); bCtx.stroke();
  // eyelid shadow
  bCtx.strokeStyle = 'rgba(60,40,25,0.15)'; bCtx.lineWidth = 0.7;
  bCtx.beginPath(); bCtx.moveTo(-8.5, hdY); bCtx.quadraticCurveTo(-5.5, hdY+2.5, -2.5, hdY); bCtx.stroke();
  bCtx.beginPath(); bCtx.moveTo(2.5, hdY); bCtx.quadraticCurveTo(5.5, hdY+2.5, 8.5, hdY); bCtx.stroke();
  // subtle nose line
  bCtx.strokeStyle = 'rgba(100,70,45,0.18)'; bCtx.lineWidth = 0.6;
  bCtx.beginPath(); bCtx.moveTo(0, hdY+2); bCtx.quadraticCurveTo(0.5, hdY+5, 0, hdY+6); bCtx.stroke();
  // soft serene mouth
  bCtx.strokeStyle = 'rgba(120,75,55,0.3)'; bCtx.lineWidth = 0.9;
  bCtx.beginPath(); bCtx.moveTo(-4.5, hdY+7.5); bCtx.quadraticCurveTo(0, hdY+9.5, 4.5, hdY+7.5); bCtx.stroke();
  // bindi / third eye (soft glow, only running)
  if (bRunning) {
    const tE = bCtx.createRadialGradient(0, hdY-5, 0, 0, hdY-5, 4);
    tE.addColorStop(0, `rgba(255,220,140,${0.5 + pulse*0.25})`);
    tE.addColorStop(1, 'rgba(255,220,140,0)');
    bCtx.fillStyle = tE;
    bCtx.beginPath(); bCtx.arc(0, hdY-5, 4, 0, Math.PI*2); bCtx.fill();
  }

  // ── Tantien (lower dantien energy center) ──
  const tY = wY+9;
  // outer breath-synced halo
  const tgOut = bCtx.createRadialGradient(0, tY, 4, 0, tY, 22 + breath*8);
  tgOut.addColorStop(0, `rgba(80,200,160,${0.18 + bArmPos*0.12})`);
  tgOut.addColorStop(0.5, `rgba(80,200,160,${0.08 + bArmPos*0.06})`);
  tgOut.addColorStop(1, 'rgba(80,200,160,0)');
  bCtx.fillStyle = tgOut;
  bCtx.beginPath(); bCtx.arc(0, tY, 22 + breath*8, 0, Math.PI*2); bCtx.fill();
  // inner hot core
  const tgIn = bCtx.createRadialGradient(0, tY, 0, 0, tY, 8 + pulse*3);
  tgIn.addColorStop(0, `rgba(255,240,200,${0.25 + bArmPos*0.15})`);
  tgIn.addColorStop(1, 'rgba(255,240,200,0)');
  bCtx.fillStyle = tgIn;
  bCtx.beginPath(); bCtx.arc(0, tY, 8 + pulse*3, 0, Math.PI*2); bCtx.fill();

  // ── Aura (multi-layered, phase-colored) ──
  if (bRunning && bArmPos > 0.15) {
    const aurColors = [
      [168,213,220], // inhale
      [210,210,210], // hold
      [230,200,120], // exhale
      [180,180,190]  // rest
    ];
    const col = aurColors[bPhaseIdx];
    for (let i = 0; i < 4; i++) {
      const rr = ((bTime*6 + i*35) % 155);
      const ra = Math.max(0, 1 - rr/155) * bArmPos * 0.07;
      bCtx.strokeStyle = `rgba(${col[0]},${col[1]},${col[2]},${ra})`;
      bCtx.lineWidth = 0.9;
      bCtx.beginPath(); bCtx.arc(0, cY-5, rr, 0, Math.PI*2); bCtx.stroke();
    }
  }

  // ── Breath particles (rising on inhale, falling on exhale) ──
  if (bRunning) {
    const rising = bPhaseIdx === 0 || bPhaseIdx === 1;
    for (let i = 0; i < 6; i++) {
      const phaseOff = i * 1.3;
      const prog = ((bTime*0.5 + phaseOff) % 3) / 3;
      const px = Math.sin(bTime*0.7 + i*2.1) * (24 + i*3);
      const py = rising
        ? cY - prog*80
        : cY - 80 + prog*80;
      const pa = Math.sin(prog*Math.PI) * 0.35 * bArmPos;
      bCtx.fillStyle = rising
        ? `rgba(220,240,250,${pa})`
        : `rgba(255,225,175,${pa})`;
      bCtx.beginPath(); bCtx.arc(px, py, 1.2 + Math.sin(prog*Math.PI)*0.8, 0, Math.PI*2); bCtx.fill();
    }
  }

  // ── Stars (with twinkling) ──
  for (let i = 0; i < 18; i++) {
    const sx2 = Math.sin(i*2.1 + bTime*0.06) * (140 + i*4);
    const sy2 = -165 - i*8 + Math.cos(i*1.5) * 40;
    const twinkle = 0.08 + Math.sin(bTime*1.3 + i*0.7) * 0.07;
    const sz = 1.0 + (i % 3) * 0.4;
    bCtx.fillStyle = `rgba(220,230,240,${Math.max(0.03, twinkle)})`;
    bCtx.beginPath(); bCtx.arc(sx2, sy2, sz, 0, Math.PI*2); bCtx.fill();
    // occasional cross-sparkle on brightest stars
    if (i % 5 === 0) {
      bCtx.strokeStyle = `rgba(220,230,240,${twinkle*0.7})`;
      bCtx.lineWidth = 0.4;
      bCtx.beginPath();
      bCtx.moveTo(sx2-sz*2, sy2); bCtx.lineTo(sx2+sz*2, sy2);
      bCtx.moveTo(sx2, sy2-sz*2); bCtx.lineTo(sx2, sy2+sz*2);
      bCtx.stroke();
    }
  }

  bCtx.restore();

  // Floating cues
  if (bRunning && bCues.length) {
    const ns = performance.now()/1000;
    for (let i=bCues.length-1;i>=0;i--) {
      const c=bCues[i], age=ns-c.born;
      if (age>6) { bCues.splice(i,1); continue; }
      const alpha = age<0.8 ? age/0.8 : (age>4 ? (6-age)/2 : 1);
      bCtx.save(); bCtx.globalAlpha=Math.max(0,alpha*0.3);
      bCtx.font="italic 13px 'Fraunces',Georgia,serif"; bCtx.fillStyle='#A8D5DC'; bCtx.textAlign='center';
      bCtx.fillText(c.text,c.x,c.y-age*7); bCtx.restore();
    }
  }
  bTime += 0.016;
}

function bMaybeCue(now) {
  if (!bRunning || now-bLastCueTime<5000) return;
  bLastCueTime = now;
  const texts = B_CUES[LANG];
  const text = texts[Math.floor(Math.random()*texts.length)];
  const dpr = Math.min(devicePixelRatio||1,2);
  const w2=bCanvas.width/dpr, h2=bCanvas.height/dpr;
  bCues.push({text, x:20+Math.random()*(w2-40), y:h2*0.5+Math.random()*(h2*0.25), born:now/1000});
  if (bCues.length>5) bCues.shift();
}

function bAnimate(ts) {
  if (!bCanvas.width) bResizeCanvas();
  if (bRunning) { bUpdatePhase(ts); bUpdateTimer(ts); bMaybeCue(ts); }
  bDraw();
  bAnimId = requestAnimationFrame(bAnimate);
}

function bStart() {
  if (bRunning) return;
  bRunning = true;
  bPhaseStart = performance.now();
  bLastTs = bPhaseStart;
  bLastCountSec = -1;
  bUpdateMainControls();
  breathVibrate([50,30,50]);
  // Voice: announce the first phase immediately
  bVoicePhaseStart(bPhaseIdx);
}

function bPause() {
  if (!bRunning) return;
  bRunning = false;
  bUpdateMainControls();
  if (bCycles > 0) bRecordSession(bCycles, bSeconds);
}

function bReset() {
  const was = bRunning;
  if (was) { bRunning = false; if (bCycles>0) bRecordSession(bCycles, bSeconds); }
  bPhaseIdx=0; bArmPos=0; bCycles=0; bSeconds=0; bCues=[]; bLastCueTime=0; bLastCountSec=-1;
  document.getElementById('bTimer').textContent = '00:00';
  document.getElementById('bCycles').textContent = '0';
  const now = performance.now(); bPhaseStart=now; bLastTs=now;
  const ph = B_PHASE_LABELS[LANG][0];
  document.getElementById('bPhaseName').textContent = ph.label;
  document.getElementById('bPhaseSub').textContent = ph.sub;
  bUpdateMainControls();
  if (!was) bDraw();
}

function switchPattern(key) {
  if (bRunning) return; // Don't switch while running
  tapFeedback();
  bCurrentPattern = key;
  B_PHASES = B_PATTERNS[key].phases;
  var p = B_PATTERNS[key];
  var descEl = document.getElementById('bPatternDesc');
  if (descEl) descEl.textContent = LANG === 'el' ? p.desc_el : p.desc_en;
  document.querySelectorAll('.breath-pattern-btn').forEach(function(btn){
    btn.classList.toggle('active', btn.dataset.pattern === key);
  });
  updatePatternPurposeLabels();
  // Only reset if breath canvas is initialized
  if (bCanvas) bReset();
}

function updatePatternPurposeLabels() {
  document.querySelectorAll('.breath-pattern-btn').forEach(function(btn){
    var key = btn.dataset.pattern;
    var p = B_PATTERNS[key];
    var purposeEl = btn.querySelector('.bp-purpose');
    if (purposeEl && p) {
      purposeEl.textContent = LANG === 'el' ? p.purpose_el : p.purpose_en;
    }
  });
}

function initBreathExercise() {
  bCanvas = document.getElementById('breathCanvas');
  if (!bCanvas) return;
  bCtx = bCanvas.getContext('2d');
  
  // Retry resize until canvas has dimensions
  var retries = 0;
  function tryResize() {
    bResizeCanvas();
    if ((!bCanvas.width || !bCanvas.height) && retries < 10) {
      retries++;
      setTimeout(tryResize, 100);
    } else {
      bDraw();
    }
  }
  tryResize();
  if (!bInited) {
    document.getElementById('bPlayBtn').addEventListener('click', () => bRunning ? bPause() : bStart());
    document.getElementById('bResetBtn').addEventListener('click', bReset);
    window.addEventListener('resize', () => { if (document.getElementById('screen-breath').classList.contains('active')) { bResizeCanvas(); bDraw(); } });
    bInited = true;
  }
  bUpdateHistUI();
  updateBreathLang();
  bUpdateVoiceBtn();
  var p = B_PATTERNS[bCurrentPattern];
  var descEl = document.getElementById('bPatternDesc');
  if (descEl) descEl.textContent = LANG === 'el' ? p.desc_el : p.desc_en;
  if (!bAnimId) bAnimId = requestAnimationFrame(bAnimate);
}

// ══════════════════════════════════════════════
// CELEBRATION
// ══════════════════════════════════════════════
function showCelebrate() {
  const mins = Math.floor(bSeconds / 60);
  const secs = Math.floor(bSeconds % 60);
  const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  // Celebrate overlay removed in v2 - just record
}
