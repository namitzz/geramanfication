/**
 * Phase 2 Learning Content - Modular Structure Matching Phase 1
 * 
 * Design Contract:
 * - Every section = Learn → Practice → Flashcards
 * - Short, focused explanations
 * - Direct links to corresponding decks
 * - Active learning, not passive reading
 */

export interface Phase2Section {
  id: string;
  title: string;
  description: string;
  deckId: string; // Direct link to corresponding flashcard deck
  rule: string; // Short, actionable rule or pattern
  keyPoints: string[]; // Bullet points instead of paragraphs
  examples: { de: string; en: string; note?: string }[];
}

// ============================================================
// PHASE 2 SECTIONS - Modular Learn → Practice Flow
// ============================================================

export const dailyRoutineVocab: Phase2Section = {
  id: 'daily-routine-vocab',
  title: 'Daily Routine Vocabulary',
  description: 'Essential vocabulary for describing your day in German',
  deckId: 'phase2-daily-routine-vocab',
  rule: 'Learn time-of-day expressions and routine verbs to describe your daily activities.',
  keyPoints: [
    'Time periods: der Morgen (morning), der Nachmittag (afternoon), der Abend (evening)',
    'Essential verbs: frühstücken (have breakfast), arbeiten (work), kochen (cook)',
    'Phrases: zur Arbeit gehen (go to work), nach Hause kommen (come home)',
  ],
  examples: [
    { de: 'Ich frühstücke jeden Morgen um sieben Uhr.', en: 'I have breakfast every morning at seven o\'clock.' },
    { de: 'Am Abend koche ich Abendessen.', en: 'In the evening I cook dinner.' },
    { de: 'Nach der Arbeit gehe ich nach Hause.', en: 'After work I go home.' },
  ],
};

export const separableVsInseparableVerbs: Phase2Section = {
  id: 'separable-inseparable-verbs',
  title: 'Separable vs Inseparable Verbs',
  description: 'Master which verb prefixes separate and which stay attached',
  deckId: 'phase2-separable-inseparable',
  rule: 'SEPARABLE prefixes (ab-, an-, auf-, aus-, ein-, mit-) go to the end of the sentence. INSEPARABLE prefixes (be-, emp-, ent-, er-, ge-, ver-) stay attached.',
  keyPoints: [
    'Separable: aufstehen → Ich stehe um 7 Uhr auf. (prefix at end)',
    'Inseparable: beginnen → Ich beginne um 8 Uhr. (prefix stays)',
    'Memory tip: If you can stress the prefix when speaking, it\'s separable',
    'Same stem, different meanings: aufstehen (get up) vs verstehen (understand)',
  ],
  examples: [
    { de: 'Ich stehe jeden Tag um 6 Uhr auf.', en: 'I get up every day at 6 o\'clock.', note: 'aufstehen - separable' },
    { de: 'Der Film beginnt um 20 Uhr.', en: 'The movie begins at 8 PM.', note: 'beginnen - inseparable' },
    { de: 'Wir kaufen im Supermarkt ein.', en: 'We shop in the supermarket.', note: 'einkaufen - separable' },
  ],
};

export const reflexiveVerbs: Phase2Section = {
  id: 'reflexive-verbs',
  title: 'Reflexive Verbs',
  description: 'Verbs where the subject does something to themselves',
  deckId: 'phase2-reflexive-verbs',
  rule: 'Reflexive verbs use pronouns (mich, dich, sich, uns, euch, sich) to show the action reflects back on the subject.',
  keyPoints: [
    'Reflexive pronouns: ich → mich, du → dich, er/sie/es → sich, wir → uns',
    'Common verbs: sich waschen (wash), sich anziehen (get dressed), sich duschen (shower)',
    'Pronoun comes right after the conjugated verb: Ich wasche mich.',
    'Some verbs are BOTH reflexive AND separable: sich anziehen → Ich ziehe mich an.',
  ],
  examples: [
    { de: 'Ich wasche mich jeden Morgen.', en: 'I wash myself every morning.' },
    { de: 'Er zieht sich schnell an.', en: 'He gets dressed quickly.', note: 'Reflexive + separable' },
    { de: 'Sie beeilt sich, weil sie spät ist.', en: 'She hurries because she is late.' },
  ],
};

