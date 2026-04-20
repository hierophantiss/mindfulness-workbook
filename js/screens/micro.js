/* ═══ js/screens/micro.js ═══ */
var microTimer = null;
function buildMicroScreen() {
  var screen = document.getElementById('screen-micro');
  var cats = [
    {key:'all', label:'🌀 '+t('microTitle')},
    {key:'body', label:'🧍 '+t('microCatBody')},
    {key:'breath', label:'🫁 '+t('microCatBreath')},
    {key:'attention', label:'👁 '+t('microCatAttention')},
    {key:'space', label:'✦ '+t('microCatSpace')},
    {key:'kindness', label:'💛 '+t('microCatKindness')}
  ];
  var doses = t('microdoses') || [];
  var filtered = microCat === 'all' ? doses : doses.filter(function(d){ return d.cat === microCat; });
  if (microIdx >= filtered.length) microIdx = 0;
  var dose = filtered[microIdx];

  var catBtns = cats.map(function(c){
    var active = c.key === microCat;
    return '<button style="padding:6px 12px;border-radius:16px;border:1.5px solid '+(active?'var(--teal)':'var(--border)')+';background:'+(active?'var(--teal)':'transparent')+';color:'+(active?'white':'var(--text-soft)')+';font-family:inherit;font-size:11px;font-weight:700;cursor:pointer;white-space:nowrap" onclick="microCat=\''+c.key+'\';microIdx=0;buildMicroScreen()">'+c.label+'</button>';
  }).join('');

  screen.innerHTML = '<div class="scroll-area">' +
    '<div class="screen-header">' +
      '<button class="back-btn" onclick="goBack()">←</button>' +
      '<div class="screen-title">'+t('microTitle')+'</div>' +
    '</div>' +
    '<div class="content-card mindful-focus-section">' +
      '<p style="font-size:14px;color:var(--text-soft);line-height:1.7">'+t('microIntro')+'</p>' +
      '<div style="margin-top:12px">' +
        '<button style="background:none;border:none;font-family:inherit;font-size:12px;color:var(--teal);cursor:pointer;padding:0;text-decoration:underline" onclick="document.getElementById(\'micro-sci\').style.display=document.getElementById(\'micro-sci\').style.display===\'none\'?\'block\':\'none\'">'+t('microSciBtn')+'</button>' +
        '<div id="micro-sci" style="display:none;margin-top:8px;padding:12px;background:rgba(42,93,94,0.06);border-radius:8px;font-size:12px;color:var(--text-soft);line-height:1.6">'+t('microSciText')+'</div>' +
      '</div>' +
    '</div>' +
    '<div style="padding:0 16px 8px;display:flex;gap:6px;flex-wrap:wrap;justify-content:center">'+catBtns+'</div>' +
    (dose ? (
      '<div class="content-card mindful-focus-section" style="border-left:3px solid var(--teal);min-height:140px">' +
        '<div style="font-size:11px;color:var(--text-hint);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px">'+t('microCat'+dose.cat.charAt(0).toUpperCase()+dose.cat.slice(1))+'</div>' +
        '<h3>'+dose.title+'</h3>' +
        '<p style="margin-bottom:14px">'+dose.text+'</p>' +
        '<div style="display:flex;align-items:center;gap:12px">' +
          '<div id="micro-timer" style="font-family:Fraunces,serif;font-size:28px;font-weight:900;color:var(--teal);min-width:40px;text-align:center">'+dose.dur+'</div>' +
          '<button class="btn-primary" style="font-size:13px;padding:10px 18px" id="micro-start-btn" onclick="startMicroTimer('+dose.dur+')">▶ '+dose.dur+' δευτ.</button>' +
          '<button class="btn-secondary" style="font-size:13px;padding:10px 18px" onclick="microIdx++;buildMicroScreen()">'+t('microNext')+'</button>' +
        '</div>' +
      '</div>'
    ) : '') +
    '<div style="text-align:center;padding:12px;font-size:13px;font-style:italic;color:var(--text-soft)">'+t('microVictory')+'</div>' +
    '<div class="spacer-bottom"></div>' +
  '</div>';
}

function startMicroTimer(secs) {
  if (microTimer) clearInterval(microTimer);
  var remaining = secs;
  var el = document.getElementById('micro-timer');
  var btn = document.getElementById('micro-start-btn');
  if (btn) btn.style.display = 'none';
  el.textContent = remaining;
  microTimer = setInterval(function() {
    remaining--;
    el.textContent = remaining;
    if (remaining <= 0) {
      clearInterval(microTimer);
      microTimer = null;
      el.textContent = '✓';
      el.style.color = 'var(--sage)';
      if (navigator.vibrate) navigator.vibrate([40,30,40]);
      else hapticPulse(40, 180);
      setTimeout(function(){ el.style.color = 'var(--teal)'; }, 2000);
    }
  }, 1000);
}
