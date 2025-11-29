/**
 * A1-Level German Curriculum Data
 * Based on extracted content from course materials
 *
 * MASTER INSTRUCTION:
 * When generating content, ONLY use the knowledge provided in this dataset.
 * Do not invent new grammar or A2/A3 topics.
 * Always keep vocabulary within the lists here.
 */

// ============================================================
// 1. GREETINGS + BASIC QUESTIONS
// ============================================================

export const greetingsQuestions = {
  questions: [
    { de: 'Wie heißt du?', en: "What's your name? (informal)" },
    { de: 'Wie heißen Sie?', en: "What's your name? (formal)" },
    { de: 'Wo wohnst du?', en: 'Where do you live? (informal)' },
    { de: 'Wo wohnen Sie?', en: 'Where do you live? (formal)' },
    { de: 'Woher kommst du?', en: 'Where do you come from? (informal)' },
    { de: 'Woher kommen Sie?', en: 'Where do you come from? (formal)' },
    { de: 'Welche Sprachen sprichst du?', en: 'What languages do you speak? (informal)' },
    { de: 'Welche Sprachen sprechen Sie?', en: 'What languages do you speak? (formal)' },
    { de: 'Welche Nationalität hast du?', en: 'What nationality are you? (informal)' },
    { de: 'Welche Nationalität haben Sie?', en: 'What nationality are you? (formal)' },
  ],
  answers: [
    { de: 'Ich heiße…', en: 'My name is…' },
    { de: 'Ich wohne in…', en: 'I live in…' },
    { de: 'Ich komme aus…', en: 'I come from…' },
    { de: 'Ich spreche…', en: 'I speak…' },
    { de: 'Ich bin…', en: 'I am…' },
  ],
  addressForms: {
    du: { description: 'familiar/informal', usage: 'friends, family, children' },
    Sie: { description: 'respectful/formal', usage: 'strangers, elders, professional' },
    ihr: { description: 'plural familiar', usage: 'group of friends/family' },
  },
};

// ============================================================
// 2. PRONUNCIATION RULES
// ============================================================

export const pronunciationRules = {
  longVsShortVowels: {
    explanation: 'German vowels can be long or short. Long vowels often have an "h" after them.',
    examples: [
      { word: 'geht', vowel: 'e', length: 'long', note: 'because of "h"' },
      { word: 'Geld', vowel: 'e', length: 'short', note: '' },
      { word: 'ich', vowel: 'i', length: 'short', note: '' },
      { word: 'Igel', vowel: 'i', length: 'long', note: '' },
    ],
  },
  umlauts: {
    explanation: 'Umlauts (ä, ö, ü) change the vowel sound.',
    letters: [
      { letter: 'ä', pronunciation: 'like "e" in bed', examples: ['Mädchen', 'Bär', 'Engländer'] },
      { letter: 'ö', pronunciation: 'like "i" in bird with rounded lips', examples: ['schön', 'München', 'Öl'] },
      {
        letter: 'ü',
        pronunciation: 'say "ee" then round your lips',
        examples: ['Tschüss', 'München', 'zurück', 'über'],
      },
    ],
  },
  consonants: [
    { pattern: 'ch', pronunciation: '[ç] soft sound after e, i', examples: ['ich', 'Technik', 'nicht', 'Mädchen'] },
    { pattern: 'sch', pronunciation: '[ʃ] like English "sh"', examples: ['schreiben', 'schön'] },
    { pattern: 'sp', pronunciation: '"shp" at beginning of word', examples: ['sprechen', 'Spanien', 'spielen'] },
    { pattern: 'st', pronunciation: '"sht" at beginning of word', examples: ['Stadt', 'studieren', 'Straße'] },
    { pattern: 'tsch', pronunciation: 'like English "ch"', examples: ['Tschüss', 'Deutsch'] },
    { pattern: 's', pronunciation: '"z" sound at start of word', examples: ['Sie', 'sozial', 'sind', 'sehen'] },
    { pattern: 'ß', pronunciation: 'sharp "s" (ss)', examples: ['heiße', 'Straße', 'groß'] },
    { pattern: 'w', pronunciation: 'like English "v"', examples: ['Wiedersehen', 'Wasser', 'wohnen'] },
    { pattern: 'v', pronunciation: 'like English "f"', examples: ['Vater', 'viel', 'vier'] },
    { pattern: 'z', pronunciation: 'like "ts"', examples: ['zehn', 'zwei', 'zu'] },
  ],
  diphthongs: [
    { pattern: 'ei', pronunciation: 'like "eye"', examples: ['mein', 'ein', 'kein', 'heiße'] },
    { pattern: 'ie', pronunciation: 'like "ee"', examples: ['sie', 'wie', 'Bier', 'spielen'] },
    { pattern: 'eu/äu', pronunciation: 'like "oy"', examples: ['Euro', 'neu', 'Häuser', 'heute'] },
    { pattern: 'au', pronunciation: 'like "ow" in cow', examples: ['Auf Wiedersehen', 'Auto', 'Frau'] },
  ],
};

