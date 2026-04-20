/* ═══════════════════════════════════════════
   js/data/routes.js — Mood Routes & Conversation Flows
   
   Two systems:
   1. MOOD_ROUTES: mood → axis → action mapping
   2. CONVERSATION_FLOWS: decision trees for step-by-step guidance
   
   Used by the Companion 2.0 routing engine.
   No API, no AI — pure rule-based logic.
   ═══════════════════════════════════════════ */


// ═══════════════════════════════════════════
// MOOD ROUTES
// mood key → which axis helps → what action to take
// ═══════════════════════════════════════════

var MOOD_ROUTES = {

  // ─── CRISIS ───
  overwhelm: {
    axis: 'body',
    action: 'sos',
    icon: '🆘',
    label: { el: 'Υπερφόρτωση', en: 'Overwhelm' },
    response: {
      el: {
        msg: 'Πάρε μια στιγμή. Δεν χρειάζεται να κάνεις τίποτα άλλο.',
        task: 'Νιώσε τα πέλματά σου. Μία αργή εκπνοή από το στόμα. Αυτό αρκεί.',
        wisdom: 'Δεν είσαι τα σύννεφα. Είσαι ο ουρανός.'
      },
      en: {
        msg: 'Take a moment. You don\'t need to do anything else.',
        task: 'Feel your soles. One slow mouth exhale. That\'s enough.',
        wisdom: 'You are not the clouds. You are the sky.'
      }
    },
    actions: [
      { key: 'sos', label: { el: '🆘 SOS Ηρεμία', en: '🆘 SOS Calm' }, run: "showScreen('breath');setTimeout(activateSOS,400)" },
      { key: 'micro', label: { el: '🧍 Μικρή γείωση', en: '🧍 Quick ground' }, run: "microCat='body';microIdx=0;showScreen('micro')" }
    ],
    followUpMood: 'anxiety',
    protocol: 'overload'
  },

  panic: {
    axis: 'breath',
    action: 'sos',
    icon: '😱',
    label: { el: 'Πανικός', en: 'Panic' },
    response: {
      el: {
        msg: 'Είσαι ασφαλής. Ο πανικός περνάει — πάντα περνάει.',
        task: 'Εκπνοή από το στόμα. Αργά. Σαν να σβήνεις κερί πολύ μακριά σου.',
        wisdom: 'Η αναπνοή ρέει μόνη της. Εσύ απλά παρατηρείς.'
      },
      en: {
        msg: 'You are safe. Panic passes — it always passes.',
        task: 'Mouth exhale. Slowly. Like blowing out a very distant candle.',
        wisdom: 'Breath flows by itself. You just observe.'
      }
    },
    actions: [
      { key: 'sos', label: { el: '🆘 SOS Τώρα', en: '🆘 SOS Now' }, run: "showScreen('breath');setTimeout(activateSOS,400)" },
      { key: 'breath478', label: { el: '🫁 Αναπνοή 4-7-8', en: '🫁 Breath 4-7-8' }, run: "switchPattern('4-7-8');showScreen('breath')" }
    ],
    protocol: 'anxiety'
  },

  // ─── TENSION ───
  anxiety: {
    axis: 'breath',
    action: 'breath478',
    icon: '😰',
    label: { el: 'Άγχος', en: 'Anxiety' },
    response: {
      el: {
        msg: 'Το άγχος είναι ενέργεια χωρίς κατεύθυνση. Δώσε του μία.',
        task: 'Βάρος → Εκπνοή → Ταμπέλα → Χώρος. Τέσσερα βήματα.',
        wisdom: 'Η αργή εκπνοή ενεργοποιεί το φρένο του νευρικού συστήματος.'
      },
      en: {
        msg: 'Anxiety is energy without direction. Give it one.',
        task: 'Weight → Exhale → Label → Space. Four steps.',
        wisdom: 'Slow exhale activates the brake of the nervous system.'
      }
    },
    actions: [
      { key: 'breath478', label: { el: '🫁 Αναπνοή 4-7-8', en: '🫁 Breath 4-7-8' }, run: "switchPattern('4-7-8');showScreen('breath')" },
      { key: 'protocol', label: { el: '📋 Πρωτόκολλο Άγχους', en: '📋 Anxiety Protocol' }, run: "openChapter(7)" }
    ],
    protocol: 'anxiety'
  },

  restless: {
    axis: 'body',
    action: 'micro',
    icon: '⚡',
    label: { el: 'Ανησυχία / Νευρικότητα', en: 'Restlessness' },
    response: {
      el: {
        msg: 'Η ενέργεια χρειάζεται έξοδο. Μπορείς να τη δώσεις μέσω κίνησης.',
        task: 'Σήκω. Πάτα δυνατά στο πάτωμα 3 φορές. Νιώσε τον κραδασμό.',
        wisdom: 'Η γη σε κρατά. Εμπιστεύσου τη.'
      },
      en: {
        msg: 'Energy needs an outlet. You can give it through movement.',
        task: 'Stand up. Press hard into the floor 3 times. Feel the vibration.',
        wisdom: 'Earth holds you. Trust it.'
      }
    },
    actions: [
      { key: 'micro', label: { el: '🧍 Μικρή δόση σώμα', en: '🧍 Micro body dose' }, run: "microCat='body';microIdx=0;showScreen('micro')" },
      { key: 'breath', label: { el: '🫁 Αναπνοή 5-5', en: '🫁 Breath 5-5' }, run: "switchPattern('5-5');showScreen('breath')" }
    ]
  },

  // ─── ATTENTION STATES ───
  scattered: {
    axis: 'attention',
    action: 'label',
    icon: '🌀',
    label: { el: 'Διάσπαση', en: 'Scattered' },
    response: {
      el: {
        msg: 'Ο νους τρέχει. Αυτό δεν είναι αποτυχία — είναι μοτίβο.',
        task: 'Βάλε ταμπέλα στην επόμενη σκέψη: «Ανησυχία», «Σενάριο» ή «Κριτική».',
        wisdom: 'Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση.'
      },
      en: {
        msg: 'The mind is racing. This isn\'t failure — it\'s a pattern.',
        task: 'Label the next thought: "Worry," "Scenario" or "Criticism."',
        wisdom: 'Returning attention is not failure — it is the practice itself.'
      }
    },
    actions: [
      { key: 'micro', label: { el: '👁 Μικρή δόση προσοχή', en: '👁 Micro attention dose' }, run: "microCat='attention';microIdx=0;showScreen('micro')" },
      { key: 'ground', label: { el: '🧍 Γείωση πρώτα', en: '🧍 Ground first' }, run: "microCat='body';microIdx=0;showScreen('micro')" }
    ]
  },

  hyperfocus: {
    axis: 'space',
    action: 'soften',
    icon: '🔒',
    label: { el: 'Κλείδωμα / Hyperfocus', en: 'Hyperfocus / Locked' },
    response: {
      el: {
        msg: 'Ο νους κλείδωσε. Δεν πειράζει — ήδη το παρατήρησες.',
        task: 'Μαλάκωσε το βλέμμα. Νιώσε τον χώρο γύρω. Μετά νιώσε τη βαρύτητα.',
        wisdom: 'Ο χώρος δεν είναι κενό — είναι πεδίο επίγνωσης.'
      },
      en: {
        msg: 'The mind locked. That\'s okay — you already noticed it.',
        task: 'Soften your gaze. Feel the space around. Then feel gravity.',
        wisdom: 'Space is not emptiness — it\'s a field of awareness.'
      }
    },
    actions: [
      { key: 'micro', label: { el: '✦ Μικρή δόση χώρος', en: '✦ Micro space dose' }, run: "microCat='space';microIdx=0;showScreen('micro')" },
      { key: 'exercise', label: { el: '👁 Άσκηση προσοχής', en: '👁 Attention exercise' }, run: "launchPractice('camera_exercise.html')" }
    ]
  },

  // ─── EMOTIONAL STATES ───
  numb: {
    axis: 'body',
    action: 'external',
    icon: '😶',
    label: { el: 'Μούδιασμα / Αποσύνδεση', en: 'Numbness / Disconnect' },
    response: {
      el: {
        msg: 'Μερικές φορές το νευρικό σύστημα κλείνει για προστασία. Αυτό είναι εντάξει.',
        task: 'Κράτα κάτι κρύο ή ζεστό. Ακούμπησε κάτι με υφή. Μύρισε κάτι δυνατό.',
        wisdom: 'Η βαρύτητα είναι πάντα εδώ. Ακόμα κι αν δεν τη νιώθεις.'
      },
      en: {
        msg: 'Sometimes the nervous system shuts down for protection. That\'s okay.',
        task: 'Hold something cold or warm. Touch a texture. Smell something strong.',
        wisdom: 'Gravity is always here. Even when you can\'t feel it.'
      }
    },
    actions: [
      { key: 'external', label: { el: '🤚 Εξωτερικές αγκυρώσεις', en: '🤚 External anchors' }, run: "microCat='body';microIdx=0;showScreen('micro')" },
      { key: 'breath', label: { el: '🫁 Απαλή αναπνοή', en: '🫁 Gentle breath' }, run: "switchPattern('5-5');showScreen('breath')" }
    ]
  },

  selfcritical: {
    axis: 'kindness',
    action: 'compassion',
    icon: '💛',
    label: { el: 'Αυτοκριτική', en: 'Self-criticism' },
    response: {
      el: {
        msg: 'Αυτή η φωνή δεν είναι δική σου. Είναι απόηχος.',
        task: 'Πες μέσα σου: «Α, αυτή είναι η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω.»',
        wisdom: 'Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται.'
      },
      en: {
        msg: 'That voice isn\'t yours. It\'s an echo.',
        task: 'Say to yourself: "Ah, that\'s the old voice. I don\'t need to follow it."',
        wisdom: 'Treat yourself the way you would treat a struggling friend.'
      }
    },
    actions: [
      { key: 'kindness', label: { el: '💛 Μικρή δόση καλοσύνη', en: '💛 Micro kindness dose' }, run: "microCat='kindness';microIdx=0;showScreen('micro')" },
      { key: 'chapter', label: { el: '🧠 Κεφ. 5: Ο Νους', en: '🧠 Ch. 5: The Mind' }, run: "openChapter(5)" }
    ]
  },

  // ─── POSITIVE STATES ───
  curious: {
    axis: 'learn',
    action: 'nextCh',
    icon: '📖',
    label: { el: 'Περιέργεια', en: 'Curiosity' },
    response: {
      el: {
        msg: 'Η περιέργεια είναι η καλύτερη κατάσταση για μάθηση.',
        task: null,
        wisdom: 'Η ενσυνειδητότητα δεν ζητάει έλεγχο. Ζητάει περιέργεια.'
      },
      en: {
        msg: 'Curiosity is the best state for learning.',
        task: null,
        wisdom: 'Mindfulness doesn\'t ask for control. It asks for curiosity.'
      }
    },
    actions: [],
    dynamicActions: 'nextChapterOrFAQ'
  },

  energetic: {
    axis: 'all',
    action: 'practice',
    icon: '⚡',
    label: { el: 'Ενέργεια / Ετοιμότητα', en: 'Energy / Ready' },
    response: {
      el: {
        msg: 'Τέλεια στιγμή για πρακτική.',
        task: null,
        wisdom: 'Η παρουσία δεν χρειάζεται ώρες. Ξεκινά με νίκες λίγων δευτερολέπτων.'
      },
      en: {
        msg: 'Perfect moment for practice.',
        task: null,
        wisdom: 'Presence doesn\'t need hours. It starts with victories of a few seconds.'
      }
    },
    actions: [],
    dynamicActions: 'practiceOrNextChapter'
  },

  calm: {
    axis: 'space',
    action: 'open',
    icon: '🌿',
    label: { el: 'Ηρεμία', en: 'Calm' },
    response: {
      el: {
        msg: 'Ωραία. Αυτή η ηρεμία αξίζει να παρατηρηθεί.',
        task: 'Μαλάκωσε το βλέμμα. Νιώσε τα πάντα μαζί — χωρίς εστίαση.',
        wisdom: 'Η ανοιχτή προσοχή δεν ψάχνει — δέχεται.'
      },
      en: {
        msg: 'Nice. This calm is worth noticing.',
        task: 'Soften your gaze. Feel everything together — without focus.',
        wisdom: 'Open attention doesn\'t search — it receives.'
      }
    },
    actions: [
      { key: 'breath', label: { el: '🫁 Αναπνοή 4-2-6-1', en: '🫁 Breath 4-2-6-1' }, run: "switchPattern('4-2-6-1');showScreen('breath')" },
      { key: 'open', label: { el: '✦ Ανοιχτή επίγνωση', en: '✦ Open awareness' }, run: "launchPractice('openawareness.html')" }
    ]
  },

  sleepy: {
    axis: 'breath',
    action: 'breath55',
    icon: '🌙',
    label: { el: 'Κούραση / Υπνηλία', en: 'Tired / Sleepy' },
    response: {
      el: {
        msg: 'Η κούραση είναι σήμα — σεβάσου το.',
        task: 'Αν θέλεις: 3 αργές αναπνοές 5-5 (ισορροπία) ή απλά ξεκουράσου.',
        wisdom: 'Ο μηχανικός νους χρειάζεται ανάπαυση. Δώσε του χώρο.'
      },
      en: {
        msg: 'Tiredness is a signal — respect it.',
        task: 'If you want: 3 slow 5-5 breaths (balance) or simply rest.',
        wisdom: 'The mechanical mind needs rest. Give it space.'
      }
    },
    actions: [
      { key: 'breath55', label: { el: '🫁 Αναπνοή 5-5', en: '🫁 Breath 5-5' }, run: "switchPattern('5-5');showScreen('breath')" },
      { key: 'nothing', label: { el: '🌙 Τίποτα — ξεκουράσου', en: '🌙 Nothing — rest' }, run: "hideCompanionBubble()" }
    ]
  }
};


