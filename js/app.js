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
  },

  registerPWA() {
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
          console.log('User accepted the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
    } else {
      alert(t('installNotSupported') || 'Η εγκατάσταση δεν υποστηρίζεται σε αυτόν τον browser.');
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

    // Screen-specific initialization (Entering)
    this.routeBuilders(id);
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

// Global Exposure for legacy script compatibility
function showScreen(id) { App.showScreen(id); }
function goBack() { App.goBack(); }
function setLang(l) { App.setLang(l); }
function toggleDark() {
  document.body.classList.toggle('dark');
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}
function t(k) { return (T[LANG] && T[LANG][k]) || (T.el && T.el[k]) || k; }

function toggleMenu() {
  const overlay = document.getElementById('menu-overlay');
  const panel = document.getElementById('menu-panel');
  if (overlay && panel) {
    overlay.style.display = 'block';
    // Trigger reflow for animation
    overlay.offsetHeight;
    overlay.classList.add('open');
    panel.classList.add('open');
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

/* ═══ GLOBAL EVENT DELEGATION ═══ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    // Traverse up to find a button or element with data-action
    const target = e.target.closest('[data-action]');
    if (!target) return;
    
    const action = target.getAttribute('data-action');
    
    switch (action) {
      case 'welcome-breath':
        if(typeof tapFeedback === 'function') tapFeedback();
        welcomeAction('breath');
        break;
      case 'welcome-explore':
        if(typeof tapFeedback === 'function') tapFeedback();
        welcomeAction('explore');
        break;
      case 'toggle-menu':
        toggleMenu();
        break;
      case 'toggle-dark':
        toggleDark();
        break;
      case 'toggle-lang':
        setLang(LANG === 'el' ? 'en' : 'el');
        break;
      case 'close-menu':
        closeMenu();
        break;
      case 'menu-navigate':
        menuNavigate(target.getAttribute('data-screen'));
        break;
      case 'menu-chapters-ltm':
        closeMenu();
        showScreen('chapters');
        setTimeout(() => typeof openLearningToRide === 'function' && openLearningToRide(), 400);
        break;
      case 'menu-breath-sos':
        closeMenu();
        showScreen('breath');
        setTimeout(() => typeof activateSOS === 'function' && activateSOS(), 400);
        break;
      case 'toggle-hero-audio':
        toggleHeroAudio();
        break;
      case 'toggle-hero-voice':
        toggleHeroVoice();
        break;
      case 'show-screen':
        showScreen(target.getAttribute('data-screen'));
        break;
      case 'go-back':
        goBack();
        break;
      case 'toggle-breath-voice':
        if(typeof toggleBreathVoice === 'function') toggleBreathVoice();
        break;
      case 'toggle-breath-audio':
        if(typeof toggleBreathAudio === 'function') toggleBreathAudio();
        break;
      case 'breath-play':
        if(typeof handlePlayClick === 'function') handlePlayClick();
        break;
      case 'breath-exit':
        if(typeof handleExitClick === 'function') handleExitClick();
        break;
      case 'breath-reset':
        if(typeof bReset === 'function') bReset();
        break;
      case 'breath-pattern':
        if(typeof switchPattern === 'function') switchPattern(target.getAttribute('data-pattern'));
        break;
      case 'close-practice':
        if(typeof closePractice === 'function') closePractice();
        break;
      case 'close-tw':
        if(typeof closeTW === 'function') closeTW();
        break;
      case 'confirm-tw':
        if(typeof confirmTW === 'function') confirmTW();
        break;
      default:
        // Action not handled here
        break;
    }
  });

  // Stop propagation for specific cards
  document.querySelectorAll('[data-stop-propagation]').forEach(el => {
    el.addEventListener('click', e => e.stopPropagation());
  });
});

function closeWelcome() {
  const overlay = document.getElementById('welcome-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; overlay.style.opacity = ''; }, 300);
  }
  try { localStorage.setItem('welcomeSeen', '1'); } catch (e) {}
}

function welcomeAction(action) {
  closeWelcome();
  if (action === 'breath') {
    showScreen('breath');
  } else if (action === 'explore') {
    showScreen('chapters');
  }
}

/* ═══ HERO AUDIO / VOICE TOGGLES ═══ */
function toggleHeroAudio() {
  if (typeof toggleBreathAudio === 'function') {
    toggleBreathAudio();
  } else {
    window.breathAudioOn = !window.breathAudioOn;
  }
  if (App && typeof App.updateHeroBtnUI === 'function') App.updateHeroBtnUI();
}

function toggleHeroVoice() {
  if (typeof toggleBreathVoice === 'function') {
    toggleBreathVoice();
  } else {
    window.bVoiceEnabled = !window.bVoiceEnabled;
  }
  if (App && typeof App.updateHeroBtnUI === 'function') App.updateHeroBtnUI();
}

/* ═══ PWA INSTALL ═══ */
function installApp() {
  if (App && typeof App.installPWA === 'function') {
    App.installPWA();
  } else {
    alert(t('installNotSupported') || 'Η εγκατάσταση δεν είναι διαθέσιμη αυτή τη στιγμή.');
  }
}

/* ═══ TRIGGER WARNING OVERLAY ═══ */
var _twPendingFile = null;
function openTW(file, warnText) {
  _twPendingFile = file;
  const overlay = document.getElementById('tw-overlay');
  const text = document.getElementById('tw-text');
  if (text && warnText) text.textContent = warnText;
  if (overlay) overlay.classList.add('active');
}
function closeTW() {
  const overlay = document.getElementById('tw-overlay');
  if (overlay) overlay.classList.remove('active');
  _twPendingFile = null;
}
function confirmTW() {
  const overlay = document.getElementById('tw-overlay');
  if (overlay) overlay.classList.remove('active');
  if (_twPendingFile && typeof launchPractice === 'function') {
    launchPractice(_twPendingFile);
  }
  _twPendingFile = null;
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
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(20,40,45,0.95);color:#fff;padding:12px 20px;border-radius:12px;font-size:13px;z-index:10000;box-shadow:0 8px 30px rgba(0,0,0,0.5);border:1px solid rgba(168,213,220,0.2);pointer-events:none;text-align:center;max-width:85%;transition:all 0.4s ease;opacity:0';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(-10px)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(0px)';
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
