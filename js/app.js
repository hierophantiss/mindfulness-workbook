/* ═══ js/app.js ═══ */
/**
 * Main Application Module
 * Handles navigation, language switching, and core screen orchestration.
 */

// Global State for legacy scripts
var LANG = (typeof LANG !== 'undefined') ? LANG : 'el';
var currentScreen = 'home';
var screenHistory = [];

const App = {
  currentScreen: 'home',
  screenHistory: [],
  deferredPrompt: null,

  init() {
    this.registerPWA();
    this.setupAccessibility();
    this.restoreState();
    this.setupNavigation();
    
    // Explicitly initialize companions if available
    setTimeout(() => {
      if (typeof window.initCompanion === 'function') window.initCompanion();
      if (typeof window.c2Init === 'function') window.c2Init();
    }, 1000);
  },

  registerPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => {})
          .catch(err => console.warn('SW registration failed:', err));
      });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
  },

  installPWA() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
        } else {
        }
        this.deferredPrompt = null;
      });
    } else {
      // Check for iOS/non-supported browsers
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        showToast('Για εγκατάσταση στο iOS: πάτα το κουμπί Share και μετά "Προσθήκη στην οθόνη αφετηρίας"');
      } else {
        showToast(t('installNotSupported') || 'Η εγκατάσταση δεν υποστηρίζεται ή η εφαρμογή είναι ήδη εγκατεστημένη.');
      }
    }
  },

  setupAccessibility() {
    // Global Keyboard listener for role="button" elements
    document.addEventListener('keydown', (e) => {
      if (e.target.getAttribute('role') === 'button' || e.target.tagName === 'BUTTON') {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            e.target.click();
          }
        }
      }
    });

    // Tap feedback sound/haptic wrapper
    window.tapFeedback = () => {
      if (typeof hapticFeedback === 'function') hapticFeedback('light');
    };
  },

  restoreState() {
    this.setLang(LANG || 'el');
    this.showScreen('home');
    this.updateHeroBtnUI();
  },

  setupNavigation() {
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.screen) {
        this.showScreen(e.state.screen, true);
      } else {
        this.showScreen('home', true);
      }
    });
  },

  showScreen(id, isPopState = false) {
    if (typeof tapFeedback === 'function' && !isPopState) tapFeedback();

    const oldScreenId = this.currentScreen;
    this.currentScreen = id;

    // UI Updates
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById('screen-' + id);
    if (screen) {
      screen.classList.add('active');
      const sa = screen.querySelector('.scroll-area');
      if (sa) sa.scrollTop = 0;
    }

    // Legacy sync
    window.currentScreen = id;

    // History Management
    if (!isPopState) {
      this.screenHistory.push(id);
      try {
        history.pushState({ screen: id }, '', '#' + id);
      } catch (e) {}
    }

    // Screen-specific cleanup (Leaving)
    if (oldScreenId === 'breath' && id !== 'breath') {
      this.stopBreathEngine();
    }
    if (oldScreenId === 'home' && id !== 'home') {
      if (quoteInterval) {
        clearInterval(quoteInterval);
        quoteInterval = null;
      }
    }

    // Screen-specific initialization (Entering)
    this.routeBuilders(id);
    if (id === 'home') {
      updateQuote();
    }
  },

  routeBuilders(id) {
    switch (id) {
      case 'home': updateHeroProgress(); break;
      case 'chapters': buildChaptersList(); break;
      case 'practice': buildPracticeList(); break;
      case 'breath': setTimeout(() => { if(typeof initBreathExercise === 'function') initBreathExercise(); }, 150); break;
      case 'ai': if(typeof buildAIScreen === 'function') buildAIScreen(); break;
      case 'journal': if(typeof buildJournal === 'function') buildJournal(); break;
      case 'start': if(typeof buildStartScreen === 'function') buildStartScreen(); break;
      case 'micro': if(typeof buildMicroScreen === 'function') buildMicroScreen(); break;
      case 'about': if(typeof buildAboutScreen === 'function') buildAboutScreen(); break;
      case 'downloads': if(typeof buildDownloadsScreen === 'function') buildDownloadsScreen(); break;
      case 'widget': if(typeof buildWidgetScreen === 'function') buildWidgetScreen(); break;
    }
  },

  goBack() {
    if (this.screenHistory.length > 1) {
      this.screenHistory.pop(); // current
      const prev = this.screenHistory.pop(); // previous
      this.showScreen(prev);
    } else {
      this.showScreen('home');
    }
  },

  stopBreathEngine() {
    if (typeof bPause === 'function') bPause();
    if (typeof stopBreathAudio === 'function') stopBreathAudio();
    if (typeof window !== 'undefined') window.breathAudioOn = false;
  },

  setLang(lang) {
    LANG = lang;
    document.documentElement.lang = lang;

    const btn = document.getElementById('lang-label');
    if (btn) btn.textContent = lang === 'el' ? 'EN' : 'ΕΛ';

    const topTitle = document.getElementById('top-title');
    if (topTitle) topTitle.textContent = lang === 'el' ? 'Mindfulness' : 'Mindfulness';

    // Update i18n placeholders
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (T[lang] && T[lang][key]) el.textContent = T[lang][key];
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (T[lang] && T[lang][key]) el.setAttribute('aria-label', T[lang][key]);
    });

    // Refresh current screen
    this.routeBuilders(this.currentScreen);
    updateQuote();
    if (typeof initNotifications === 'function') initNotifications();
  },

  updateHeroBtnUI() {
    const audioBtn = document.getElementById('hero-btn-audio');
    const voiceBtn = document.getElementById('hero-btn-voice');
    const audioActive = !!(window.breathAudioOn);
    const voiceActive = !!(window.bVoiceEnabled);
    
    if (audioBtn) {
      audioBtn.classList.toggle('active', audioActive);
      audioBtn.setAttribute('aria-pressed', audioActive);
      const icon = document.getElementById('hero-audio-icon');
      if (icon) icon.textContent = audioActive ? '🎧' : '♪';
    }
    if (voiceBtn) {
      voiceBtn.classList.toggle('active', voiceActive);
      voiceBtn.setAttribute('aria-pressed', voiceActive);
    }
  }
};

