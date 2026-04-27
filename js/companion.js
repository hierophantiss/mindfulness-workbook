/* ═══════════════════════════════════════════
   companion.js — ∞ Neurodiversity Companion
   A gentle, memory-aware guide for neurodivergent users
   - Guided onboarding tour (replaces static welcome)
   - Tracks reading progress per chapter (scroll depth, time)
   - Integrates with journal mood
   - Offers context-aware, guilt-free suggestions
   - All data in localStorage (device-only)
   - Export/Import for device transfer
   ═══════════════════════════════════════════ */

// ═══ COMPANION STATE ═══
var COMPANION_KEY = 'mindful_companion_v5'; 

function loadCompanionData() {
  try {
    var raw = localStorage.getItem(COMPANION_KEY);
    // Legacy support: try to migrate from v1 or v4 if current is empty
    if (!raw) {
       raw = localStorage.getItem('companion_v4') || localStorage.getItem('companion_v1');
    }
    
    var d = raw ? JSON.parse(raw) : defaultCompanionData();

    if (!d.chapterProgress) d.chapterProgress = {};
    if (!d.visits) d.visits = [];
    if (!d.exercisesDone) d.exercisesDone = [];
    if (!d.dailyLogs) d.dailyLogs = [];
    if (!d.activeDailyPlan) d.activeDailyPlan = null;
    if (!d.dismissed) d.dismissed = false;
    if (!d.lastSeen) d.lastSeen = null;
    if (typeof d.onboarded === 'undefined') d.onboarded = false;
    if (!d.fabPos) d.fabPos = null;
    if (!d.dailyOpen) d.dailyOpen = { date: '', count: 0 };
    
    // Clear old positioning to enforce middle-right default the first time after this update
    var needsSave = false;
    if (!d.posResetV3) {
      d.fabPos = null;
      d.posResetV3 = true;
      needsSave = true;
    }
    if (typeof d.introSeen === 'undefined') {
      d.introSeen = false;
      needsSave = true;
    }
    
    if (needsSave) {
      try { localStorage.setItem(COMPANION_KEY, JSON.stringify(d)); } catch(e) {}
    }
    
    return d;
  } catch(e) { return defaultCompanionData(); }
}

function defaultCompanionData() {
  return {
    chapterProgress: {},
    visits: [],
    exercisesDone: [],
    dailyLogs: [],
    activeDailyPlan: null,
    lastScreen: 'home',
    lastChapter: null,
    firstVisit: new Date().toISOString(),
    lastSeen: null,
    dismissed: false,
    onboarded: false,
    bubbleCount: 0,
    fabPos: null,
    dailyOpen: { date: '', count: 0 },
    posResetV3: true,
    introSeen: false
  };
}

/**
 * Log a meaningful user activity for later AI analysis
 * @param {string} type - 'mood', 'chapter', 'exercise', 'note'
 * @param {any} data - contextual data for the activity
 */
function logCompanionActivity(type, data) {
  if (!companionData.dailyLogs) companionData.dailyLogs = [];
  var entry = {
    t: new Date().toISOString(),
    type: type,
    data: data,
    screen: companionData.lastScreen
  };
  companionData.dailyLogs.push(entry);
  
  // Keep only last 100 entries to avoid bloat
  if (companionData.dailyLogs.length > 100) {
    companionData.dailyLogs = companionData.dailyLogs.slice(-100);
  }
  saveCompanionData(companionData);
}

function saveCompanionData(data) {
  try { 
    localStorage.setItem(COMPANION_KEY, JSON.stringify(data));
    // Emit event for other scripts (like companion2) to sync
    window.dispatchEvent(new CustomEvent('companionDataUpdated', { detail: data }));
  } catch(e) {}
}

var companionData = loadCompanionData();
var companionVisible = false;
var companionTimeout = null;
var chapterScrollTracker = null;
var chapterTimeStart = null;
var isDragging = false;
var fabScrolled = false;

// ═══ INFINITY SYMBOL SVG ═══
function infinitySVG(size) {
  size = size || 32;
  return '<svg width="' + size + '" height="' + Math.round(size * 0.55) + '" viewBox="0 0 120 66" fill="none" xmlns="http://www.w3.org/2000/svg" class="inf-svg-glow">' +
    '<defs><linearGradient id="inf-grad" x1="0" y1="33" x2="120" y2="33" gradientUnits="userSpaceOnUse">' +
    '<stop offset="0%" stop-color="#E8704A"/>' +
    '<stop offset="20%" stop-color="#E8A030"/>' +
    '<stop offset="40%" stop-color="#C8C040"/>' +
    '<stop offset="55%" stop-color="#50B870"/>' +
    '<stop offset="70%" stop-color="#40A0A8"/>' +
    '<stop offset="85%" stop-color="#6070C0"/>' +
    '<stop offset="100%" stop-color="#9860A8"/>' +
    '</linearGradient></defs>' +
    '<path d="M60 33 C60 16, 45 4, 30 4 C15 4, 2 16, 2 33 C2 50, 15 62, 30 62 C45 62, 60 50, 60 33 C60 16, 75 4, 90 4 C105 4, 118 16, 118 33 C118 50, 105 62, 90 62 C75 62, 60 50, 60 33Z" stroke="url(#inf-grad)" stroke-width="6.5" stroke-linecap="round" fill="none" class="inf-path-main"/>' +
    '</svg>';
}

