// js/journal.js
// ═══ JOURNAL (placeholder - will use full journal from old code) ═══
// ═══ JOURNAL ═══
let expandedDay = 0;
function emptyWeek() { return t('days').map((d,i)=>({id:i,day:d,checked:{body:false,breath:false,focus:false,space:false},note:''})); }
function loadJournal() { try { return JSON.parse(localStorage.getItem('journal_v1')) || emptyWeek(); } catch { return emptyWeek(); } }
function saveJournal(data) { localStorage.setItem('journal_v1', JSON.stringify(data)); }
let journalData = loadJournal();

function getWeekStart() { const now = new Date(); const day = now.getDay(); const diff = now.getDate() - day + (day === 0 ? -6 : 1); const monday = new Date(now.setDate(diff)); return monday.toISOString().split('T')[0]; }
function getBreathSessions(dayIdx) { try { const data = JSON.parse(localStorage.getItem('breath_sessions') || '{}'); return data[getWeekStart() + '_' + dayIdx] || 0; } catch { return 0; } }

function buildJournal() {
  journalData = loadJournal();
  const screen = document.getElementById('screen-journal');
  const axes = t('axes');
  const days = t('days');
  journalData.forEach((e,i)=> e.day = days[i]);
  const total = journalData.reduce((s,e)=>s+Object.values(e.checked).filter(Boolean).length,0);
  const max = days.length * axes.length;
  const pct = Math.round((total/max)*100);

  screen.innerHTML = `
    <div class="scroll-area">
      <div class="screen-header">
        <button class="back-btn" onclick="goBack()">←</button>
        <div class="screen-title">${t('journalTitle')}</div>
      </div>
      <div style="padding:0 20px 12px">
        <div style="font-size:13px;color:var(--text-soft);margin-bottom:8px">${t('journalSub')}</div>
        <div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden">
          <div style="height:8px;background:var(--teal);border-radius:4px;width:${pct}%;transition:width .5s"></div>
        </div>
        <div style="font-size:12px;color:var(--text-hint);margin-top:4px">${total}/${max} ✓ · ${pct}%</div>
      </div>
      <div style="padding:0 20px 14px">
        <div style="font-size:12px;font-weight:700;color:var(--text-hint);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">${t('moodLabel')}</div>
        <div style="display:flex;gap:8px;justify-content:center">
          ${['😣','😕','😐','🙂','😌'].map((em,i) => {
            const saved = loadMood();
            const active = saved === i;
            return '<button style="font-size:28px;padding:6px 10px;border-radius:12px;border:2px solid '+(active?'var(--teal)':'transparent')+';background:'+(active?'rgba(42,93,94,0.1)':'transparent')+';cursor:pointer;transition:all .2s;transform:'+(active?'scale(1.15)':'scale(1)')+'" onclick="pickMood('+i+')">'+em+'</button>';
          }).join('')}
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-hint);margin-top:4px;padding:0 8px">
          <span>${t('moodBad')}</span><span>${t('moodGood')}</span>
        </div>
      </div>
      <div id="journal-days">
        ${journalData.map((entry,di) => {
          const done = Object.values(entry.checked).filter(Boolean).length === axes.length;
          const isOpen = expandedDay === di;
          const dots = axes.map(ax => `<div style="width:9px;height:9px;border-radius:50%;background:${entry.checked[ax.key]?ax.color:'var(--border)'}"></div>`).join('');
          const chips = axes.map(ax => `
            <button style="border:2px solid ${ax.color};border-radius:22px;padding:9px 14px;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;background:${entry.checked[ax.key]?ax.color:'transparent'};color:${entry.checked[ax.key]?'white':'var(--text)'};transition:all .2s;text-align:left" onclick="toggleCheck(${di},'${ax.key}')">${ax.label}</button>
          `).join('');
          const prompts = t('prompts');
          const checkedAxes = axes.filter(ax => entry.checked[ax.key]);
          let promptsHtml = '';
          if (checkedAxes.length > 0) {
            promptsHtml = `<div style="margin-top:10px">
              <div style="font-size:10px;font-weight:700;color:var(--text-hint);letter-spacing:0.5px;margin-bottom:6px;text-transform:uppercase">${t('promptLabel')}</div>
              ${checkedAxes.map(ax => `<div style="margin-bottom:8px"><div style="font-size:11px;font-weight:700;color:${ax.color};margin-bottom:4px">${ax.label}</div><div style="display:flex;flex-wrap:wrap;gap:4px">${(prompts[ax.key]||[]).map(q => { const used = entry.note && entry.note.includes(q); return '<button style="font-size:11px;padding:5px 10px;border-radius:16px;cursor:pointer;background:rgba(46,139,154,'+(used?'0.12':'0.06')+');border:1px solid rgba(46,139,154,'+(used?'0.25':'0.12')+');color:var(--text);font-family:inherit;opacity:'+(used?'0.5':'1')+'" onclick="addPrompt('+di+',\''+q.replace(/'/g,"\\'")+'\')">'+q+'</button>'; }).join('')}</div></div>`).join('')}
            </div>`;
          }
          const sessions = getBreathSessions(di);
          const sessionHtml = sessions > 0 ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:10px;padding:3px 8px;border-radius:10px;background:rgba(46,139,154,0.1);color:var(--teal);font-weight:600">🫁 ${sessions}</span>` : '';
          return `
            <div style="background:var(--bg-card);margin:0 16px 8px;border-radius:var(--radius);overflow:hidden;border:0.5px solid var(--border)">
              <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;${done?'background:var(--teal);':''}" onclick="toggleDay(${di})">
                <div style="width:34px;height:34px;border-radius:50%;background:${done?'white':'var(--border)'};display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:${done?'var(--teal)':'var(--text-hint)'};flex-shrink:0">${done?'✓':di+1}</div>
                <div style="flex:1;font-size:15px;font-weight:700;color:${done?'white':'var(--text)'}">${entry.day} ${sessionHtml}</div>
                <div style="display:flex;gap:5px">${dots}</div>
                <div style="font-size:14px;color:${done?'rgba(255,255,255,0.5)':'var(--text-hint)'};transition:transform .3s;${isOpen?'transform:rotate(180deg)':''}">▾</div>
              </div>
              <div style="padding:${isOpen?'14px 16px':'0 16px'};border-top:${isOpen?'1px solid var(--border)':'none'};display:${isOpen?'block':'none'}">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">${chips}</div>
                ${promptsHtml}
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
                  <span style="font-size:11px;font-weight:700;color:var(--text-hint)">${t('comfortLevel')}</span>
                  <input type="range" min="1" max="5" value="${entry.comfort||3}" style="flex:1;accent-color:var(--teal)" onchange="updateComfort(${di},+this.value)">
                  <span style="font-size:14px">${['😣','😕','😐','🙂','😌'][((entry.comfort||3)-1)]}</span>
                </div>
                <input type="text" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:10px 12px;font-family:inherit;font-size:12px;color:var(--text);background:var(--bg);outline:none;margin-bottom:8px" placeholder="${t('tagsPlaceholder')}" value="${entry.tags||''}" onchange="updateTags(${di},this.value)">
                
                <!-- BODY MAP SECTION -->
                <div style="font-size:12px;font-weight:700;color:var(--text-hint);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px">${t('bodyMapTitle')}</div>
                <div style="display:flex; gap:12px; align-items:center; margin-bottom:18px">
                  <div style="flex-shrink:0; position:relative; width:80px; height:120px; background:rgba(42,93,94,0.05); border-radius:12px; display:flex; align-items:center; justify-content:center">
                    <svg viewBox="0 0 100 150" style="width:100%; height:100%; fill:none; stroke:var(--text-hint); stroke-width:3">
                      <circle cx="50" cy="20" r="10" />
                      <line x1="50" y1="30" x2="50" y2="80" />
                      <line x1="50" y1="40" x2="20" y2="60" />
                      <line x1="50" y1="40" x2="80" y2="60" />
                      <line x1="50" y1="80" x2="30" y2="130" />
                      <line x1="50" y1="80" x2="70" y2="130" />
                    </svg>
                  </div>
                  <div style="display:flex; flex-wrap:wrap; gap:6px; flex:1">
                    ${Object.entries(t('bodyParts')).map(([key, label]) => {
                      const active = (entry.tensions || []).includes(key);
                      return `<button style="font-size:11px; padding:6px 10px; border-radius:16px; border:1px solid ${active?'var(--teal)':'var(--border)'}; background:${active?'var(--teal)':'transparent'}; color:${active?'white':'var(--text-soft)'}; cursor:pointer" onclick="toggleTension(${di}, '${key}')">${label}</button>`;
                    }).join('')}
                  </div>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
                  <div style="font-size:12px;font-weight:600;color:var(--text-hint)">${t('noteLabel')}</div>
                  <button id="mic-btn-${di}" class="mic-btn" onclick="startSpeech(${di})" style="background:none; border:none; cursor:pointer; font-size:18px; padding:4px; opacity:0.6; display:flex; align-items:center; gap:4px">
                    <span id="mic-icon-${di}">🎙️</span>
                  </button>
                </div>
                <textarea id="note-area-${di}" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:12px;font-family:inherit;font-size:14px;color:var(--text);background:var(--bg);resize:none;min-height:80px;outline:none;line-height:1.5" rows="3" onchange="updateNote(${di},this.value)" placeholder="${t('notePlaceholder')}">${entry.note}</textarea>
              </div>
            </div>`;
        }).join('')}
      </div>
      <button style="display:block;margin:12px auto;background:none;border:none;font-size:13px;color:var(--text-hint);text-decoration:underline;cursor:pointer;font-family:inherit;padding:10px" onclick="journalReset()">${t('resetBtn')}</button>
      <button style="display:block;margin:12px auto;background:rgba(42,93,94,0.1);border:1px solid var(--teal);border-radius:12px;font-size:13px;color:var(--teal);cursor:pointer;font-family:inherit;padding:10px 20px;font-weight:600" onclick="exportJournalNotes()">
        💾 ${t('exportBtn')}
      </button>
    </div>`;
}

function exportJournalNotes() {
  const axes = t('axes');
  let content = `MINDFULNESS WORKBOOK - JOURNAL NOTES\n`;
  content += `Generated: ${new Date().toLocaleString()}\n`;
  content += `------------------------------------------\n\n`;

  journalData.forEach((entry, i) => {
    content += `${entry.day} (Day ${i + 1})\n`;
    content += `Status: ${Object.values(entry.checked).filter(Boolean).length}/${axes.length} axes complete\n`;
    
    if (entry.comfort) {
      const emoji = ['😣','😕','😐','🙂','😌'][entry.comfort - 1];
      content += `Comfort level: ${entry.comfort}/5 ${emoji}\n`;
    }
    
    if (entry.tags) {
      content += `Tags: ${entry.tags}\n`;
    }

    if (entry.tensions && entry.tensions.length > 0) {
      const bodyParts = t('bodyParts');
      const parts = entry.tensions.map(k => bodyParts[k] || k).join(', ');
      content += `Tensions: ${parts}\n`;
    }

    if (entry.note) {
      content += `Notes:\n${entry.note}\n`;
    }

    content += `\n------------------------------------------\n\n`;
  });

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mindfulness_notes_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toggleDay(di) { expandedDay = expandedDay===di ? -1 : di; buildJournal(); }
function toggleCheck(di, key) { journalData[di].checked[key] = !journalData[di].checked[key]; saveJournal(journalData); showSaveConfirm(); buildJournal(); }
function updateNote(di, text) { journalData[di].note = text; saveJournal(journalData); showSaveConfirm(); }
function updateComfort(di, val) { journalData[di].comfort = val; saveJournal(journalData); buildJournal(); }
function updateTags(di, val) { journalData[di].tags = val; saveJournal(journalData); showSaveConfirm(); }
function toggleTension(di, key) {
  if (!journalData[di].tensions) journalData[di].tensions = [];
  const idx = journalData[di].tensions.indexOf(key);
  if (idx === -1) journalData[di].tensions.push(key);
  else journalData[di].tensions.splice(idx, 1);
  saveJournal(journalData); buildJournal();
}
let recognition = null;
function startSpeech(di) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) { showToast(t('micError')); return; }
  if (recognition) { recognition.stop(); recognition = null; return; }

  recognition = new SpeechRecognition();
  recognition.lang = LANG === 'el' ? 'el-GR' : 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  const btn = document.getElementById('mic-btn-' + di);
  const icon = document.getElementById('mic-icon-' + di);
  const area = document.getElementById('note-area-' + di);

  recognition.onstart = () => {
    icon.textContent = '🔴';
    btn.style.opacity = '1';
    showToast(t('micRecord'));
  };

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    const current = journalData[di].note || '';
    journalData[di].note = current + (current ? ' ' : '') + text;
    area.value = journalData[di].note;
    saveJournal(journalData);
    showSaveConfirm();
    buildJournal();
  };

  recognition.onend = () => {
    icon.textContent = '🎙️';
    btn.style.opacity = '0.6';
    recognition = null;
  };

  recognition.onerror = (e) => {
    console.error('Speech recognition error', e);
    showToast(t('micError'));
    recognition = null;
  };

  recognition.start();
}
function showSaveConfirm() { var el = document.createElement('div'); el.textContent = t('savedLocal'); el.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--teal);color:white;padding:8px 18px;border-radius:20px;font-size:12px;z-index:200;opacity:1;transition:opacity 1s'; document.body.appendChild(el); setTimeout(function(){ el.style.opacity='0'; setTimeout(function(){ el.remove() }, 1000); }, 1500); }
function addPrompt(di, prompt) {
  const current = journalData[di].note || '';
  if (current.includes(prompt)) return;
  journalData[di].note = current + (current ? '\n' : '') + '• ' + prompt + ' ';
  saveJournal(journalData); buildJournal();
  setTimeout(() => { const ta = document.querySelectorAll('textarea'); if (ta[di]) { ta[di].focus(); ta[di].scrollTop = ta[di].scrollHeight; } }, 100);
}
function journalReset() { if (confirm(t('confirmReset'))) { journalData = emptyWeek(); saveJournal(journalData); expandedDay = 0; buildJournal(); } }

// ═══ MOOD TRACKER ═══
function loadMood() { try { const d = JSON.parse(localStorage.getItem('mood_today')||'{}'); return d.date === new Date().toDateString() ? d.val : -1; } catch { return -1; } }
function pickMood(val) { localStorage.setItem('mood_today', JSON.stringify({date:new Date().toDateString(), val:val})); buildJournal(); }

window.buildJournal = buildJournal;
window.toggleDay = toggleDay;
window.toggleCheck = toggleCheck;
window.updateNote = updateNote;
window.updateComfort = updateComfort;
window.updateTags = updateTags;
window.toggleTension = toggleTension;
window.startSpeech = startSpeech;
window.addPrompt = addPrompt;
window.journalReset = journalReset;
window.pickMood = pickMood;
window.exportJournalNotes = exportJournalNotes;
