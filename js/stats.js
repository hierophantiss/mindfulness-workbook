// js/stats.js
/* ═══════════════════════════════════════════
   stats.js — Session tracking & localStorage
   ═══════════════════════════════════════════ */

function loadStats() {
  try {
    return JSON.parse(localStorage.getItem('mindful_stats')) || {sessions:0,minutes:0,streak:0,lastDate:'',explored:[]};
  } catch { return {sessions:0,minutes:0,streak:0,lastDate:'',explored:[]}; }
}
function saveStats(s) { localStorage.setItem('mindful_stats', JSON.stringify(s)); }

let stats = loadStats();
if (!stats.explored) stats.explored = [];

function recordSession(minutes) {
  const today = new Date().toDateString();
  stats.sessions++;
  stats.minutes += minutes;
  
  if (!stats.dailyCount) stats.dailyCount = { date: '', count: 0 };
  if (stats.dailyCount.date !== today) {
    stats.dailyCount.date = today;
    stats.dailyCount.count = 1;
  } else {
    stats.dailyCount.count++;
  }

  if (stats.lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    stats.streak = (stats.streak || 0) + (stats.lastDate === yesterday ? 1 : 1); // Simple bounce back or count
    stats.lastDate = today;
  }
  saveStats(stats);
}

function trackExerciseOpened(file) {
  if (!stats.explored) stats.explored = [];
  const id = file.replace('.html', '');
  if (!stats.explored.includes(id)) {
    stats.explored.push(id);
    saveStats(stats);
  }
}
