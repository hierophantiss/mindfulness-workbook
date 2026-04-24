```javascript
// ============================================
// MINDFULNESS COMPANION v2.0
// Ενοποιημένο Module - Vanilla JS
// Λειτουργεί παντού (HTML, React, PWA)
// ============================================

const MindfulnessCompanion = (function() {
    'use strict';
    
    // --- Ιδιωτικά Δεδομένα ---
    const STORAGE_KEY = 'mindfulness_companion';
    
    const data = {
        name: 'Σύντροφος Ενσυνειδητότητας',
        version: '2.0.0',
        
        // Χαιρετισμοί ανά ώρα
        greetings: {
            morning: [
                'Καλημέρα! Νέα μέρα, νέα ευκαιρία για ενσυνειδητότητα.',
                'Καλημέρα! Πώς ξύπνησες σήμερα;',
                'Το πρωί είναι η καλύτερη στιγμή για διαλογισμό.'
            ],
            afternoon: [
                'Καλησπέρα! Πώς πάει η μέρα σου;',
                'Μια μικρή παύση για αναπνοή κάνει θαύματα.',
                'Χαίρομαι που με θυμήθηκες.'
            ],
            evening: [
                'Καλό βράδυ! Ώρα να ηρεμήσουμε.',
                'Η μέρα τελειώνει. Ας αφήσουμε το άγχος.',
                'Απόψε θα κοιμηθούμε ήρεμα.'
            ]
        },
        
        // Αποφθέγματα
        quotes: [
            { text: 'Η ηρεμία δεν είναι η απουσία θορύβου, αλλά η παρουσία του εαυτού σου.', author: 'Mindfulness' },
            { text: 'Κάθε ανάσα είναι μια νέα αρχή.', author: 'Αρχαίο ρητό' },
            { text: 'Το μυαλό είναι ένας ωκεανός. Τα κύματα έρχονται και φεύγουν.', author: 'Διδασκαλία' },
            { text: 'Η ευγνωμοσύνη μετατρέπει αυτό που έχουμε σε αρκετό.', author: 'Σοφία' },
            { text: 'Δεν μπορείς να σταματήσεις τα κύματα, αλλά μπορείς να μάθεις να σερφάρεις.', author: 'Jon Kabat-Zinn' }
        ],
        
        // Οδηγοί αναπνοής
        breathingGuides: [
            { id: '478', name: '4-7-8', pattern: [4, 7, 8], description: 'Χαλάρωση και ύπνος', difficulty: 'easy' },
            { id: 'square', name: 'Τετράγωνη', pattern: [4, 4, 4, 4], description: 'Ισορροπία και συγκέντρωση', difficulty: 'medium' },
            { id: '214', name: '2-1-4', pattern: [2, 1, 4], description: 'Ενέργεια και εγρήγορση', difficulty: 'hard' }
        ],
        
        // Ασκήσεις ανά επίπεδο
        exercises: {
            beginner: [
                { name: 'Αναπνοή 4-7-8', description: 'Εισπνοή 4, κράτημα 7, εκπνοή 8', duration: 5 },
                { name: 'Σάρωση Σώματος', description: 'Παρατήρησε κάθε μέρος του σώματός σου', duration: 10 }
            ],
            intermediate: [
                { name: 'Περπάτημα με Προσοχή', description: 'Περπάτα αργά, νιώσε κάθε βήμα', duration: 15 },
                { name: 'Ακρόαση Ήχων', description: 'Άκουσε τους ήχους γύρω σου χωρίς κριτική', duration: 10 }
            ],
            advanced: [
                { name: 'Διαλογισμός Αγάπης', description: 'Στείλε αγάπη στον εαυτό σου και στους άλλους', duration: 20 }
            ]
        },
        
        // Συμβουλές ανά διάθεση
        advice: {
            happy: 'Χαίρομαι που νιώθεις χαρούμενος! Απόλαυσε αυτή τη στιγμή.',
            calm: 'Υπέροχα! Η ηρεμία είναι μια όμορφη κατάσταση.',
            sad: 'Είναι εντάξει να νιώθεις λύπη. Δώσε χώρο στα συναισθήματά σου.',
            angry: 'Ο θυμός είναι φυσιολογικός. Πάρε βαθιές ανάσες.',
            anxious: 'Το άγχος είναι προσωρινό. Εστίασε στην αναπνοή σου.',
            tired: 'Η κούραση είναι σημάδι ότι χρειάζεσαι ξεκούραση.',
            grateful: 'Η ευγνωμοσύνη ανοίγει την καρδιά. Συνέχισε έτσι!'
        }
    };
    
    // --- State Management ---
    let state = {
        lastMood: null,
        lastExercise: null,
        sessionCount: 0,
        totalMinutes: 0,
        preferences: {
            favoriteBreathing: '478',
            difficulty: 'beginner'
        },
        lastVisit: null
    };
    
    // --- Φόρτωση State ---
    function loadState() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                state = { ...state, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Companion: Δεν μπόρεσε να φορτώσει το state');
        }
    }
    
    // --- Αποθήκευση State ---
    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Companion: Δεν μπόρεσε να αποθηκεύσει το state');
        }
    }
    
    // --- Βοηθητικές Συναρτήσεις ---
    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        return 'evening';
    }
    
    function randomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    // --- Δημόσιο API ---
    return {
        getGreeting: function() {
            const timeOfDay = getTimeOfDay();
            return randomItem(data.greetings[timeOfDay]);
        },
        getQuote: function() {
            return randomItem(data.quotes);
        },
        getAdvice: function(mood) {
            return data.advice[mood] || data.advice.calm;
        },
        getBreathingGuide: function(id) {
            return data.breathingGuides.find(g => g.id === id) || data.breathingGuides[0];
        },
        getExercises: function(difficulty) {
            return data.exercises[difficulty] || data.exercises.beginner;
        },
        logSession: function(minutes, mood) {
            state.sessionCount++;
            state.totalMinutes += minutes;
            state.lastMood = mood;
            state.lastVisit = new Date().toISOString();
            saveState();
        },
        getStats: function() {
            return { ...state };
        },
        getVersion: function() {
            return data.version;
        },
        getName: function() {
            return data.name;
        }
    };
    
})();
```

**Η αλλαγή έγινε!** Το `companion.js` τώρα:
1. Έχει ολοκληρωμένη τη `randomItem` συνάρτηση
2. Επιστρέφει ένα δημόσιο API με όλες τις μεθόδους
3. Κλείνει σωστά το IIFE με `})();`

**Δοκίμασε να ανανεώσεις τη σελίδα τώρα (F5 ή Ctrl+R). Λειτουργεί;**