// ═══ ONBOARDING TOUR & INTRO ═══

function showCompanionIntro() {
  if (document.getElementById('comp-intro-card') || companionData.introSeen) return;
  
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  var title = lang === 'el' ? 'Γεια σου! Είμαι ο ∞' : 'Hello! I am ∞';
  var text = lang === 'el' 
    ? 'Είμαι ο σύντροφός σου σε αυτό το ταξίδι. Θα θυμάμαι τι έχεις διαβάσει και θα σε κατευθύνω αν το ζητήσεις. <br><br>Μπορείς να με μετακινήσεις και να με αφήσεις όπου σε βολεύει στην οθόνη!'
    : 'I am your companion on this journey. I will remember what you read and guide you if you ask. <br><br>You can move me and drop me anywhere on the screen!';
  var btnText = lang === 'el' ? 'Κατάλαβα ✦' : 'Got it ✦';
  
  var card = document.createElement('div');
  card.id = 'comp-intro-card';
  card.className = 'companion-intro-card';
  card.innerHTML = 
    '<div class="comp-intro-hero" style="position:relative; width:calc(100% + 48px); height:140px; margin:-24px -24px 20px -24px; overflow:hidden; border-radius:20px 20px 0 0;">' +
      '<img src="hero.webp" style="width:100%; height:100%; object-fit:cover; object-position:center; filter:brightness(0.9);" alt="Hero" loading="lazy" onerror="this.style.background=\'linear-gradient(135deg,#2A5D5E,#A8D5DC)\'">' +
      '<div style="position:absolute; bottom:0; left:0; width:100%; height:50%; background:linear-gradient(to top, var(--bg-card, #FFFFFF), transparent);"></div>' +
    '</div>' +
    '<div class="comp-intro-title">' + title + '</div>' + 
    '<div class="comp-intro-text">' + text + '</div>' + 
    '<button class="comp-intro-btn">' + btnText + '</button>';
  
  document.body.appendChild(card);
  
  // Position in the middle of the screen
  card.style.top = '50%';
  card.style.left = '50%';
  card.style.right = 'auto';
  card.style.transform = 'translate(-50%, -50%)';
  card.style.width = '90%';
  card.style.maxWidth = '360px';
  
  // Force reflow then animate
  card.offsetHeight;
  card.classList.add('show');
  
  card.querySelector('.comp-intro-btn').addEventListener('click', function() {
    card.classList.remove('show');
    setTimeout(function() { card.remove(); }, 400);
    companionData.introSeen = true;
    saveCompanionData(companionData);
    showCompanionNudge();
  });
}

var tourStep = 0;
var tourActive = false;

function getTourSteps() {
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  if (lang === 'el') {
    return [
      {
        title: 'Γεια σου! Είμαι ο ∞',
        text: 'Θα είμαι ο σύντροφός σου σε αυτό το ταξίδι. Μπορείς να με μετακινήσεις όπου σε βολεύει στην οθόνη.',
        target: null
      },
      {
        title: '🎛️ Το Μενού σου',
        text: 'Εδώ θα βρεις όλα τα εργαλεία: Ημερολόγιο, Ρυθμίσεις και την Ανάλυση της προόδου σου.',
        target: '.menu-btn'
      },
      {
        title: '🫁 Άμεση Ηρεμία',
        text: 'Αυτή η κάρτα είναι για τις στιγμές που χρειάζεσαι αναπνοή ή SOS βοήθεια τώρα.',
        target: '#home-breath-card'
      },
      {
        title: '📖 Μάθηση v2',
        text: 'Εδώ ξεκινάς το πρόγραμμα 8 εβδομάδων. Κάθε κεφάλαιο είναι ένα βήμα προς μια πιο ήρεμη ζωή.',
        target: '#home-chapters-card'
      },
      {
        title: '🎯 Εξάσκηση',
        text: 'Όλες οι διαδραστικές ασκήσεις και οι "Μικρές Δόσεις" βρίσκονται εδώ για καθημερινή χρήση.',
        target: '#home-exercises-card'
      },
      {
        title: '♾️ Είμαι πάντα εδώ',
        text: 'Πάτα με για να δεις τι σου προτείνω με βάση την πρόοδό σου. Χωρίς πίεση, μόνο υποστήριξη.',
        target: '#companion-fab'
      }
    ];
  } else {
    return [
      {
        title: 'Hello! I\'m ∞',
        text: 'I\'ll be your companion on this journey. You can move me anywhere on the screen.',
        target: null
      },
      {
        title: '🎛️ Your Menu',
        text: 'Access all tools here: Journal, Settings, and your progress analytics.',
        target: '.menu-btn'
      },
      {
        title: '🫁 Instant Calm',
        text: 'This card is for moments when you need breathing or SOS help right now.',
        target: '#home-breath-card'
      },
      {
        title: '📖 Learning v2',
        text: 'Start your 8-week program here. Each chapter is a step towards a calmer life.',
        target: '#home-chapters-card'
      },
      {
        title: '🎯 Practice',
        text: 'Interactive exercises and "Micro Doses" for your daily mindful routine.',
        target: '#home-exercises-card'
      },
      {
        title: '♾️ Always here',
        text: 'Tap me to see personalized suggestions based on your progress. No pressure, just support.',
        target: '#companion-fab'
      }
    ];
  }
}

