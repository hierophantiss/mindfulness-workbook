/* ═══ js/screens/practice.js ═══ */
function buildPracticeList() {
  const screen = document.getElementById('screen-practice');
  const practices = T[LANG]?.practices || T.el.practices;
  const hideStats = localStorage.getItem('hideStats') === '1';

  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('menuExercises')}</div>
      </div>
      <div class="content-card" id="state-entry">
        <h3>${t('howFeelNow')}</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px">
          <button class="state-btn" onclick="showAdvice('hyper')" style="border-color:var(--terra)">⚡ ${t('stateHyper')}</button>
          <button class="state-btn" onclick="showAdvice('discon')" style="border-color:var(--lav)">🌫 ${t('stateDiscon')}</button>
          <button class="state-btn" onclick="showAdvice('focus')" style="border-color:var(--gold)">🎯 ${t('stateFocus')}</button>
          <button class="state-btn" onclick="showAdvice('body')" style="border-color:var(--sage)">💪 ${t('stateBody')}</button>
        </div>
        <div id="state-advice" style="display:none;margin-top:12px;padding:14px;background:rgba(42,93,94,0.06);border-radius:10px">
        </div>
      </div>
      ${hideStats ? '' : `<div class="practice-stats-bar">
        <div class="ps-cell"><div class="ps-val">${stats.sessions}</div><div class="ps-lbl">${t('statSessions')}</div></div>
        <div class="ps-div"></div>
        <div class="ps-cell"><div class="ps-val">${stats.minutes}</div><div class="ps-lbl">${t('statMinutes')}</div></div>
        <div class="ps-div"></div>
        <div class="ps-cell"><div class="ps-val">${stats.streak}</div><div class="ps-lbl">${t('statStreak')}</div></div>
        <div class="ps-div"></div>
        <div class="ps-cell"><div class="ps-val">${(stats.explored||[]).length}<span style="font-size:12px;opacity:0.4">/${practices.length}</span></div><div class="ps-lbl">${t('statExplored')}</div></div>
        <div style="width:100%"><div class="ps-progress"><div class="ps-bar" style="width:${Math.round((stats.explored||[]).length/practices.length*100)}%"></div></div></div>
      </div>`}
      <button style="display:block;margin:0 auto 8px;background:none;border:none;font-size:11px;color:var(--text-hint);cursor:pointer;font-family:inherit;padding:6px" onclick="toggleHideStats()">${hideStats ? t('showStats') : t('hideStats')}</button>
      <div class="practice-grid">
        ${practices.map(p => {
          const explored = (stats.explored||[]).includes(p.file.replace('.html',''));
          return `<button class="practice-card${explored?' explored':''}" onclick="openPracticeItem('${p.file}')">
            <div class="practice-icon-wrap" style="background:${p.axisColor}22">${p.icon}</div>
            <div style="flex:1">
              <div class="practice-name">${p.name}${p.warn ? ' ⚠️' : ''}${explored ? ' ✓' : ''}</div>
              <div class="practice-desc">${p.desc}</div>
              <span class="practice-axis" style="background:${p.axisColor}">${p.axis}</span>
            </div>
          </button>`;
        }).join('')}
      </div>
      <div style="padding:16px;text-align:center">
        <p style="font-size:11px;color:var(--text-hint);line-height:1.6;font-style:italic">${t('disclaimer')}</p>
        <p style="font-size:10px;color:var(--text-hint);margin-top:6px">🔒 ${t('privacyNote')}</p>
      </div>
      <div class="spacer-bottom"></div>
    </div>`;
}

// ═══ MICRO-DOSES SCREEN ═══
var microCat = 'all';
var microIdx = 0;
var microTimer = null;

