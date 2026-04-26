/* ═══ js/screens/start.js ═══ */
/**
 * Start/Onboarding Screen Module
 * Explains the core philosophy (Fourfold Axis) and introductory mindfulness concepts.
 */

function buildStartScreen() {
  const container = document.getElementById('screen-start');
  if (!container) return;

  container.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()" aria-label="Back">←</button>
        <div class="screen-title" data-i18n="menuStart">${t('menuStart')}</div>
      </div>

      <div class="start-container">
        <!-- WHAT IS MINDFULNESS -->
        <section class="content-card focus-section">
          <h2 class="section-title">${t('whatIsMindfulness')}</h2>
          <p class="section-body">${t('whatIsMindfulnessBody')}</p>
        </section>

        <!-- THE FOURFOLD AXIS -->
        <section class="content-card focus-section axis-section">
          <h2 class="section-title">${t('axisTitle')}</h2>
          <p class="section-body mb-4">${t('axisIntro')}</p>
          
          <div class="axis-list">
            ${renderAxisItem('🧍', t('axisBody'), t('axisBodyDesc'), 'var(--sage)')}
            ${renderAxisItem('🫁', t('axisBreath'), t('axisBreathDesc'), 'var(--terra)')}
            ${renderAxisItem('👁', t('axisAttention'), t('axisAttentionDesc'), 'var(--gold)')}
            ${renderAxisItem('✦', t('axisSpace'), t('axisSpaceDesc'), 'var(--lav)')}
          </div>

          <div class="axis-key-box">
            <strong>${t('axisKey')}</strong>
          </div>
        </section>

        <!-- MANIFESTO -->
        <section class="content-card focus-section">
          <h2 class="section-title">${t('manifestoTitle')}</h2>
          <p class="section-body">${t('manifestoBody').replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>')}</p>
        </section>

        <!-- KINDNESS -->
        <section class="content-card focus-section kindness-section">
          <h2 class="section-title">${t('kindnessTitle')}</h2>
          <p class="section-body">${t('kindnessEcho')}</p>
          <p class="section-body mt-4">${t('kindnessGrounding')}</p>
          <p class="section-body mt-4">${t('kindnessMethod')}</p>
          <p class="section-body mt-4">${t('kindnessGrowth')}</p>
          
          <div class="kindness-practice-box">
            <strong>${t('kindnessPractice')}</strong>
          </div>
        </section>

        <!-- CTAs -->
        <div class="start-actions-grid">
          <button class="btn-primary" onclick="showScreen('breath')">
            🫁 ${t('tryBreath')}
          </button>
          <button class="btn-primary" onclick="if(window.c2ShowSheet) window.c2ShowSheet();" style="background:var(--accent-purple); border-color:var(--accent-purple)">
            ✨ ${t('navAI')}
          </button>
          <button class="btn-secondary" onclick="openChapter(1)">
            📖 ${t('startCh1')}
          </button>
          <button class="btn-secondary" onclick="showScreen('practice')">
            🎯 ${t('seeExercises')}
          </button>
        </div>

        <div class="start-footer-cta">
          <button class="btn-primary w-full" onclick="showScreen('chapters')">
            📖 ${t('menuChapters')} — ${t('menuChaptersSub')}
          </button>
        </div>
      </div>
    </div>`;
}

function renderAxisItem(icon, title, desc, color) {
  return `
    <div class="axis-item">
      <span class="axis-item-icon" aria-hidden="true">${icon}</span>
      <div class="axis-item-content">
        <strong style="color:${color}">${title}</strong>
        <p class="axis-item-desc">${desc}</p>
      </div>
    </div>`;
}
