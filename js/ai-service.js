import { GoogleGenAI } from "@google/genai";

let ai = null;

export async function initAI() {
    if (ai) return ai;
    
    let apiKey = undefined;
    try {
        apiKey = process.env.GEMINI_API_KEY;
    } catch (e) {
        console.warn("Could not access process.env.GEMINI_API_KEY directly.");
    }
    
    if (!apiKey) {
        console.error("Gemini API Error: GEMINI_API_KEY is not defined in the environment.");
        return null;
    }
    
    try {
        ai = new GoogleGenAI({ apiKey });
        return ai;
    } catch (err) {
        console.error("Failed to initialize Gemini AI:", err);
        return null;
    }
}

export async function generateAIResponse(promptOrContents, systemInstruction = "") {
    const aiInstance = await initAI();
    if (!aiInstance) throw new Error("AI not initialized");

    try {
        let contents;
        if (Array.isArray(promptOrContents)) {
            contents = promptOrContents.map(m => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: (typeof m.text === 'string') ? m.text : (m.parts && m.parts[0].text) }]
            }));
        } else {
            contents = [{ role: 'user', parts: [{ text: promptOrContents }] }];
        }

        const response = await aiInstance.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: contents,
            config: {
                systemInstruction: systemInstruction || undefined,
                temperature: 0.7
            }
        });
        
        if (!response || !response.text) {
            throw new Error("Empty response from Gemini");
        }
        return response.text;
    } catch (err) {
        console.error("Gemini Generation Error:", err);
        throw err;
    }
}

// Global exposure for non-module scripts
if (typeof window !== 'undefined') {
    window.generateAIResponse = generateAIResponse;
}
