/* ═══════════════════════════════════════════
   js/companion2.js — Companion 2.0 Routing Engine (Stable Version)
   ═══════════════════════════════════════════ */

var c2CurrentFlow = null;
var c2CurrentStep = null;
var c2FlowHistory = [];
var c2SheetVisible = false;

function c2SetContent(html) {
    var content = document.getElementById('c2-content');
    if (content) content.innerHTML = html;
}

function c2SaveCompanionData(data) {
    try { localStorage.setItem('companion_v1', JSON.stringify(data)); } catch(e) {}
}

// 1. Αρχικοποίηση Δεδομένων Χρήστη
function c2EnsureState() {
    if (typeof window.companionData === 'undefined') {
        window.companionData = JSON.parse(localStorage.getItem('companion_v1')) || {};
    }
    var d = window.companionData;
    if (!d.chapterProgress) d.chapterProgress = {};
    if (!d.programProgress) d.programProgress = { week: 0, day: 0, lastVisit: null };
    if (!d.moodHistory) d.moodHistory = [];
    if (!d.faqSeen) d.faqSeen = {};
    if (!d.conceptsSeen) d.conceptsSeen = [];
    if (!d.depthPreference) d.depthPreference = 1;
    if (!d.lastChapter) d.lastChapter = 1;
    if (typeof d.microDosesDone === 'undefined') d.microDosesDone = 0;
    c2SaveCompanionData(d);
}

// 2. Δημιουργία του UI (Sheet)
function c2Init() {
    if (document.getElementById('c2-sheet')) return;
    c2EnsureState();
    
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';
    var sheet = document.createElement('div');
    sheet.id = 'c2-sheet';
    sheet.className = 'c2-sheet';
    sheet.innerHTML = `
        <div class="c2-sheet-handle" onclick="window.c2ToggleSheet()" tabindex="0" role="button" aria-label="${lang === 'el' ? 'Εναλλαγή βοηθού' : 'Toggle companion'}" aria-expanded="false">
            <div class="c2-handle-bar"></div>
        </div>
        <div class="c2-sheet-content" id="c2-content" role="dialog" aria-modal="true" aria-label="${lang === 'el' ? 'Βοηθός Companion' : 'Companion Assistant'}"></div>`;
    document.body.appendChild(sheet);

    // Keyboard support for handle
    var handle = sheet.querySelector('.c2-sheet-handle');
    handle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.c2ToggleSheet();
        }
    });
}

// 3. Διαχείριση Εμφάνισης
function c2ToggleSheet() { 
    c2SheetVisible ? window.c2HideSheet() : window.c2ShowSheet(); 
}

function c2ShowSheet() {
    var sheet = document.getElementById('c2-sheet');
    if (!sheet) return;
    c2EnsureState();
    window.c2ShowMainMenu();
    sheet.classList.add('visible');
    c2SheetVisible = true;
    
    var handle = sheet.querySelector('.c2-sheet-handle');
    if (handle) handle.setAttribute('aria-expanded', 'true');
}

function c2HideSheet() {
    var sheet = document.getElementById('c2-sheet');
    if (sheet) {
        sheet.classList.remove('visible');
        var handle = sheet.querySelector('.c2-sheet-handle');
        if (handle) handle.setAttribute('aria-expanded', 'false');
    }
    c2SheetVisible = false;
    c2CurrentFlow = null;
    c2CurrentStep = null;
    c2FlowHistory = [];
}

