/* ═══════════════════════════════════════════
   js/data/concepts.js — Knowledge Concepts Dictionary
   
   Every core concept of the Fourfold Axis method.
   Each entry:
     el/en: { title, short, full, ndNote, science (optional) }
     axis: which axis this belongs to
     chapters: [which chapters reference it]
     related: [linked concept keys]
   
   Used by:
   - Companion bubble (tap a term → see card)
   - FAQ cross-references (relatedConcept → lookup here)
   - Knowledge explorer screen
   ═══════════════════════════════════════════ */

var KNOWLEDGE_CONCEPTS = {

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 1: ΣΩΜΑ — Body
  // ═══════════════════════════════════════════

  grounding: {
    el: {
      title: 'Γείωση',
      short: 'Η αίσθηση του σώματος στον χώρο μέσω βαρύτητας.',
      full: 'Η γείωση είναι η πρώτη πράξη χαλάρωσης. Νιώθοντας τη βαρύτητα — τα πέλματα στο πάτωμα, το βάρος στην καρέκλα, τον άξονα της σπονδυλικής στήλης — ενεργοποιείς αισθητηριακά κυκλώματα που ανταγωνίζονται τον «αυτόματο πιλότο» (DMN). Η βαρύτητα είναι η απόδειξη του «Εδώ» — σου δείχνει ακριβώς πού βρίσκεσαι αυτή τη στιγμή.',
      ndNote: 'Αν δεν νιώθεις τα πέλματα (συχνό σε ατυπική δια-αίσθηση), δοκίμασε εξωτερικές αγκυρώσεις: κράτα κάτι βαρύ, πάτα δυνατά στο πάτωμα, ή νιώσε τη θερμοκρασία ενός αντικειμένου.',
      science: 'Craig (2002) Nature Reviews Neuroscience — η αίσθηση βαρύτητας ενεργοποιεί το ιδιοδεκτικό σύστημα.'
    },
    en: {
      title: 'Grounding',
      short: 'The sensation of your body in space through gravity.',
      full: 'Grounding is the first act of relaxation. By feeling gravity — soles on the floor, weight on the chair, the axis of the spine — you activate sensory circuits that compete with the "autopilot" (DMN). Gravity is the proof of "Here" — it shows you exactly where you exist in this moment.',
      ndNote: 'If you can\'t feel your soles (common with atypical interoception), try external anchors: hold something heavy, press feet firmly into the floor, or feel the temperature of an object.',
      science: 'Craig (2002) Nature Reviews Neuroscience — gravity sense activates the proprioceptive system.'
    },
    axis: 'body',
    chapters: [1, 6, 7, 8, 9],
    related: ['gravity', 'proprioception', 'dmn', 'interoception']
  },

  gravity: {
    el: {
      title: 'Βαρύτητα',
      short: 'Η δύναμη που αποδεικνύει το «Εδώ».',
      full: 'Η βαρύτητα δεν είναι απλώς μια δύναμη — είναι η απόδειξη ότι υπάρχεις σε συγκεκριμένο σημείο του χώρου, αυτή τη στιγμή. Δεν χρειάζεται πίστη ή εμπειρία για να τη νιώσεις. Είναι αδιαμφισβήτητη. Γι\' αυτό είναι η βάση ολόκληρης της μεθόδου.',
      ndNote: 'Η βαρύτητα είναι πάντα εκεί ακόμα κι αν δεν τη νιώθεις «δυνατά». Η ένταση της αίσθησης δεν μετράει — η στροφή της προσοχής προς αυτήν μετράει.'
    },
    en: {
      title: 'Gravity',
      short: 'The force that proves "Here."',
      full: 'Gravity is not just a force — it is proof that you exist at a specific point in space, at this very moment. No faith or experience is needed to feel it. It is undeniable. That\'s why it\'s the foundation of the entire method.',
      ndNote: 'Gravity is always there even if you don\'t feel it "strongly." The intensity of sensation doesn\'t matter — turning attention toward it does.'
    },
    axis: 'body',
    chapters: [1, 8, 9],
    related: ['grounding', 'proprioception']
  },

  proprioception: {
    el: {
      title: 'Ιδιοδεκτικότητα',
      short: 'Η αίσθηση της θέσης του σώματος στον χώρο.',
      full: 'Το ιδιοδεκτικό σύστημα σου λέει πού βρίσκεται κάθε μέλος του σώματος χωρίς να κοιτάξεις. Ενεργοποιείται αυτόματα από τη βαρύτητα, τη στάση, και την κίνηση. Όταν εστιάζεις σε αυτή την αίσθηση, ενεργοποιείς κυκλώματα που ανταγωνίζονται τη νοητική περιπλάνηση.',
      ndNote: 'Πολλοί νευροδιαφορετικοί έχουν ατυπική ιδιοδεκτικότητα — μπορεί να χρειαστεί μεγαλύτερη πίεση (π.χ. βαρύ αντικείμενο, σφιχτό αγκάλιασμα) για να ενεργοποιηθεί.',
      science: 'Craig (2002) Nature Reviews Neuroscience.'
    },
    en: {
      title: 'Proprioception',
      short: 'The sense of your body\'s position in space.',
      full: 'The proprioceptive system tells you where each body part is without looking. It\'s automatically activated by gravity, posture, and movement. When you focus on this sensation, you activate circuits that compete with mental wandering.',
      ndNote: 'Many neurodivergent people have atypical proprioception — you may need stronger input (e.g., heavy object, tight hug) for it to activate.',
      science: 'Craig (2002) Nature Reviews Neuroscience.'
    },
    axis: 'body',
    chapters: [1, 10],
    related: ['grounding', 'gravity', 'interoception']
  },

  interoception: {
    el: {
      title: 'Δια-αίσθηση (Interoception)',
      short: 'Η αντίληψη εσωτερικών σωματικών αισθήσεων.',
      full: 'Η δια-αίσθηση είναι η γέφυρα μεταξύ σώματος και συνείδησης. Περιλαμβάνει την αντίληψη του καρδιακού παλμού, της αναπνοής, της πείνας, της θερμοκρασίας, και του πόνου. Η αναπνοή ως «εσωτερική αφή» — νιώθεις τον αέρα στα ρουθούνια, τη διαστολή του στήθους — ενεργοποιεί αυτό ακριβώς το σύστημα.',
      ndNote: 'Πολλοί αυτιστικοί και ADHD έχουν ατυπική δια-αίσθηση. Μπορεί να μη νιώθεις τον καρδιακό σου παλμό ή να τον νιώθεις υπερβολικά. Και τα δύο είναι φυσιολογικά για τον δικό σου εγκέφαλο. Η μέθοδος δεν απαιτεί «σωστή» αίσθηση — αρκεί η στροφή της προσοχής.'
    },
    en: {
      title: 'Interoception',
      short: 'The perception of internal body sensations.',
      full: 'Interoception is the bridge between body and consciousness. It includes sensing heartbeat, breathing, hunger, temperature, and pain. Breathing as "internal touch" — feeling air at the nostrils, chest expansion — activates exactly this system.',
      ndNote: 'Many autistic and ADHD people have atypical interoception. You may not feel your heartbeat, or feel it too intensely. Both are normal for your brain. The method doesn\'t require "correct" sensation — turning attention is enough.'
    },
    axis: 'body',
    chapters: [1, 2, 10],
    related: ['proprioception', 'grounding', 'internal_touch']
  },

  echo: {
    el: {
      title: 'Ο Απόηχος',
      short: 'Η ένταση στο σώμα που δεν γεννήθηκε μέσα σου.',
      full: 'Το σφίξιμο, η ένταση, η φωνή «δεν κάνεις αρκετά» — δεν γεννήθηκαν μέσα σου. Είναι απόηχοι: λόγια που άκουσες, βλέμματα που δέχτηκες, προσδοκίες που δεν εκπληρώθηκαν. Το νευρικό σύστημα τα αποθήκευσε. Η μέθοδος δεν ζητά να τα πολεμήσεις — ζητά αναγνώριση: «Α, αυτή είναι η παλιά φωνή.»',
      ndNote: 'Οι νευροδιαφορετικοί κουβαλάμε συχνά περισσότερους απόηχους λόγω χρόνων masking, απόρριψης, και αίσθησης ότι «κάτι δεν πάει καλά μαζί μας». Η αναγνώριση είναι η αρχή — όχι η ανάλυση.'
    },
    en: {
      title: 'The Echo',
      short: 'The tension in your body that didn\'t originate inside you.',
      full: 'The tightness, the tension, the voice "you\'re not doing enough" — they didn\'t originate inside you. They\'re echoes: words you heard, looks you received, expectations that weren\'t met. Your nervous system stored them. The method doesn\'t ask you to fight them — it asks for recognition: "Ah, that\'s the old voice."',
      ndNote: 'Neurodivergent people often carry more echoes due to years of masking, rejection, and feeling that "something is wrong with us." Recognition is the beginning — not analysis.'
    },
    axis: 'body',
    chapters: [1, 5, 9],
    related: ['self_criticism', 'kindness', 'trauma']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 2: ΑΝΑΠΝΟΗ — Breath
  // ═══════════════════════════════════════════

  vagus_nerve: {
    el: {
      title: 'Πνευμονογαστρικό Νεύρο (Vagus)',
      short: 'Το «φρένο» του νευρικού συστήματος.',
      full: 'Το vagus nerve είναι το μεγαλύτερο νεύρο του παρασυμπαθητικού συστήματος. Η αργή εκπνοή (6+ δευτερόλεπτα) το ενεργοποιεί, μειώνοντας τον καρδιακό ρυθμό και στέλνοντας σήμα ασφάλειας στον εγκέφαλο. Γι\' αυτό η εκπνοή στο μοτίβο 4-2-6-1 είναι η μεγαλύτερη φάση.',
      ndNote: 'Εκπνοή 6 δευτερολέπτων αρκεί. Δεν χρειάζεται τέλεια εκτέλεση — ακόμα και μια αργή εκπνοή από το στόμα ενεργοποιεί μερικώς το vagus.',
      science: 'Gerritsen & Band (2018) — αργή εκπνοή ενεργοποιεί vagus nerve, μειώνει καρδιακό ρυθμό.'
    },
    en: {
      title: 'Vagus Nerve',
      short: 'The "brake" of the nervous system.',
      full: 'The vagus nerve is the largest nerve of the parasympathetic system. Slow exhale (6+ seconds) activates it, reducing heart rate and sending a safety signal to the brain. That\'s why the exhale in the 4-2-6-1 pattern is the longest phase.',
      ndNote: 'A 6-second exhale is enough. No perfect execution needed — even a slow mouth exhale partially activates the vagus.',
      science: 'Gerritsen & Band (2018) — slow exhale activates vagus nerve, reduces heart rate.'
    },
    axis: 'breath',
    chapters: [2, 7, 10],
    related: ['slow_exhale', 'parasympathetic', 'pattern_4261']
  },

  slow_exhale: {
    el: {
      title: 'Αργή Εκπνοή',
      short: 'Η βασική τεχνική ρύθμισης του νευρικού συστήματος.',
      full: 'Η αργή εκπνοή — ιδανικά από το στόμα, 6+ δευτερόλεπτα — ενεργοποιεί το πνευμονογαστρικό νεύρο. Σε στιγμές πανικού, αυτό μόνο αρκεί. Δεν χρειάζεται μοτίβο, δεν χρειάζεται μέτρηση — απλά αφήνεις τον αέρα να βγει πιο αργά απ\' ό,τι μπήκε.',
      ndNote: 'Αν η μέτρηση σε αγχώνει, μην μετράς. Απλά φύσα αργά σαν να σβήνεις ένα κερί πολύ μακριά σου.'
    },
    en: {
      title: 'Slow Exhale',
      short: 'The fundamental technique for nervous system regulation.',
      full: 'Slow exhale — ideally through the mouth, 6+ seconds — activates the vagus nerve. In panic moments, this alone is enough. No pattern needed, no counting — just let the air out slower than it came in.',
      ndNote: 'If counting stresses you, don\'t count. Just blow slowly as if extinguishing a candle far away.'
    },
    axis: 'breath',
    chapters: [2, 6, 7],
    related: ['vagus_nerve', 'pattern_4261', 'sos']
  },

  internal_touch: {
    el: {
      title: 'Εσωτερική Αφή',
      short: 'Η αναπνοή ως αίσθηση αφής μέσα στο σώμα.',
      full: 'Η αναπνοή δεν είναι μόνο αέρας — είναι αφή. Νιώσε τον αέρα στα ρουθούνια (κρύο/ζεστό), τη διαστολή του στήθους, τη μαλακή κίνηση της κοιλιάς. Αυτή η εσωτερική αφή ενεργοποιεί τη δια-αίσθηση — τη γέφυρα μεταξύ σώματος και συνείδησης.',
      ndNote: 'Αν η εσωτερική αφή είναι αδύναμη, βάλε το χέρι στην κοιλιά — η εξωτερική αφή ενισχύει την εσωτερική.'
    },
    en: {
      title: 'Internal Touch',
      short: 'Breathing as a sense of touch inside the body.',
      full: 'Breath is not just air — it is touch. Feel the air at the nostrils (cool/warm), the expansion of the chest, the soft belly movement. This internal touch activates interoception — the bridge between body and consciousness.',
      ndNote: 'If internal touch is weak, place your hand on your belly — external touch amplifies internal.'
    },
    axis: 'breath',
    chapters: [2],
    related: ['interoception', 'vagus_nerve']
  },

  pattern_4261: {
    el: {
      title: 'Μοτίβο 4-2-6-1',
      short: 'Το βασικό μοτίβο αναπνοής του Τετραπλού Άξονα.',
      full: '4 δευτερόλεπτα εισπνοή → 2 δευτερόλεπτα κράτηση → 6 δευτερόλεπτα εκπνοή → 1 δευτερόλεπτο παύση. Η μεγαλύτερη εκπνοή ενεργοποιεί το vagus nerve. Σχεδιασμένο ειδικά για γείωση και παρουσία.',
      ndNote: 'Αν τα 6 δευτερόλεπτα εκπνοής είναι δύσκολα, ξεκίνα με 4. Ο στόχος δεν είναι τελειότητα — είναι ρυθμός.'
    },
    en: {
      title: '4-2-6-1 Pattern',
      short: 'The core breathing pattern of the Fourfold Axis.',
      full: '4 seconds inhale → 2 seconds hold → 6 seconds exhale → 1 second pause. The longer exhale activates the vagus nerve. Designed specifically for grounding and presence.',
      ndNote: 'If 6-second exhale is hard, start with 4. The goal isn\'t perfection — it\'s rhythm.'
    },
    axis: 'breath',
    chapters: [2, 8, 9],
    related: ['vagus_nerve', 'slow_exhale']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 3: ΠΡΟΣΟΧΗ — Attention
  // ═══════════════════════════════════════════

  attention_modes: {
    el: {
      title: 'Τρεις Μορφές Προσοχής',
      short: 'Εστιασμένη, ανοιχτή, διασπασμένη.',
      full: 'Η προσοχή λειτουργεί σε τρεις μορφές:\n• Εστιασμένη (Κλειστή): σαν φακός — φωτίζει ένα σημείο.\n• Ανοιχτή: σαν ανοιχτό φως — φωτίζει πολλά χωρίς εστίαση.\n• Διασπασμένη: σαν στροβοσκόπιο — πηδά χωρίς επιστροφή.\nΣτόχος δεν είναι να μείνεις μόνο στην εστιασμένη — αλλά να αναγνωρίζεις σε ποια βρίσκεσαι.',
      ndNote: 'Ο ADHD νους πηγαίνει γρήγορα στη διασπασμένη. Ο αυτιστικός νους συχνά κλειδώνει στην εστιασμένη (hyperfocus). Και τα δύο είναι μοτίβα — όχι αδυναμίες.'
    },
    en: {
      title: 'Three Modes of Attention',
      short: 'Focused, open, scattered.',
      full: 'Attention operates in three modes:\n• Focused (Closed): like a flashlight — illuminates one point.\n• Open: like ambient light — illuminates many without focus.\n• Scattered: like a strobe — jumps without returning.\nThe goal isn\'t to stay focused — but to recognize which mode you\'re in.',
      ndNote: 'The ADHD mind quickly goes scattered. The autistic mind often locks into focused (hyperfocus). Both are patterns — not weaknesses.'
    },
    axis: 'attention',
    chapters: [3, 5],
    related: ['hyperfocus', 'labeling', 'gentle_return']
  },

  hyperfocus: {
    el: {
      title: 'Hyperfocus (Αγκυλωμένη Προσοχή)',
      short: 'Ο νους κλειδώνει σε ένα σημείο — εξαφανίζονται χώρος, σώμα, χρόνος.',
      full: 'Η αντίθετη ακραία κατάσταση από τη διάσπαση: ο νους κλειδώνει σε ένα σημείο και δεν μπορεί να φύγει. Ο κόσμος γύρω εξαφανίζεται. Μπορεί να είναι παραγωγικό αλλά και εξουθενωτικό — ειδικά όταν δεν το ελέγχεις.',
      ndNote: 'Εργαλείο σπασίματος: Χώρος (μαλάκωσε το βλέμμα) + Σώμα (νιώσε τη βαρύτητα). Αυτός ο συνδυασμός «σπάει» το τούνελ.'
    },
    en: {
      title: 'Hyperfocus (Locked Attention)',
      short: 'The mind locks on one point — space, body, time disappear.',
      full: 'The opposite extreme from scattering: the mind locks onto one point and cannot leave. The world around disappears. It can be productive but also exhausting — especially when uncontrolled.',
      ndNote: 'Breaking tool: Space (soften gaze) + Body (feel gravity). This combination "breaks" the tunnel.'
    },
    axis: 'attention',
    chapters: [3, 5],
    related: ['attention_modes', 'open_awareness', 'grounding']
  },

  labeling: {
    el: {
      title: 'Ταμπέλα',
      short: 'Βάλε όνομα στη σκέψη → δημιούργησε απόσταση.',
      full: 'Όταν μια σκέψη σε τραβά, βάλε της ταμπέλα: «Ανησυχία», «Σενάριο», «Κριτική», «Παρελθόν». Η ταμπέλα δημιουργεί απόσταση — δεν είσαι η σκέψη, είσαι αυτός που την παρατηρεί. Δεν χρειάζεται ανάλυση — μόνο χαρακτηρισμός. Μετά, επιστροφή στον άξονα.',
      ndNote: 'Η ταμπέλα είναι εξαιρετικά αποτελεσματική για ADHD νου που «κολλάει» σε loops ανησυχίας. Ένα μόνο λέξη αρκεί.'
    },
    en: {
      title: 'Labeling',
      short: 'Name the thought → create distance.',
      full: 'When a thought pulls you, label it: "Worry," "Scenario," "Criticism," "Past." The label creates distance — you are not the thought, you are the one observing it. No analysis needed — just a name. Then, return to the axis.',
      ndNote: 'Labeling is extremely effective for ADHD minds that get stuck in worry loops. One single word is enough.'
    },
    axis: 'attention',
    chapters: [3, 7, 8],
    related: ['attention_modes', 'gentle_return', 'self_criticism']
  },

  gentle_return: {
    el: {
      title: 'Απαλή Επιστροφή',
      short: 'Η επιστροφή της προσοχής ΔΕΝ είναι αποτυχία — ΕΙΝΑΙ η άσκηση.',
      full: 'Κάθε φορά που η προσοχή φεύγει και γυρνάς, κάνεις μια «κάμψη» για τον προμετωπιαίο φλοιό. Ο αριθμός των επιστροφών μετράει — όχι η διάρκεια της εστίασης. 50 επιστροφές σε 5 λεπτά = 50 ασκήσεις. Αυτό είναι η νευροπλαστικότητα σε δράση.',
      ndNote: 'Αυτή η αλλαγή νοοτροπίας είναι κρίσιμη για νευροδιαφορετικούς. Αντί «αποτυγχάνω γιατί η προσοχή φεύγει», σκέψου «κάθε επιστροφή με δυναμώνει». Αυτό δεν είναι παρηγοριά — είναι νευροεπιστήμη.'
    },
    en: {
      title: 'Gentle Return',
      short: 'Returning attention is NOT failure — it IS the practice.',
      full: 'Every time attention leaves and you return, you\'re doing a "push-up" for the prefrontal cortex. The number of returns matters — not the duration of focus. 50 returns in 5 minutes = 50 exercises. This is neuroplasticity in action.',
      ndNote: 'This mindset shift is critical for neurodivergent people. Instead of "I\'m failing because attention leaves," think "every return makes me stronger." This isn\'t comfort — it\'s neuroscience.'
    },
    axis: 'attention',
    chapters: [3, 5, 9],
    related: ['attention_modes', 'neuroplasticity', 'kindness']
  },

  // ═══════════════════════════════════════════
  // ΑΞΟΝΑΣ 4: ΧΩΡΟΣ — Space
  // ═══════════════════════════════════════════

  open_awareness: {
    el: {
      title: 'Ανοιχτή Επίγνωση',
      short: 'Η ικανότητα να δέχεσαι τα πάντα χωρίς να κολλάς σε κάτι.',
      full: 'Η ανοιχτή επίγνωση είναι το πιο απελευθερωτικό κέντρο. Αντί να εστιάζεις σε ένα σημείο, αφήνεις τα πάντα να υπάρχουν — ήχους, αισθήσεις, σκέψεις — χωρίς να κρατάς κάτι. Σαν ανοιχτός ουρανός που χωράει τα σύννεφα χωρίς να τα σπρώχνει.',
      ndNote: 'Η ανοιχτή επίγνωση είναι αντίδοτο στην υπερφόρτωση — σου δίνει χώρο αντί να πολεμάς τα ερεθίσματα. Η περιφερειακή όραση βοηθάει: μαλάκωσε το βλέμμα.'
    },
    en: {
      title: 'Open Awareness',
      short: 'The ability to receive everything without clinging.',
      full: 'Open awareness is the most liberating center. Instead of focusing on one point, you let everything exist — sounds, sensations, thoughts — without holding anything. Like an open sky that holds clouds without pushing them.',
      ndNote: 'Open awareness is an antidote to overload — it gives you space instead of fighting stimuli. Peripheral vision helps: soften your gaze.'
    },
    axis: 'space',
    chapters: [4, 8, 9],
    related: ['peripheral_vision', 'sky_metaphor', 'hyperfocus']
  },

  peripheral_vision: {
    el: {
      title: 'Περιφερειακή Όραση',
      short: 'Μαλάκωσε το βλέμμα — η περιφέρεια σβήνει τον συναγερμό.',
      full: 'Η μετάβαση από εστιασμένο σε περιφερειακό βλέμμα στέλνει σήμα ασφάλειας στον εγκέφαλο. Η εστιασμένη όραση λέει «ψάξε κίνδυνο». Η περιφερειακή λέει «δεν υπάρχει κίνδυνος, χαλάρωσε». Γι\' αυτό αυτή η τεχνική είναι τόσο αποτελεσματική σε υπερφόρτωση.',
      ndNote: 'Σε θορυβώδη χώρο, η περιφερειακή όραση μετατρέπει τα ερεθίσματα σε «σύννεφα» — τα αφήνεις να υπάρχουν χωρίς να σε κατακλύζουν.'
    },
    en: {
      title: 'Peripheral Vision',
      short: 'Soften your gaze — the periphery turns off the alarm.',
      full: 'Shifting from focused to peripheral vision sends a safety signal to the brain. Focused vision says "search for danger." Peripheral says "no danger, relax." That\'s why this technique is so effective during overload.',
      ndNote: 'In noisy spaces, peripheral vision transforms stimuli into "clouds" — you let them exist without being overwhelmed.'
    },
    axis: 'space',
    chapters: [4, 6, 7],
    related: ['open_awareness', 'sky_metaphor']
  },

  sky_metaphor: {
    el: {
      title: 'Η Μεταφορά του Ουρανού',
      short: 'Εσύ δεν είσαι τα σύννεφα — είσαι ο ουρανός που τα χωράει.',
      full: 'Ο ουρανός δεν πιέζεται από τα σύννεφα, δεν αντιδρά, δεν κρίνει. Απλά τα χωράει. Σκέψεις, συναισθήματα, αισθήσεις εμφανίζονται και εξαφανίζονται. Εσύ μένεις. Αυτό δεν είναι ποιητική εικόνα — είναι η εμπειρία του 4ου άξονα. Στη Dzogchen παράδοση λέγεται Rigpa: η φυσική κατάσταση ανοιχτής επίγνωσης.',
      ndNote: 'Αυτή η μεταφορά αλλάζει τη σχέση σου με τα ερεθίσματα. Αντί «πρέπει να τα σταματήσω», γίνεται «μπορώ να τα χωρέσω». Αυτό λειτουργεί καλύτερα για ND νους.'
    },
    en: {
      title: 'The Sky Metaphor',
      short: 'You are not the clouds — you are the sky that holds them.',
      full: 'The sky is not burdened by clouds, does not react, does not judge. It simply holds them. Thoughts, emotions, sensations appear and disappear. You remain. This is not a poetic image — it\'s the experience of the 4th axis. In the Dzogchen tradition this is called Rigpa: the natural state of open awareness.',
      ndNote: 'This metaphor changes your relationship with stimuli. Instead of "I must stop them," it becomes "I can hold them." This works better for ND minds.'
    },
    axis: 'space',
    chapters: [4, 7, 9],
    related: ['open_awareness', 'peripheral_vision']
  },

  // ═══════════════════════════════════════════
  // CROSS-AXIS: ΝΕΥΡΟΕΠΙΣΤΗΜΗ + ND
  // ═══════════════════════════════════════════

  dmn: {
    el: {
      title: 'Default Mode Network (DMN)',
      short: 'Ο «αυτόματος πιλότος» — νοητική περιπλάνηση και αυτοκριτική.',
      full: 'Το DMN είναι ένα δίκτυο εγκεφαλικών περιοχών που ενεργοποιείται αυτόματα όταν δεν εστιάζεις σε κάτι συγκεκριμένο. Παράγει νοητική περιπλάνηση, αυτοκριτική, επανάληψη παλιών ιστοριών, φαντασιώσεις για το μέλλον. Η ενσυνειδητότητα μειώνει τη δραστηριότητά του.',
      ndNote: 'Στον ADHD νου, το DMN μπορεί να είναι υπερδραστήριο. Γι\' αυτό ο νους «τρέχει» ακόμα κι αν θέλεις ηρεμία. Η γείωση (αίσθηση βαρύτητας) το αντικρούει αισθητηριακά.',
      science: 'Brewer et al. (2011) PNAS — η ενσυνειδητότητα μειώνει τη δραστηριότητα του DMN.'
    },
    en: {
      title: 'Default Mode Network (DMN)',
      short: 'The "autopilot" — mental wandering and self-criticism.',
      full: 'The DMN is a brain network that activates automatically when you\'re not focused on something specific. It produces mental wandering, self-criticism, replaying old stories, fantasizing about the future. Mindfulness reduces its activity.',
      ndNote: 'In ADHD brains, the DMN can be overactive. That\'s why the mind "races" even when you want calm. Grounding (gravity sensation) counters it sensorially.',
      science: 'Brewer et al. (2011) PNAS — mindfulness reduces DMN activity.'
    },
    axis: 'all',
    chapters: [1, 5, 10],
    related: ['grounding', 'self_criticism', 'neuroplasticity']
  },

  self_criticism: {
    el: {
      title: 'Αυτοκριτική',
      short: 'Ενεργοποιεί τα ίδια κυκλώματα με τον εξωτερικό κίνδυνο.',
      full: 'Η αυτοκριτική ενεργοποιεί την αμυγδαλή και την κορτιζόλη — τα ίδια νευρικά κυκλώματα που ενεργοποιούνται σε εξωτερική απειλή. Κάθε φορά που κρίνεις τον εαυτό σου, ο εγκέφαλος αντιδρά σαν να δέχεσαι επίθεση. Η καλοσύνη δεν είναι πολυτέλεια — είναι νευρολογική ανάγκη.',
      ndNote: 'Οι νευροδιαφορετικοί έχουμε χρόνια εξάσκηση στην αυτοκριτική λόγω εξωτερικής πίεσης. Η φωνή «δεν κάνεις αρκετά» δεν είναι δική σου — είναι απόηχος. Αναγνώρισέ τον, μην τον ακολουθήσεις.'
    },
    en: {
      title: 'Self-Criticism',
      short: 'Activates the same circuits as external danger.',
      full: 'Self-criticism activates the amygdala and cortisol — the same neural circuits triggered by external threat. Every time you judge yourself, your brain reacts as if under attack. Kindness isn\'t a luxury — it\'s a neurological necessity.',
      ndNote: 'Neurodivergent people have years of self-criticism practice due to external pressure. The voice "you\'re not doing enough" isn\'t yours — it\'s an echo. Recognize it, don\'t follow it.'
    },
    axis: 'all',
    chapters: [1, 5, 9],
    related: ['echo', 'kindness', 'dmn', 'amygdala']
  },

  kindness: {
    el: {
      title: 'Καλοσύνη',
      short: 'Η στάση της μεθόδου — δεν είναι προαιρετική.',
      full: 'Η καλοσύνη δεν διδάσκεται ως ξεχωριστή τεχνική. Είναι η στάση πίσω από κάθε βήμα: ο τρόπος που η μέθοδος δεν σε πιέζει, δεν σε κρίνει, δεν λέει «πρέπει». Κάθε φορά που επιστρέφεις χωρίς κριτική, εξασκείς καλοσύνη. Μεταχειρίσου τον εαυτό σου όπως θα μεταχειριζόσουν έναν φίλο.',
      ndNote: 'Η απαλότητα αυτής της μεθόδου δεν είναι τυχαία — είναι η μόνη στάση που επιτρέπει στο νευρικό σύστημα να ηρεμήσει. Η πίεση ενεργοποιεί αμυγδαλή. Η απαλότητα την απενεργοποιεί.'
    },
    en: {
      title: 'Kindness',
      short: 'The attitude of the method — not optional.',
      full: 'Kindness isn\'t taught as a separate technique. It\'s the attitude behind every step: the way the method doesn\'t push you, doesn\'t judge you, doesn\'t say "you must." Every time you return without criticism, you practice kindness. Treat yourself as you would treat a struggling friend.',
      ndNote: 'The gentleness of this method isn\'t accidental — it\'s the only attitude that allows the nervous system to calm. Pressure activates the amygdala. Gentleness deactivates it.'
    },
    axis: 'all',
    chapters: [5, 9],
    related: ['self_criticism', 'echo', 'gentle_return']
  },

  neuroplasticity: {
    el: {
      title: 'Νευροπλαστικότητα',
      short: 'Ο εγκέφαλος αλλάζει δομή με βάση αυτό που κάνεις.',
      full: '8 εβδομάδες πρακτικής ενσυνειδητότητας αυξάνουν τη φαιά ουσία σε περιοχές μάθησης, μνήμης και συναισθηματικής ρύθμισης — Hölzel et al. (2011). Κάθε «απαλή επιστροφή» χτίζει νέους νευρωνικούς διαδρόμους. Ακόμα και 5 δευτερόλεπτα παρατήρησης ενισχύουν τη νησίδα (insula).',
      ndNote: 'Αυτό σημαίνει ότι η πρακτική δεν είναι υποκειμενική εμπειρία — αλλάζει κυριολεκτικά τη δομή του εγκεφάλου σου. Για νευροδιαφορετικούς που αισθάνονται «κολλημένοι», αυτό είναι ελπίδα βασισμένη σε επιστήμη.',
      science: 'Hölzel et al. (2011) — 8 εβδομάδες πρακτικής αλλάζουν μετρήσιμα τη δομή του εγκεφάλου.'
    },
    en: {
      title: 'Neuroplasticity',
      short: 'The brain changes structure based on what you do.',
      full: '8 weeks of mindfulness practice increases grey matter in areas of learning, memory, and emotional regulation — Hölzel et al. (2011). Every "gentle return" builds new neural pathways. Even 5 seconds of observation strengthens the insula.',
      ndNote: 'This means practice isn\'t just subjective experience — it literally changes your brain\'s structure. For neurodivergent people who feel "stuck," this is science-based hope.',
      science: 'Hölzel et al. (2011) — 8 weeks of practice measurably change brain structure.'
    },
    axis: 'all',
    chapters: [10],
    related: ['gentle_return', 'dmn']
  },

  mechanical_mind: {
    el: {
      title: 'Μηχανικός Νους',
      short: 'Το εσωτερικό σύστημα κανόνων που αντικαθιστά τον αυτοματισμό.',
      full: 'Πολλοί νευροδιαφορετικοί αναπτύσσουν ένα εσωτερικό σύστημα κανόνων — «αν Χ, τότε Υ» — για να λειτουργούν σε κοινωνικές καταστάσεις, στη δουλειά, στην καθημερινότητα. Είναι κουραστικό αλλά εξυπνότατο. Η ενσυνειδητότητα δεν αντικαθιστά τον μηχανικό νου — τον ανακουφίζει. Δίνει στιγμές ανάπαυσης στο σύστημα.',
      ndNote: 'Αν αναγνωρίζεις τον μηχανικό νου, σημαίνει ότι ήδη κάνεις masking. Αυτή η μέθοδος δεν ζητά να σταματήσεις — ζητά μικρές παύσεις ανανέωσης.'
    },
    en: {
      title: 'Mechanical Mind',
      short: 'The internal rule system that replaces missing automaticity.',
      full: 'Many neurodivergent people develop an internal rule system — "if X, then Y" — to function in social situations, at work, in daily life. It\'s exhausting but brilliantly clever. Mindfulness doesn\'t replace the mechanical mind — it relieves it. It gives moments of rest to the system.',
      ndNote: 'If you recognize the mechanical mind, it means you\'re already masking. This method doesn\'t ask you to stop — it asks for small refresh pauses.'
    },
    axis: 'all',
    chapters: [5],
    related: ['self_criticism', 'echo', 'dmn']
  },

  parasympathetic: {
    el: {
      title: 'Παρασυμπαθητικό Σύστημα',
      short: 'Το σύστημα «ξεκούρασης και ανάκαμψης» — αντίθετο του fight-or-flight.',
      full: 'Το αυτόνομο νευρικό σύστημα έχει δύο σκέλη: το συμπαθητικό (fight-or-flight, ένταση) και το παρασυμπαθητικό (rest-and-digest, χαλάρωση). Η αργή εκπνοή, η γείωση, και η ανοιχτή επίγνωση ενεργοποιούν το παρασυμπαθητικό.',
      ndNote: 'Πολλοί νευροδιαφορετικοί ζουν σε χρόνια ενεργοποίηση του συμπαθητικού (fight-or-flight ολημερίς). Αυτή η μέθοδος χτίζει σταδιακά πρόσβαση στο παρασυμπαθητικό.',
      science: 'Gerritsen & Band (2018).'
    },
    en: {
      title: 'Parasympathetic System',
      short: 'The "rest and recover" system — opposite of fight-or-flight.',
      full: 'The autonomic nervous system has two branches: sympathetic (fight-or-flight, tension) and parasympathetic (rest-and-digest, relaxation). Slow exhale, grounding, and open awareness activate the parasympathetic.',
      ndNote: 'Many neurodivergent people live in chronic sympathetic activation (fight-or-flight all day). This method gradually builds access to the parasympathetic.',
      science: 'Gerritsen & Band (2018).'
    },
    axis: 'all',
    chapters: [2, 7, 10],
    related: ['vagus_nerve', 'slow_exhale', 'grounding']
  },

  amygdala: {
    el: {
      title: 'Αμυγδαλή',
      short: 'Το κέντρο συναγερμού του εγκεφάλου.',
      full: 'Η αμυγδαλή ενεργοποιείται σε αντίληψη κινδύνου — πραγματικού ή φανταστικού. Η αυτοκριτική την ενεργοποιεί όπως ο εξωτερικός κίνδυνος. Η ενσυνειδητότητα, ειδικά 27+ λεπτά ημερησίως, μειώνει μετρήσιμα τη δραστηριότητα και το μέγεθός της.',
      ndNote: 'Η αμυγδαλή μπορεί να είναι πιο αντιδραστική σε νευροδιαφορετικούς λόγω χρόνιας υπερδιέγερσης. Η μέθοδος δεν ζητά να «νικήσεις» την αμυγδαλή — ζητά να μην την τροφοδοτείς με αυτοκριτική.'
    },
    en: {
      title: 'Amygdala',
      short: 'The brain\'s alarm center.',
      full: 'The amygdala activates when perceiving danger — real or imagined. Self-criticism activates it just like external danger. Mindfulness, especially 27+ minutes daily, measurably reduces its activity and size.',
      ndNote: 'The amygdala may be more reactive in neurodivergent people due to chronic overstimulation. The method doesn\'t ask you to "defeat" the amygdala — it asks you to stop feeding it with self-criticism.'
    },
    axis: 'all',
    chapters: [5, 10],
    related: ['self_criticism', 'parasympathetic', 'dmn']
  },

  // ═══════════════════════════════════════════
  // ΠΡΑΚΤΙΚΑ — Practical / SOS
  // ═══════════════════════════════════════════

  sos: {
    el: {
      title: 'SOS Mode',
      short: 'Τετρα-αισθητηριακή παρέμβαση σε κρίση.',
      full: 'Αυτιά: theta binaural beats (6 Hz) → βαθιά ηρεμία.\nΜάτια: ηρεμιστικό μπλε-τιρκουάζ φως.\nΣώμα: αναπνοή 4-7-8 (η πιο ηρεμιστική).\nΑφή: haptic ρυθμός.\n\nΌλα μαζί στέλνουν πολλαπλά σήματα ασφάλειας στο νευρικό σύστημα ταυτόχρονα.',
      ndNote: 'Χρειάζεται ακουστικά για τα binaural beats. Αν δεν έχεις, η αναπνοή 4-7-8 μόνη της βοηθάει σημαντικά.'
    },
    en: {
      title: 'SOS Mode',
      short: 'Quad-sensory intervention during crisis.',
      full: 'Ears: theta binaural beats (6 Hz) → deep calm.\nEyes: calming blue-teal light.\nBody: 4-7-8 breath (the most calming).\nTouch: haptic rhythm.\n\nAll together send multiple safety signals to the nervous system simultaneously.',
      ndNote: 'Requires headphones for binaural beats. Without them, 4-7-8 breathing alone helps significantly.'
    },
    axis: 'all',
    chapters: [7],
    related: ['vagus_nerve', 'slow_exhale', 'parasympathetic']
  },

  trauma: {
    el: {
      title: 'Trauma-Informed Προσέγγιση',
      short: 'Η μέθοδος σέβεται τα όριά σου — πάντα.',
      full: 'Αυτός ο οδηγός είναι trauma-informed:\n• Ξεκινά πάντα από το σώμα — η γείωση δημιουργεί ασφάλεια πρώτα.\n• Δεν ζητά «άδειασμα νου» — η προσοχή επιστρέφει, δεν ελέγχει.\n• Σέβεται τα όρια — αν κάτι φέρνει δυσφορία, σταματάς.\n• Χρησιμοποιεί καλοσύνη αντί κατάκριση.\n• Δεν ζητά κλείσιμο ματιών αν αυτό δεν αισθάνεται ασφαλές.',
      ndNote: 'Οι νευροδιαφορετικοί έχουν υψηλότερη πιθανότητα τραυματικών εμπειριών λόγω στίγματος, masking, και κοινωνικού αποκλεισμού. Η μέθοδος το λαμβάνει υπόψη σε κάθε βήμα.'
    },
    en: {
      title: 'Trauma-Informed Approach',
      short: 'The method respects your boundaries — always.',
      full: 'This guide is trauma-informed:\n• Always starts with body — grounding creates safety first.\n• Does not ask to "empty mind" — attention returns, it doesn\'t control.\n• Respects boundaries — if something brings discomfort, you stop.\n• Uses kindness instead of judgment.\n• Doesn\'t require closing eyes if that doesn\'t feel safe.',
      ndNote: 'Neurodivergent people have higher likelihood of traumatic experiences due to stigma, masking, and social exclusion. The method accounts for this at every step.'
    },
    axis: 'all',
    chapters: [1, 5, 7, 9],
    related: ['kindness', 'echo', 'self_criticism', 'grounding']
  }
};