export const timeExpressions: Phase2Section = {
  id: 'time-expressions',
  title: 'Time Expressions',
  description: 'Tell time in German using 12h and 24h formats',
  deckId: 'phase2-time-expressions',
  rule: 'Use "um" for "at" + time. Remember: "halb neun" = 8:30 (halfway TO nine, not half past nine).',
  keyPoints: [
    'On the hour: Es ist acht Uhr. (It is 8 o\'clock)',
    'Half hour: Es ist halb neun. = 8:30 (half TO nine!)',
    'Quarter past: Es ist Viertel nach sieben. = 7:15',
    'Quarter to: Es ist Viertel vor neun. = 8:45',
    'Use "um" for "at": Ich stehe um 7 Uhr auf.',
  ],
  examples: [
    { de: 'Es ist halb acht.', en: 'It is 7:30 (half to eight).', note: 'halb counts forward!' },
    { de: 'Ich stehe um Viertel nach sechs auf.', en: 'I get up at quarter past six (6:15).' },
    { de: 'Der Zug fährt um Viertel vor neun ab.', en: 'The train departs at quarter to nine (8:45).' },
  ],
};

export const wohinVsWo: Phase2Section = {
  id: 'wohin-wo',
  title: 'Wohin (Direction) vs Wo (Location)',
  description: 'Understand the difference between "where to?" and "where?"',
  deckId: 'phase2-wohin-wo',
  rule: 'WO (where?) uses DATIV for static location. WOHIN (where to?) uses AKKUSATIV for movement/direction.',
  keyPoints: [
    'Location (Wo + Dativ): Ich bin im Park. (I am IN the park)',
    'Direction (Wohin + Akkusativ): Ich gehe in den Park. (I go TO the park)',
    'Verb pairs: liegen (lie/location) vs legen (lay/direction)',
    'Fixed: zu Hause (at home) vs nach Hause (going home)',
  ],
  examples: [
    { de: 'Wo bist du? - Ich bin im Park.', en: 'Where are you? - I am in the park.', note: 'Location - Dativ' },
    { de: 'Wohin gehst du? - Ich gehe in den Park.', en: 'Where are you going? - I am going to the park.', note: 'Direction - Akkusativ' },
    { de: 'Das Buch liegt auf dem Tisch.', en: 'The book is on the table.', note: 'liegen + Dativ' },
    { de: 'Ich lege das Buch auf den Tisch.', en: 'I put the book on the table.', note: 'legen + Akkusativ' },
  ],
};

export const herrIhssenReading: Phase2Section = {
  id: 'herr-ihssen-reading',
  title: 'Reading: A Journalist\'s Day',
  description: 'Apply all Phase 2 concepts in context',
  deckId: 'phase2-herr-ihssen',
  rule: 'Read authentic German text to see separable verbs, reflexive verbs, and time expressions in real use.',
  keyPoints: [
    'Identify separable verbs in the text (aufwachen, aufstehen, ankommen)',
    'Notice reflexive verbs (sich duschen, sich rasieren, sich treffen)',
    'Track time expressions throughout the day',
    'Vocabulary: Zeitung (newspaper), U-Bahn (subway), Kantine (cafeteria)',
  ],
  examples: [
    { de: 'Er wacht jeden Morgen um 6 Uhr auf.', en: 'He wakes up every morning at 6 o\'clock.' },
    { de: 'Er duscht sich und rasiert sich.', en: 'He showers and shaves.' },
    { de: 'Um Viertel vor acht kommt er im Büro an.', en: 'He arrives at the office at quarter to eight.' },
  ],
};

export const practiceSentences: Phase2Section = {
  id: 'practice-sentences',
  title: 'Practice Sentences',
  description: 'Master Phase 2 by combining all grammar concepts',
  deckId: 'phase2-practice-sentences',
  rule: 'Practice complete sentences that combine separable verbs, reflexive verbs, time expressions, and location/direction.',
  keyPoints: [
    'Build sentences using multiple Phase 2 concepts together',
    'Practice word order with separable verb prefixes at the end',
    'Use reflexive pronouns correctly with time and location',
    'Apply Wo/Wohin distinction in daily routine contexts',
  ],
  examples: [
    { de: 'Ich wache um 6 Uhr auf und stehe sofort auf.', en: 'I wake up at 6 and get up immediately.' },
    { de: 'Ich dusche mich und ziehe mich schnell an.', en: 'I shower and get dressed quickly.' },
    { de: 'Um halb acht gehe ich aus dem Haus und fahre ins Büro.', en: 'At 7:30 I leave the house and drive to the office.' },
  ],
};

// ============================================================
// ALL PHASE 2 SECTIONS (in order)
// ============================================================

export const allPhase2Sections: Phase2Section[] = [
  dailyRoutineVocab,
  separableVsInseparableVerbs,
  reflexiveVerbs,
  timeExpressions,
  wohinVsWo,
  herrIhssenReading,
  practiceSentences,
];

export default allPhase2Sections;
