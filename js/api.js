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
        
        const systemInstruction = `You are the "∞ Mindfulness Companion". 
Provide a single, powerful, and gentle guidance message for the user.
Include 2-3 specific action buttons.

User State: ${JSON.stringify(d)}
Language: ${lang}
Knowledge Base: ${JSON.stringify({ FAQ: window.KNOWLEDGE_FAQ || {}, CONCEPTS: window.KNOWLEDGE_CONCEPTS || {} })}`;

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
        
        var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">∞ Guidance</span></div>`;
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
