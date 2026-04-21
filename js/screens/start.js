/* ═══ js/screens/start.js ═══ */
function buildStartScreen() {
  const screen = document.getElementById('screen-start');
  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('menuStart')}</div>
      </div>
      <div class="content-card mindful-focus-section">
        <h3>${t('whatIsMindfulness')}</h3>
        <p>${t('whatIsMindfulnessBody')}</p>
      </div>
      <div class="content-card mindful-focus-section" style="border-left:3px solid var(--teal)">
        <h3>${t('axisTitle')}</h3>
        <p style="margin-bottom:14px">${t('axisIntro')}</p>
        <div style="display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:22px;flex-shrink:0;margin-top:2px">🧍</span>
            <div><strong style="color:var(--sage)">${t('axisBody')}</strong><br><span style="font-size:13px;color:var(--text-soft);line-height:1.6">${t('axisBodyDesc')}</span></div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:22px;flex-shrink:0;margin-top:2px">🫁</span>
            <div><strong style="color:var(--terra)">${t('axisBreath')}</strong><br><span style="font-size:13px;color:var(--text-soft);line-height:1.6">${t('axisBreathDesc')}</span></div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:22px;flex-shrink:0;margin-top:2px">👁</span>
            <div><strong style="color:var(--gold)">${t('axisAttention')}</strong><br><span style="font-size:13px;color:var(--text-soft);line-height:1.6">${t('axisAttentionDesc')}</span></div>
          </div>
          <div style="display:flex;gap:12px;align-items:flex-start">
            <span style="font-size:22px;flex-shrink:0;margin-top:2px">✦</span>
            <div><strong style="color:var(--lav)">${t('axisSpace')}</strong><br><span style="font-size:13px;color:var(--text-soft);line-height:1.6">${t('axisSpaceDesc')}</span></div>
          </div>
        </div>
        <div style="margin-top:14px;padding:12px;background:rgba(42,93,94,0.06);border-radius:8px;font-size:13px;color:var(--text);line-height:1.6;text-align:center">
          <strong>${t('axisKey')}</strong>
        </div>
      </div>
      <div class="content-card mindful-focus-section">
        <h3>${t('manifestoTitle')}</h3>
        <p>${t('manifestoBody').replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>')}</p>
      </div>
      <div class="content-card mindful-focus-section" style="border-left:3px solid var(--lav)">
        <h3>${t('kindnessTitle')}</h3>
        <p>${t('kindnessEcho')}</p>
        <p style="margin-top:12px">${t('kindnessGrounding')}</p>
        <p style="margin-top:12px">${t('kindnessMethod')}</p>
        <p style="margin-top:12px">${t('kindnessGrowth')}</p>
        <div style="margin-top:14px;padding:12px;background:rgba(181,167,208,0.08);border-radius:8px;font-size:13px;color:var(--text);line-height:1.6">
          <strong>${t('kindnessPractice')}</strong>
        </div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;padding:0 16px;margin-top:8px">
        <button class="btn-primary" onclick="showScreen('breath')">🫁 ${t('tryBreath')}</button>
        <button class="btn-primary" onclick="showScreen('ai')" style="background:var(--accent-purple);border-color:var(--accent-purple)">✨ ${t('navAI')}</button>
        <button class="btn-secondary" onclick="openChapter(1)">📖 ${t('startCh1')}</button>
        <button class="btn-secondary" onclick="showScreen('practice')">🎯 ${t('seeExercises')}</button>
      </div>
      <div style="padding:16px;text-align:center">
        <button class="btn-primary" onclick="showScreen('chapters')" style="width:100%;justify-content:center">📖 ${t('menuChapters')} — ${t('menuChaptersSub')}</button>
      </div>
    </div>`;
}