// 4. Κεντρικό Μενού
function c2ShowMainMenu() {
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';
    var d = window.companionData;
    var isProgramPage = window.location.pathname.includes('learning-to-ride');

    var html = `
        <div class="c2-header">
            <div class="c2-greeting">
                <div class="c2-greeting-text" role="heading" aria-level="2">${lang === 'el' ? 'Πώς μπορώ να βοηθήσω;' : 'How can I help?'}</div>
            </div>
            <button class="c2-close" onclick="window.c2HideSheet()" aria-label="${lang === 'el' ? 'Κλείσιμο βοηθού' : 'Close assistant'}">✕</button>
        </div>`;

    // ADD PROGRAM PROGRESS DIRECTLY IF ON PROGRAM PAGE
    if (isProgramPage && d.programProgress && d.programProgress.week > 0) {
        var progTitle = d.programProgress.title || "...";
        html += `<div class="c2-context-box" style="margin: 0 0 14px 0; padding:12px; background:rgba(42,93,94,0.1); border-radius:12px; font-size:13px; border:1px solid rgba(42,93,94,0.2)">
            <div style="font-weight:bold; margin-bottom:4px; color:var(--teal); display:flex; align-items:center; gap:6px;">
                <span>📅</span> ${lang === 'el' ? 'Η Πρόοδός σου:' : 'Your Progress:'}
            </div>
            <div style="font-size:14px; font-weight:600; margin-bottom:4px;">${lang === 'el' ? 'Εβδομάδα' : 'Week'} ${d.programProgress.week}, ${lang === 'el' ? 'Ημέρα' : 'Day'} ${d.programProgress.day}</div>
            <div style="opacity:0.8; font-size:12px; margin-bottom:8px;">${progTitle}</div>
            <div style="font-style:italic; opacity:0.7; font-size:11px;">${lang === 'el' ? 'Συνέχισε την εξαιρετική προσπάθεια.' : 'Keep up the great work.'}</div>
        </div>`;
    }

    html += `<div class="c2-menu">
            ${c2MenuBtn('💭', lang === 'el' ? 'Πώς νιώθεις;' : 'How do you feel?', 'moodCheck')}
            ${c2MenuBtn('🧭', lang === 'el' ? 'Τι να κάνω;' : 'What to do?', 'smartHub')}
            ${c2MenuBtn('🔍', lang === 'el' ? 'Εγκυκλοπαίδεια' : 'Encyclopedia', 'conceptExplore')}
            ${c2MenuBtn('📂', lang === 'el' ? 'Ιστορικό / Σημειώσεις' : 'History / Notes', 'historyView')}
        </div>`;
    c2SetContent(html);
}

function c2MenuBtn(icon, title, flowId) {
    return `
    <button class="c2-menu-btn" onclick="window.c2StartFlow('${flowId}')">
        <span class="c2-menu-icon">${icon}</span>
        <div class="c2-menu-text"><div class="c2-menu-title">${title}</div></div>
        <span class="c2-menu-arrow">›</span>
    </button>`;
}

// 5. Μηχανή Ροής (Flow Engine)
function c2StartFlow(flowId) {
    if (typeof CONVERSATION_FLOWS === 'undefined' || !CONVERSATION_FLOWS[flowId]) return;
    c2CurrentFlow = CONVERSATION_FLOWS[flowId];
    c2FlowHistory = [];
    window.c2RunStep(c2CurrentFlow.steps[0].id);
}

function c2RunStep(stepId) {
    if (!c2CurrentFlow || stepId === 'end') { window.c2ShowMainMenu(); return; }

    var step = c2CurrentFlow.steps.find(function(s) { return s.id === stepId; });
    if (!step) return;

    c2CurrentStep = step;
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';

    // Επιλογή renderer ανάλογα με τον τύπο του step
    if (step.type === 'mood_select') {
        window.c2RenderMoodSelect(step, lang);
    } else if (step.type === 'mood_response') {
        window.c2RenderMoodResponse(lang);
    } else if (step.type === 'faq_list') {
        window.c2RenderFaqList(step, lang);
    } else if (step.type === 'faq_answer') {
        window.c2RenderFaqAnswer(step, lang);
    } else if (step.type === 'concept_select') {
        window.c2RenderConceptSelect(step, lang);
    } else if (step.type === 'concept_card') {
        window.c2RenderConceptCard(step, lang);
    } else if (step.type === 'dynamic_greeting') {
        window.c2RenderDynamicGreeting(step, lang);
    } else if (step.type === 'smart_hub') {
        window.c2RenderSmartHub(step, lang);
    } else if (step.type === 'history_view') {
        window.c2RenderHistory(step, lang);
    } else if (step.type === 'depth_select') {
        window.c2RenderDepthSelect(step, lang);
    } else {
        window.c2RenderGenericSelect(step, lang);
    }
}