function startTour() {
  tourStep = 0;
  tourActive = true;

  // Close old welcome if showing
  var oldWelcome = document.getElementById('welcome-overlay');
  if (oldWelcome) oldWelcome.style.display = 'none';

  // Hide companion bubble if open
  hideCompanionBubble();

  // Remove existing tour overlay
  var existing = document.getElementById('tour-overlay');
  if (existing) existing.remove();

  // Create tour overlay
  var overlay = document.createElement('div');
  overlay.id = 'tour-overlay';
  overlay.innerHTML = '<div id="tour-spotlight"></div><div id="tour-card"></div>';
  document.body.appendChild(overlay);

  // Force reflow then show
  overlay.offsetHeight;
  overlay.classList.add('visible');

  showTourStep(0);
}

function showTourStep(stepIdx) {
  var steps = getTourSteps();
  if (stepIdx >= steps.length) { endTour(); return; }

  tourStep = stepIdx;
  var step = steps[stepIdx];
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  var isFirst = stepIdx === 0;
  var isLast = stepIdx === steps.length - 1;

  var spotlight = document.getElementById('tour-spotlight');
  var card = document.getElementById('tour-card');
  if (!spotlight || !card) return;

  // Find target
  var targetEl = null;
  if (step.target) {
    if (typeof step.targetIndex !== 'undefined') {
      var all = document.querySelectorAll(step.target);
      targetEl = all[step.targetIndex] || null;
    } else {
      targetEl = document.querySelector(step.target);
    }
  }

    // Position spotlight around target
    if (targetEl) {
      function updateSpotlight() {
        if (!tourActive || !document.getElementById('tour-spotlight')) return;
        var r = targetEl.getBoundingClientRect();
        var p = 8;
        var s = document.getElementById('tour-spotlight');
        if (s) {
          s.style.display = 'block';
          s.style.top = (r.top - p) + 'px';
          s.style.left = (r.left - p) + 'px';
          s.style.width = (r.width + p * 2) + 'px';
          s.style.height = (r.height + p * 2) + 'px';
        }
        requestAnimationFrame(updateSpotlight);
      }

      var rect = targetEl.getBoundingClientRect();
      spotlight.style.display = 'block';

      // Scroll into view if needed
      if (rect.top < 60 || rect.bottom > window.innerHeight - 70) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      requestAnimationFrame(updateSpotlight);
    } else {
      spotlight.style.display = 'none';
    }

  // Position card — below target or centered
  var cardTop;
  if (targetEl) {
    var tRect = targetEl.getBoundingClientRect();
    if (tRect.top > window.innerHeight * 0.5) {
      // Target is in bottom half → card goes above
      cardTop = Math.max(70, tRect.top - 210);
    } else {
      // Target is in top half → card goes below
      cardTop = Math.min(tRect.bottom + 16, window.innerHeight - 270);
    }
  } else {
    cardTop = Math.max(100, window.innerHeight * 0.22);
  }

  // Progress dots
  var dots = '';
  for (var i = 0; i < steps.length; i++) {
    dots += '<div class="tour-dot' + (i === stepIdx ? ' active' : '') + (i < stepIdx ? ' done' : '') + '"></div>';
  }

  // Build card HTML
  card.style.top = cardTop + 'px';
  card.className = 'tour-card-enter';
  card.innerHTML =
    '<div class="tour-card-header">' +
      '<div class="tour-card-icon">' + infinitySVG(24) + '</div>' +
      '<div class="tour-card-step">' + (stepIdx + 1) + '/' + steps.length + '</div>' +
    '</div>' +
    '<div class="tour-card-title">' + step.title + '</div>' +
    '<div class="tour-card-text">' + step.text + '</div>' +
    '<div class="tour-dots">' + dots + '</div>' +
    '<div class="tour-card-actions">' +
      (isFirst
        ? '<button class="tour-btn-skip" onclick="endTour()">' + (lang === 'el' ? 'Παράλειψη' : 'Skip') + '</button>' +
          '<button class="tour-btn-next" onclick="showTourStep(1)">' + (lang === 'el' ? 'Ξεκίνα ξενάγηση →' : 'Start tour →') + '</button>'
        : isLast
          ? '<button class="tour-btn-next tour-btn-finish" onclick="endTour()">' + (lang === 'el' ? 'Ας ξεκινήσουμε! ✦' : 'Let\'s begin! ✦') + '</button>'
          : '<button class="tour-btn-back" onclick="showTourStep(' + (stepIdx - 1) + ')">←</button>' +
            '<button class="tour-btn-next" onclick="showTourStep(' + (stepIdx + 1) + ')">' + (lang === 'el' ? 'Επόμενο →' : 'Next →') + '</button>'
      ) +
    '</div>';

  // Animate in
  setTimeout(function() { card.className = 'tour-card-visible'; }, 30);
}

