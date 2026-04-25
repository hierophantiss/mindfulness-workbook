/* ═══ js/screens/chapters.js ═══ */
/**
 * Chapters Screen Module
 * Renders the educational content groups and individual chapter views.
 */

function buildChaptersList() {
  const container = document.getElementById('screen-chapters');
  if (!container) return;

  const chs = CHAPTERS_DATA[LANG] || CHAPTERS_DATA.el;
  const foundationChs = chs.slice(0, 4);
  const appChs = chs.slice(4, 7);
  const deeperChs = chs.slice(7, 10);

  container.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()" aria-label="Back">←</button>
        <div class="screen-title" data-i18n="menuChapters">${t('menuChapters')}</div>
      </div>

      <div class="chapters-container">
        <!-- FOUNDATION -->
        <section class="ch-group">
          <header class="ch-group-header" style="text-align: center; padding-top: 32px;">
            <div style="color: #e89e6e; font-size: 24px; font-family: 'Fraunces', Georgia, serif; font-weight: 500; font-style: normal; line-height: 1.25; margin-bottom: 20px; letter-spacing: -0.2px;">
              ${LANG === 'el' ? 'τα τέσσερα<br>στοιχεία που έχεις<br>πάντα μαζί σου' : 'the four<br>elements you always<br>carry with you'}
            </div>
            <h2 class="ch-group-title" style="font-size: 14px; letter-spacing: 0.15em;">${t('groupFoundationTitle')}</h2>
            <p class="ch-group-sub" style="font-size: 15px; opacity: 0.85;">${t('groupFoundationSub')}</p>
          </header>
          <div class="ch-grid-2x2">
            ${foundationChs.map(ch => renderChapterCard(ch)).join('')}
          </div>
        </section>

        <!-- APPLICATION -->
        <section class="ch-group">
          <header class="ch-group-header">
            <h2 class="ch-group-title">${t('groupAppTitle')}</h2>
            <p class="ch-group-sub">${t('groupAppSub')}</p>
          </header>
          <div class="ch-list">
            ${appChs.map(ch => renderChapterItem(ch)).join('')}
          </div>
        </section>

        <!-- DEEPER -->
        <section class="ch-group">
          <header class="ch-group-header">
            <h2 class="ch-group-title">${t('groupDeeperTitle')}</h2>
            <p class="ch-group-sub">${t('groupDeeperSub')}</p>
          </header>
          <div class="ch-list">
            ${deeperChs.map(ch => renderChapterItem(ch)).join('')}
          </div>
        </section>

        <hr class="menu-divider">

        <!-- SPECIAL CARDS -->
        <div class="ch-special-section">
          ${renderSpecialItem({
            icon: '◎',
            title: LANG === 'el' ? 'Πρόγραμμα 8 Εβδομάδων' : '8-Week Program',
            sub: LANG === 'el' ? 'Ολοκληρωμένη πρακτική Τετραπλού Άξονα' : 'Complete Fourfold Axis practice',
            action: 'openLearningToRide()',
            color: 'var(--teal)'
          })}
          
          ${renderSpecialItem({
            icon: '✨',
            title: t('navAI'),
            sub: t('menuAISub'),
            action: "showScreen('ai')",
            color: 'var(--gold)'
          })}
        </div>

        <!-- REMINDERS -->
        <div class="reminders-card">
           <div class="reminder-row">
             <div class="reminder-info">
               <div class="reminder-title">${LANG==='el'?'Υπενθυμίσεις Πρακτικής':'Practice Reminders'}</div>
               <div class="reminder-sub">${LANG==='el'?'Λάβετε ειδοποίηση για τη δουλειά σας':'Get notified to work on your practice'}</div>
             </div>
             <button class="btn-primary btn-sm" onclick="App.requestNotifPermission()">
               ${LANG==='el'?'Ενεργοποίηση':'Enable'}
             </button>
           </div>
        </div>
      </div>
    </div>`;
}

function renderChapterCard(ch) {
  return `
    <button class="ch-card-sm" onclick="openChapter(${ch.num})">
      <div class="ch-card-icon" style="background:${ch.hex}">${ch.icon}</div>
      <div class="ch-card-info">
        <h3 class="ch-card-title">${ch.title}</h3>
        <p class="ch-card-tag">${ch.tag ? '«' + ch.tag + '»' : ch.sub}</p>
      </div>
    </button>`;
}

function renderChapterItem(ch) {
  return `
    <button class="ch-item" onclick="openChapter(${ch.num})">
      <div class="ch-num" style="background:${ch.hex}">${ch.icon}</div>
      <div class="ch-info">
        <h3 class="ch-title">${ch.title}</h3>
        <p class="ch-sub">${ch.sub}</p>
      </div>
      <div class="ch-arrow" aria-hidden="true">›</div>
    </button>`;
}

function renderSpecialItem({ icon, title, sub, action, color }) {
  return `
    <button class="ch-item special-item" onclick="${action}" style="--item-color: ${color}">
      <div class="ch-num" style="background:${color}">${icon}</div>
      <div class="ch-info">
        <h3 class="ch-title" style="color:${color}">${title}</h3>
        <p class="ch-sub">${sub}</p>
      </div>
      <div class="ch-arrow" aria-hidden="true">›</div>
    </button>`;
}

function openChapter(num) {
  const chs = CHAPTERS_DATA[LANG] || CHAPTERS_DATA.el;
  const ch = chs[num - 1];
  if (!ch) return;

  const practices = CHAPTER_PRACTICES[num] || [];
  const allPractices = T[LANG]?.practices || T.el.practices;

  const practiceCards = practices.map(id => {
    const p = allPractices.find(x => x.id === id);
    if (!p) return '';
    return `
      <button class="practice-card" onclick="openPracticeItem('${p.file}')">
        <div class="practice-icon-wrap" style="background:${p.axisColor}22">${p.icon}</div>
        <div class="practice-info">
          <div class="practice-name">${p.name}</div>
          <div class="practice-desc">${p.desc}</div>
        </div>
      </button>`;
  }).join('');

  const container = document.getElementById('screen-chapter');
  container.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="showScreen('chapters')" aria-label="Back to Chapters">←</button>
        <h1 class="screen-title">${ch.icon} ${ch.title}</h1>
      </div>
      
      <article class="chapter-content">
        <section class="content-card focus-section summary">
          <p class="italic">${ch.summary}</p>
        </section>

        ${ch.tldr ? `
          <section class="content-card focus-section tldr">
            <h2 class="tldr-label">${t('tldrLabel')}</h2>
            <p class="tldr-text">${ch.tldr}</p>
          </section>
        ` : ''}

        ${ch.theorySections.map(s => `
          <section class="content-card focus-section">
            <h2 class="section-title">${s.title}</h2>
            <p class="section-body">${window.c2LinkConcepts(s.body.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>'), LANG)}</p>
          </section>
        `).join('')}

        ${ch.exercise ? `
          <section class="content-card focus-section exercise" style="border-left-color: ${ch.hex}">
            <h2 class="section-title">${ch.exercise.title}</h2>
            <ol class="exercise-steps">
              ${ch.exercise.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </section>
        ` : ''}

        ${ch.insight ? `<div class="content-card insight-quote">${ch.insight}</div>` : ''}

        ${(CHAPTER_TAKEAWAYS[LANG]||CHAPTER_TAKEAWAYS.el)[num] ? `
          <section class="content-card focus-section takeaway">
            <h2 class="takeaway-title">${t('chTakeaway')}</h2>
            <ul class="takeaway-list">
              ${((CHAPTER_TAKEAWAYS[LANG]||CHAPTER_TAKEAWAYS.el)[num]||[]).map(tk => `<li>✓ ${tk}</li>`).join('')}
            </ul>
          </section>` : ''}

        <div class="chapter-actions">
          <button class="btn-primary w-full" onclick="microCat='${CHAPTER_MICRO_CAT[num]||'all'}';microIdx=0;showScreen('micro')">
            ${t('chTryNow')}
          </button>
        </div>

        ${practiceCards ? `
          <section class="chapter-practices">
            <h2 class="practices-label">${t('chPracticesLabel')}</h2>
            <div class="practice-list">${practiceCards}</div>
          </section>` : ''}

        <nav class="chapter-nav">
          ${num > 1 ? `<button class="btn-secondary" onclick="openChapter(${num-1})">← ${t('prev')}</button>` : '<div></div>'}
          ${num < chs.length ? `<button class="btn-primary" onclick="openChapter(${num+1})">${t('next')} →</button>` : '<div></div>'}
        </nav>
      </article>
    </div>`;

  showScreen('chapter');

  // Tracking
  const chaptersRead = JSON.parse(localStorage.getItem('chaptersRead')||'[]');
  if (!chaptersRead.includes(num)) chaptersRead.push(num);
  localStorage.setItem('chaptersRead', JSON.stringify(chaptersRead));
}

function openPracticeItem(file) {
  const practices = T[LANG]?.practices || T.el.practices;
  const ex = practices.find(p => p.file === file);
  if (ex && ex.warn) { showTW(ex.warn, file); return; }
  launchPractice(file);
}