// ============================================================
// 3. NEGATION: NICHT vs KEIN
// ============================================================

export const negation = {
  kein: {
    usage: 'negates nouns (replaces ein/eine)',
    examples: [
      { de: 'Ich spreche kein Deutsch.', en: "I don't speak German." },
      { de: 'Ich habe keine Schwester.', en: "I don't have a sister." },
      { de: 'Das ist kein Problem.', en: "That's not a problem." },
    ],
    forms: {
      masculine: 'kein',
      feminine: 'keine',
      neuter: 'kein',
      plural: 'keine',
    },
  },
  nicht: {
    usage: 'negates verbs, adverbs, phrases',
    examples: [
      { de: 'Ich wohne nicht in Berlin.', en: "I don't live in Berlin." },
      { de: 'Er spricht nicht gut.', en: "He doesn't speak well." },
      { de: 'Sie kommt heute nicht.', en: "She's not coming today." },
    ],
  },
  doch: {
    usage: 'contradiction to a negative question',
    example: {
      question: 'Sprichst du kein Deutsch?',
      answer: 'Doch! Ich spreche Deutsch.',
      translation: "Yes, I do! (contradicting the negative)",
    },
  },
};

// ============================================================
// 4. NATIONALITIES (MASCULINE / FEMININE)
// ============================================================

export const nationalities = [
  { country: 'Frankreich', countryEn: 'France', masculine: 'Franzose', feminine: 'Französin' },
  { country: 'Italien', countryEn: 'Italy', masculine: 'Italiener', feminine: 'Italienerin' },
  { country: 'Spanien', countryEn: 'Spain', masculine: 'Spanier', feminine: 'Spanierin' },
  { country: 'Syrien', countryEn: 'Syria', masculine: 'Syrer', feminine: 'Syrierin' },
  { country: 'USA', countryEn: 'USA', masculine: 'Amerikaner', feminine: 'Amerikanerin' },
  { country: 'Deutschland', countryEn: 'Germany', masculine: 'Deutscher', feminine: 'Deutsche' },
  { country: 'Schweiz', countryEn: 'Switzerland', masculine: 'Schweizer', feminine: 'Schweizer' }, // same for both
  { country: 'Vereinigtes Königreich', countryEn: 'United Kingdom', masculine: 'Brite', feminine: 'Britin' },
  { country: 'England', countryEn: 'England', masculine: 'Engländer', feminine: 'Engländerin' },
  { country: 'Lettland', countryEn: 'Latvia', masculine: 'Lette', feminine: 'Lettin' },
  { country: 'Armenien', countryEn: 'Armenia', masculine: 'Armenier', feminine: 'Armenierin' },
  { country: 'Brasilien', countryEn: 'Brazil', masculine: 'Brasilianer', feminine: 'Brasilianerin' },
  { country: 'Österreich', countryEn: 'Austria', masculine: 'Österreicher', feminine: 'Österreicherin' },
  { country: 'Polen', countryEn: 'Poland', masculine: 'Pole', feminine: 'Polin' },
  { country: 'Russland', countryEn: 'Russia', masculine: 'Russe', feminine: 'Russin' },
  { country: 'Türkei', countryEn: 'Turkey', masculine: 'Türke', feminine: 'Türkin' },
  { country: 'China', countryEn: 'China', masculine: 'Chinese', feminine: 'Chinesin' },
  { country: 'Japan', countryEn: 'Japan', masculine: 'Japaner', feminine: 'Japanerin' },
];