function endTour() {
  tourActive = false;
  companionData.onboarded = true;
  localStorage.setItem('welcomed', '1');
  saveCompanionData(companionData);

  var overlay = document.getElementById('tour-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.remove(); }, 350);
  }

  // Gentle nudge on the FAB
  setTimeout(function() { showCompanionNudge(); }, 600);
}

// ═══ BUILD COMPANION UI ═══
function initCompanion() {
  if (document.getElementById('companion-fab')) return;

  var fab = document.createElement('div');
  fab.id = 'companion-fab';
  fab.innerHTML = infinitySVG(36);
  
  // Apply saved or default position
  updateFabPosition(fab);

  fab.addEventListener('click', function(e) {
    if (isDragging) return;
    e.stopPropagation();
    if (typeof tapFeedback === 'function') tapFeedback();
    
    // Toggle Companion 2.0 Sheet instead of old bubble
    if (window.c2ToggleSheet) {
      window.c2ToggleSheet();
    } else {
      showCompanionBubble();
    }
  });

  makeDraggable(fab);
  document.body.appendChild(fab);

  // Resize Listener
  window.addEventListener('resize', function() {
    updateFabPosition(document.getElementById('companion-fab'));
  });

  // Home Screen Scroll Listener
  setTimeout(function() {
    var homeScreen = document.getElementById('screen-home');
    var scrollArea = homeScreen ? homeScreen.querySelector('.scroll-area') : null;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', function(e) {
        var st = e.target.scrollTop;
        var threshold = 30; 
        if (st > threshold && !fabScrolled) {
          fabScrolled = true;
          updateFabPosition(document.getElementById('companion-fab'));
        } else if (st <= threshold && fabScrolled) {
          fabScrolled = false;
          updateFabPosition(document.getElementById('companion-fab'));
        }
      }, { passive: true });
    }
  }, 1000);

  // We keep the container but no bubble will show now
  if (!document.getElementById('companion-bubble')) {
    var bubble = document.createElement('div');
    bubble.id = 'companion-bubble';
    bubble.innerHTML = '<div id="companion-bubble-inner"></div>';
    document.body.appendChild(bubble);
  }

  document.addEventListener('click', function(e) {
    if (companionVisible && !e.target.closest('#companion-bubble') && !e.target.closest('#companion-fab')) {
      hideCompanionBubble();
    }
  });

  // Watch for session changes to update glow
  setInterval(updateCompanionVisuals, 5000);
  updateCompanionVisuals();

  // Hook into navigation
  var origShowScreen = window.showScreen;
  window.showScreen = function(id) {
    origShowScreen(id);
    companionTrackScreen(id);
    updateFabPosition(document.getElementById('companion-fab'));
  };

  var origOpenChapter = window.openChapter;
  window.openChapter = function(num) {
    origOpenChapter(num);
    companionStartChapterTracking(num);
    updateFabPosition(document.getElementById('companion-fab'));
  };

  // ─── PURELY PASSIVE MODE AFTER 7 INTERACTIONS ═══
  // Silent now, only c2 triggers on click
  
  // TRIGGER INTRO ON LOAD
  if (!companionData.introSeen) {
    setTimeout(showCompanionIntro, 1000);
  }
}

// ═══ COMPANION UI POSITIONING ═══
function getAppBounds() {
  var screenW = window.innerWidth;
  var maxW = screenW;
  
  // Match CSS media queries (--max-w)
  if (screenW >= 900) maxW = 860;
  else if (screenW >= 600) maxW = 720;
  
  var leftEdge = (screenW - maxW) / 2;
  return {
    left: leftEdge,
    right: leftEdge + maxW,
    width: maxW,
    isCentered: screenW > maxW
  };
}

function updateFabPosition(fab) {
  if (!fab) return;
  
  fab.classList.remove('fab-home', 'fab-floating');
  fab.classList.add('fab-floating');
  fab.style.transform = 'none';
  
  // Always give it a slight ambient glow starting out
  if (!fab.getAttribute('data-glow') || fab.getAttribute('data-glow') === "0") {
      fab.setAttribute('data-glow', '1');
  }
  
  // Force reset if saved position is aggressively near the bottom (from very old config)
  if (companionData.fabPos && companionData.fabPos.y > window.innerHeight - 160) {
      companionData.fabPos = null; 
  }
  
  if (companionData.fabPos && typeof companionData.fabPos.x === 'number') {
    // Free movement across entire window width/height bounds
    var x = Math.max(8, Math.min(window.innerWidth - 60, companionData.fabPos.x));
    var y = Math.max(70, Math.min(window.innerHeight - 110, companionData.fabPos.y));
    fab.style.left = x + 'px';
    fab.style.top = y + 'px';
  } else {
    // Default position: Middle-Right of the whole screen
    var fabH = 52;
    var xDefault = window.innerWidth - 68;
    var yDefault = (window.innerHeight / 2) - (fabH / 2);
    fab.style.left = xDefault + 'px';
    fab.style.top = yDefault + 'px';
  }
  fab.style.bottom = 'auto';
  fab.style.right = 'auto';
  fab.style.display = 'flex'; // Force visibility
}

