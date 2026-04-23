/* ═══ js/screens/micro.js ═══ */
/**
 * Micro-doses Screen Module
 * Handles brief mindfulness exercises with a countdown timer.
 */

var microTimer = null;

function buildMicroScreen() {
  const container = document.getElementById('screen-micro');
  if (!container) return;

  const cats = [
    {key:'all', label:'🌀 ' + t('microTitle')},
    {key:'body', label:'🧍 ' + t('microCatBody')},
    {key:'breath', label:'🫁 ' + t('microCatBreath')},
    {key:'attention', label:'👁 ' + t('microCatAttention')},
    {key:'space', label:'✦ ' + t('microCatSpace')},
    {key:'kindness', label:'💛 ' + t('microCatKindness')}
  ];

  const doses = t('microdoses') || [];
  const filtered = microCat === 'all' ? doses : doses.filter(d => d.cat === microCat);
  if (microIdx >= filtered.length) microIdx = 0;
  const dose = filtered[microIdx];

  container.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()" aria-label="Back">←</button>
        <div class="screen-title">${t('microTitle')}</div>
      </div>

      <div class="micro-container">
        <!-- INTRO -->
        <section class="content-card focus-section">
          <p class="micro-intro-text">${t('microIntro')}</p>
          <div class="micro-science-toggle">
            <button class="text-link-btn" onclick="toggleMicroScience()">${t('microSciBtn')}</button>
            <div id="micro-sci" class="micro-science-box" style="display:none">${t('microSciText')}</div>
          </div>
        </section>

        <!-- CATEGORIES -->
        <nav class="micro-cats">
          ${cats.map(c => `
            <button class="micro-cat-btn ${c.key === microCat ? 'active' : ''}" 
                    onclick="microCat='${c.key}';microIdx=0;buildMicroScreen()">
              ${c.label}
            </button>
          `).join('')}
        </nav>

        <!-- DOSE CARD -->
        ${dose ? `
          <div class="content-card focus-section micro-card">
            <div class="micro-cat-tag">
              ${t('microCat' + dose.cat.charAt(0).toUpperCase() + dose.cat.slice(1))}
            </div>
            <h3 class="micro-dose-title">${dose.title}</h3>
            <p class="micro-dose-text">${dose.text}</p>
            
            <div class="micro-actions">
              <div id="micro-timer" class="micro-timer-display">${dose.dur}</div>
              <button class="btn-primary" id="micro-start-btn" onclick="startMicroTimer(${dose.dur})">
                ▶ ${dose.dur} ${LANG === 'el' ? 'δευτ.' : 'sec'}
              </button>
              <button class="btn-secondary" onclick="microIdx++;buildMicroScreen()">
                ${t('microNext')}
              </button>
            </div>
          </div>
        ` : `<div class="empty-state">No doses found for this category.</div>`}

        <div class="micro-victory-footer">
          ${t('microVictory')}
        </div>
      </div>
    </div>`;
}

function toggleMicroScience() {
  const el = document.getElementById('micro-sci');
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function startMicroTimer(secs) {
  if (microTimer) clearInterval(microTimer);
  let remaining = secs;
  const el = document.getElementById('micro-timer');
  const btn = document.getElementById('micro-start-btn');
  
  if (btn) btn.style.display = 'none';
  if (el) el.textContent = remaining;

  microTimer = setInterval(() => {
    remaining--;
    if (el) el.textContent = remaining;
    
    if (remaining <= 0) {
      clearInterval(microTimer);
      microTimer = null;
      if (el) {
        el.textContent = '✓';
        el.style.color = 'var(--teal)';
      }
      if (typeof tapFeedback === 'function') tapFeedback('medium');
      if (navigator.vibrate) navigator.vibrate([40, 30, 40]);
    }
  }, 1000);
}