function c2RenderHistory(step, lang) {
    var d = window.companionData;
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">${lang === 'el' ? 'Ιστορικό & Σημειώσεις' : 'History & Notes'}</span></div>`;
    
    html += `<div style="padding:10px; font-size:13px;">`;
    
    // Combine journal entries
    var allNotes = [];
    
    // Chapter notes
    if (d.journalHistory) {
        Object.keys(d.journalHistory).forEach(ch => {
            allNotes.push({
                type: 'chapter',
                source: lang === 'el' ? `Κεφάλαιο ${ch}` : `Chapter ${ch}`,
                text: d.journalHistory[ch],
                date: d.lastSeen || new Date().toISOString(), // Fallback
                timestamp: d.journalHistory[ch].timestamp || 0
            });
        });
    }
    
    // Program notes
    if (d.programJournal) {
        Object.keys(d.programJournal).forEach(key => {
            var match = key.match(/w(\d+)d(\d+)/);
            var label = match ? (lang === 'el' ? `W${match[1]}D${match[2]}` : `W${match[1]}D${match[2]}`) : key;
            allNotes.push({
                type: 'program',
                source: `${lang === 'el' ? 'Πρόγραμμα' : 'Program'} — ${label}`,
                text: d.programJournal[key].text,
                date: d.programJournal[key].date,
                timestamp: d.programJournal[key].timestamp || 0
            });
        });
    }
    
    // Sort by timestamp
    allNotes.sort((a, b) => b.timestamp - a.timestamp);
    
    if (allNotes.length === 0) {
        html += `<div style="text-align:center; opacity:0.6; padding:40px 0;">${lang === 'el' ? 'Δεν υπάρχουν σημειώσεις ακόμα.' : 'No notes yet.'}</div>`;
    } else {
        allNotes.forEach(n => {
            html += `<div class="c2-history-item" style="margin-bottom:12px; border-bottom:1px solid var(--border); padding-bottom:12px;">
                <div style="font-size:11px; opacity:0.8; margin-bottom:4px; color:var(--teal); font-weight:bold;">${n.source} · ${n.date}</div>
                <div style="white-space: pre-wrap; font-size:14px; color:var(--text); line-height:1.6;">${n.text}</div>
            </div>`;
        });
    }
    
    html += `</div>`;
    c2SetContent(html);
}