// ═══════════════════════════════════════════
// CONVERSATION FLOWS
// Decision trees — step-by-step guidance
// Each flow = array of steps
// Each step = text + options → next step or action
// ═══════════════════════════════════════════

var CONVERSATION_FLOWS = {

  // ─── MAIN ENTRY: MOOD CHECK ───
  moodCheck: {
    id: 'moodCheck',
    title: { el: 'Πώς νιώθεις;', en: 'How do you feel?' },
    steps: [
      {
        id: 'ask_mood',
        text: { el: 'Πώς νιώθεις τώρα;', en: 'How do you feel right now?' },
        subtext: { el: 'Πάτα αυτό που ταιριάζει — δεν υπάρχει λάθος απάντηση.', en: 'Tap what fits — there\'s no wrong answer.' },
        type: 'mood_select',
        options: [
          { mood: 'overwhelm', category: 'crisis' },
          { mood: 'anxiety', category: 'tension' },
          { mood: 'scattered', category: 'attention' },
          { mood: 'calm', category: 'positive' }
        ],
        next: 'route_by_mood'
      },
      {
        id: 'route_by_mood',
        type: 'mood_response',
        next: 'after_action'
      },
      {
        id: 'after_action',
        text: { el: 'Πώς ήταν;', en: 'How was it?' },
        delay: 30000,
        options: [
          { label: { el: '✓ Βοήθησε', en: '✓ Helped' }, feedback: 'helpful', next: 'end' },
          { label: { el: '↻ Θέλω κάτι άλλο', en: '↻ Try something else' }, feedback: 'retry', next: 'ask_mood' },
          { label: { el: '— Δεν ξέρω', en: '— Not sure' }, feedback: 'neutral', next: 'end' }
        ]
      }
    ]
  },

  // ─── CHAPTER EXPLORATION ───
  chapterExplore: {
    id: 'chapterExplore',
    title: { el: 'Εξερεύνηση κεφαλαίου', en: 'Chapter exploration' },
    steps: [
      {
        id: 'pick_depth',
        text: { el: 'Πόσο βαθιά θέλεις να πας;', en: 'How deep do you want to go?' },
        type: 'depth_select',
        options: [
          { label: { el: '🟢 Βασικά — δώσε μου τα κλειδιά', en: '🟢 Basics — give me the keys' }, depth: 1 },
          { label: { el: '🟡 Εξηγήσεις — θέλω να καταλάβω', en: '🟡 Explanations — I want to understand' }, depth: 2 },
          { label: { el: '🔴 Νευροεπιστήμη — δώσε μου τα papers', en: '🔴 Neuroscience — show me the papers' }, depth: 3 }
        ],
        saves: 'depthPreference',
        next: 'show_faq'
      },
      {
        id: 'show_faq',
        type: 'faq_list',
        source: 'KNOWLEDGE_FAQ',
        filterByDepth: true,
        next: 'show_answer'
      },
      {
        id: 'show_answer',
        type: 'faq_answer',
        showRelated: true,
        options: [
          { label: { el: '← Άλλη ερώτηση', en: '← Another question' }, next: 'show_faq' },
          { label: { el: '📖 Πάμε στο κεφάλαιο', en: '📖 Go to chapter' }, next: 'open_chapter' },
          { label: { el: '✕ Κλείσε', en: '✕ Close' }, next: 'end' }
        ]
      }
    ]
  },

  // ─── CONCEPT EXPLORER ───
  conceptExplore: {
    id: 'conceptExplore',
    title: { el: 'Τι σημαίνει...', en: 'What does ... mean' },
    steps: [
      {
        id: 'pick_concept',
        text: { el: 'Ποια έννοια θέλεις να εξερευνήσεις;', en: 'Which concept do you want to explore?' },
        type: 'concept_select',
        source: 'KNOWLEDGE_CONCEPTS',
        groupBy: 'axis',
        next: 'show_concept'
      },
      {
        id: 'show_concept',
        type: 'concept_card',
        showRelated: true,
        showNdNote: true,
        options: [
          { label: { el: '🔗 Σχετική έννοια', en: '🔗 Related concept' }, next: 'pick_related' },
          { label: { el: '❓ FAQ για αυτό', en: '❓ FAQ about this' }, next: 'related_faq' },
          { label: { el: '✕ Κλείσε', en: '✕ Close' }, next: 'end' }
        ]
      },
      {
        id: 'pick_related',
        type: 'related_concepts',
        next: 'show_concept'
      },
      {
        id: 'related_faq',
        type: 'faq_by_concept',
        next: 'show_answer'
      }
    ]
  },

  // ─── SMART HUB (Context-aware suggestions) ───
  smartHub: {
    id: 'smartHub',
    title: { el: 'Τι να κάνω;', en: 'What to do?' },
    steps: [
      {
        id: 'overview',
        type: 'smart_hub',
        next: 'end'
      }
    ]
  },

  // ─── RETURNING USER ───
  welcomeBack: {
    id: 'welcomeBack',
    title: { el: 'Καλώς ήρθες πίσω', en: 'Welcome back' },
    steps: [
      {
        id: 'greet',
        type: 'dynamic_greeting',
        usesState: ['lastSeen', 'lastChapter', 'moodHistory', 'returnAfterAbsence'],
        next: 'offer_options'
      },
      {
        id: 'offer_options',
        text: { el: 'Τι θα ήθελες;', en: 'What would you like?' },
        type: 'select',
        options: [
          { label: { el: '📖 Συνέχισε από εκεί που σταμάτησα', en: '📖 Continue where I left off' }, next: 'resume_chapter' },
          { label: { el: '💭 Πες μου πώς νιώθω', en: '💭 Tell me how I feel' }, next: 'ask_mood' },
          { label: { el: '⚡ Μικρή δόση τώρα', en: '⚡ Quick dose now' }, next: 'suggest_micro' },
          { label: { el: '🫁 Αναπνοή', en: '🫁 Breathe' }, run: "showScreen('breath')" }
        ]
      },
      {
        id: 'resume_chapter',
        type: 'resume_from_progress',
        next: 'end'
      }
    ]
  },

  // ─── AFTER EXERCISE ───
  afterExercise: {
    id: 'afterExercise',
    title: { el: 'Μετά την άσκηση', en: 'After exercise' },
    steps: [
      {
        id: 'ask_feeling',
        text: { el: 'Πώς ήταν;', en: 'How was it?' },
        type: 'select',
        options: [
          { label: { el: '😊 Βοήθησε', en: '😊 It helped' }, feedback: 'helpful', next: 'encourage' },
          { label: { el: '😐 Δεν είμαι σίγουρος', en: '😐 Not sure' }, feedback: 'neutral', next: 'normalize' },
          { label: { el: '😕 Δεν ένιωσα τίποτα', en: '😕 Didn\'t feel anything' }, feedback: 'nothing', next: 'reassure' },
          { label: { el: '😣 Ένιωσα δυσφορία', en: '😣 Felt discomfort' }, feedback: 'discomfort', next: 'safety' }
        ]
      },
      {
        id: 'encourage',
        text: {
          el: 'Αυτή η αίσθηση που νιώθεις τώρα — αυτό ήταν. Δεν χρειαζόταν κάτι παραπάνω.',
          en: 'That sensation you feel right now — that was it. Nothing more was needed.'
        },
        type: 'message',
        next: 'end'
      },
      {
        id: 'normalize',
        text: {
          el: 'Αυτό είναι απολύτως φυσιολογικό. Η πρακτική δεν είναι πάντα δραματική. Μερικές φορές απλά παρατηρείς. Αυτό αρκεί.',
          en: 'This is completely normal. Practice isn\'t always dramatic. Sometimes you just observe. That\'s enough.'
        },
        type: 'message',
        next: 'end'
      },
      {
        id: 'reassure',
        text: {
          el: 'Αυτό δεν σημαίνει ότι δεν δούλεψε. Πολλοί νευροδιαφορετικοί έχουν ατυπική δια-αίσθηση — η αίσθηση μπορεί να είναι αμυδρή ή καθυστερημένη. Δοκίμασε εξωτερικές αγκυρώσεις: κάτι κρύο, μια υφή, ένα βάρος.',
          en: 'This doesn\'t mean it didn\'t work. Many neurodivergent people have atypical interoception — sensation may be faint or delayed. Try external anchors: something cold, a texture, a weight.'
        },
        type: 'message',
        next: 'end'
      },
      {
        id: 'safety',
        text: {
          el: 'Η δυσφορία είναι σήμα — και η μέθοδος σέβεται τα σήματα. Δεν χρειάζεται να συνεχίσεις. Αν θέλεις, δοκίμασε κάτι πιο ήπιο — ή απλά σταμάτα. Κάθε σταμάτημα είναι νόμιμο.',
          en: 'Discomfort is a signal — and the method respects signals. You don\'t need to continue. If you want, try something gentler — or simply stop. Every stop is valid.'
        },
        type: 'message',
        showConcept: 'trauma',
        next: 'end'
      }
    ]
  },

  // ─── HISTORY EXPLORER ───
  historyView: {
    id: 'historyView',
    title: { el: 'Ιστορικό', en: 'History' },
    steps: [
      {
        id: 'show_history',
        type: 'history_view'
      }
    ]
  }
};