function makeDraggable(el) {
  var startX, startY, initLeft, initTop;
  var isTouch = false;
  
  function onMove(e) {
    if (e.cancelable && e.type.indexOf('touch') !== -1) {
        e.preventDefault(); // Prevent body scrolling while dragging
    }
    isDragging = true;
    el.classList.add('dragging');
    
    var clientX = (e.type.indexOf('touch') !== -1) ? e.touches[0].clientX : e.clientX;
    var clientY = (e.type.indexOf('touch') !== -1) ? e.touches[0].clientY : e.clientY;
    
    var x = initLeft + (clientX - startX);
    var y = initTop + (clientY - startY);
    
    // Free movement across entire window width/height bounds
    x = Math.max(8, Math.min(window.innerWidth - el.offsetWidth - 8, x));
    y = Math.max(60, Math.min(window.innerHeight - el.offsetHeight - 8, y));

    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.bottom = 'auto';
    el.style.right = 'auto';
  }
  
  function onEnd() {
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend', onEnd);
    
    if (isDragging) {
      el.classList.remove('dragging');
      companionData.fabPos = { x: parseFloat(el.style.left), y: parseFloat(el.style.top) };
      saveCompanionData(companionData);
      setTimeout(function() { isDragging = false; }, 50);
    }
    isTouch = false;
  }

  el.addEventListener('mousedown', function(e) {
    if (isTouch) return;
    if (el.classList.contains('fab-home')) return; // Don't drag on home center
    var rect = el.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    initLeft = rect.left;
    initTop = rect.top;
    document.addEventListener('mousemove', onMove, {passive: false});
    document.addEventListener('mouseup', onEnd);
  });
  
  el.addEventListener('touchstart', function(e) {
    if (el.classList.contains('fab-home')) return;
    isTouch = true;
    var rect = el.getBoundingClientRect();
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    initLeft = rect.left;
    initTop = rect.top;
    document.addEventListener('touchmove', onMove, {passive: false});
    document.addEventListener('touchend', onEnd);
  }, {passive: false});
}

function updateCompanionVisuals() {
  var fab = document.getElementById('companion-fab');
  if (!fab) return;
  
  var daily = (typeof stats !== 'undefined' && stats.dailyCount) ? stats.dailyCount.count : 0;
  
  // Set glow level based on daily sessions, always ensure it is at least 1 so it glows lightly
  var level = Math.max(1, Math.min(5, daily));
  fab.setAttribute('data-glow', level);
}

// ═══ SCREEN TRACKING ═══
function companionTrackScreen(screenId) {
  companionData.lastScreen = screenId;
  companionData.lastSeen = new Date().toISOString();
  companionData.visits.push({ date: new Date().toISOString(), screen: screenId });
  if (companionData.visits.length > 50) companionData.visits = companionData.visits.slice(-50);
  saveCompanionData(companionData);
  if (screenId !== 'chapter') companionStopChapterTracking();
}

// ═══ CHAPTER PROGRESS ═══
function companionStartChapterTracking(num) {
  companionStopChapterTracking();
  chapterTimeStart = Date.now();
  companionData.lastChapter = num;
  if (!companionData.chapterProgress[num]) {
    companionData.chapterProgress[num] = { scrollPct: 0, timeSpent: 0, lastVisit: new Date().toISOString(), completed: false, visits: 0 };
  }
  companionData.chapterProgress[num].visits++;
  companionData.chapterProgress[num].lastVisit = new Date().toISOString();
  saveCompanionData(companionData);
  
  // LOG ACTIVITY
  logCompanionActivity('chapter_start', { id: num });

  setTimeout(function() {
    var screen = document.getElementById('screen-chapter');
    var scrollArea = screen ? screen.querySelector('.scroll-area') : null;
    if (scrollArea) {
      chapterScrollTracker = function() {
        var pct = scrollArea.scrollTop / (scrollArea.scrollHeight - scrollArea.clientHeight);
        var capped = Math.min(1, Math.max(0, pct));
        if (companionData.chapterProgress[num] && capped > companionData.chapterProgress[num].scrollPct) {
          var previouslyCompleted = companionData.chapterProgress[num].completed;
          companionData.chapterProgress[num].scrollPct = Math.round(capped * 100) / 100;
          if (capped > 0.85) companionData.chapterProgress[num].completed = true;
          saveCompanionData(companionData);
          
          // LOG COMPLETION ONCE
          if (!previouslyCompleted && companionData.chapterProgress[num].completed) {
            logCompanionActivity('chapter_complete', { id: num });
          }
        }
      };
      scrollArea.addEventListener('scroll', chapterScrollTracker, { passive: true });
    }
  }, 300);
}

function companionStopChapterTracking() {
  if (chapterTimeStart && companionData.lastChapter) {
    var elapsed = Math.round((Date.now() - chapterTimeStart) / 1000);
    if (companionData.chapterProgress[companionData.lastChapter]) {
      companionData.chapterProgress[companionData.lastChapter].timeSpent += elapsed;
      saveCompanionData(companionData);
    }
  }
  chapterTimeStart = null;
  if (chapterScrollTracker) {
    var screen = document.getElementById('screen-chapter');
    var sa = screen ? screen.querySelector('.scroll-area') : null;
    if (sa) sa.removeEventListener('scroll', chapterScrollTracker);
    chapterScrollTracker = null;
  }
}

