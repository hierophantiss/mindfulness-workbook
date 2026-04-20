/* ═══ js/notifications.js ═══ */
// Reminder & Notification System for 8-week program
const NOTIF_STORAGE_KEY = 'mindful_reminders_enabled';
const MOMENTS_STORAGE_KEY = 'mindful_moments_enabled';

const REMINDERS_TEXT = {
  el: {
    title: 'Υπενθύμιση Πρακτικής',
    body: 'Είναι ώρα για τη σημερινή σου στιγμή ενσυνειδητότητας. 🧘',
    request: 'Θέλεις να λαμβάνεις υπενθυμίσεις για την πρακτική σου;',
    granted: 'Οι υπενθυμίσεις ενεργοποιήθηκαν!',
    denied: 'Οι υπενθυμίσεις δεν είναι διαθέσιμες.'
  },
  en: {
    title: 'Practice Reminder',
    body: 'It\'s time for your mindfulness moment today. 🧘',
    request: 'Would you like to receive practice reminders?',
    granted: 'Reminders enabled!',
    denied: 'Reminders are not available.'
  }
};

function getMindfulnessMoment() {
  const pool = [];
  // Add micro-doses from i18n
  const microdoses = T[LANG]?.microdoses || T.el.microdoses;
  microdoses.forEach(m => pool.push({title: m.title, body: m.text}));
  
  // Add exercises from chapters
  const chapters = CHAPTERS_DATA[LANG] || CHAPTERS_DATA.el;
  chapters.forEach(ch => {
    if (ch.exercise) {
      pool.push({title: ch.exercise.title, body: ch.exercise.steps[0] + '...'});
    }
  });

  return pool[Math.floor(Math.random() * pool.length)];
}

function initNotifications() {
  if (!("Notification" in window)) return;
  
  checkAndNotify();
  // Check every hour
  setInterval(checkAndNotify, 3600000);
}

function requestNotifPermission() {
  if (!("Notification" in window)) {
    showToast(REMINDERS_TEXT[LANG].denied);
    return;
  }
  
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      localStorage.setItem(NOTIF_STORAGE_KEY, '1');
      showToast(REMINDERS_TEXT[LANG].granted);
      // Send a test one
      new Notification(REMINDERS_TEXT[LANG].title, {
        body: REMINDERS_TEXT[LANG].body,
        icon: '/favicon.ico'
      });
    } else {
      localStorage.setItem(NOTIF_STORAGE_KEY, '0');
    }
  });
}

function checkAndNotify() {
  const practiceEnabled = localStorage.getItem(NOTIF_STORAGE_KEY) === '1';
  const momentsEnabled = localStorage.getItem(MOMENTS_STORAGE_KEY) === '1';
  
  if (!practiceEnabled && !momentsEnabled) return;
  if (Notification.permission !== 'granted') return;
  
  const stats = loadStats();
  const lastDate = stats.lastDate;
  const today = new Date().toDateString();
  const hour = new Date().getHours();

  // 1. Regular Practice Reminder (6 PM if not practiced today)
  if (practiceEnabled && lastDate !== today && hour >= 18) {
    showPracticeNotification();
  }

  // 2. Random Mindfulness Moments (between 10 AM and 8 PM, once in a while)
  if (momentsEnabled && hour >= 10 && hour <= 20) {
    const lastMoment = parseInt(localStorage.getItem('last_moment_timestamp') || '0');
    const now = Date.now();
    // Every 4-6 hours ideally, but check randomly now
    if (now - lastMoment > 4 * 3600000 && Math.random() < 0.2) {
      const moment = getMindfulnessMoment();
      new Notification(moment.title, { body: moment.body, icon: '/favicon.ico' });
      localStorage.setItem('last_moment_timestamp', now.toString());
    }
  }
}

function showPracticeNotification() {
  const lastPrompt = localStorage.getItem('last_notif_timestamp') || 0;
  const now = Date.now();
  
  // Don't notify more than once every 20 hours
  if (now - lastPrompt < 20 * 3600000) return;
  
  new Notification(REMINDERS_TEXT[LANG].title, {
    body: REMINDERS_TEXT[LANG].body,
    icon: '/favicon.ico'
  });
  
  localStorage.setItem('last_notif_timestamp', now.toString());
}

function toggleMoments() {
  if (Notification.permission !== 'granted') {
    requestNotifPermission();
    return;
  }
  const current = localStorage.getItem(MOMENTS_STORAGE_KEY);
  const next = current === '1' ? '0' : '1';
  localStorage.setItem(MOMENTS_STORAGE_KEY, next);
  
  const btn = document.getElementById('moments-toggle');
  if (btn) {
    btn.textContent = next === '1' ? (LANG==='el'?'Ενεργό':'On') : (LANG==='el'?'Ανενεργό':'Off');
  }
  showToast(next === '1' ? t('onboardToolMicro') : t('navHome')); // reusing some keys for feedback or just generic
}
