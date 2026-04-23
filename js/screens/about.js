/* ═══ js/screens/about.js ═══ */
function buildAboutScreen() {
  const screen = document.getElementById('screen-about');
  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('menuAbout')}</div>
      </div>

      <!-- COMPANION ABOUT SECTION -->
      <div style="padding: 16px 16px 4px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${(t('compAboutCards') || []).map(function(card){
          return `
            <div style="background: var(--bg-card); border: 0.5px solid var(--border); border-radius: 16px; padding: 16px; min-height: 120px; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="font-family: inherit; font-size: 14px; font-weight: 700; color: var(--teal); margin-bottom: 8px;">${card.title}</div>
              <div style="font-size: 11px; color: var(--text-soft); line-height: 1.5;">${card.text}</div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="content-card mindful-focus-section" style="border-left:3px solid var(--teal)">
        <h3>${t('whatsDifferent')}</h3>
        <p>${t('whatsDifferentBody').replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>')}</p>
      </div>
      <div class="content-card mindful-focus-section" style="border-left:3px solid var(--gold)">
        <h3>${t('researchTitle')}</h3>
        <p style="margin-bottom:14px;font-size:13px;color:var(--text-soft);line-height:1.6">${t('researchIntro')}</p>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${(t('researchItems')||[]).map(function(item){ return '<div style="font-size:13px;color:var(--text-soft);line-height:1.7">'+item+'</div>'; }).join('')}
        </div>
        <div style="margin-top:14px;padding:12px;background:rgba(42,93,94,0.06);border-radius:8px;font-size:12px;color:var(--text);line-height:1.6;font-style:italic">${t('researchFooter')}</div>
      </div>
      <div class="content-card mindful-focus-section">
        <h3>${t('traumaTitle')}</h3>
        <p>${t('traumaText').replace(/\\n\\n/g, '<br><br>').replace(/\\n/g, '<br>')}</p>
      </div>
      <div class="content-card mindful-focus-section">
        <h3>${t('aboutTitle')}</h3>
        <p class="about-bio">${t('aboutText')}</p>
        <a class="about-email" href="mailto:bairaktaris.theodoros@gmail.com">✉ ${t('aboutContact')}</a>
      </div>
      <div class="content-card mindful-focus-section">
        <h3>${t('glossaryTitle')}</h3>
        <div style="font-size:13px;color:var(--text-soft);line-height:1.8">
          <div style="margin-bottom:8px"><strong style="color:var(--teal)">Insula</strong> — ${LANG==='el'?'Η γέφυρα αίσθησης-επίγνωσης. Ενισχύεται με πρακτική.':'Bridge between sensation and awareness. Strengthens with practice.'}</div>
          <div style="margin-bottom:8px"><strong style="color:var(--teal)">DMN</strong> — ${LANG==='el'?'Ο «αυτόματος πιλότος» του νου. Η ενσυνειδητότητα τον ρυθμίζει.':'The mind autopilot. Mindfulness regulates it.'}</div>
          <div style="margin-bottom:8px"><strong style="color:var(--teal)">${LANG==='el'?'Πνευμονογαστρικό':'Vagus Nerve'}</strong> — ${LANG==='el'?'Η αργή εκπνοή το ενεργοποιεί → ηρεμία.':'Slow exhale activates it → calm.'}</div>
          <div style="margin-bottom:8px"><strong style="color:var(--teal)">${LANG==='el'?'Ιδιοδεκτικότητα':'Proprioception'}</strong> — ${LANG==='el'?'Ο εσωτερικός GPS σου — αίσθηση θέσης στον χώρο.':'Your internal GPS — sense of position in space.'}</div>
          <div><strong style="color:var(--teal)">${LANG==='el'?'Νευροπλαστικότητα':'Neuroplasticity'}</strong> — ${LANG==='el'?'Ο εγκέφαλος αλλάζει δομή με εμπειρία. 8 εβδομάδες αρκούν.':'Brain changes structure through experience. 8 weeks enough.'}</div>
        </div>
      </div>
      <div style="padding:16px;text-align:center">
        <button class="footer-link" onclick="tapFeedback(); initOnboarding(true)" style="margin-bottom:12px; display:inline-block; border:1px solid rgba(168,213,220,0.1); padding:6px 12px; border-radius:20px; color:var(--text-soft); cursor:pointer; background:rgba(255,255,255,0.03); font-size:11px;">
          ✨ ${t('replayIntro')}
        </button>
        <p style="font-size:10px;color:var(--text-hint)">🔒 ${t('privacyNote')}</p>
      </div>
    </div>`;
}