function toggleHeroAudio() {
  if (typeof toggleBreathAudio === 'function') {
    toggleBreathAudio();
  }
}

function toggleHeroVoice() {
  if (typeof toggleBreathVoice === 'function') {
    toggleBreathVoice();
  }
}

// Global Exposure for legacy script compatibility
window.toggleHeroAudio = toggleHeroAudio;
window.toggleHeroVoice = toggleHeroVoice;
function showScreen(id) { App.showScreen(id); }
function goBack() { App.goBack(); }
function setLang(l) { App.setLang(l); }
function toggleDark() {
  document.body.classList.toggle('dark');
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
function t(k) { return (T[LANG] && T[LANG][k]) || (T.el && T.el[k]) || k; }

function openMenu() {
  const overlay = document.getElementById('menu-overlay');
  const panel = document.getElementById('menu-panel');
  if (overlay && panel) {
    if (overlay.style.display !== 'block') {
      overlay.style.display = 'block';
      // Trigger reflow for animation
      overlay.offsetHeight;
      overlay.classList.add('open');
      panel.classList.add('open');
    }
  } else {
  }
}

function toggleMenu() {
  const overlay = document.getElementById('menu-overlay');
  const panel = document.getElementById('menu-panel');
  if (overlay && panel) {
    if (overlay.style.display === 'block') {
      closeMenu();
    } else {
      openMenu();
    }
  } else {
  }
}

function closeMenu() {
  const overlay = document.getElementById('menu-overlay');
  const panel = document.getElementById('menu-panel');
  if (overlay && panel) {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 400);
  }
}

function menuNavigate(id) {
  closeMenu();
  showScreen(id);
}

function openLearningToRide() {
  const file = LANG === 'el' ? 'learning-to-ride-greek.html' : 'learning-to-ride-english.html';
  launchPractice(file);
}

function showToast(msg, duration = 3000) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'app-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, duration);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => App.init());

/**
 * ═══ UI HELPERS ═══
 */

function updateHeroProgress() {
  if (App.currentScreen !== 'home') return;
  const explored = stats.explored || [];
  const practices = T[LANG]?.practices || T.el.practices;
  
  const axesStatus = { 'Body': false, 'Breath': false, 'Attention': false, 'Space': false };

  explored.forEach(id => {
    const p = practices.find(x => x.id === id);
    if (!p) return;
    const ax = p.axis;
    if (ax.includes('Σώμα') || ax.includes('Body')) axesStatus['Body'] = true;
    if (ax.includes('Αναπνοή') || ax.includes('Breath')) axesStatus['Breath'] = true;
    if (ax.includes('Προσοχή') || ax.includes('Attention')) axesStatus['Attention'] = true;
    if (ax.includes('Χώρος') || ax.includes('Space')) axesStatus['Space'] = true;
  });

  const chaptersRead = JSON.parse(localStorage.getItem('chaptersRead') || '[]');
  if (chaptersRead.includes(1)) axesStatus['Body'] = true;
  if (chaptersRead.includes(2)) axesStatus['Breath'] = true;
  if (chaptersRead.includes(3)) axesStatus['Attention'] = true;
  if (chaptersRead.includes(4)) axesStatus['Space'] = true;

  ['body-axis', 'breath-circle', 'attention-triangle', 'space-rays'].forEach((cls, i) => {
    const el = document.querySelector('.' + cls);
    const key = ['Body', 'Breath', 'Attention', 'Space'][i];
    if (el) el.classList.toggle('active', axesStatus[key]);
  });
}

