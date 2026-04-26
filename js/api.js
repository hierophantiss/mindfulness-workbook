import { callGemini, Type } from './aiClient.js';

window.c2RunApiTurn = async function(eventContext) {
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';
    var d = window.companionData;
    
    var title = lang === 'el' ? 'Τεχνητή Νοημοσύνη' : 'AI Guidance';
    var loadingHtml = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title" role="heading" aria-level="2">${title}</span></div>
        <div style="padding: 20px; text-align: center;">
            <div class="thinking-dots" style="margin-bottom:15px; font-size:24px;">♾️</div>
            <p style="font-size:14px; opacity:0.8;">${lang === 'el' ? 'Αναλύω την πρόοδό σου για να σου δώσω την καλύτερη συμβουλή...' : 'Analyzing your progress to give you the best advice...'}</p>
        </div>`;
    window.c2SetContent(loadingHtml);
    if (typeof window.c2ShowSheet === 'function') window.c2ShowSheet();

    try {
        const log = typeof getMindfulLog === 'function' ? getMindfulLog() : [];
        const isInventory = eventContext === 'USER_REQUESTED_DAILY_INVENTORY';
        
        var systemInstruction = `You are the "∞ Mindfulness Companion", a supportive guide for neurodivergent individuals (ADHD/Autism).
Your goal is to provide gentle, trauma-informed guidance based on the user's progress in the "Fourfold Axis" program.

Tone: Calm, clear, non-judgmental, and validating.
Context:
- User Progress: ${JSON.stringify(d)}
- Current View: ${window.location.pathname}
- History Log: ${JSON.stringify(log.slice(-15))}

Task:
${isInventory ? 
  "- Provide a 'Daily Inventory' summary. Briefly recap what the user achieved today/lately (chapters read, mood trends, exercises done). Then suggest where they are 'standing' in their journey and what a good focus for tomorrow would be." :
  "- Provide a single, powerful, and gentle guidance message for the user based on their current state."}

Include 2-3 specific action buttons (e.g., 'openChapter(3)', 'showScreen(\"breath\")', 'c2StartFlow(\"moodCheck\")').

Language: ${lang}
Knowledge Base Sample: ${JSON.stringify({ FAQ_COUNT: Object.keys(window.KNOWLEDGE_FAQ || {}).length, CONCEPTS_COUNT: Object.keys(window.KNOWLEDGE_CONCEPTS || {}).length })}`;

        const schema = {
            type: Type.OBJECT,
            properties: {
                message: { type: Type.STRING },
                buttons: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            label: { type: Type.STRING },
                            action: { type: Type.STRING }
                        },
                        required: ["label", "action"]
                    }
                }
            },
            required: ["message", "buttons"]
        };

        const aiRes = await callGemini(lang, `DIRECT_GUIDANCE_REQUEST: Context: ${eventContext}. Log: ${JSON.stringify(log.slice(-10))}`, systemInstruction, schema);
        
        if (isInventory) {
            d.lastAiSynthesis = {
                message: aiRes.message,
                date: new Date().toISOString()
            };
            if (typeof window.c2SaveCompanionData === 'function') window.c2SaveCompanionData(d);
        }

        var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">${isInventory ? (lang === 'el' ? 'Απογραφή' : 'Inventory') : '∞ Guidance'}</span></div>`;
        html += `
            <div class="c2-welcome" style="margin-top:0;">
                <div class="c2-welcome-msg" style="font-size: 15px; line-height: 1.6; color: var(--text); background: rgba(122,158,126,0.1); padding:15px; border-radius:12px; border-left:4px solid var(--teal);">${aiRes.message}</div>
            </div>
            <div class="c2-actions" style="margin-top:20px;">`;
        
        if (aiRes.buttons && aiRes.buttons.length > 0) {
            aiRes.buttons.forEach(btn => {
                html += `<button class="c2-action-btn c2-action-next" onclick="window.c2HideSheet(); ${btn.action}">${btn.label}</button>`;
            });
        }
        
        html += `<button class="c2-option-btn" style="margin-top:10px;" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Πίσω' : '✕ Back'}</button>`;
        html += `</div>`;
        
        window.c2SetContent(html);
        
    } catch(err) {
        console.error("API Companion Error:", err);
        var errHtml = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">Συνέχεια</span></div>
            <div style="padding: 20px; text-align: center; opacity:0.8;">
                ${lang === 'el' ? 'Δεν μπόρεσα να συνδεθώ στον κεντρικό εγκέφαλο. Μπορείς να συνεχίσεις με τις υπάρχουσες επιλογές.' : 'Could not connect to the core brain. You can continue with existing options.'}
            </div>
            <div class="c2-actions">
                <button class="c2-action-btn" onclick="window.c2StartFlow('smartHub')">${lang === 'el' ? 'Δες τι να κάνεις (Local)' : 'See what to do (Local)'}</button>
                <button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Πίσω' : '✕ Back'}</button>
            </div>`;
        window.c2SetContent(errHtml);
    }
};