function c2RenderSmartHub(step, lang) {
    var d = window.companionData;
    var activeScreen = "";
    var activeEl = document.querySelector('.screen.active');
    if (activeEl) activeScreen = activeEl.id;

    // Check if we are on the 8-week program page
    var isProgramPage = window.location.pathname.includes('learning-to-ride');

    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()" aria-label="${lang === 'el' ? 'Πίσω στο μενού' : 'Back to menu'}">←</button><span class="c2-back-title" role="heading" aria-level="2">${lang === 'el' ? 'Τι να κάνω;' : 'What to do?'}</span></div>`;
    
    // Memory/First time logic
    if (!d.lastChapter && (!d.programProgress || d.programProgress.week === 0)) {
        html += `<div class="c2-welcome-wisdom" style="margin-bottom:12px; font-size:12px;">
            ${lang === 'el' ? '<b>Πρώτη φορά;</b> Αυτή η εφαρμογή είναι ένας οδηγός Mindfulness. Ξεκίνα από το Κεφάλαιο 1 ή το Πρόγραμμα 8 Εβδομάδων.' : '<b>First time?</b> This app is a Mindfulness guide. Start from Chapter 1 or the 8-Week Program.'}
        </div>`;
    } else {
        // Context-aware guidance
        if (isProgramPage && d.programProgress && d.programProgress.week > 0) {
             var progTitle = d.programProgress.title || "...";
             html += `<div class="c2-context-box" style="margin-bottom:12px; padding:12px; background:rgba(42,93,94,0.1); border-radius:8px; font-size:13px; border:1px solid var(--border);">
                <div style="font-weight:bold; margin-bottom:2px;">${lang === 'el' ? 'Πρόοδος Προγράμματος:' : 'Program Progress:'}</div>
                <div style="font-size:14px; margin-bottom:4px;">Week ${d.programProgress.week}, Day ${d.programProgress.day} <span style="opacity:0.7; font-size:12px;">— ${progTitle}</span></div>
                <div style="font-style:italic; opacity:0.8;">${lang === 'el' ? 'Κάθε βήμα μετράει. Είσαι στο σωστό δρόμο.' : 'Every step counts. You are on the right track.'}</div>
            </div>`;
        } else {
            var chs = (typeof CHAPTERS_DATA !== 'undefined') ? (CHAPTERS_DATA[lang] || CHAPTERS_DATA.el) : [];
            var ch = chs[d.lastChapter - 1];
            if (ch) {
                html += `<div class="c2-context-box" style="margin-bottom:12px; padding:12px; background:rgba(42,93,94,0.1); border-radius:8px; font-size:13px; border:1px solid var(--border);">
                    <div style="font-weight:bold; margin-bottom:4px;">${lang === 'el' ? 'Συνέχεια από:' : 'Continuing from:'} ${ch.title}</div>`;
                
                if (typeof CHAPTER_TAKEAWAYS !== 'undefined' && CHAPTER_TAKEAWAYS[lang] && CHAPTER_TAKEAWAYS[lang][d.lastChapter]) {
                    var takeaways = CHAPTER_TAKEAWAYS[lang][d.lastChapter];
                    var randomTakeaway = takeaways[Math.floor(Math.random() * takeaways.length)];
                    html += `<div style="font-style:italic; opacity:0.8;">"${randomTakeaway}"</div>`;
                }
                html += `</div>`;
            }
        }
    }

    html += '<div class="c2-options">';

    // CONTEXT A: Χρήστης διαβάζει κεφάλαιο ή είναι στο πρόγραμμα
    if (activeScreen === 'screen-chapter' || activeScreen === 'screen-chapter' || isProgramPage) {
        html += `<button class="c2-option-btn" onclick="window.c2StartFlow('conceptExplore')">🔍 ${lang === 'el' ? 'Τι σημαίνουν οι όροι εδώ;' : 'What do these terms mean?'}</button>`;
        html += `<button class="c2-option-btn" onclick="window.c2StartFlow('chapterExplore')">❓ ${lang === 'el' ? 'Απορίες' : 'Questions?'}</button>`;
    } 
    // CONTEXT B: Χρήστης είναι στην αρχική ή αλλού
    else {
        if (d.programProgress && d.programProgress.week > 0) {
            var progUrl = lang === 'el' ? 'learning-to-ride-greek.html' : 'learning-to-ride-english.html';
            html += `<button class="c2-option-btn" onclick="window.location.href='${progUrl}'">📅 ${lang === 'el' ? 'Συνέχισε το Πρόγραμμα' : 'Continue 8-Week Program'}</button>`;
        }
        
        if (d.lastChapter) {
            html += `<button class="c2-option-btn" onclick="window.c2HideSheet(); openChapter(${d.lastChapter})">📖 ${lang === 'el' ? 'Συνέχισε το Κεφ. ' + d.lastChapter : 'Continue Ch. ' + d.lastChapter}</button>`;
            
            // Micro-dose suggestion
            if (typeof CHAPTER_MICRO_CAT !== 'undefined' && CHAPTER_MICRO_CAT[d.lastChapter]) {
                var cat = CHAPTER_MICRO_CAT[d.lastChapter];
                html += `<button class="c2-option-btn" onclick="window.c2HideSheet(); microCat='${cat}';showScreen('micro')">⚡ ${lang === 'el' ? 'Μικρή δόση (' + cat + ')' : 'Micro dose (' + cat + ')'}</button>`;
            }
        } else {
            html += `<button class="c2-option-btn" onclick="window.c2HideSheet(); openChapter(1)">📖 ${lang === 'el' ? 'Ξεκίνα το Κεφάλαιο 1' : 'Start Chapter 1'}</button>`;
        }
        html += `<button class="c2-option-btn" onclick="window.c2HideSheet(); showScreen('practice')">🎯 ${lang === 'el' ? 'Κάνε μια άσκηση' : 'Do an exercise'}</button>`;
        html += `<button class="c2-option-btn" onclick="window.c2RunStep('pick_concept')">🔍 ${lang === 'el' ? 'Εγκυκλοπαίδεια όρων' : 'Concept dictionary'}</button>`;
    }

    html += `<button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Πίσω στο μενού' : '✕ Back to menu'}</button>`;
    html += '</div>';
    c2SetContent(html);
}