export const nationalityRules = {
  general: 'Add -in for feminine form',
  patterns: [
    { masculine: '-er', feminine: '-erin', examples: ['Italiener → Italienerin'] },
    { masculine: '-e', feminine: '-in', examples: ['Franzose → Französin', 'Brite → Britin'] },
  ],
};

// ============================================================
// 5. FAMILY VOCAB + POSSESSIVES
// ============================================================

export const familyVocab = [
  { de: 'Bruder', en: 'brother', article: 'der', plural: 'Brüder' },
  { de: 'Schwester', en: 'sister', article: 'die', plural: 'Schwestern' },
  { de: 'Kind', en: 'child', article: 'das', plural: 'Kinder' },
  { de: 'Eltern', en: 'parents', article: 'die', note: 'plural only' },
  { de: 'Onkel', en: 'uncle', article: 'der', plural: 'Onkel' },
  { de: 'Tante', en: 'aunt', article: 'die', plural: 'Tanten' },
  { de: 'Nichte', en: 'niece', article: 'die', plural: 'Nichten' },
  { de: 'Neffe', en: 'nephew', article: 'der', plural: 'Neffen' },
  { de: 'Großmutter', en: 'grandmother', article: 'die', plural: 'Großmütter', informal: 'Oma' },
  { de: 'Großvater', en: 'grandfather', article: 'der', plural: 'Großväter', informal: 'Opa' },
  { de: 'Oma', en: 'grandma', article: 'die', plural: 'Omas' },
  { de: 'Opa', en: 'grandpa', article: 'der', plural: 'Opas' },
  { de: 'Cousin', en: 'male cousin', article: 'der', plural: 'Cousins' },
  { de: 'Kusine', en: 'female cousin', article: 'die', plural: 'Kusinen' },
  { de: 'Freund', en: 'male friend / boyfriend', article: 'der', plural: 'Freunde' },
  { de: 'Freundin', en: 'female friend / girlfriend', article: 'die', plural: 'Freundinnen' },
  { de: 'Mutter', en: 'mother', article: 'die', plural: 'Mütter' },
  { de: 'Vater', en: 'father', article: 'der', plural: 'Väter' },
  { de: 'Sohn', en: 'son', article: 'der', plural: 'Söhne' },
  { de: 'Tochter', en: 'daughter', article: 'die', plural: 'Töchter' },
];

export const possessives = {
  table: [
    { gender: 'masculine', mein: 'mein', dein: 'dein', sein: 'sein', ihr: 'ihr' },
    { gender: 'feminine', mein: 'meine', dein: 'deine', sein: 'seine', ihr: 'ihre' },
    { gender: 'neuter', mein: 'mein', dein: 'dein', sein: 'sein', ihr: 'ihr' },
    { gender: 'plural', mein: 'meine', dein: 'deine', sein: 'seine', ihr: 'ihre' },
  ],
  examples: [
    { de: 'Das ist mein Bruder.', en: 'This is my brother.' },
    { de: 'Das ist meine Schwester.', en: 'This is my sister.' },
    { de: 'Das sind meine Eltern.', en: 'These are my parents.' },
    { de: 'Wie heißt dein Freund?', en: 'What is your (informal) friend called?' },
    { de: 'Wie heißt Ihre Freundin?', en: 'What is your (formal) friend called?' },
    { de: 'Sein Bruder spricht Deutsch.', en: 'His brother speaks German.' },
    { de: 'Ihre Schwester spricht kein Deutsch.', en: "Her sister doesn't speak German." },
  ],
};