// ═══════════════════════════════════════════
// MOOD CATEGORIES — for grouping in UI
// ═══════════════════════════════════════════

var MOOD_CATEGORIES = {
  crisis:    { el: 'SOS / Κρίση',   en: 'SOS / Crisis', color: '#E24B4A', moods: ['overwhelm'] },
  tension:   { el: 'Άγχος / Διάσπαση', en: 'Anxiety / ADHD', color: '#C07050', moods: ['anxiety', 'scattered'] },
  emotional: { el: 'Συναίσθημα',    en: 'Feeling',      color: '#B5A7D0', moods: ['selfcritical', 'hyperfocus'] },
  positive:  { el: 'Ηρεμία',        en: 'Calm',         color: '#7A9E7E', moods: ['calm'] }
};


// ═══════════════════════════════════════════
// DYNAMIC ACTION GENERATORS
// For moods with dynamicActions, these functions
// generate context-aware actions at runtime
// ═══════════════════════════════════════════

var DYNAMIC_ACTIONS = {

  nextChapterOrFAQ: function(companionData, lang) {
    var chs = (typeof CHAPTERS_DATA !== 'undefined') ? (CHAPTERS_DATA[lang] || CHAPTERS_DATA.el) : [];
    var nextCh = null;
    for (var i = 1; i <= 10; i++) {
      if (!companionData.chapterProgress[i] || !companionData.chapterProgress[i].completed) {
        nextCh = i; break;
      }
    }
    var actions = [];
    if (nextCh && chs[nextCh - 1]) {
      actions.push({
        key: 'chapter',
        label: { el: chs[nextCh-1].icon + ' Κεφ. ' + nextCh + ': ' + chs[nextCh-1].title, en: chs[nextCh-1].icon + ' Ch. ' + nextCh + ': ' + chs[nextCh-1].title },
        run: 'openChapter(' + nextCh + ')'
      });
    }
    actions.push({
      key: 'faq',
      label: { el: '❓ Ρώτα κάτι', en: '❓ Ask something' },
      flow: 'chapterExplore'
    });
    actions.push({
      key: 'concepts',
      label: { el: '🔍 Εξερεύνηση εννοιών', en: '🔍 Explore concepts' },
      flow: 'conceptExplore'
    });
    return actions;
  },

  practiceOrNextChapter: function(companionData, lang) {
    var chs = (typeof CHAPTERS_DATA !== 'undefined') ? (CHAPTERS_DATA[lang] || CHAPTERS_DATA.el) : [];
    var resumeCh = null, nextCh = null;
    var progKeys = Object.keys(companionData.chapterProgress);
    for (var p = 0; p < progKeys.length; p++) {
      var prog = companionData.chapterProgress[progKeys[p]];
      if (!prog.completed && prog.scrollPct > 0.05) { resumeCh = parseInt(progKeys[p]); break; }
    }
    for (var i = 1; i <= 10; i++) {
      if (!companionData.chapterProgress[i] || !companionData.chapterProgress[i].completed) { nextCh = i; break; }
    }

    var actions = [];
    actions.push({
      key: 'breath',
      label: { el: '🫁 Αναπνοή 4-2-6-1', en: '🫁 Breath 4-2-6-1' },
      run: "switchPattern('4-2-6-1');showScreen('breath')"
    });
    if (resumeCh && chs[resumeCh - 1]) {
      actions.push({
        key: 'resume',
        label: { el: '📖 Συνέχισε: ' + chs[resumeCh-1].title, en: '📖 Continue: ' + chs[resumeCh-1].title },
        run: 'openChapter(' + resumeCh + ')'
      });
    } else if (nextCh && chs[nextCh - 1]) {
      actions.push({
        key: 'next',
        label: { el: '📖 Επόμενο: ' + chs[nextCh-1].title, en: '📖 Next: ' + chs[nextCh-1].title },
        run: 'openChapter(' + nextCh + ')'
      });
    }
    actions.push({
      key: 'exercise',
      label: { el: '🎯 Άσκηση', en: '🎯 Exercise' },
      run: "showScreen('practice')"
    });
    return actions;
  }
};
