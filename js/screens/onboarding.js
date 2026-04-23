/* ═══ js/onboarding.js ═══ */
function initOnboarding(force = false) {
  if (!force && localStorage.getItem('onboarding_seen') === '1') return;
  
  // Remove existing overlay if any (prevent duplicates)
  const existing = document.getElementById('onboarding-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'onboarding-overlay';
  overlay.className = 'onboarding-overlay';
  
  let currentStep = 0;
  const steps = [
    {
      title: t('onboardTitle'),
      body: t('onboardWelcomeBody'),
      hero: 'hero.png',
      color: 'var(--teal)'
    },
    {
      title: t('onboardPhilosophy'),
      body: t('onboardPhilosophyBody') + '<br><br>' + t('onboardPhilosophyBody2'),
      icon: '🌱',
      color: 'var(--sage)'
    },
    {
      title: t('onboardToolBreath'),
      body: t('onboardToolBreathSub') || 'Αναπνοή, SOS και άμεση υποστήριξη.',
      icon: '🫁',
      color: 'var(--accent-purple)',
      highlight: 'home-breath-card'
    },
    {
      title: t('onboardToolChapters'),
      body: t('onboardToolChaptersSub') || 'Πρόγραμμα 8 εβδομάδων για βαθιά αλλαγή.',
      icon: '📖',
      color: 'var(--teal)',
      highlight: 'home-chapters-card'
    },
    {
      title: t('onboardToolExercises'),
      body: t('onboardToolExercisesSub') || 'Ασκήσεις γείωσης και εστίασης.',
      icon: '🎯',
      color: 'var(--gold)',
      highlight: 'home-exercises-card'
    },
    {
      title: t('onboardToolJournal'),
      body: t('onboardToolJournalSub') || 'Το ημερολόγιο και οι ρυθμίσεις σου.',
      icon: '🎛️',
      color: 'var(--lav)',
      highlight: 'menu-btn'
    },
    {
      title: t('onboardAction'),
      body: '',
      icon: '✨',
      color: 'var(--teal)'
    }
  ];

  function renderStep(idx) {
    const step = steps[idx];
    const isFirst = idx === 0;
    const isLast = idx === steps.length - 1;
    
    // Remote old highlights
    document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));
    document.querySelectorAll('.onboarding-highlight-context').forEach(el => el.classList.remove('onboarding-highlight-context'));
    
    // Apply new highlight if any
    if (step.highlight) {
      const target = document.getElementById(step.highlight);
      if (target) {
        target.classList.add('onboarding-highlight');
        
        // Lift parents to allow child to pop above overlay
        let p = target.parentElement;
        while (p && p.tagName !== 'BODY') {
          if (p.classList.contains('screen') || p.classList.contains('scroll-area') || 
              p.classList.contains('bottom-nav') || p.classList.contains('top-bar') ||
              p.tagName === 'MAIN' || p.tagName === 'HEADER') {
            p.classList.add('onboarding-highlight-context');
          }
          p = p.parentElement;
        }

        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    overlay.innerHTML = `
      <div class="onboarding-card onboarding-card-rich" style="border-top: 4px solid ${step.color}">
        <div class="onboarding-aura" style="background: radial-gradient(circle, ${step.color}22 0%, transparent 70%)"></div>
        
        ${step.hero ? `<img src="${step.hero}" class="onboarding-hero-img" alt="Hero" referrerPolicy="no-referrer">` : ''}

        ${isFirst ? `
          <div class="onboarding-lang-switch">
            <button class="lang-btn ${LANG === 'el' ? 'active' : ''}" id="ob-lang-el">ΕΛ</button>
            <button class="lang-btn ${LANG === 'en' ? 'active' : ''}" id="ob-lang-en">EN</button>
          </div>
        ` : ''}

        ${step.icon ? `<div class="onboarding-icon">${step.icon}</div>` : ''}
        <h2 class="onboarding-title">${step.title}</h2>
        ${step.body ? `<p class="onboarding-body">${step.body}</p>` : ''}
        
        <div class="onboarding-dots">
          ${steps.map((_, i) => `<div class="dot ${i === idx ? 'active' : ''}"></div>`).join('')}
        </div>
        
        <div class="onboarding-actions">
          <button class="btn-onboarding" id="onboard-next">
            ${isLast ? t('welcomeDone') : t('next')}
          </button>
        </div>
      </div>
    `;

    if (isFirst) {
      document.getElementById('ob-lang-el').addEventListener('click', () => {
        if (typeof setLang === 'function') setLang('el');
        renderStep(0);
      });
      document.getElementById('ob-lang-en').addEventListener('click', () => {
        if (typeof setLang === 'function') setLang('en');
        renderStep(0);
      });
    }
    
    document.getElementById('onboard-next').addEventListener('click', () => {
      if (isLast) {
        finishOnboarding();
      } else {
        renderStep(idx + 1);
      }
    });
  }

  function finishOnboarding() {
    document.querySelectorAll('.onboarding-highlight').forEach(el => el.classList.remove('onboarding-highlight'));
    document.querySelectorAll('.onboarding-highlight-context').forEach(el => el.classList.remove('onboarding-highlight-context'));
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
      localStorage.setItem('onboarding_seen', '1');
    }, 600);
  }

  document.body.appendChild(overlay);
  // Ensure we start at home screen for onboarding
  if (typeof showScreen === 'function') showScreen('home');
  renderStep(0);
}

// Ensure it's ready
window.addEventListener('load', () => {
  setTimeout(initOnboarding, 800);
});
