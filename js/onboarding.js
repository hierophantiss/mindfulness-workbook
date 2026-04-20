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
      title: t('onboardToolSOS'),
      body: '', // Short context from title
      icon: '🆘',
      color: 'var(--terra)',
      highlight: 'home-sos-card'
    },
    {
      title: t('onboardToolBreath'),
      body: '',
      icon: '🎧',
      color: 'var(--accent-purple)',
      highlight: 'nav-breath'
    },
    {
      title: t('onboardToolExercises'),
      body: '',
      icon: '🎯',
      color: 'var(--gold)',
      highlight: 'home-exercises-card'
    },
    {
      title: t('onboardToolChapters'),
      body: '',
      icon: '📖',
      color: 'var(--teal)',
      highlight: 'home-chapters-card'
    },
    {
      title: t('onboardToolMicro'),
      body: '',
      icon: '⚡',
      color: 'var(--accent-purple)',
      highlight: 'home-micro-card'
    },
    {
      title: t('onboardToolJournal'),
      body: '',
      icon: '📓',
      color: 'var(--lav)',
      highlight: 'nav-journal'
    },
    {
      title: t('onboardToolWork'),
      body: '',
      icon: '📖',
      color: 'var(--terra)',
      highlight: 'home-downloads-link'
    },
    {
      title: t('onboardMemory'),
      body: t('onboardMemoryBody'),
      icon: '🧠',
      color: 'var(--gold)'
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
    
    // Apply new highlight if any
    if (step.highlight) {
      const target = document.getElementById(step.highlight);
      if (target) {
        target.classList.add('onboarding-highlight');
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
