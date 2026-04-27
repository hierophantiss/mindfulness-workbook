import { GoogleGenAI, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey });

/**
 * Generic helper to call Gemini with a system instruction and structured JSON response.
 */
export async function callGemini(lang, prompt, systemInstruction, schema) {
    try {
        const config = {
            systemInstruction: systemInstruction,
            temperature: 0.2
        };

        if (schema) {
            config.responseMimeType = "application/json";
            config.responseSchema = schema;
        }

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: config
        });

        if (!response.text) throw new Error("Empty response");
        return schema ? JSON.parse(response.text) : response.text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
}

// Attach to window for legacy scripts
window.aiClient = { callGemini, Type };

export { Type };