// ═══ COMPANION INTELLIGENCE ═══
function getCompanionMessage() {
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  var data = companionData;
  var now = new Date();
  var mood = typeof loadMood === 'function' ? loadMood() : -1;
  var totalChapters = 10;
  var chaptersCompleted = 0;
  var keys = Object.keys(data.chapterProgress);
  for (var k = 0; k < keys.length; k++) { if (data.chapterProgress[keys[k]].completed) chaptersCompleted++; }

  var daysSince = 0;
  if (data.lastSeen) daysSince = Math.floor((now - new Date(data.lastSeen)) / 86400000);

  var resumeChapter = null, resumeScroll = 0;
  var progKeys = Object.keys(data.chapterProgress);
  for (var p = 0; p < progKeys.length; p++) {
    var prog = data.chapterProgress[progKeys[p]];
    if (!prog.completed && prog.scrollPct > 0.05 && prog.scrollPct < 0.85 && prog.scrollPct > resumeScroll) {
      resumeScroll = prog.scrollPct;
      resumeChapter = parseInt(progKeys[p]);
    }
  }

  var nextChapter = null;
  for (var i = 1; i <= totalChapters; i++) {
    if (!data.chapterProgress[i] || !data.chapterProgress[i].completed) { nextChapter = i; break; }
  }

  var chs = (typeof CHAPTERS_DATA !== 'undefined') ? (CHAPTERS_DATA[lang] || CHAPTERS_DATA.el) : [];
  var messages = { primary: '', secondary: '', actions: [] };

  if (mood >= 0 && mood <= 1) {
    messages.primary = lang === 'el' ? 'Βλέπω ότι δεν νιώθεις και τόσο καλά σήμερα. Δεν χρειάζεται να κάνεις τίποτα.' : 'I see today isn\'t easy. You don\'t need to do anything.';
    messages.secondary = lang === 'el' ? 'Αν θέλεις, μια ήρεμη αναπνοή μπορεί να βοηθήσει.' : 'If you want, a calm breath might help.';
    messages.actions = [{ label: lang === 'el' ? '🫁 Αναπνοή' : '🫁 Breathe', action: "showScreen('breath')" }];
    return messages;
  }

  if (daysSince >= 2) {
    messages.primary = lang === 'el' ? 'Καλώς ήρθες πίσω. Ξέρω από πού συνεχίζεις.' : 'Welcome back. I know where you left off.';
    if (resumeChapter && chs[resumeChapter - 1]) {
      var ch = chs[resumeChapter - 1];
      messages.secondary = lang === 'el' ? 'Ήσουν στο «' + ch.title + '» (' + Math.round(resumeScroll * 100) + '%). Θέλεις να συνεχίσεις;' : 'You were at "' + ch.title + '" (' + Math.round(resumeScroll * 100) + '%). Continue?';
      messages.actions = [{ label: ch.icon + ' ' + (lang === 'el' ? 'Συνέχισε' : 'Continue'), action: 'openChapter(' + resumeChapter + ')' }];
    } else if (nextChapter && chs[nextChapter - 1]) {
      messages.secondary = lang === 'el' ? 'Το επόμενο βήμα: «' + chs[nextChapter - 1].title + '».' : 'Next step: "' + chs[nextChapter - 1].title + '".';
      messages.actions = [{ label: chs[nextChapter - 1].icon + ' ' + (lang === 'el' ? 'Πάμε' : 'Let\'s go'), action: 'openChapter(' + nextChapter + ')' }];
    }
    return messages;
  }

  if (resumeChapter && chs[resumeChapter - 1]) {
    var ch2 = chs[resumeChapter - 1];
    messages.primary = lang === 'el' ? 'Μένεις στο «' + ch2.title + '» — ' + Math.round(resumeScroll * 100) + '% διαβασμένο.' : 'You\'re at "' + ch2.title + '" — ' + Math.round(resumeScroll * 100) + '% read.';
    messages.secondary = lang === 'el' ? 'Θέλεις να συνεχίσεις;' : 'Want to continue?';
    messages.actions = [{ label: ch2.icon + ' ' + (lang === 'el' ? 'Συνέχισε' : 'Continue'), action: 'openChapter(' + resumeChapter + ')' }];
    return messages;
  }

  if (chaptersCompleted >= totalChapters) {
    messages.primary = lang === 'el' ? 'Ολοκλήρωσες όλα τα κεφάλαια! 🎉' : 'All chapters complete! 🎉';
    messages.secondary = lang === 'el' ? 'Δοκίμασε μια μικρή δόση.' : 'Try a micro dose.';
    messages.actions = [
      { label: lang === 'el' ? '✦ Μικρή δόση' : '✦ Micro dose', action: "microCat='all';microIdx=0;showScreen('micro')" },
      { label: lang === 'el' ? '🫁 Αναπνοή' : '🫁 Breathe', action: "showScreen('breath')" }
    ];
    return messages;
  }

  if (nextChapter && chs[nextChapter - 1]) {
    var ch3 = chs[nextChapter - 1];
    messages.primary = lang === 'el' ? 'Επόμενο βήμα: «' + ch3.title + '»' : 'Next: "' + ch3.title + '"';
    messages.secondary = ch3.sub + ' — ' + chaptersCompleted + '/' + totalChapters + (lang === 'el' ? ' ολοκληρωμένα' : ' completed');
    messages.actions = [{ label: ch3.icon + ' ' + (lang === 'el' ? 'Ξεκίνα' : 'Start'), action: 'openChapter(' + nextChapter + ')' }];
    return messages;
  }

  messages.primary = lang === 'el' ? 'Γεια! Πώς θέλεις να ξεκινήσεις;' : 'Hi! How to start?';
  messages.actions = [
    { label: lang === 'el' ? '📖 Κεφάλαια' : '📖 Chapters', action: "showScreen('chapters')" },
    { label: lang === 'el' ? '🫁 Αναπνοή' : '🫁 Breathe', action: "showScreen('breath')" }
  ];
  return messages;
}

