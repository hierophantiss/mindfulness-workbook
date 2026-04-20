/* ═══ js/app.js ═══ */
var microCat = '';
var microIdx = 0;
function installApp() {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    window.deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      }
      window.deferredPrompt = null;
    });
  } else {
    alert(t('installNotSupported') || 'Η εγκατάσταση δεν υποστηρίζεται σε αυτόν τον browser.');
  }
}

// Listen for PWA install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  window.deferredPrompt = e;
});

// ═══ THEME ═══
function toggleDark() {
  const body = document.body;
  const isDark = body.classList.contains('dark');
  if (isDark) {
    body.classList.remove('dark');
    document.getElementById('dark-toggle').textContent = '🌙';
  } else {
    body.classList.add('dark');
    document.getElementById('dark-toggle').textContent = '☀️';
  }
}

function showScreen(id) {
  tapFeedback();
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  if (screen) {
    screen.classList.add('active');
    if (currentScreen !== id) {
      screenHistory.push(id);
      try{history.pushState({screen:id},'','#'+id)}catch(e){}
    }
    currentScreen = id;
  }

  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  const navMap = { home:'nav-home', chapters:'nav-chapters', chapter:'nav-chapters', breath:'nav-breath', journal:'nav-journal', ai:'nav-ai' };
  const navId = navMap[id];
  if (navId) {
    const activeBtn = document.getElementById(navId);
    if (activeBtn) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
    }
  }

  // Build screen content on demand
  if (id === 'chapters') buildChaptersList();
  if (id === 'practice') buildPracticeList();
  if (id === 'breath') setTimeout(initBreathExercise, 150);
  if (id === 'ai') buildAIScreen();
  if (id === 'journal') buildJournal();
  if (id === 'start') buildStartScreen();
  if (id === 'micro') buildMicroScreen();
  if (id === 'about') buildAboutScreen();
  if (id === 'downloads') buildDownloadsScreen();
  if (id === 'widget') buildWidgetScreen();

  // Scroll to top
  var scrollArea = screen ? screen.querySelector('.scroll-area') : null;
  if (scrollArea) scrollArea.scrollTop = 0;
  const sa = screen?.querySelector('.scroll-area');
  if (sa) sa.scrollTop = 0;
}

function goBack() {
  try{history.back()}catch(e){showScreen('home')}
}

// Browser back button handler
window.addEventListener('popstate', function(e) {
  if (e.state && e.state.screen) {
    currentScreen = e.state.screen;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    var screen = document.getElementById('screen-' + e.state.screen);
    if (screen) screen.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    var navMap = { home:'nav-home', chapters:'nav-chapters', chapter:'nav-chapters', breath:'nav-breath', journal:'nav-journal', ai:'nav-ai' };
    var navId = navMap[e.state.screen];
    if (navId) document.getElementById(navId)?.classList.add('active');
  } else {
    currentScreen = 'home';
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-home').classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-home')?.classList.add('active');
  }
});

// ═══ LANGUAGE ═══
function setLang(lang) {
  LANG = lang;
  document.documentElement.lang = lang;

  // Update lang button
  const btn = document.getElementById('lang-label');
  if (btn) btn.textContent = lang === 'el' ? 'EN' : 'ΕΛ';

  // Update top title
  document.getElementById('top-title').textContent = lang === 'el' ? 'Mindfulness' : 'Mindfulness';
  var elSub = document.getElementById('top-subtitle-el');
  if (elSub) elSub.style.display = lang === 'el' ? 'block' : 'none';
  // Update hero quotes for new language
  updateQuote();

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (T[lang] && T[lang][key]) el.textContent = T[lang][key];
  });

  // Update all data-i18n-title elements (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (T[lang] && T[lang][key]) el.title = T[lang][key];
  });

  // Update all data-i18n-aria elements (accessibility labels)
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    if (T[lang] && T[lang][key]) el.setAttribute('aria-label', T[lang][key]);
  });

  // Update dynamic content
  updateQuote();
  if (currentScreen === 'chapters') buildChaptersList();
  if (currentScreen === 'practice') buildPracticeList();
  if (currentScreen === 'journal') buildJournal();
  if (currentScreen === 'start') buildStartScreen();
  if (currentScreen === 'about') buildAboutScreen();
  if (currentScreen === 'breath') updateBreathLang();

  // Welcome screen translations
  var wt = document.getElementById('w-title');
  if (wt) {
    wt.textContent = t('welcomeTitle');
    document.getElementById('w-q').textContent = t('welcomeQ');
    document.getElementById('w-skip').textContent = t('welcomeSkip');
    // w-sub and w-desc handled by data-i18n attributes
  }
  
  if (typeof initNotifications === 'function') initNotifications();
}

function t(key) {
  return (T[LANG] && T[LANG][key]) || (T.el && T.el[key]) || key;
}