function c2SaveAndRun(key, value, nextStep) {
    var d = window.companionData;
    d[key] = value;
    c2SaveCompanionData(d);
    window.c2RunStep(nextStep);
}

function c2RenderDepthSelect(step, lang) {
    var title = step.text ? step.text[lang] : "...";
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">${title}</span></div>`;
    html += '<div class="c2-options">';
    
    if (step.options) {
        step.options.forEach(function(opt) {
            var label = opt.label[lang] || opt.label;
            // Save depth and run next
            var action = `window.c2SaveAndRun('${step.saves}', ${opt.depth}, '${step.next}')`;
            html += `<button class="c2-option-btn" onclick="${action}">${label}</button>`;
        });
    }
    html += '</div>';
    c2SetContent(html);
}


function c2RenderDynamicGreeting(step, lang) {
    var d = window.companionData;
    var lastCh = d.lastChapter || 1;
    var chs = (typeof CHAPTERS_DATA !== 'undefined') ? (CHAPTERS_DATA[lang] || CHAPTERS_DATA.el) : [];
    var chTitle = chs[lastCh - 1] ? chs[lastCh - 1].title : "...";

    var greeting = lang === 'el' ? 'Καλώς ήρθες πίσω!' : 'Welcome back!';
    var msg = lang === 'el' 
        ? `Είδα ότι τελευταία φορά ήσουν στο <b>Κεφάλαιο ${lastCh}: ${chTitle}</b>. Θέλεις να συνεχίσεις από εκεί;`
        : `I saw you were last at <b>Chapter ${lastCh}: ${chTitle}</b>. Would you like to continue from there?`;

    if (!d.lastChapter) {
        msg = lang === 'el'
            ? "Είναι η πρώτη σου φορά; Η εφαρμογή αυτή είναι ένας οδηγός Mindfulness ειδικά σχεδιασμένος για νευροδιαφορετικούς. Περιλαμβάνει 10 κεφάλαια θεωρίας, ασκήσεις αναπνοής και μικρές δόσεις γείωσης."
            : "Is it your first time? This app is a Mindfulness guide specifically designed for neurodivergent users. It includes 10 theory chapters, breathing exercises, and micro-doses of grounding.";
    }

    var html = `
        <div class="c2-header">
            <div class="c2-greeting"><div class="c2-greeting-text" role="heading" aria-level="2">${greeting}</div></div>
            <button class="c2-close" onclick="window.c2HideSheet()" aria-label="${lang === 'el' ? 'Κλείσιμο βοηθού' : 'Close assistant'}">✕</button>
        </div>
        <div class="c2-welcome">
            <div class="c2-welcome-msg">${msg}</div>
        </div>
        <div class="c2-actions">
            <button class="c2-action-btn c2-action-next" onclick="window.c2RunStep('${step.next}')">${lang === 'el' ? 'Επιλογές' : 'Options'} →</button>
        </div>`;
    c2SetContent(html);
}