function getProgressSummary() {
  var chaptersCompleted = 0, totalTime = 0;
  var keys = Object.keys(companionData.chapterProgress);
  for (var i = 0; i < keys.length; i++) {
    if (companionData.chapterProgress[keys[i]].completed) chaptersCompleted++;
    totalTime += companionData.chapterProgress[keys[i]].timeSpent || 0;
  }
  return {
    chaptersCompleted: chaptersCompleted, totalChapters: 10,
    totalMinutes: Math.round(totalTime / 60),
    exercises: (typeof stats !== 'undefined' && stats.explored) ? stats.explored.length : 0,
    pct: Math.round((chaptersCompleted / 10) * 100)
  };
}

// ═══ BUBBLE ═══
function toggleCompanionBubble() { companionVisible ? hideCompanionBubble() : showCompanionBubble(); }

function showCompanionBubble() {
  var bubble = document.getElementById('companion-bubble');
  var inner = document.getElementById('companion-bubble-inner');
  if (!bubble || !inner) return;

  var today = new Date().toDateString();
  if (companionData.dailyOpen.date !== today) {
    companionData.dailyOpen.date = today;
    companionData.dailyOpen.count = 1;
  } else {
    companionData.dailyOpen.count++;
  }

  var msg = getCompanionMessage();
  var progress = getProgressSummary();
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';

  // Special message if daily limit reached
  if (companionData.dailyOpen.count >= 3) {
    msg.primary = lang === 'el' ? 'Συγχαρητήρια! Έχεις κάνει 3 check-ins σήμερα.' : 'Congratulations! You\'ve done 3 check-ins today.';
    msg.secondary = lang === 'el' ? 'Η συνέπεια είναι η δύναμή σου. Συνέχισε να παρατηρείς την παρούσα στιγμή.' : 'Consistency is your power. Keep noticing the present moment.';
  }

  var actionsHtml = '';
  for (var i = 0; i < msg.actions.length; i++) {
    actionsHtml += '<button class="comp-action" onclick="hideCompanionBubble();' + msg.actions[i].action + '">' + msg.actions[i].label + '</button>';
  }

  var smartActionsHtml = 
    '<button class="comp-smart-btn" onclick="hideCompanionBubble(); if(window.c2StartFlow){window.c2StartFlow(\'moodCheck\');window.c2ShowSheet();}else{/*fallback*/}">💭 ' + (lang === 'el' ? 'Πώς νιώθεις;' : 'How do you feel?') + '</button>' +
    '<button class="comp-smart-btn" onclick="hideCompanionBubble(); if(window.c2StartFlow){window.c2StartFlow(\'smartHub\');window.c2ShowSheet();}else{/*fallback*/}">🧭 ' + (lang === 'el' ? 'Τι να κάνω;' : 'What to do?') + '</button>';

  inner.innerHTML =
    '<div class="comp-header">' +
      '<div class="comp-icon">' + infinitySVG(28) + '</div>' +
      '<button class="comp-close" onclick="hideCompanionBubble()" aria-label="Close">✕</button>' +
    '</div>' +
    '<div class="comp-body">' +
      '<p class="comp-primary">' + msg.primary + '</p>' +
      (msg.secondary ? '<p class="comp-secondary">' + msg.secondary + '</p>' : '') +
    '</div>' +
    '<div class="comp-smart-actions">' + smartActionsHtml + '</div>' +
    (actionsHtml ? '<div class="comp-actions">' + actionsHtml + '</div>' : '') +
    '<div class="comp-progress">' +
      '<div class="comp-progress-bar"><div class="comp-progress-fill" style="width:' + progress.pct + '%"></div></div>' +
      '<div class="comp-progress-label">' + progress.chaptersCompleted + '/10 ' + (lang === 'el' ? 'κεφάλαια' : 'chapters') +
        (progress.totalMinutes > 0 ? ' · ' + progress.totalMinutes + (lang === 'el' ? ' λεπτά' : ' min') : '') +
        (progress.exercises > 0 ? ' · ' + progress.exercises + (lang === 'el' ? ' ασκήσεις' : ' exercises') : '') +
      '</div>' +
    '</div>' +
    '<div class="comp-footer">' +
      '<button class="comp-footer-btn" onclick="showCompanionSettings()">⚙ ' + (lang === 'el' ? 'Ρυθμίσεις' : 'Settings') + '</button>' +
      '<button class="comp-footer-btn" onclick="startTour()">∞ ' + (lang === 'el' ? 'Ξενάγηση' : 'Tour') + '</button>' +
    '</div>';

  bubble.classList.add('visible');
  companionVisible = true;
  companionData.bubbleCount++;
  saveCompanionData(companionData);
}

