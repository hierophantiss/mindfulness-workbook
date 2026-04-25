import { GoogleGenAI, Type } from '@google/genai';

window.c2RunApiTurn = async function(eventContext) {
    var lang = (typeof LANG !== 'undefined') ? LANG : 'el';
    var d = window.companionData;
    
    // Set a loading state
    var title = lang === 'el' ? 'Μια στιγμή...' : 'One moment...';
    var loadingHtml = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title" role="heading" aria-level="2">${title}</span></div>
        <div style="padding: 20px; text-align: center; opacity: 0.7;">
            ${lang === 'el' ? 'Σκέφτομαι τι είναι καλύτερο για σένα...' : 'Thinking about what is best for you...'}
        </div>`;
    window.c2SetContent(loadingHtml);
    window.c2ShowSheet();

    try {
        var apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey: apiKey || 'fake-key' });
        
        let knowledgeBaseStr = "";
        knowledgeBaseStr += `FAQ: ${JSON.stringify(window.KNOWLEDGE_FAQ || {})}\n`;
        knowledgeBaseStr += `Concepts: ${JSON.stringify(window.KNOWLEDGE_CONCEPTS || {})}\n`;
        knowledgeBaseStr += `Chapters: ${JSON.stringify(window.CHAPTERS || {})}\n`;
        
        const systemInstruction = `You are the "∞ Mindfulness Companion", a gentle, trauma-informed guide for neurodivergent individuals.
You do NOT have an open chat. You only provide one message at a time, along with action buttons, to guide the user.
Your knowledge and responses MUST be strictly based on the following JS data objects from the app's source code:
${knowledgeBaseStr}

User Language: ${lang}
User's Current State (resides only on their device):
${JSON.stringify(d, null, 2)}

Current Event/Context: ${eventContext}

Instructions:
1. Provide a short, compassionate, and highly relevant message based ONLY on the User State and Event, referencing the knowledge base.
2. If they are progressing, encourage them kindly using a quote or takeaway.
3. If they are struggling or it's a mood check, suggest a relevant SOS practice or concept.
4. Output up to 3 action buttons. Actions must be valid JS functions like:
   - "window.c2HideSheet(); window.openChapter(X);"
   - "window.c2HideSheet(); window.showScreen('breath');"
   - "window.c2HideSheet(); window.showScreen('chapters');"
   - "window.c2HideSheet(); window.showScreen('practice');"
   - "window.c2RunApiTurn('mood:anxious');" (if you want to trigger another AI response)

Respond STRICTLY in JSON format matching this schema:
{
  "message": "The text to show to the user, formatted with minimal HTML like <b> if needed",
  "buttons": [
    { "label": "Button Text", "action": "JavaScript code to execute" }
  ]
}
Do not include markdown blocks, just the JSON.`;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: "Provide the next guide message." }] }],
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
                responseMimeType: "application/json",
                responseSchema: {
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
                }
            }
        });
        
        if (!response.text) throw new Error("Empty response text");
        const data = JSON.parse(response.text);
        
        var html = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">∞ Companion</span></div>`;
        html += `
            <div class="c2-welcome">
                <div class="c2-welcome-msg" style="font-size: 15px; line-height: 1.5; color: var(--text);">${data.message}</div>
            </div>
            <div class="c2-actions">`;
        
        if (data.buttons && data.buttons.length > 0) {
            data.buttons.forEach(btn => {
                html += `<button class="c2-action-btn c2-action-next" onclick="${btn.action}">${btn.label}</button>`;
            });
        }
        
        html += `<button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Πίσω' : '✕ Back'}</button>`;
        html += `</div>`;
        
        window.c2SetContent(html);
        
        // Save companion data to track we talked to them today maybe
        var today = new Date().toDateString();
        if (d.dailyOpen && d.dailyOpen.date !== today) {
            d.dailyOpen.date = today;
            d.dailyOpen.count = 1;
        } else if (d.dailyOpen) {
            d.dailyOpen.count++;
        }
        window.c2SaveCompanionData(d);
        
    } catch(err) {
        console.error("API Companion Error:", err);
        var errHtml = `<div class="c2-back-row"><button class="c2-back" onclick="window.c2ShowMainMenu()">←</button><span class="c2-back-title">Σφάλμα</span></div>
            <div style="padding: 20px; text-align: center; color: #E8704A;">
                Σφάλμα: ${err.message}
            </div>
            <div class="c2-actions"><button class="c2-option-btn" onclick="window.c2ShowMainMenu()">${lang === 'el' ? '✕ Πίσω' : '✕ Back'}</button></div>`;
        window.c2SetContent(errHtml);
    }
};
