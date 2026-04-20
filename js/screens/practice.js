function buildPracticeList() {
    const screen = document.getElementById('screen-practice');
    const practices = T[LANG]?.practices || T.el.practices;
    
    screen.innerHTML = `
        <div class="scroll-area">
            <div class="screen-header">
                <button class="back-btn" onclick="goBack()">←</button>
                <div class="screen-title">${t('menuExercises')}</div>
            </div>
            <div class="practice-grid">
                ${practices.map(p => `
                    <button class="practice-card" onclick="openPracticeItem('${p.file}')">
                        <div class="practice-icon-wrap" style="background:${p.axisColor}22">${p.icon}</div>
                        <div style="flex:1">
                            <div class="practice-name">${p.name}</div>
                            <div class="practice-desc">${p.desc}</div>
                            <div class="practice-axis" style="background:${p.axisColor}">${p.axis}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
            <div class="spacer-bottom"></div>
        </div>`;
}
