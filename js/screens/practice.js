/* ═══ js/screens/practice.js ═══ */
/**
 * Practice Screen Module
 * Builds the list of available mindfulness exercises.
 */

function buildPracticeList() {
    const container = document.getElementById('screen-practice');
    if (!container) return;

    const practices = T[LANG]?.practices || T.el.practices;
    
    container.innerHTML = `
        <div class="scroll-area">
            <div class="screen-header">
                <button class="back-btn" onclick="goBack()" aria-label="Back">←</button>
                <div class="screen-title" data-i18n="menuExercises">${t('menuExercises')}</div>
            </div>
            
            <div class="practice-container">
                <div class="practice-list-modern">
                    ${practices.map(p => renderPracticeCardModern(p)).join('')}
                </div>
                
                <!-- Extra Space for clarity -->
                <div style="height:40px"></div>
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
