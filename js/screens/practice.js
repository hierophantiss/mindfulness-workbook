/* ═══ js/screens/practice.js ═══ */
/**
 * Practice Screen Module
 * Builds the list of available mindfulness exercises.
 */

function buildPracticeList() {
    const container = document.getElementById('screen-practice');
    if (!container) return;

    if (!window.currentPracticeCat) window.currentPracticeCat = 'all';

    const practices = T[LANG]?.practices || T.el.practices;
    const cats = [
        { id: 'all', label: LANG === 'el' ? 'Όλα' : 'All' },
        { id: 'body', label: LANG === 'el' ? 'Σώμα' : 'Body' },
        { id: 'breath', label: LANG === 'el' ? 'Αναπνοή' : 'Breath' },
        { id: 'attention', label: LANG === 'el' ? 'Προσοχή' : 'Attention' },
        { id: 'space', label: LANG === 'el' ? 'Χώρος' : 'Space' },
        { id: 'sound', label: LANG === 'el' ? 'Ήχος' : 'Sound' }
    ];

    const filtered = window.currentPracticeCat === 'all' 
        ? practices 
        : practices.filter(p => p.axis.toLowerCase().includes(window.currentPracticeCat.toLowerCase()) || (p.cat && p.cat === window.currentPracticeCat));
    
    container.innerHTML = `
        <div class="scroll-area">
            <div class="screen-header">
                <button class="back-btn" onclick="goBack()" aria-label="Back">←</button>
                <div class="screen-title" data-i18n="menuExercises">${t('menuExercises')}</div>
            </div>
            
            <div class="practice-container">
                <nav class="micro-cats" style="margin-bottom: 20px;">
                    ${cats.map(c => `
                        <button class="micro-cat-btn ${c.id === window.currentPracticeCat ? 'active' : ''}" 
                                onclick="window.currentPracticeCat='${c.id}'; buildPracticeList()">
                            ${c.label}
                        </button>
                    `).join('')}
                </nav>

                <div class="practice-list-modern">
                    ${filtered.map(p => renderPracticeCardModern(p)).join('')}
                </div>
                
                ${filtered.length === 0 ? `<div class="empty-state" style="text-align:center; padding: 40px; opacity: 0.6;">${LANG === 'el' ? 'Δεν βρέθηκαν ασκήσεις.' : 'No exercises found.'}</div>` : ''}

                <!-- Extra Space for clarity -->
                <div style="height:60px"></div>
            </div>
        </div>`;
}

function renderPracticeCardModern(p) {
    return `
        <button class="practice-card" onclick="openPracticeItem('${p.file}')" role="button" aria-label="${p.name}">
            <div class="practice-icon-wrap" style="background:${p.axisColor}22; color:${p.axisColor}">
              ${p.icon}
            </div>
            <div class="practice-info">
                <div class="practice-name">${p.name}</div>
                <div class="practice-desc">${p.desc}</div>
                <div class="practice-meta">
                  <span class="practice-axis-tag" style="background:${p.axisColor}15; color:${p.axisColor}">
                    ${p.axis}
                  </span>
                </div>
            </div>
            <div class="practice-chevron">›</div>
        </button>`;
}

window.buildPracticeList = buildPracticeList;