function c2RenderFaqList(step, lang) {
    var faqData = window[step.source];
    if (!faqData) return window.c2ShowMainMenu();

    var d = window.companionData;
    var lastCh = d.lastChapter || 1;
    var items = faqData[lastCh] ? faqData[lastCh][lang] : [];

    var title = lang === 'el' ? 'Συχνές Ερωτήσεις' : 'FAQ';
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()" aria-label="${lang === 'el' ? 'Πίσω στο μενού' : 'Back to menu'}">←</button><span class="c2-back-title" role="heading" aria-level="2">${title} (Κεφ. ${lastCh})</span></div>`;
    
    html += '<div class="c2-faq-list">';
    if (items.length === 0) {
        html += `<div class="c2-empty">${lang === 'el' ? 'Δεν υπάρχουν ερωτήσεις για αυτό το κεφάλαιο.' : 'No questions for this chapter.'}</div>`;
    } else {
        items.forEach(function(item, idx) {
            html += `<button class="c2-faq-btn" onclick="window.c2ShowFaqAnswer(${lastCh}, ${idx})">
                <span class="c2-faq-q">${item.q}</span>
                <span class="c2-menu-arrow">›</span>
            </button>`;
        });
    }
    html += '</div>';
    c2SetContent(html);
}

function c2ShowFaqAnswer(ch, idx) {
    window.c2CurrentFaq = { ch: ch, idx: idx };
    window.c2RunStep('show_answer');
}

function c2RenderFaqAnswer(step, lang) {
    var faqData = window.KNOWLEDGE_FAQ;
    var ref = window.c2CurrentFaq;
    if (!ref || !faqData[ref.ch]) return window.c2RunStep('show_faq');

    var item = faqData[ref.ch][lang][ref.idx];
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2RunStep('show_faq')" aria-label="${lang === 'el' ? 'Πίσω στη λίστα ερωτήσεων' : 'Back to FAQ list'}">←</button><span class="c2-back-title" role="heading" aria-level="2">${item.q}</span></div>`;
    
    html += `
        <div class="c2-answer">
            <div class="c2-answer-text">${item.a}</div>
        </div>
        <div class="c2-options">
            <button class="c2-option-btn" onclick="window.c2RunStep('show_faq')">${lang === 'el' ? '← Άλλη ερώτηση' : '← Another question'}</button>
            ${item.relatedChapter ? `<button class="c2-option-btn" onclick="window.c2HideSheet(); openChapter(${item.relatedChapter})">📖 Πάμε στο κεφάλαιο ${item.relatedChapter}</button>` : ''}
            <button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Κλείσε' : '✕ Close'}</button>
        </div>`;
    c2SetContent(html);
}

function c2RenderConceptSelect(step, lang) {
    var concepts = window[step.source] || window.KNOWLEDGE_CONCEPTS;
    if (!concepts) return window.c2ShowMainMenu();

    var title = lang === 'el' ? 'Τι σημαίνει...' : 'What does it mean...';
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()" aria-label="${lang === 'el' ? 'Πίσω στο μενού' : 'Back to menu'}">←</button><span class="c2-back-title" role="heading" aria-level="2">${title}</span></div>`;
    
    html += '<div class="c2-options">';
    Object.keys(concepts).forEach(function(key) {
        var c = concepts[key];
        var cData = c[lang] || c.el;
        if (cData) {
            html += `<button class="c2-option-btn" onclick="window.c2ShowConceptCard('${key}')">
                <span class="c2-concept-title">${cData.title}</span>
            </button>`;
        }
    });
    html += '</div>';
    c2SetContent(html);
}

function c2ShowConceptCard(key) {
    window.c2CurrentConceptKey = key;
    window.c2RunStep('show_concept');
}

function c2RenderConceptCard(step, lang) {
    var concepts = window.KNOWLEDGE_CONCEPTS;
    var key = window.c2CurrentConceptKey;
    if (!key || !concepts[key]) return window.c2RunStep('pick_concept');

    var c = concepts[key];
    var cData = c[lang] || c.el;
    if (!cData) return window.c2RunStep('pick_concept');

    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2RunStep('pick_concept')">←</button><span class="c2-back-title">${cData.title}</span></div>`;
    
    html += `
        <div class="c2-concept-card">
            <div class="c2-concept-full">${cData.full}</div>
            ${cData.ndNote ? `<div class="c2-concept-nd"><div class="c2-nd-label">ND Note</div><div class="c2-nd-text">${cData.ndNote}</div></div>` : ''}
        </div>
        <div class="c2-options">
            <button class="c2-option-btn" onclick="window.c2RunStep('pick_concept')">${lang === 'el' ? '← Άλλη έννοια' : '← Another concept'}</button>
            <button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Κλείσε' : '✕ Close'}</button>
        </div>`;
    c2SetContent(html);
}

