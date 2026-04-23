/* ═══ js/haptics.js ═══ */

// ═══ HAPTIC FEEDBACK (cross-platform: Android vibrate + iOS AudioContext) ═══
var _hapticCtx = null;
function _getHapticCtx() {
  if (!_hapticCtx) {
    try { _hapticCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }
  if (_hapticCtx && _hapticCtx.state === 'suspended') _hapticCtx.resume();
  return _hapticCtx;
}
function hapticPulse(durationMs, freq) {
  durationMs = durationMs || 15;
  freq = freq || 200;
  // Android: use native vibrate
  if (navigator.vibrate) { navigator.vibrate(durationMs); return; }
  // iOS fallback: inaudible low-frequency oscillation
  var ctx = _getHapticCtx();
  if (!ctx) return;
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.value = 0.01; // barely audible — just enough to trigger haptic engine
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationMs / 1000);
}
function tapFeedback() {
  if (document.body.classList.contains('reduce-motion')) return;
  if (navigator.vibrate) { navigator.vibrate(12); return; }
  hapticPulse(12, 200);
}
function breathVibrate(pattern) {
  if (document.body.classList.contains('reduce-motion')) return;
  if (navigator.vibrate) { navigator.vibrate(pattern); return; }
  // iOS: just a single pulse for phase change
  hapticPulse(25, 150);
}