function hideCompanionBubble() {
  var bubble = document.getElementById('companion-bubble');
  if (bubble) bubble.classList.remove('visible');
  companionVisible = false;
}

function showCompanionNudge() {
  var fab = document.getElementById('companion-fab');
  if (!fab) return;
  fab.classList.add('nudge');
  setTimeout(function() { fab.classList.remove('nudge'); }, 4000);
}

// ═══ SETTINGS ═══
function showCompanionSettings() {
  var inner = document.getElementById('companion-bubble-inner');
  if (!inner) return;
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  inner.innerHTML =
    '<div class="comp-header"><div class="comp-icon">' + infinitySVG(28) + '</div><button class="comp-close" onclick="hideCompanionBubble()" aria-label="Close">✕</button></div>' +
    '<div class="comp-body"><p class="comp-primary">' + (lang === 'el' ? 'Ρυθμίσεις' : 'Settings') + '</p>' +
    '<p class="comp-secondary">' + (lang === 'el' ? 'Τα δεδομένα αποθηκεύονται μόνο στη συσκευή σου.' : 'Data stays on your device.') + '</p></div>' +
    '<div class="comp-actions" style="flex-direction:column">' +
      '<button class="comp-action" onclick="companionExport()">📤 ' + (lang === 'el' ? 'Εξαγωγή' : 'Export') + '</button>' +
      '<button class="comp-action" onclick="companionImportTrigger()">📥 ' + (lang === 'el' ? 'Εισαγωγή' : 'Import') + '</button>' +
      '<button class="comp-action comp-action-danger" onclick="companionReset()">🗑 ' + (lang === 'el' ? 'Διαγραφή' : 'Delete') + '</button>' +
    '</div>' +
    '<div class="comp-footer"><button class="comp-footer-btn" onclick="showCompanionBubble()">← ' + (lang === 'el' ? 'Πίσω' : 'Back') + '</button></div>' +
    '<input type="file" id="companion-import-file" accept=".json" style="display:none" onchange="companionImportFile(this)">';
}

// ═══ EXPORT / IMPORT ═══
function companionExport() {
  var d = { companion: companionData, version: 1, exportDate: new Date().toISOString() };
  try { d.journal = JSON.parse(localStorage.getItem('journal_v1')); } catch(e) {}
  try { d.stats = JSON.parse(localStorage.getItem('mindful_stats')); } catch(e) {}
  try { d.mood = JSON.parse(localStorage.getItem('mood_today')); } catch(e) {}
  try { d.chaptersRead = JSON.parse(localStorage.getItem('chaptersRead')); } catch(e) {}
  try { d.breathSessions = JSON.parse(localStorage.getItem('breath_sessions')); } catch(e) {}
  var blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = 'mindfulness-' + new Date().toISOString().split('T')[0] + '.json'; a.click();
  URL.revokeObjectURL(url);
  if (typeof showSaveConfirm === 'function') showSaveConfirm();
}
function companionImportTrigger() { var el = document.getElementById('companion-import-file'); if (el) el.click(); }
function companionImportFile(input) {
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var d = JSON.parse(e.target.result);
      if (!d.version || !d.companion) { alert(lang === 'el' ? 'Μη έγκυρο αρχείο.' : 'Invalid file.'); return; }
      if (!confirm(lang === 'el' ? 'Αντικατάσταση δεδομένων;' : 'Replace data?')) return;
      companionData = d.companion; saveCompanionData(companionData);
      if (d.journal) localStorage.setItem('journal_v1', JSON.stringify(d.journal));
      if (d.stats) { localStorage.setItem('mindful_stats', JSON.stringify(d.stats)); if (typeof loadStats === 'function') stats = loadStats(); }
      if (d.mood) localStorage.setItem('mood_today', JSON.stringify(d.mood));
      if (d.chaptersRead) localStorage.setItem('chaptersRead', JSON.stringify(d.chaptersRead));
      if (d.breathSessions) localStorage.setItem('breath_sessions', JSON.stringify(d.breathSessions));
      if (typeof showSaveConfirm === 'function') showSaveConfirm();
      showCompanionBubble();
    } catch(err) { alert(lang === 'el' ? 'Σφάλμα εισαγωγής.' : 'Import error.'); }
  };
  reader.readAsText(file);
}
function companionReset() {
  var lang = typeof LANG !== 'undefined' ? LANG : 'el';
  if (confirm(lang === 'el' ? 'Διαγραφή δεδομένων βοηθού;' : 'Delete companion data?')) {
    companionData = defaultCompanionData(); saveCompanionData(companionData); showCompanionBubble();
  }
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', function() { setTimeout(initCompanion, 500); });