function c2RenderGenericSelect(step, lang) {
    var title = step.text ? step.text[lang] : "...";
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">${title}</span></div>`;
    html += '<div class="c2-options">';
    
    if (step.options) {
        step.options.forEach(function(opt) {
            var label = opt.label[lang] || opt.label;
            var action = "";
            if (opt.next) action = `window.c2RunStep('${opt.next}')`;
            else if (opt.run) action = `window.c2HideSheet(); ${opt.run}`;
            else action = `window.c2ShowMainMenu()`;

            html += `<button class="c2-option-btn" onclick="${action}">${label}</button>`;
        });
    }
    html += '</div>';
    c2SetContent(html);
}

function c2RenderMoodSelect(step, lang) {
    var title = step.text[lang];
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">${title}</span></div>`;
    html += '<div class="c2-mood-grid">';
    
    Object.keys(MOOD_CATEGORIES).forEach(function(catKey) {
        var cat = MOOD_CATEGORIES[catKey];
        html += `<div class="c2-mood-category"><div class="c2-mood-cat-label" style="color:${cat.color}">${cat[lang]}</div>`;
        cat.moods.forEach(function(mKey) {
            var route = MOOD_ROUTES[mKey];
            if (route) {
                html += `
                <button class="c2-mood-btn" onclick="window.c2HandleMoodClick('${mKey}')">
                    <span class="c2-mood-icon">${route.icon}</span>
                    <span class="c2-mood-label">${route.label[lang]}</span>
                </button>`;
            }
        });
        html += '</div>';
    });
    html += '</div>';
    c2SetContent(html);
}

function c2HandleMoodClick(moodKey) {
    window.companionData.lastMoodRoute = moodKey;
    c2SaveCompanionData(window.companionData);
    window.c2RunStep('route_by_mood');
}

function c2RenderMoodResponse(lang) {
    var moodKey = window.companionData.lastMoodRoute;
    var route = MOOD_ROUTES[moodKey];
    if (!route) return window.c2ShowMainMenu();

    var resp = route.response[lang];
    var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2RunStep('ask_mood')">←</button><span class="c2-back-title">${route.label[lang]}</span></div>`;
    html += `
        <div class="c2-response">
            <div class="c2-resp-msg">${resp.msg}</div>
            ${resp.task ? `<div class="c2-resp-task">${resp.task}</div>` : ''}
            <div class="c2-resp-wisdom">"${resp.wisdom}"</div>
        </div>
        <div class="c2-actions">`;
    
    route.actions.forEach(function(act) {
        var label = act.label[lang];
        var actionStr = "";
        if (act.run) actionStr = `window.c2HideSheet(); ${act.run}`;
        else if (act.flow) actionStr = `window.c2StartFlow('${act.flow}')`;
        else if (act.next) actionStr = `window.c2RunStep('${act.next}')`;
        
        html += `<button class="c2-action-btn" onclick="${actionStr}">${label}</button>`;
    });

    // Προσθήκη κουμπιού "Συνέχεια" αν υπάρχει επόμενο βήμα στη ροή
    if (c2CurrentStep && c2CurrentStep.next) {
        var nextLabel = lang === 'el' ? 'Συνέχεια' : 'Continue';
        html += `<button class="c2-action-btn c2-action-next" onclick="window.c2RunStep('${c2CurrentStep.next}')">${nextLabel} →</button>`;
    }
    
    html += `</div>`;
    c2SetContent(html);
}

// 8. Concept Linking
function c2LinkConcepts(text, lang) {
    var concepts = window.KNOWLEDGE_CONCEPTS;
    if (!concepts) { console.log("No concepts found"); return text; }
    
    var linkedText = text;
    Object.keys(concepts).forEach(function(key) {
        var c = concepts[key];
        var cData = c[lang] || c.el;
        if (cData && cData.title) {
            // Simple regex replacement, case insensitive
            try {
                var regex = new RegExp('\\b' + cData.title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '\\b', 'gi');
                linkedText = linkedText.replace(regex, function(match) {
                    return `<span class="c2-concept-link" onclick="window.c2ShowConceptCard('${key}')" style="color:var(--teal); text-decoration:underline; cursor:pointer;">${match}</span>`;
                });
            } catch(e) {
                console.error("Regex error for concept:", cData.title, e);
            }
        }
    });
    return linkedText;
}

