/* ═══ js/screens/ai.js ═══ */

function buildAIScreen() {
  const screen = document.getElementById('screen-ai');
  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" onclick="goBack()">←</button>
      <div class="screen-title">${t('navAI')}</div>
    </div>
    
    <div class="scroll-area ai-scroll-area">
      <div style="padding: 20px; text-align: center; margin-top: 50px;">
        <div style="font-size: 40px; margin-bottom: 20px;">✦</div>
        <h2 style="margin-bottom: 15px; color: var(--text);">${LANG === 'el' ? 'Ο Προσωπικός σου Βοηθός' : 'Your Personal Guide'}</h2>
        <p style="color: var(--text-soft); line-height: 1.6; margin-bottom: 30px;">
          ${LANG === 'el' 
            ? 'Ο βοηθός ενσυνειδητότητας πλέον βρίσκεται πάντα μαζί σου, στο εικονίδιο κάτω δεξιά. Δεν χρειάζεται να γράφεις—ο βοηθός γνωρίζει την πρόοδό σου (μόνο τοπικά στη συσκευή σου) και σου δίνει τις καλύτερες επιλογές.' 
            : 'The mindfulness guide is now always with you, via the icon in the bottom right. No need to type—the guide knows your progress (stored securely on your device) and provides the best options.'}
        </p>
        <button class="bento-card bento-wide" style="margin: 0 auto; display: flex; align-items: center; justify-content: center; padding: 15px; border-radius: 12px; background: var(--teal); color: white; border: none; font-weight: bold;" onclick="openCompanionNow()">
          ${LANG === 'el' ? 'Άνοιξε το Companion' : 'Open Companion'}
        </button>
      </div>
    </div>`;
}

function openCompanionNow() {
  goBack();
  setTimeout(() => {
    if (window.c2RunApiTurn) {
        window.c2RunApiTurn('User clicked to open from AI screen.');
    } else if (window.c2ToggleSheet) {
        window.c2ToggleSheet();
    }
  }, 200);
}
