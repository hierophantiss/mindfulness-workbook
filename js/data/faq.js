/* ═══════════════════════════════════════════
   js/data/faq.js — Knowledge FAQ for Companion 2.0
   
   Structured Q&A per chapter, bilingual (el/en)
   Each entry:
     q: question text
     a: answer text (from the book's content)
     tags: for search/cross-reference
     depth: 1=basic, 2=intermediate, 3=neuroscience
     relatedChapter: (optional) links to another chapter
     relatedExercise: (optional) links to exercise file
     relatedConcept: (optional) links to KNOWLEDGE_CONCEPTS key
     followUp: (optional) next conversation flow step
   ═══════════════════════════════════════════ */

var KNOWLEDGE_FAQ = {

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 1: ΣΩΜΑ — Body
  // ═══════════════════════════════════════════
  1: {
    el: [
      {
        q: 'Τι είναι η γείωση;',
        a: 'Η γείωση είναι η αίσθηση του σώματός σου στον χώρο μέσω της βαρύτητας. Νιώθεις τα πέλματα στο πάτωμα, το βάρος στην καρέκλα, τον άξονα της σπονδυλικής στήλης. Η βαρύτητα είναι η απόδειξη του «Εδώ» — σου δείχνει ακριβώς πού βρίσκεσαι αυτή τη στιγμή.',
        tags: ['body', 'grounding', 'basics', 'gravity'],
        depth: 1,
        relatedExercise: 'gravity_thoughts.html',
        relatedConcept: 'grounding'
      },
      {
        q: 'Γιατί ξεκινάμε από το σώμα και όχι από τη σκέψη;',
        a: 'Μέσα στο σώμα δεν υπάρχουν έννοιες — μόνο αισθήσεις. Βάρος, ζεστασιά, πίεση, παλμός. Όταν στρέφεσαι στο σώμα, βγαίνεις από τη σκέψη χωρίς να πολεμήσεις τη σκέψη. Αυτή η μετάβαση — από τις λέξεις στις αισθήσεις — είναι η βάση κάθε πρακτικής ενσυνειδητότητας.',
        tags: ['body', 'grounding', 'philosophy'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'Πώς η γείωση σταματά την αυτοκριτική;',
        a: 'Το Default Mode Network — ο «αυτόματος πιλότος» — παράγει νοητική περιπλάνηση, αυτοκριτική και επανάληψη παλιών ιστοριών. Κάθε φορά που νιώθεις τη βαρύτητα, ενεργοποιείς αισθητηριακά κυκλώματα που ανταγωνίζονται αυτόν τον πιλότο. Δεν μπορείς ταυτόχρονα να βυθίζεσαι σε αυτοκριτική και να νιώθεις το πάτωμα κάτω από τα πόδια σου.',
        tags: ['body', 'grounding', 'dmn', 'self-criticism', 'neuroscience'],
        depth: 2,
        relatedConcept: 'dmn'
      },
      {
        q: 'Δεν νιώθω τίποτα όταν προσπαθώ να γειωθώ. Τι κάνω;',
        a: 'Αυτό είναι πολύ συνηθισμένο — ειδικά για νευροδιαφορετικούς. Πολλοί έχουν ατυπική δια-αίσθηση (interoception), δηλαδή δυσκολεύονται να αντιληφθούν εσωτερικές σωματικές αισθήσεις. Δοκίμασε εξωτερικές αγκυρώσεις αντί εσωτερικών: κράτα κάτι βαρύ, πάτα δυνατά στο πάτωμα, νιώσε τη θερμοκρασία ενός αντικειμένου. Η αίσθηση δεν χρειάζεται να είναι ισχυρή — ακόμα και μια αμυδρή αντίληψη αρκεί.',
        tags: ['body', 'interoception', 'difficulty', 'nd-specific', 'tips'],
        depth: 1,
        relatedConcept: 'interoception',
        followUp: 'tryExternal'
      },
      {
        q: 'Τι είναι ο «απόηχος» στο σώμα;',
        a: 'Το σφίξιμο στο σώμα, η ένταση, η φωνή που λέει «δεν κάνεις αρκετά» — δεν γεννήθηκαν μέσα σου. Είναι απόηχοι του παρελθόντος: λόγια που άκουσες, βλέμματα που δέχτηκες, προσδοκίες που δεν εκπληρώθηκαν. Το νευρικό σου σύστημα τα αποθήκευσε. Η μέθοδος δεν ζητά να πολεμήσεις αυτόν τον απόηχο — ζητά να τον αναγνωρίσεις: «Α, αυτή είναι η παλιά φωνή. Δεν χρειάζεται να την ακολουθήσω».',
        tags: ['body', 'trauma', 'echo', 'kindness'],
        depth: 2,
        relatedChapter: 5,
        relatedConcept: 'echo'
      },
      {
        q: 'Τι ρόλο παίζει η ιδιοδεκτικότητα;',
        a: 'Η ιδιοδεκτικότητα (proprioception) είναι η αίσθηση της θέσης του σώματος στον χώρο. Όταν νιώθεις τη βαρύτητα, ενεργοποιείς το ιδιοδεκτικό σύστημα — Craig (2002) Nature Reviews Neuroscience. Αυτή η αίσθηση ανταγωνίζεται το DMN (τον αυτόματο πιλότο) και φέρνει τον νου στο «εδώ» χωρίς προσπάθεια.',
        tags: ['body', 'proprioception', 'neuroscience'],
        depth: 3,
        relatedConcept: 'proprioception'
      },
      {
        q: 'Πώς συνδέεται το σώμα με τον χώρο;',
        a: 'Η βαθιά χαλαρότητα μέσα στο σώμα δεν είναι ποτέ μια απομονωμένη πράξη. Προϋποθέτει πάντα την επίγνωση του χώρου. Το σώμα, μέσω των αισθητηρίων, μας πληροφορεί συνεχώς για τη θέση μας μέσα στον χώρο. Όταν ο χώρος γίνεται αντιληπτός ως ασφαλής, το νευρικό σύστημα χαλαρώνει — και μόνο τότε το σώμα αφήνεται πραγματικά.',
        tags: ['body', 'space', 'safety', 'nervous-system'],
        depth: 2,
        relatedChapter: 4
      }
    ],
    en: [
      {
        q: 'What is grounding?',
        a: 'Grounding is the sensation of your body in space through gravity. You feel your soles on the floor, the weight on the chair, the axis of your spine. Gravity is the proof of "Here" — it shows you exactly where you exist in this moment.',
        tags: ['body', 'grounding', 'basics', 'gravity'],
        depth: 1,
        relatedExercise: 'gravity_thoughts.html',
        relatedConcept: 'grounding'
      },
      {
        q: 'Why do we start with the body, not thought?',
        a: 'Inside the body there are no concepts — only sensations. Weight, warmth, pressure, pulse. When you turn to the body, you leave thinking without fighting thinking. This shift — from words to sensations — is the foundation of every mindfulness practice.',
        tags: ['body', 'grounding', 'philosophy'],
        depth: 1,
        relatedChapter: 5
      },
      {
        q: 'How does grounding stop self-criticism?',
        a: 'The Default Mode Network — the "autopilot" — produces mental wandering, self-criticism, and replaying old stories. Every time you feel gravity, you activate sensory circuits that compete with that autopilot. You cannot simultaneously sink into self-criticism and feel the floor beneath your feet.',
        tags: ['body', 'grounding', 'dmn', 'self-criticism', 'neuroscience'],
        depth: 2,
        relatedConcept: 'dmn'
      },
      {
        q: 'I don\'t feel anything when I try to ground. What do I do?',
        a: 'This is very common — especially for neurodivergent people. Many have atypical interoception, meaning difficulty perceiving internal body sensations. Try external anchors instead: hold something heavy, press your feet firmly into the floor, feel the temperature of an object. The sensation doesn\'t need to be strong — even a faint awareness is enough.',
        tags: ['body', 'interoception', 'difficulty', 'nd-specific', 'tips'],
        depth: 1,
        relatedConcept: 'interoception',
        followUp: 'tryExternal'
      },
      {
        q: 'What is the "echo" in the body?',
        a: 'The tightness in your body, the tension, the voice that says "you\'re not doing enough" — they didn\'t originate inside you. They are echoes of the past: words you heard, looks you received, expectations that weren\'t met. Your nervous system stored them. This method doesn\'t ask you to fight that echo — it asks you to recognize it: "Ah, that\'s the old voice. I don\'t need to follow it."',
        tags: ['body', 'trauma', 'echo', 'kindness'],
        depth: 2,
        relatedChapter: 5,
        relatedConcept: 'echo'
      },
      {
        q: 'What role does proprioception play?',
        a: 'Proprioception is the sense of your body\'s position in space. When you feel gravity, you activate the proprioceptive system — Craig (2002) Nature Reviews Neuroscience. This sensation competes with the DMN (the autopilot) and brings the mind to "here" without effort.',
        tags: ['body', 'proprioception', 'neuroscience'],
        depth: 3,
        relatedConcept: 'proprioception'
      },
      {
        q: 'How are body and space connected?',
        a: 'Deep relaxation in the body is never an isolated act. It always requires awareness of space. Our body, through sensory organs, continuously informs us of our position in space. When space is perceived as safe, the nervous system relaxes — and only then does the body truly let go.',
        tags: ['body', 'space', 'safety', 'nervous-system'],
        depth: 2,
        relatedChapter: 4
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 2: ΑΝΑΠΝΟΗ — Breath
  // ═══════════════════════════════════════════
  2: {
    el: [
      {
        q: 'Γιατί η αναπνοή είναι σημαντική;',
        a: 'Αν το σώμα μάς ενώνει με τη γη, η αναπνοή μάς συνδέει με τον ρυθμό της ζωής. Κάθε εισπνοή: αρχή. Κάθε παύση: τώρα. Κάθε εκπνοή: αποδοχή. Σώμα + Αναπνοή μαζί σχηματίζουν τον κατακόρυφο άξονα: η βαρύτητα δίνει το «Εδώ», η αναπνοή το «Τώρα».',
        tags: ['breath', 'basics', 'rhythm', 'axis'],
        depth: 1
      },
      {
        q: 'Τι είναι η «εσωτερική αφή»;',
        a: 'Η αναπνοή δεν είναι μόνο αέρας — είναι αφή. Νιώσε τον αέρα στα ρουθούνια, τη διαστολή του στήθους, τη μαλακή κίνηση της κοιλιάς. Αυτή η εσωτερική αφή ενεργοποιεί τη δια-αίσθηση (interoception) — τη γέφυρα μεταξύ σώματος και συνείδησης.',
        tags: ['breath', 'interoception', 'internal-touch'],
        depth: 2,
        relatedConcept: 'interoception'
      },
      {
        q: 'Τι μοτίβο αναπνοής να χρησιμοποιήσω;',
        a: 'Εξαρτάται από τι χρειάζεσαι:\n\n• 4-2-6-1 (Τετραπλός Άξονας): Γείωση & Παρουσία. Η αργή εκπνοή ενεργοποιεί το πνευμονογαστρικό νεύρο.\n• 4-7-8 (Dr. Weil): Βαθιά ηρεμία & ύπνος. Η μεγάλη κράτηση εξισορροπεί.\n• 5-5 (Συνοχή): Εστίαση & ισορροπία. Καρδιακή συνοχή — McCraty et al.',
        tags: ['breath', 'patterns', 'practical', '4-2-6-1', '4-7-8', '5-5'],
        depth: 1,
        relatedExercise: 'breath_exercise.html'
      },
      {
        q: 'Γιατί η αργή εκπνοή ηρεμεί;',
        a: 'Η αργή εκπνοή ενεργοποιεί το πνευμονογαστρικό νεύρο (vagus nerve) — το «φρένο» του νευρικού συστήματος. Αυτό μειώνει τον καρδιακό ρυθμό και στέλνει σήμα ασφάλειας στον εγκέφαλο — Gerritsen & Band (2018). Εκπνοή 6 δευτερολέπτων αρκεί για ενεργοποίηση.',
        tags: ['breath', 'vagus-nerve', 'neuroscience', 'exhale'],
        depth: 2,
        relatedConcept: 'vagus_nerve'
      },
      {
        q: 'Η αναπνοή μου είναι ρηχή/σφιγμένη. Τι σημαίνει;',
        a: 'Η αναπνοή είναι ο δείκτης της ψυχικής σου κατάστασης. Αν είναι σφιγμένη ή ρηχή → ένταση. Αν είναι αργή και βαθιά → χαλάρωση. Μην προσπαθήσεις να την αλλάξεις αμέσως — πρώτα παρατήρησε. Η παρατήρηση χωρίς επέμβαση είναι η ίδια η πρακτική.',
        tags: ['breath', 'observation', 'indicator', 'nd-specific'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε στιγμή έντονου πανικού;',
        a: 'Σε στιγμές έντονου άγχους, αφήνουμε την εκπνοή να βγαίνει από το στόμα, λίγο πιο αργά και παρατεταμένα. Αν ο πανικός είναι πολύ έντονος, χρησιμοποίησε το SOS mode — theta binaural beats (6 Hz) + αναπνοή 4-7-8 + ηρεμιστικό φως. Πάτα το ∞ και επίλεξε «Υπερφόρτωση».',
        tags: ['breath', 'panic', 'sos', 'crisis', 'practical'],
        depth: 1,
        relatedChapter: 7
      }
    ],
    en: [
      {
        q: 'Why is breathing important?',
        a: 'If the body unites us with the earth, breath connects us with the rhythm of life. Every inhale: beginning. Every pause: now. Every exhale: acceptance. Body + Breath together form the vertical axis: gravity gives us "Here," breath gives us "Now."',
        tags: ['breath', 'basics', 'rhythm', 'axis'],
        depth: 1
      },
      {
        q: 'What is "internal touch"?',
        a: 'Breath is not just air — it is touch. Feel the air at your nostrils, the expansion of the chest, the soft movement of the belly. This internal touch activates interoception — the bridge between body and consciousness.',
        tags: ['breath', 'interoception', 'internal-touch'],
        depth: 2,
        relatedConcept: 'interoception'
      },
      {
        q: 'Which breathing pattern should I use?',
        a: 'It depends on what you need:\n\n• 4-2-6-1 (Fourfold Axis): Grounding & Presence. Slow exhale activates the vagus nerve.\n• 4-7-8 (Dr. Weil): Deep calm & sleep. Long hold balances.\n• 5-5 (Coherence): Focus & balance. Cardiac coherence — McCraty et al.',
        tags: ['breath', 'patterns', 'practical', '4-2-6-1', '4-7-8', '5-5'],
        depth: 1,
        relatedExercise: 'breath_exercise.html'
      },
      {
        q: 'Why does slow exhale calm us?',
        a: 'Slow exhale activates the vagus nerve — the "brake" of the nervous system. This reduces heart rate and sends a safety signal to the brain — Gerritsen & Band (2018). A 6-second exhale is enough for activation.',
        tags: ['breath', 'vagus-nerve', 'neuroscience', 'exhale'],
        depth: 2,
        relatedConcept: 'vagus_nerve'
      },
      {
        q: 'My breathing is shallow/tight. What does it mean?',
        a: 'Breathing is the indicator of your mental state. If tight or shallow → tension. If slow and deep → relaxation. Don\'t try to change it immediately — first observe. Observation without intervention is the practice itself.',
        tags: ['breath', 'observation', 'indicator', 'nd-specific'],
        depth: 1
      },
      {
        q: 'What do I do in a moment of intense panic?',
        a: 'In moments of intense anxiety, let the exhale flow out through the mouth, a little slower and more prolonged. If panic is very intense, use SOS mode — theta binaural beats (6 Hz) + 4-7-8 breath + calming light. Tap the ∞ and select "Overwhelm."',
        tags: ['breath', 'panic', 'sos', 'crisis', 'practical'],
        depth: 1,
        relatedChapter: 7
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 3: ΠΡΟΣΟΧΗ — Attention
  // ═══════════════════════════════════════════
  3: {
    el: [
      {
        q: 'Ποιες είναι οι τρεις μορφές προσοχής;',
        a: '• Εστιασμένη (Κλειστή): Σαν φακός — φωτίζει ένα σημείο με ένταση.\n• Ανοιχτή: Σαν ανοιχτό φως — φωτίζει πολλά μαζί, χωρίς εστίαση.\n• Διασπασμένη: Σαν στροβοσκόπιο — πηδά από σκέψη σε σκέψη χωρίς επιστροφή.\n\nΣτόχος δεν είναι να εξαλείψεις τη διάσπαση — αλλά να αναγνωρίζεις σε ποια μορφή βρίσκεσαι.',
        tags: ['attention', 'modes', 'basics', 'focused', 'open', 'scattered'],
        depth: 1,
        relatedConcept: 'attention_modes'
      },
      {
        q: 'Τι είναι το hyperfocus και πώς το σπάω;',
        a: 'Η αντίθετη ακραία κατάσταση: ο νους κλειδώνει σε ένα σημείο και δεν μπορεί να φύγει. Ο κόσμος γύρω εξαφανίζεται — χώρος, σώμα, χρόνος.\n\nΕργαλείο: Χώρος (μαλάκωσε το βλέμμα, νιώσε τον χώρο γύρω) + Σώμα (νιώσε τη βαρύτητα — «σπάει» το τούνελ).',
        tags: ['attention', 'hyperfocus', 'nd-specific', 'practical'],
        depth: 1,
        relatedChapter: 5,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'Τι είναι η «ταμπέλα» και πώς βοηθάει;',
        a: 'Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα: «Ανησυχία», «Σενάριο», «Κριτική». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη, είσαι αυτός που την παρατηρεί. Μετά επέστρεψε απαλά στον άξονα. Δεν χρειάζεται να αναλύσεις τη σκέψη — μόνο να τη χαρακτηρίσεις.',
        tags: ['attention', 'labeling', 'practical', 'technique'],
        depth: 1,
        relatedConcept: 'labeling'
      },
      {
        q: 'Η προσοχή μου φεύγει αμέσως. Αποτυγχάνω;',
        a: 'Η επιστροφή της προσοχής δεν είναι αποτυχία — είναι η ίδια η άσκηση. Κάθε φορά που παρατηρείς ότι η προσοχή έφυγε και γυρνάς, κάνεις ένα «κάμψη» για τον προμετωπιαίο φλοιό. Ο αριθμός των επιστροφών μετράει — όχι η διάρκεια της εστίασης.',
        tags: ['attention', 'failure', 'nd-specific', 'encouragement'],
        depth: 1,
        relatedConcept: 'gentle_return'
      },
      {
        q: 'Τι σημαίνει «Τετραπλή Προσοχή»;',
        a: 'Στην πλήρη πρακτική, η προσοχή δεν λειτουργεί μόνη. Εστιάζει πάνω στον κατακόρυφο άξονα (Σώμα + Αναπνοή), και από εκεί ανοίγει στον Χώρο. Τέσσερα κέντρα, μία παρουσία. Αυτό σημαίνει «Τετραπλός Άξονας».',
        tags: ['attention', 'fourfold', 'axis', 'integration'],
        depth: 2,
        relatedChapter: 9
      }
    ],
    en: [
      {
        q: 'What are the three modes of attention?',
        a: '• Focused (Closed): Like a flashlight — illuminates one point intensely.\n• Open: Like ambient light — illuminates many things at once, without focus.\n• Scattered: Like a strobe — jumps from thought to thought without returning.\n\nThe goal isn\'t to eliminate scattering — but to recognize which mode you\'re in.',
        tags: ['attention', 'modes', 'basics', 'focused', 'open', 'scattered'],
        depth: 1,
        relatedConcept: 'attention_modes'
      },
      {
        q: 'What is hyperfocus and how do I break it?',
        a: 'The opposite extreme: the mind locks onto one point and cannot leave. The world around disappears — space, body, time.\n\nTool: Space (soften your gaze, feel the space around) + Body (feel gravity — it "breaks" the tunnel).',
        tags: ['attention', 'hyperfocus', 'nd-specific', 'practical'],
        depth: 1,
        relatedChapter: 5,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'What is "labeling" and how does it help?',
        a: 'When a thought pulls you, label it: "Worry," "Scenario," "Criticism." The label creates distance — you are not the thought, you are the one observing it. Then return gently to the axis. You don\'t need to analyze the thought — just characterize it.',
        tags: ['attention', 'labeling', 'practical', 'technique'],
        depth: 1,
        relatedConcept: 'labeling'
      },
      {
        q: 'My attention leaves immediately. Am I failing?',
        a: 'Returning attention is not failure — it is the practice itself. Every time you notice attention has left and you return, you\'re doing a "push-up" for the prefrontal cortex. The number of returns matters — not the duration of focus.',
        tags: ['attention', 'failure', 'nd-specific', 'encouragement'],
        depth: 1,
        relatedConcept: 'gentle_return'
      },
      {
        q: 'What does "Fourfold Attention" mean?',
        a: 'In the full practice, attention does not work alone. It focuses upon the vertical axis (Body + Breath), and from there opens into Space. Four centers, one presence. This is what "Fourfold Axis" means.',
        tags: ['attention', 'fourfold', 'axis', 'integration'],
        depth: 2,
        relatedChapter: 9
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 4: ΧΩΡΟΣ — Space
  // ═══════════════════════════════════════════
  4: {
    el: [
      {
        q: 'Τι σημαίνει «ανοιχτή επίγνωση»;',
        a: 'Η ανοιχτή επίγνωση είναι η ικανότητα να δέχεσαι τα πάντα χωρίς να κολλάς σε κάτι. Σκέψεις, αισθήσεις, ήχοι — έρχονται και φεύγουν σαν σύννεφα σε ανοιχτό ουρανό. Εσύ δεν είσαι τα σύννεφα — είσαι ο χώρος που τα χωράει.',
        tags: ['space', 'open-awareness', 'basics', 'sky-metaphor'],
        depth: 1,
        relatedConcept: 'open_awareness'
      },
      {
        q: 'Πώς βοηθάει ο χώρος στην υπερφόρτωση;',
        a: 'Η ανοιχτή προσοχή λειτουργεί ως σήμα ασφάλειας στον εγκέφαλο: «δεν υπάρχει κίνδυνος, υπάρχει χώρος». Η περιφερειακή όραση, η ανοιχτή ακοή, η αίσθηση του χώρου γύρω — όλα αυτά μαζί «σβήνουν» το σήμα συναγερμού. Αντί να πολεμάς τα ερεθίσματα, τα αφήνεις να υπάρχουν.',
        tags: ['space', 'overload', 'nd-specific', 'safety', 'practical'],
        depth: 1,
        relatedChapter: 7
      },
      {
        q: 'Πώς μαλακώνω το βλέμμα;',
        a: 'Τρία βήματα:\n1. Εστίασε σε ένα σημείο (Προσοχή).\n2. Μαλάκωσε το βλέμμα — μην κρατάς, άφησε τα μάτια να χαλαρώσουν.\n3. Άφησε τον χώρο να σε αγκαλιάσει — ήχοι, σώμα, αέρας, όλα μαζί.\n\nΔεν προσπαθείς να δεις τα πάντα. Αφήνεις τα πάντα να υπάρχουν.',
        tags: ['space', 'peripheral-vision', 'technique', 'practical'],
        depth: 1,
        relatedExercise: 'openawareness.html'
      },
      {
        q: 'Τι σχέση έχει ο χώρος με τη μεταφορά του ουρανού;',
        a: 'Ο ουρανός δεν πιέζεται από τα σύννεφα, δεν αντιδρά, δεν κρίνει. Απλά τα χωράει. Ο χώρος της επίγνωσης λειτουργεί ακριβώς έτσι — σκέψεις, συναισθήματα, αισθήσεις εμφανίζονται και εξαφανίζονται. Εσύ μένεις. Αυτό δεν είναι ποιητική εικόνα — είναι η εμπειρία του 4ου άξονα.',
        tags: ['space', 'sky-metaphor', 'philosophy', 'dzogchen'],
        depth: 2
      }
    ],
    en: [
      {
        q: 'What does "open awareness" mean?',
        a: 'Open awareness is the ability to receive everything without clinging to anything. Thoughts, sensations, sounds — they come and go like clouds in an open sky. You are not the clouds — you are the space that holds them.',
        tags: ['space', 'open-awareness', 'basics', 'sky-metaphor'],
        depth: 1,
        relatedConcept: 'open_awareness'
      },
      {
        q: 'How does space help with overload?',
        a: 'Open attention functions as a safety signal to the brain: "no danger, there is space." Peripheral vision, open hearing, the sense of space around — all together they "turn off" the alarm signal. Instead of fighting stimuli, you let them be.',
        tags: ['space', 'overload', 'nd-specific', 'safety', 'practical'],
        depth: 1,
        relatedChapter: 7
      },
      {
        q: 'How do I soften my gaze?',
        a: 'Three steps:\n1. Focus on one point (Attention).\n2. Soften your gaze — don\'t hold, let the eyes relax.\n3. Let space embrace you — sounds, body, air, all together.\n\nYou\'re not trying to see everything. You\'re letting everything exist.',
        tags: ['space', 'peripheral-vision', 'technique', 'practical'],
        depth: 1,
        relatedExercise: 'openawareness.html'
      },
      {
        q: 'What\'s the relationship between space and the sky metaphor?',
        a: 'The sky is not burdened by clouds, does not react, does not judge. It simply holds them. The space of awareness works exactly like this — thoughts, emotions, sensations appear and disappear. You remain. This is not a poetic image — it is the experience of the 4th axis.',
        tags: ['space', 'sky-metaphor', 'philosophy', 'dzogchen'],
        depth: 2
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 5: ΝΕΥΡΟΔΙΑΦΟΡΕΤΙΚΟΣ ΝΟΥΣ
  // ═══════════════════════════════════════════
  5: {
    el: [
      {
        q: 'Ο νους μου «τρέχει». Τι κάνω;',
        a: 'Νους που τρέχει = Διασπασμένη Προσοχή / Υπερφόρτωση. Ο κόσμος γίνεται αλυσίδα από μικρά άγκιστρα — κάθε ερέθισμα κρατά ένα κομμάτι προσοχής.\n\nΕργαλείο: Σώμα (Γείωση) + Αναπνοή (Ρυθμός). Η βαρύτητα σε φέρνει «εδώ», ο ρυθμός σε φέρνει «τώρα». Νιώσε τα πέλματα + μία αναπνοή. Αυτό αρκεί.',
        tags: ['mind', 'racing', 'nd-specific', 'practical', 'adhd'],
        depth: 1,
        relatedExercise: 'racing_mind.html'
      },
      {
        q: 'Ο νους μου «κλειδώνει». Τι κάνω;',
        a: 'Νους που κλειδώνει = Αγκυλωμένη Προσοχή / Hyperfocus. Σαν τούνελ έντονης εστίασης. Ο χρόνος εξαφανίζεται, το σώμα ξεχνιέται.\n\nΕργαλείο: Χώρος (Απελευθέρωση) + Σώμα (Επιστροφή). Μαλάκωσε το βλέμμα, νιώσε τον χώρο γύρω — αυτό «σπάει» το τούνελ.',
        tags: ['mind', 'locking', 'hyperfocus', 'nd-specific', 'practical', 'autism'],
        depth: 1,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'Τι είναι ο «μηχανικός νους»;',
        a: 'Πολλοί νευροδιαφορετικοί αναπτύσσουν έναν «μηχανικό νου» — ένα εσωτερικό σύστημα κανόνων που αντικαθιστά τον αυτοματισμό που λείπει. Είναι κουραστικό αλλά εξυπνότατο. Η ενσυνειδητότητα δεν αντικαθιστά τον μηχανικό νου — τον ανακουφίζει. Δίνει στιγμές ανάπαυσης στο σύστημα.',
        tags: ['mind', 'mechanical-mind', 'nd-specific', 'masking'],
        depth: 2
      },
      {
        q: 'Γιατί η αυτοκριτική είναι τόσο δυνατή;',
        a: 'Η νευροεπιστήμη δείχνει: η αυτοκριτική ενεργοποιεί την αμυγδαλή και την κορτιζόλη — τα ίδια κυκλώματα με τον εξωτερικό κίνδυνο. Κάθε φορά που κρίνεις τον εαυτό σου, ο εγκέφαλος αντιδρά σαν να δέχεσαι επίθεση. Η αυτοκριτική δεν είναι δική σου αλήθεια — είναι απόηχος. Η απαλότητα της μεθόδου είναι η ίδια η στάση που χρειάζεται.',
        tags: ['mind', 'self-criticism', 'amygdala', 'cortisol', 'neuroscience', 'kindness'],
        depth: 2,
        relatedConcept: 'self_criticism'
      },
      {
        q: 'Ο νους μου δεν είναι σπασμένος;',
        a: 'Όχι. Ο νευροδιαφορετικός νους δεν είναι ελαττωματικός — λειτουργεί διαφορετικά. Η ένταση, η διάσπαση, το κλείδωμα δεν είναι αδυναμίες — είναι μοτίβα. Και τα μοτίβα μπορούν να αναγνωριστούν. Δεν πολεμάς τον εγκέφαλό σου — συνεργάζεσαι μαζί του.',
        tags: ['mind', 'affirmation', 'nd-specific', 'core-message'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'My mind is "racing." What do I do?',
        a: 'Racing mind = Scattered Attention / Overload. The world becomes a chain of small hooks — each stimulus holds a piece of attention.\n\nTool: Body (Grounding) + Breath (Rhythm). Gravity brings you "here," rhythm brings you "now." Feel your soles + one breath. That\'s enough.',
        tags: ['mind', 'racing', 'nd-specific', 'practical', 'adhd'],
        depth: 1,
        relatedExercise: 'racing_mind.html'
      },
      {
        q: 'My mind is "locking." What do I do?',
        a: 'Locking mind = Anchored Attention / Hyperfocus. Like a tunnel of intense focus. Time disappears, the body is forgotten.\n\nTool: Space (Release) + Body (Return). Soften your gaze, feel the space around — this "breaks" the tunnel.',
        tags: ['mind', 'locking', 'hyperfocus', 'nd-specific', 'practical', 'autism'],
        depth: 1,
        relatedConcept: 'hyperfocus'
      },
      {
        q: 'What is the "mechanical mind"?',
        a: 'Many neurodivergent people develop a "mechanical mind" — an internal rule system that replaces the missing automaticity. It\'s exhausting but brilliantly clever. Mindfulness doesn\'t replace the mechanical mind — it relieves it. It gives moments of rest to the system.',
        tags: ['mind', 'mechanical-mind', 'nd-specific', 'masking'],
        depth: 2
      },
      {
        q: 'Why is self-criticism so powerful?',
        a: 'Neuroscience shows: self-criticism activates the amygdala and cortisol — the same circuits as external threat. Every time you judge yourself, your brain reacts as if under attack. Self-criticism isn\'t your truth — it\'s an echo. The gentleness of this method is the very attitude that\'s needed.',
        tags: ['mind', 'self-criticism', 'amygdala', 'cortisol', 'neuroscience', 'kindness'],
        depth: 2,
        relatedConcept: 'self_criticism'
      },
      {
        q: 'My mind isn\'t broken?',
        a: 'No. The neurodivergent mind is not defective — it works differently. The intensity, the scattering, the locking are not weaknesses — they are patterns. And patterns can be recognized. You don\'t fight your brain — you collaborate with it.',
        tags: ['mind', 'affirmation', 'nd-specific', 'core-message'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 6: ΚΑΘΗΜΕΡΙΝΗ ΖΩΗ
  // ═══════════════════════════════════════════
  6: {
    el: [
      {
        q: 'Πώς χρησιμοποιώ τον Τετραπλό Άξονα στη δουλειά;',
        a: '3 αναπνοές πριν ανοίξεις email. Νιώσε τα πέλματα πριν μιλήσεις σε meeting. Ταμπέλα στις σκέψεις ανησυχίας. Αυτά τα 3 πράγματα, κάθε μέρα, αλλάζουν τη σχέση σου με την ένταση χωρίς να χρειαστείς χρόνο.',
        tags: ['daily', 'work', 'practical', 'micro-doses'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε θορυβώδη χώρο;',
        a: '• Νιώσε τα πόδια στο έδαφος — άμεση γείωση.\n• 3 ήσυχες αναπνοές με εκπνοή από το στόμα.\n• Άνοιξε την περιφερειακή όραση — μετατρέπει τα ερεθίσματα σε «σύννεφα».\n• Ακουστικά ή fidget toy αν χρειαστεί — δεν είναι αδυναμία, είναι ρύθμιση.',
        tags: ['daily', 'noise', 'sensory', 'practical', 'nd-specific'],
        depth: 1
      },
      {
        q: 'Πώς βοηθάει σε κοινωνικές καταστάσεις;',
        a: '• Βρες ένα ουδέτερο σημείο εστίασης (φυτό, τοίχο).\n• Νιώσε τα πόδια σταθερά — γείωση κατά τη διάρκεια.\n• Ένταση στο σαγόνι; Μία αργή εκπνοή τη λύνει.\n• Αν χρειαστεί, βγες για 30 δευτερόλεπτα — δεν χρειάζεται δικαιολογία.',
        tags: ['daily', 'social', 'practical', 'nd-specific', 'masking'],
        depth: 1
      },
      {
        q: 'Πόσο χρόνο χρειάζεται καθημερινά;',
        a: 'Η συνέπεια σε μικρές δόσεις είναι πιο σημαντική από τη διάρκεια. 5 δευτερόλεπτα γείωσης πριν ξεκινήσεις τη μέρα. 10 δευτερόλεπτα αναπνοής πριν τον ύπνο. Αρκεί. Η παρουσία δεν χρειάζεται ώρες — ξεκινά με νίκες λίγων δευτερολέπτων.',
        tags: ['daily', 'time', 'micro-doses', 'encouragement'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I use the Fourfold Axis at work?',
        a: '3 breaths before opening email. Feel your soles before speaking in a meeting. Label anxious thoughts. These 3 things, every day, change your relationship with tension without needing extra time.',
        tags: ['daily', 'work', 'practical', 'micro-doses'],
        depth: 1
      },
      {
        q: 'What do I do in a noisy space?',
        a: '• Feel your feet on the ground — instant grounding.\n• 3 quiet breaths with mouth exhale.\n• Open peripheral vision — it transforms stimuli into "clouds."\n• Headphones or fidget toy if needed — it\'s not weakness, it\'s regulation.',
        tags: ['daily', 'noise', 'sensory', 'practical', 'nd-specific'],
        depth: 1
      },
      {
        q: 'How does it help in social situations?',
        a: '• Find a neutral focus point (plant, wall).\n• Feel your feet steady — grounding during interaction.\n• Tension in jaw? One slow exhale releases it.\n• If you need to, step out for 30 seconds — no justification needed.',
        tags: ['daily', 'social', 'practical', 'nd-specific', 'masking'],
        depth: 1
      },
      {
        q: 'How much time does it need daily?',
        a: 'Consistency in small doses matters more than duration. 5 seconds of grounding before starting the day. 10 seconds of breathing before sleep. That\'s enough. Presence doesn\'t need hours — it starts with victories of a few seconds.',
        tags: ['daily', 'time', 'micro-doses', 'encouragement'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 7: ΚΡΙΣΗ — Crisis
  // ═══════════════════════════════════════════
  7: {
    el: [
      {
        q: 'Τι κάνω σε κρίση άγχους;',
        a: 'Πρωτόκολλο Άγχους — 4 βήματα:\n1. Βάρος: νιώσε τη βαρύτητα\n2. Εκπνοή: 3 αργές εκπνοές από το στόμα\n3. Ταμπέλα: «Ανησυχία» ή «Σενάριο»\n4. Χώρος: άνοιξε περιφερειακή όραση\n\nΜπορείς να κάνεις μόνο ένα βήμα. Ακόμα και αυτό αρκεί.',
        tags: ['crisis', 'anxiety', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'Τι κάνω σε υπερφόρτωση ερεθισμάτων;',
        a: 'Πρωτόκολλο Υπερφόρτωσης — 4 βήματα:\n1. Πέλματα: νιώσε τα στο πάτωμα\n2. Ροή: μείνε στη ροή της αναπνοής\n3. Ένα σημείο: σταθερό σημείο εστίασης\n4. Μαλάκωσε: τα ερεθίσματα είναι σύννεφα\n\nΑν είναι πολύ έντονο, χρησιμοποίησε το SOS mode.',
        tags: ['crisis', 'overload', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'Ποια είναι τα πρώτα σημάδια;',
        a: 'Τα πρώτα σήματα εμφανίζονται στο σώμα πριν τη σκέψη: σφίξιμο στο σαγόνι, ένταση στους ώμους, πίεση στο στήθος, ρηχή αναπνοή. Αναγνώρισε τα δικά σου — αυτά είναι ο πρώιμος δείκτης. Όσο νωρίτερα τα πιάνεις, τόσο ευκολότερα τα διαχειρίζεσαι.',
        tags: ['crisis', 'signals', 'body', 'self-awareness'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'What do I do in an anxiety crisis?',
        a: 'Anxiety Protocol — 4 steps:\n1. Weight: feel gravity\n2. Exhale: 3 slow mouth exhales\n3. Label: "Worry" or "Scenario"\n4. Space: open peripheral vision\n\nYou can do just one step. Even that is enough.',
        tags: ['crisis', 'anxiety', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'What do I do in sensory overload?',
        a: 'Overload Protocol — 4 steps:\n1. Soles: feel them on the floor\n2. Flow: stay with the breath flow\n3. One point: stable focus point\n4. Soften: stimuli are clouds\n\nIf too intense, use SOS mode.',
        tags: ['crisis', 'overload', 'protocol', 'practical', 'sos'],
        depth: 1
      },
      {
        q: 'What are the early warning signs?',
        a: 'The first signals appear in the body before thought: jaw tightening, shoulder tension, chest pressure, shallow breathing. Recognize your own — these are your early indicator. The sooner you catch them, the easier they are to manage.',
        tags: ['crisis', 'signals', 'body', 'self-awareness'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 8: ΦΥΛΛΟ ΕΡΓΑΣΙΑΣ
  // ═══════════════════════════════════════════
  8: {
    el: [
      {
        q: 'Πώς χρησιμοποιώ τα 4 βήματα;',
        a: 'Κάνε τα βήματα με σειρά ή διάλεξε αυτό που χρειάζεσαι τώρα:\n\nΣΩΜΑ: Νιώσε το βάρος σου.\nΑΝΑΠΝΟΗ: Μία εκπνοή από το στόμα.\nΠΡΟΣΟΧΗ: Πού είναι η προσοχή; Γύρνα σε ένα σημείο.\nΧΩΡΟΣ: Μαλάκωσε. Θυμήσου τον ουρανό.\n\nΑκόμα και ένα βήμα αλλάζει την κατάσταση.',
        tags: ['worksheet', 'quick-reference', 'practical', '4-steps'],
        depth: 1,
        relatedChapter: 9
      },
      {
        q: 'Πρέπει να τα κάνω με σειρά;',
        a: 'Όχι. Μπορείς να ξεκινήσεις από οποιοδήποτε βήμα. Αν νιώθεις ένταση → ΣΩΜΑ πρώτα. Αν τρέχει ο νους → ΑΝΑΠΝΟΗ. Αν η προσοχή πηδά → ΠΡΟΣΟΧΗ. Αν νιώθεις κλειστός → ΧΩΡΟΣ. Η σειρά Σ→Α→Π→Χ είναι η πλήρης ακολουθία, αλλά ένα μόνο βήμα αρκεί.',
        tags: ['worksheet', 'flexibility', 'practical'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I use the 4 steps?',
        a: 'Do the steps in order or choose the one you need now:\n\nBODY: Feel your weight.\nBREATH: One mouth exhale.\nATTENTION: Where is your attention? Return to a point.\nSPACE: Soften. Remember the sky.\n\nEven one step changes the state.',
        tags: ['worksheet', 'quick-reference', 'practical', '4-steps'],
        depth: 1,
        relatedChapter: 9
      },
      {
        q: 'Do I have to do them in order?',
        a: 'No. You can start from any step. Feeling tension → BODY first. Mind racing → BREATH. Attention jumping → ATTENTION. Feeling closed → SPACE. The S→B→A→S sequence is the full practice, but one step alone is enough.',
        tags: ['worksheet', 'flexibility', 'practical'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 9: ΤΑ ΤΕΣΣΕΡΑ ΣΤΑΔΙΑ
  // ═══════════════════════════════════════════
  9: {
    el: [
      {
        q: 'Πώς κάνω την πλήρη πρακτική;',
        a: 'Στάδιο 1 — Γείωση: Κάθισε. Νιώσε τα σημεία επαφής.\nΣτάδιο 2 — Αναπνοή: Κλείσε τα μάτια. Ακολούθησε τη ροή.\nΣτάδιο 3 — Προσοχή: Άνοιξε τα μάτια. Σταθερό σημείο. Ταμπέλα αν χρειαστεί.\nΣτάδιο 4 — Χώρος: Μαλάκωσε. Νιώσε τα πάντα μαζί.\n\nΑκόμα και 20 δευτερόλεπτα αρκούν.',
        tags: ['stages', 'full-practice', 'practical', 'guide'],
        depth: 1,
        relatedExercise: 'journey.html'
      },
      {
        q: 'Τι στάση πρέπει να έχω;',
        a: 'Η απαλότητα δεν είναι προαιρετική — είναι η ίδια η μέθοδος. Κάθε φορά που επιστρέφεις χωρίς κριτική, κάθε φορά που δέχεσαι τη διάσπαση ως μέρος της διαδικασίας — εξασκείς καλοσύνη. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο που δυσκολεύεται.',
        tags: ['stages', 'attitude', 'kindness', 'core-message'],
        depth: 1
      },
      {
        q: 'Πόσο διαρκεί κάθε στάδιο;',
        a: 'Δεν υπάρχει σωστή διάρκεια. Ξεκίνα με 5 δευτερόλεπτα ανά στάδιο (20 δευτερόλεπτα σύνολο). Αν θέλεις, αύξησε σε 1 λεπτό ανά στάδιο (4 λεπτά σύνολο). Η σταθερότητα μετράει — όχι η διάρκεια. 20 δευτερόλεπτα κάθε μέρα > 20 λεπτά μία φορά.',
        tags: ['stages', 'duration', 'practical', 'encouragement'],
        depth: 1
      }
    ],
    en: [
      {
        q: 'How do I do the full practice?',
        a: 'Stage 1 — Grounding: Sit. Feel contact points.\nStage 2 — Breath: Close eyes. Follow the flow.\nStage 3 — Attention: Open eyes. Stable point. Label if needed.\nStage 4 — Space: Soften. Feel everything together.\n\nEven 20 seconds is enough.',
        tags: ['stages', 'full-practice', 'practical', 'guide'],
        depth: 1,
        relatedExercise: 'journey.html'
      },
      {
        q: 'What attitude should I have?',
        a: 'Gentleness is not optional — it is the method itself. Every time you return without criticism, every time you accept distraction as part of the process — you are practicing kindness. Treat yourself the way you would treat a friend who is struggling.',
        tags: ['stages', 'attitude', 'kindness', 'core-message'],
        depth: 1
      },
      {
        q: 'How long does each stage last?',
        a: 'There is no right duration. Start with 5 seconds per stage (20 seconds total). If you want, increase to 1 minute per stage (4 minutes total). Consistency matters — not duration. 20 seconds daily > 20 minutes once.',
        tags: ['stages', 'duration', 'practical', 'encouragement'],
        depth: 1
      }
    ]
  },

  // ═══════════════════════════════════════════
  // ΚΕΦΑΛΑΙΟ 10: ΕΠΙΣΤΗΜΗ & ΣΟΦΙΑ
  // ═══════════════════════════════════════════
  10: {
    el: [
      {
        q: 'Τι λέει η νευροεπιστήμη για αυτή τη μέθοδο;',
        a: '• Η αίσθηση βαρύτητας ενεργοποιεί το ιδιοδεκτικό σύστημα — Craig (2002).\n• Η αργή εκπνοή ενεργοποιεί το vagus nerve — Gerritsen & Band (2018).\n• Η ενσυνειδητότητα μειώνει τη δραστηριότητα του DMN — Brewer et al. (2011) PNAS.\n• 8 εβδομάδες πρακτικής αλλάζουν μετρήσιμα τη δομή του εγκεφάλου — Hölzel et al. (2011).\n• Η εστιασμένη προσοχή ενισχύει τον προμετωπιαίο φλοιό — θεμέλιο αυτορρύθμισης.',
        tags: ['science', 'neuroscience', 'evidence', 'references'],
        depth: 3
      },
      {
        q: 'Από ποιες παραδόσεις προέρχεται η μέθοδος;',
        a: '• Satipatthana Sutta (Θεραβάντα): Τα Τέσσερα Θεμέλια αντιστοιχούν στους τέσσερις άξονες.\n• Samatha & Vipassana: Εστίαση → ενόραση, η κλασική διαδρομή 3ος → 4ος άξονας.\n• Dzogchen (Nyingma): Rigpa — η φυσική κατάσταση ανοιχτής επίγνωσης = 4ος άξονας.\n• Σουφισμός (Inayatiyya): Αναπνοή ως γέφυρα ύλης-πνεύματος.\n• Tai Chi / Qi Gong: Γείωση μέσω κίνησης — η βαρύτητα ως δάσκαλος.',
        tags: ['science', 'traditions', 'philosophy', 'lineage'],
        depth: 2
      },
      {
        q: 'Αλλάζει πραγματικά ο εγκέφαλος;',
        a: 'Ναι, μετρήσιμα. Η Hölzel et al. (2011) έδειξαν ότι 8 εβδομάδες πρακτικής ενσυνειδητότητας αυξάνουν τη φαιά ουσία σε περιοχές που σχετίζονται με μάθηση, μνήμη, συναισθηματική ρύθμιση και λήψη αποφάσεων. Αυτό λέγεται νευροπλαστικότητα — ο εγκέφαλος αλλάζει δομή με βάση αυτό που κάνεις επανειλημμένα. Ακόμα και 5 δευτερόλεπτα παρατήρησης ενισχύουν τη νησίδα (insula).',
        tags: ['science', 'neuroplasticity', 'evidence', 'brain-change'],
        depth: 3,
        relatedConcept: 'neuroplasticity'
      }
    ],
    en: [
      {
        q: 'What does neuroscience say about this method?',
        a: '• Gravity sense activates the proprioceptive system — Craig (2002).\n• Slow exhale activates the vagus nerve — Gerritsen & Band (2018).\n• Mindfulness reduces DMN activity — Brewer et al. (2011) PNAS.\n• 8 weeks of practice measurably change brain structure — Hölzel et al. (2011).\n• Focused attention strengthens the prefrontal cortex — foundation of self-regulation.',
        tags: ['science', 'neuroscience', 'evidence', 'references'],
        depth: 3
      },
      {
        q: 'Which traditions does the method come from?',
        a: '• Satipatthana Sutta (Theravada): The Four Foundations correspond to the four axes.\n• Samatha & Vipassana: Focus → insight, the classic path 3rd → 4th axis.\n• Dzogchen (Nyingma): Rigpa — the natural state of open awareness = 4th axis.\n• Sufism (Inayatiyya): Breath as bridge between matter and spirit.\n• Tai Chi / Qi Gong: Grounding through movement — gravity as teacher.',
        tags: ['science', 'traditions', 'philosophy', 'lineage'],
        depth: 2
      },
      {
        q: 'Does the brain actually change?',
        a: 'Yes, measurably. Hölzel et al. (2011) showed that 8 weeks of mindfulness practice increases grey matter in areas related to learning, memory, emotional regulation, and decision-making. This is called neuroplasticity — the brain changes structure based on what you do repeatedly. Even 5 seconds of observation strengthens the insula.',
        tags: ['science', 'neuroplasticity', 'evidence', 'brain-change'],
        depth: 3,
        relatedConcept: 'neuroplasticity'
      }
    ]
  }
};