// Εκθέτουμε τις συναρτήσεις στο window
window.c2SaveCompanionData = c2SaveCompanionData;
window.c2Init = c2Init;
window.c2ToggleSheet = c2ToggleSheet;
window.c2ShowSheet = c2ShowSheet;
window.c2HideSheet = c2HideSheet;
window.c2StartFlow = c2StartFlow;
window.c2RunStep = c2RunStep;
window.c2ShowMainMenu = c2ShowMainMenu;
window.c2RenderMoodSelect = c2RenderMoodSelect;
window.c2HandleMoodClick = c2HandleMoodClick;
window.c2RenderMoodResponse = c2RenderMoodResponse;
window.c2RenderFaqList = c2RenderFaqList;
window.c2ShowFaqAnswer = c2ShowFaqAnswer;
window.c2RenderFaqAnswer = c2RenderFaqAnswer;
window.c2RenderConceptSelect = c2RenderConceptSelect;
window.c2ShowConceptCard = c2ShowConceptCard;
window.c2RenderConceptCard = c2RenderConceptCard;
window.c2RenderDynamicGreeting = c2RenderDynamicGreeting;
window.c2RenderSmartHub = c2RenderSmartHub;
window.c2RenderGenericSelect = c2RenderGenericSelect;
window.c2RenderDepthSelect = c2RenderDepthSelect;
window.c2SaveAndRun = c2SaveAndRun;
window.c2LinkConcepts = c2LinkConcepts;

// 7. Context Hints & Reminders (Muted per user request for no popups)
function c2ShowContextHint() {
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';
    var d = window.companionData;
    
    // Logic: If user hasn't seen a concept in a while, suggest one
    var concepts = window.KNOWLEDGE_CONCEPTS;
    var unseen = Object.keys(concepts).filter(function(k) { return d.conceptsSeen.indexOf(k) === -1; });
    
    if (unseen.length > 0) {
        var randomKey = unseen[Math.floor(Math.random() * unseen.length)];
        var c = concepts[randomKey];
        var cData = c[lang] || c.el;
        
        /* Muted per user request:
        var html = `
            <div class="c2-hint-box" style="padding:15px; background:rgba(42,93,94,0.1); border-radius:10px; margin:10px;">
                <div style="font-size:12px; opacity:0.7; margin-bottom:5px;">${lang === 'el' ? 'Μικρή υπενθύμιση:' : 'Quick reminder:'}</div>
                <div style="font-weight:bold; margin-bottom:5px;">${cData.title}</div>
                <button class="c2-option-btn" style="font-size:12px; padding:5px 10px;" onclick="window.c2ShowConceptCard('${randomKey}')">${lang === 'el' ? 'Δες το' : 'See it'}</button>
            </div>`;
        c2SetContent(html);
        window.c2ShowSheet();
        */
    }
}

function c2ScheduleDailyReminder() {
    var now = new Date();
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    var msToMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(function() {
        // Trigger reminder logic
        console.log("Daily reminder triggered");
        c2ShowContextHint();
        c2ScheduleDailyReminder(); // Schedule next
    }, msToMidnight);
}

// Auto-init
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(window.c2Init, 600);
    
    // Daily reminder (Logging only)
    setTimeout(function() { 
        console.log("Daily reminder system active (silent mode)");
    }, 1000);

    /* 
    // Έναρξη welcome flow αν είναι η πρώτη φορά ή επιστροφή (DISABLED per user request to avoid auto popups)
    setTimeout(function() {
        if (!c2SheetVisible) {
            window.c2StartFlow('welcomeBack');
            window.c2ShowSheet();
        }
    }, 2000);
    */
});