// ═══ PRACTICE OVERLAY ═══
function launchPractice(file) {
  const overlay = document.getElementById('practice-overlay');
  const iframe = document.getElementById('practice-iframe');
  
  // Hide parent FAB when practice starts
  const fab = document.getElementById('companion-fab');
  if (fab) fab.style.display = 'none';

  const sep = file.includes('?') ? '&' : '?';
  iframe.src = file + sep + 'lang=' + LANG;
  overlay.style.display = 'block';
  trackExerciseOpened(file);
}

function closePractice() {
  document.getElementById('practice-overlay').style.display = 'none';
  document.getElementById('practice-iframe').src = '';
  
  // Restore parent FAB
  const fab = document.getElementById('companion-fab');
  if (fab) fab.style.display = 'flex';
}

// ═══ TRIGGER WARNING ═══
let pendingFile = null;
function showTW(msg, file) {
  pendingFile = file;
  const overlay = document.getElementById('tw-overlay');
  if (!overlay) return launchPractice(file);
  document.getElementById('tw-text').textContent = msg;
  overlay.style.display = 'flex';
}
function closeTW() {
  document.getElementById('tw-overlay').style.display = 'none';
}
function confirmTW() {
  const f = pendingFile;
  closeTW();
  if (f) launchPractice(f);
}

// ═══ 8-WEEK PROGRAM ═══
function openLearningToRide() {
  const file = LANG === 'el' ? 'learning-to-ride-greek.html' : 'learning-to-ride.html';
  launchPractice(file);
}

// ═══ TOAST SYSTEM ═══
function showToast(msg, duration = 3000) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:rgba(20,40,45,0.95);color:#fff;padding:12px 20px;border-radius:12px;font-size:13px;z-index:1000;box-shadow:0 8px 30px rgba(0,0,0,0.5);border:1px solid rgba(168,213,220,0.2);pointer-events:none;text-align:center;max-width:85%;transition:all 0.4s ease;opacity:0';
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

// ═══ QUOTES ═══
const QUOTES = {
  el: [
    { text: '«Η παρουσία δεν χρειάζεται ώρες. Ξεκινά με νίκες λίγων δευτερολέπτων.»', src: 'Τετραπλός Άξονας' },
    { text: '«Δεν είσαι τα σύννεφα. Είσαι ο ουρανός που τα χωράει.»', src: 'Τετραπλός Άξονας' },
    { text: '«Ο νους σου δεν είναι σπασμένος — λειτουργεί διαφορετικά.»', src: 'Τετραπλός Άξονας' },
    { text: '«Η βαρύτητα είναι πάντα εδώ. Το σώμα είναι πάντα εδώ.»', src: 'Τετραπλός Άξονας' },
    { text: '«Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση.»', src: 'Τετραπλός Άξονας' },
    { text: '«Παρατηρώ χωρίς να επεμβαίνω. Κάθε αναπνοή είναι μια νέα αρχή.»', src: 'Τετραπλός Άξονας' }
  ],
  en: [
    { text: '"Presence doesn\'t need hours. It starts with victories of a few seconds."', src: 'Fourfold Axis' },
    { text: '"You are not the clouds. You are the sky that holds them."', src: 'Fourfold Axis' },
    { text: '"Your mind is not broken — it works differently."', src: 'Fourfold Axis' },
    { text: '"Gravity is always here. The body is always here."', src: 'Fourfold Axis' },
    { text: '"Returning attention is not failure — it is the practice itself."', src: 'Fourfold Axis' },
    { text: '"I observe without intervening. Every breath is a new beginning."', src: 'Fourfold Axis' }
  ]
};

var quoteInterval = null;
function updateQuote() {
  var quotes = QUOTES[LANG] || QUOTES.el;
  var el = document.getElementById('hero-quote');
  if (!el) return;
  if (quoteInterval) clearInterval(quoteInterval);
  var idx = 0;
  function show() {
    var noMotion = document.body.classList.contains('reduce-motion');
    if (noMotion) { el.textContent = quotes[idx].text; idx = (idx + 1) % quotes.length; return; }
    el.style.opacity = '0';
    setTimeout(function() {
      el.textContent = quotes[idx].text;
      el.style.opacity = '1';
      idx = (idx + 1) % quotes.length;
    }, 600);
  }
  show();
  quoteInterval = setInterval(show, 6000);
}

// ═══ INITIALIZATION ═══
window.addEventListener('DOMContentLoaded', () => {
  // If onboarding was already seen, initialize screen immediately
  if (localStorage.getItem('onboarding_seen') === '1') {
    setLang(LANG || 'el');
    showScreen('home');
  } else {
    // Onboarding will handle initialization if not seen yet
    // but we set a default lang just in case
    setLang(LANG || 'el');
  }
});
