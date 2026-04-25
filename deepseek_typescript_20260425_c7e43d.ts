// server.ts
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

// Φόρτωση μεταβλητών περιβάλλοντος από το αρχείο .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// --------------------- Middleware ---------------------
// 1. Ασφάλεια & CORS
app.use(helmet()); // Προσθέτει βασικές κεφαλίδες ασφαλείας
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*', // Επέτρεψε το frontend σου, π.χ. 'http://localhost:5173'
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

// 2. Συμπίεση & Static Files
app.use(compression()); // Μειώνει το bandwidth
app.use(express.static(path.join(__dirname, 'public'))); // Άλλαξε σε 'public' αν τα στατικά αρχεία είναι εκεί

// 3. Rate Limiting (Περιορισμός Αιτημάτων)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 λεπτά
    max: 100, // Μέγιστος αριθμός αιτημάτων ανά IP
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter); // Εφαρμογή μόνο στα API routes

// 4. Body Parsing & Logging
app.use(express.json({ limit: '10mb' })); // Περιορισμός μεγέθους δεδομένων
app.use(morgan('combined')); // Εκτενές logging

// --------------------- Routes ---------------------

// Health Check (Χρήσιμο για monitoring)
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
    const { messages, systemInstruction } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set in environment variables.');
        return res.status(500).json({ error: "Server configuration error. Please try again later." });
    }

    // Βασικός έλεγχος των εισερχόμενων δεδομένων
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid request format. 'messages' array is required." });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Χρησιμοποίησε ένα σταθερό μοντέλο παραγωγής
        const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.5-flash'; 

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: messages.map((m: any) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.text }],
            })),
            config: {
                systemInstruction: systemInstruction,
                // Μπορείς να προσθέσεις εδώ άλλες παραμέτρους (temperature, κλπ.)
            }
        });

        console.log(`Successful response for model: ${MODEL_NAME}`);
        res.json({ text: response.text });

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        // Μην επιστρέφεις το ακριβές σφάλμα στον client σε production
        const message = process.env.NODE_ENV === 'development' ? error.message : "An unexpected error occurred.";
        res.status(500).json({ error: message });
    }
});

// --------------------- Global Error Handler ---------------------
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// --------------------- Εκκίνηση Server ---------------------
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
});