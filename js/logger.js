import { callGemini, Type } from './aiClient.js';

const MINDFUL_LOG_KEY = 'mindful_log_v1';
const SYNC_THRESHOLD = 8; // Sync every 8 actions

function getMindfulLog() {
    try {
        return JSON.parse(localStorage.getItem(MINDFUL_LOG_KEY)) || [];
    } catch(e) { return []; }
}

function saveMindfulLog(log) {
    try {
        localStorage.setItem(MINDFUL_LOG_KEY, JSON.stringify(log));
    } catch(e) {}
}

/**
 * Logs a mindful action.
 * @param {string} type - e.g., 'chapter', 'exercise', 'breath', 'mood', 'screen'
 * @param {object} detail - context details
 */
window.logMindfulAction = function(type, detail = {}) {
    const log = getMindfulLog();
    const entry = {
        timestamp: new Date().toISOString(),
        type: type,
        detail: detail
    };
    log.push(entry);
    
    // Keep log manageable (last 50 actions)
    if (log.length > 50) log.shift();
    
    saveMindfulLog(log);
    
    // Check if we should sync
    checkAiSync(log);
};

async function checkAiSync(log) {
    if (typeof loadCompanionData !== 'function') return;
    const companion = loadCompanionData();
    const lastSyncCount = companion.lastSyncCount || 0;
    const currentCount = log.length;
    
    // Sync if we reached threshold or if it's the first time and we have some data
    if (currentCount - lastSyncCount >= SYNC_THRESHOLD || (!companion.lastAiSynthesis && currentCount >= 3)) {
        await requestAiSynthesis(log, companion);
    }
}

async function requestAiSynthesis(log, companion) {
    const lang = typeof LANG !== 'undefined' ? LANG : 'el';
    
    try {
        const systemInstruction = `You are the "Silent Progress Architect" for a neurodiversity-focused mindfulness app.
Your job is NOT to chat. Your job is to analyze the user's progress and provide a concise synthesis and recommendation.

CONTEXT:
1. The curriculum has 10 chapters.
2. The user is neurodivergent.
3. Methodology: Fourfold Axis.

GOAL: Provide a short synthesis in ${lang === 'el' ? 'Greek' : 'English'}.`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                insight: { type: Type.STRING },
                nextStep: { type: Type.STRING },
                icon: { type: Type.STRING }
            },
            required: ["summary", "insight", "nextStep", "icon"]
        };

        const synthesis = await callGemini(lang, `SYNTHESIS_REQUEST: Log: ${JSON.stringify(log)}. Chapter progress: ${JSON.stringify(companion.chapterProgress)}.`, systemInstruction, schema);
        
        companion.lastAiSynthesis = synthesis;
        companion.lastSyncCount = log.length;
        companion.lastSyncDate = new Date().toISOString();
        saveCompanionData(companion);
        
        if (window.c2RefreshHeader) window.c2RefreshHeader();
    } catch (e) {
        console.error("AI Sync Error:", e);
    }
}

// Global initialization for logger
document.addEventListener('DOMContentLoaded', () => {
    // Basic screen tracking hook
    const origTrack = window.companionTrackScreen;
    if (typeof origTrack === 'function') {
        window.companionTrackScreen = function(id) {
            origTrack(id);
            if (['home', 'chapters', 'practice', 'breath', 'journal'].includes(id)) {
                logMindfulAction('screen', { id });
            }
        };
    }
});