// ============================================================
// 6. VERBS: HABEN, SEIN, REGULAR -EN, STEM CHANGES
// ============================================================

export const verbHaben = {
  infinitive: 'haben',
  meaning: 'to have',
  conjugation: [
    { pronoun: 'ich', form: 'habe' },
    { pronoun: 'du', form: 'hast' },
    { pronoun: 'er/sie/es', form: 'hat' },
    { pronoun: 'wir', form: 'haben' },
    { pronoun: 'ihr', form: 'habt' },
    { pronoun: 'sie/Sie', form: 'haben' },
  ],
};

export const verbSein = {
  infinitive: 'sein',
  meaning: 'to be',
  conjugation: [
    { pronoun: 'ich', form: 'bin' },
    { pronoun: 'du', form: 'bist' },
    { pronoun: 'er/sie/es', form: 'ist' },
    { pronoun: 'wir', form: 'sind' },
    { pronoun: 'ihr', form: 'seid' },
    { pronoun: 'sie/Sie', form: 'sind' },
  ],
};

export const regularVerbRule = {
  description: 'Stem = infinitive minus -en',
  example: {
    infinitive: 'wohnen',
    stem: 'wohn',
    conjugation: [
      { pronoun: 'ich', ending: '-e', form: 'wohne' },
      { pronoun: 'du', ending: '-st', form: 'wohnst' },
      { pronoun: 'er/sie/es', ending: '-t', form: 'wohnt' },
      { pronoun: 'wir', ending: '-en', form: 'wohnen' },
      { pronoun: 'ihr', ending: '-t', form: 'wohnt' },
      { pronoun: 'sie/Sie', ending: '-en', form: 'wohnen' },
    ],
  },
};

export const stemChangingVerbs = [
  {
    infinitive: 'sprechen',
    meaning: 'to speak',
    change: 'e → i',
    examples: ['du sprichst', 'er spricht'],
  },
  {
    infinitive: 'lesen',
    meaning: 'to read',
    change: 'e → ie',
    examples: ['du liest', 'er liest'],
  },
  {
    infinitive: 'sehen',
    meaning: 'to see',
    change: 'e → ie',
    examples: ['du siehst', 'er sieht'],
  },
  {
    infinitive: 'fahren',
    meaning: 'to drive/travel',
    change: 'a → ä',
    examples: ['du fährst', 'er fährt'],
  },
  {
    infinitive: 'nehmen',
    meaning: 'to take',
    change: 'e → i',
    examples: ['du nimmst', 'er nimmt'],
  },
];

export const duEndingRule = {
  description: 'If stem ends in s, ß, or z, du-form ends with -t (not -st)',
  examples: [
    { infinitive: 'tanzen', duForm: 'du tanzt', note: 'stem ends in z' },
    { infinitive: 'heißen', duForm: 'du heißt', note: 'stem ends in ß' },
  ],
};

// ============================================================
// 7. AGES, NUMBERS, "SEIT"
// ============================================================