function launchPractice(file) {
  const overlay = document.getElementById('practice-overlay');
  const iframe = document.getElementById('practice-iframe');
  const fab = document.getElementById('companion-fab');
  
  if (fab) fab.style.display = 'none';

  const sep = file.includes('?') ? '&' : '?';
  iframe.src = file + sep + 'lang=' + LANG;
  overlay.style.display = 'block';
  if(typeof trackExerciseOpened === 'function') trackExerciseOpened(file);
}

function closePractice() {
  document.getElementById('practice-overlay').style.display = 'none';
  document.getElementById('practice-iframe').src = '';
  const fab = document.getElementById('companion-fab');
  if (fab) fab.style.display = 'flex';
}

/**
 * ═══ QUOTES ═══
 */
const QUOTES = {
  el: [
    { text: '«Η παρουσία δεν χρειάζεται ώρες. Ξεκινά με νίκες λίγων δευτερολέπτων.»' },
    { text: '«Δεν είσαι τα σύννεφα. Είσαι ο ουρανός που τα χωράει.»' },
    { text: '«Ο νους σου δεν είναι σπασμένος — λειτουργεί διαφορετικά.»' },
    { text: '«Η βαρύτητα είναι πάντα εδώ. Το σώμα είναι πάντα εδώ.»' },
    { text: '«Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση.»' },
    { text: '«Παρατηρώ χωρίς να επεμβαίνω. Κάθε αναπνοή είναι μια νέα αρχή.»' }
  ],
  en: [
    { text: '"Presence doesn\'t need hours. It starts with victories of a few seconds."' },
    { text: '"You are not the clouds. You are the sky that holds them."' },
    { text: '"Your mind is not broken — it works differently."' },
    { text: '"Gravity is always here. The body is always here."' },
    { text: '"Returning attention is not failure — it is the practice itself."' },
    { text: '"I observe without intervening. Every breath is a new beginning."' }
  ]
};

let quoteInterval = null;
function updateQuote() {
  const quotes = QUOTES[LANG] || QUOTES.el;
  const el = document.getElementById('hero-quote');
  if (!el) return;
  if (quoteInterval) clearInterval(quoteInterval);
  let idx = 0;
  const show = () => {
    const noMotion = document.body.classList.contains('reduce-motion');
    if (noMotion) { el.textContent = quotes[idx].text; idx = (idx + 1) % quotes.length; return; }
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = quotes[idx].text;
      el.style.opacity = '1';
      idx = (idx + 1) % quotes.length;
    }, 600);
  };
  show();
  quoteInterval = setInterval(show, 6000);
}

window.App = App;
window.showScreen = showScreen;
window.goBack = goBack;
window.launchPractice = launchPractice;
window.closePractice = closePractice;
window.setLang = setLang;
window.toggleDark = toggleDark;
window.toggleMenu = toggleMenu;
window.openMenu = openMenu;
window.closeMenu = closeMenu;
window.menuNavigate = menuNavigate;
window.openLearningToRide = openLearningToRide;
window.installApp = () => App.installPWA();
window.showToast = showToast;
window.t = t;
window.T = window.T || T;
window.LANG = window.LANG || LANG;

// --- Missing Global Handlers ---

window.welcomeAction = function(action) {
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) overlay.style.display = 'none';
  localStorage.setItem('onboarding_seen', '1');
  
  if (action === 'breath') {
    showScreen('breath');
  } else {
    showScreen('home');
  }
};

let pendingTWFile = null;
window.showTW = function(msgKey, file) {
  const overlay = document.getElementById('tw-overlay');
  const text = document.getElementById('tw-text');
  if (!overlay || !text) return;
  
  text.textContent = t(msgKey);
  pendingTWFile = file;
  overlay.classList.add('active');
};

window.closeTW = function() {
  const overlay = document.getElementById('tw-overlay');
  if (overlay) overlay.classList.remove('active');
  pendingTWFile = null;
};

window.confirmTW = function() {
  const file = pendingTWFile;
  window.closeTW();
  if (file) launchPractice(file);
};