export const numbers = [
  { de: 'null', en: 'zero', num: 0 },
  { de: 'eins', en: 'one', num: 1, note: '"ein" when counting but "eins" standalone' },
  { de: 'zwei', en: 'two', num: 2 },
  { de: 'drei', en: 'three', num: 3 },
  { de: 'vier', en: 'four', num: 4 },
  { de: 'fünf', en: 'five', num: 5 },
  { de: 'sechs', en: 'six', num: 6 },
  { de: 'sieben', en: 'seven', num: 7 },
  { de: 'acht', en: 'eight', num: 8 },
  { de: 'neun', en: 'nine', num: 9 },
  { de: 'zehn', en: 'ten', num: 10 },
  { de: 'elf', en: 'eleven', num: 11 },
  { de: 'zwölf', en: 'twelve', num: 12 },
  { de: 'dreizehn', en: 'thirteen', num: 13 },
  { de: 'vierzehn', en: 'fourteen', num: 14 },
  { de: 'fünfzehn', en: 'fifteen', num: 15 },
  { de: 'sechzehn', en: 'sixteen', num: 16 },
  { de: 'siebzehn', en: 'seventeen', num: 17 },
  { de: 'achtzehn', en: 'eighteen', num: 18 },
  { de: 'neunzehn', en: 'nineteen', num: 19 },
  { de: 'zwanzig', en: 'twenty', num: 20 },
  { de: 'einundzwanzig', en: 'twenty-one', num: 21 },
  { de: 'zweiundzwanzig', en: 'twenty-two', num: 22 },
  { de: 'dreiundzwanzig', en: 'twenty-three', num: 23 },
];

export const ageExpressions = {
  question: { de: 'Wie alt bist du?', en: 'How old are you?' },
  questionFormal: { de: 'Wie alt sind Sie?', en: 'How old are you? (formal)' },
  answerPattern: { de: 'Ich bin … Jahre alt.', en: 'I am … years old.' },
  note: 'Use "sein" (to be) for age in German, not "haben"',
  examples: [
    { de: 'Ich bin zwanzig Jahre alt.', en: 'I am twenty years old.' },
    { de: 'Er ist fünfundzwanzig.', en: 'He is twenty-five.' },
  ],
};

export const seitUsage = {
  description: '"Seit" + present tense is used for ongoing actions (started in the past, still continuing)',
  examples: [
    { de: 'Ich studiere seit sechs Wochen Deutsch.', en: "I have been studying German for six weeks." },
    { de: 'Sie wohnt seit sieben Jahren in Genf.', en: 'She has been living in Geneva for seven years.' },
    { de: 'Er arbeitet seit zwei Monaten hier.', en: 'He has been working here for two months.' },
  ],
};

// ============================================================
// 8. WORD ORDER RULES
// ============================================================

export const wordOrder = {
  verbSecond: {
    rule: 'In main clauses, the conjugated verb is always in the second position',
    examples: [
      { de: 'Ich sehe sie.', en: 'I see her.', structure: 'Subject + Verb + Object' },
      { de: 'Dort sehe ich sie.', en: 'There I see her.', structure: 'Adverb + Verb + Subject + Object' },
      { de: 'Heute gehe ich ins Kino.', en: "Today I'm going to the cinema.", structure: 'Time + Verb + Subject + ...' },
    ],
    note: 'When something other than the subject comes first, the subject moves after the verb',
  },
  subordinateClauses: {
    rule: 'In subordinate clauses (with weil, obwohl, dass), the verb goes to the end',
    conjunctions: ['weil (because)', 'obwohl (although)', 'dass (that)'],
    examples: [
      {
        de: 'Weil ich in England wohne, spreche ich Englisch.',
        en: 'Because I live in England, I speak English.',
      },
      {
        de: 'Obwohl er in Schottland wohnt, spricht er Deutsch.',
        en: 'Although he lives in Scotland, he speaks German.',
      },
      {
        de: 'Ich denke, dass ich sie dort sehe.',
        en: 'I think that I see her there.',
      },
    ],
  },
};

// ============================================================
// 9. DIALOGUE COMPONENTS
// ============================================================

export const dialogueComponents = {
  greeting: [
    { de: 'Hallo!', en: 'Hello!' },
    { de: 'Guten Tag!', en: 'Good day!' },
    { de: 'Guten Morgen!', en: 'Good morning!' },
    { de: 'Guten Abend!', en: 'Good evening!' },
  ],
  askingName: [
    { de: 'Wie heißt du?', en: "What's your name?" },
    { de: 'Wie heißen Sie?', en: "What's your name? (formal)" },
    { de: 'Ich heiße…', en: 'My name is…' },
    { de: 'Mein Name ist…', en: 'My name is…' },
  ],
  howAreYou: [
    { de: 'Wie geht es dir?', en: 'How are you?' },
    { de: 'Wie geht es Ihnen?', en: 'How are you? (formal)' },
    { de: 'Es geht mir gut, danke.', en: "I'm fine, thanks." },
    { de: 'Es geht mir sehr gut!', en: "I'm very well!" },
    { de: 'Es geht so.', en: 'So-so.' },
    { de: 'Und dir?', en: 'And you?' },
    { de: 'Und Ihnen?', en: 'And you? (formal)' },
  ],
  whereFrom: [
    { de: 'Woher kommst du?', en: 'Where are you from?' },
    { de: 'Woher kommen Sie?', en: 'Where are you from? (formal)' },
    { de: 'Ich komme aus…', en: 'I come from…' },
    { de: 'Wo wohnst du?', en: 'Where do you live?' },
    { de: 'Wo wohnen Sie?', en: 'Where do you live? (formal)' },
    { de: 'Ich wohne in…', en: 'I live in…' },
  ],
  nationality: [
    { de: 'Welche Nationalität hast du?', en: 'What nationality are you?' },
    { de: 'Ich bin Deutscher/Deutsche.', en: "I'm German (m/f)." },
    { de: 'Ich bin Engländer/Engländerin.', en: "I'm English (m/f)." },
  ],
  languages: [
    { de: 'Welche Sprachen sprichst du?', en: 'What languages do you speak?' },
    { de: 'Ich spreche Deutsch.', en: 'I speak German.' },
    { de: 'Ich spreche ein bisschen Deutsch.', en: 'I speak a little German.' },
    { de: 'Ich spreche Englisch und Deutsch.', en: 'I speak English and German.' },
  ],
  family: [
    { de: 'Hast du Geschwister?', en: 'Do you have siblings?' },
    { de: 'Ich habe einen Bruder.', en: 'I have a brother.' },
    { de: 'Ich habe eine Schwester.', en: 'I have a sister.' },
    { de: 'Ich habe keine Geschwister.', en: "I don't have any siblings." },
  ],
  studies: [
    { de: 'Was studierst du?', en: 'What do you study?' },
    { de: 'Ich studiere…', en: 'I study…' },
    { de: 'Ich arbeite als…', en: 'I work as…' },
  ],
  niceToMeet: [
    { de: 'Freut mich!', en: 'Nice to meet you!' },
    { de: 'Es freut mich, Sie kennenzulernen.', en: 'Nice to meet you. (formal)' },
    { de: 'Sehr angenehm.', en: 'Pleased to meet you.' },
  ],
  goodbye: [
    { de: 'Tschüss!', en: 'Bye!' },
    { de: 'Auf Wiedersehen!', en: 'Goodbye!' },
    { de: 'Bis bald!', en: 'See you soon!' },
    { de: 'Einen schönen Tag noch!', en: 'Have a nice day!' },
    { de: 'Gute Nacht!', en: 'Good night!' },
  ],
};

// ============================================================
// COMMON LANGUAGES
// ============================================================

export const languages = [
  { de: 'Deutsch', en: 'German' },
  { de: 'Englisch', en: 'English' },
  { de: 'Französisch', en: 'French' },
  { de: 'Spanisch', en: 'Spanish' },
  { de: 'Italienisch', en: 'Italian' },
  { de: 'Russisch', en: 'Russian' },
  { de: 'Arabisch', en: 'Arabic' },
  { de: 'Chinesisch', en: 'Chinese' },
  { de: 'Japanisch', en: 'Japanese' },
  { de: 'Portugiesisch', en: 'Portuguese' },
];
