/**
 * Content Generator for Germanfication
 * Generates flashcards, MCQs, fill-in-the-blanks, translations, dialogues, and pronunciation tasks
 * based strictly on the A1-level curriculum
 */

import {
  greetingsQuestions,
  pronunciationRules,
  negation,
  nationalities,
  familyVocab,
  possessives,
  verbHaben,
  verbSein,
  regularVerbRule,
  stemChangingVerbs,
  duEndingRule,
  numbers,
  ageExpressions,
  seitUsage,
  wordOrder,
  dialogueComponents,
  languages,
} from './curriculum';

// ============================================================
// Types
// ============================================================

export interface Flashcard {
  front: string;
  back: string;
  category?: string;
}

export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

export interface FillInTheBlank {
  sentence: string;
  answer: string;
  hint?: string;
  category: string;
}

export interface TranslationExercise {
  source: string;
  target: string;
  direction: 'EN_TO_DE' | 'DE_TO_EN';
  category: string;
}

export interface DialogueLine {
  speaker: string;
  de: string;
  en: string;
}

export interface Dialogue {
  title: string;
  context: string;
  lines: DialogueLine[];
}

export interface PronunciationTask {
  type: 'long_short_vowel' | 'pronunciation_rule' | 'umlaut';
  question: string;
  answer: string;
  explanation: string;
}

// ============================================================
// A. FLASHCARD GENERATORS
// ============================================================

export function generateGreetingsFlashcards(): Flashcard[] {
  const cards: Flashcard[] = [];

  // Questions and answers
  for (const item of greetingsQuestions.questions) {
    cards.push({ front: item.de, back: item.en, category: 'Greetings & Questions' });
  }
  for (const item of greetingsQuestions.answers) {
    cards.push({ front: item.de, back: item.en, category: 'Greetings & Questions' });
  }

  return cards;
}

export function generateNationalityFlashcards(): Flashcard[] {
  const cards: Flashcard[] = [];

  for (const nat of nationalities) {
    cards.push({
      front: `${nat.country} (masculine)`,
      back: nat.masculine,
      category: 'Nationalities',
    });
    cards.push({
      front: `${nat.country} (feminine)`,
      back: nat.feminine,
      category: 'Nationalities',
    });
  }

  return cards;
}

export function generateFamilyFlashcards(): Flashcard[] {
  return familyVocab.map((item) => ({
    front: `${item.article} ${item.de}`,
    back: item.en,
    category: 'Family',
  }));
}

export function generatePossessivesFlashcards(): Flashcard[] {
  return possessives.examples.map((item) => ({
    front: item.de,
    back: item.en,
    category: 'Possessives',
  }));
}

export function generateVerbFlashcards(): Flashcard[] {
  const cards: Flashcard[] = [];

  // haben
  for (const conj of verbHaben.conjugation) {
    cards.push({
      front: `haben: ${conj.pronoun}`,
      back: conj.form,
      category: 'Verb Conjugation',
    });
  }

  // sein
  for (const conj of verbSein.conjugation) {
    cards.push({
      front: `sein: ${conj.pronoun}`,
      back: conj.form,
      category: 'Verb Conjugation',
    });
  }

  return cards;
}

export function generateNumbersFlashcards(): Flashcard[] {
  return numbers.map((num) => ({
    front: num.de,
    back: `${num.en} (${num.num})`,
    category: 'Numbers',
  }));
}

export function generateLanguageFlashcards(): Flashcard[] {
  return languages.map((lang) => ({
    front: lang.de,
    back: lang.en,
    category: 'Languages',
  }));
}

export function generateAllFlashcards(): Flashcard[] {
  return [
    ...generateGreetingsFlashcards(),
    ...generateNationalityFlashcards(),
    ...generateFamilyFlashcards(),
    ...generatePossessivesFlashcards(),
    ...generateVerbFlashcards(),
    ...generateNumbersFlashcards(),
    ...generateLanguageFlashcards(),
  ];
}

// ============================================================
// B. MCQ GENERATORS
// ============================================================

export function generateNegationMCQs(): MCQ[] {
  return [
    {
      id: 'neg1',
      question: 'How do you say "I don\'t speak German"?',
      options: [
        'Ich spreche nicht Deutsch.',
        'Ich spreche kein Deutsch.',
        'Ich nicht spreche Deutsch.',
        'Ich spreche Deutsch nicht.',
      ],
      correct: 1,
      explanation: '"Kein" is used to negate nouns. Since "Deutsch" is a noun (language), we use "kein".',
      category: 'Negation',
    },
    {
      id: 'neg2',
      question: 'How do you say "I don\'t live in Berlin"?',
      options: [
        'Ich wohne kein in Berlin.',
        'Ich wohne in Berlin nicht.',
        'Ich wohne nicht in Berlin.',
        'Ich nicht wohne in Berlin.',
      ],
      correct: 2,
      explanation: '"Nicht" is used to negate verbs and phrases. Here we negate "wohnen in Berlin".',
      category: 'Negation',
    },
    {
      id: 'neg3',
      question: 'Which response contradicts a negative question?',
      options: ['Ja', 'Nein', 'Doch', 'Nicht'],
      correct: 2,
      explanation: '"Doch" is used to contradict a negative question. For example: "Sprichst du kein Deutsch?" → "Doch!"',
      category: 'Negation',
    },
    {
      id: 'neg4',
      question: 'How do you say "I don\'t have a sister"?',
      options: [
        'Ich habe nicht Schwester.',
        'Ich habe keine Schwester.',
        'Ich nicht habe eine Schwester.',
        'Ich habe Schwester nicht.',
      ],
      correct: 1,
      explanation: '"Keine" (feminine form of kein) is used with feminine nouns like "Schwester".',
      category: 'Negation',
    },
  ];
}

export function generateVerbMCQs(): MCQ[] {
  return [
    {
      id: 'verb1',
      question: 'What is the correct form of "haben" for "du"?',
      options: ['habe', 'hast', 'hat', 'haben'],
      correct: 1,
      explanation: 'The conjugation of "haben" for "du" is "hast".',
      category: 'Verb Conjugation',
    },
    {
      id: 'verb2',
      question: 'What is the correct form of "sein" for "wir"?',
      options: ['bin', 'bist', 'ist', 'sind'],
      correct: 3,
      explanation: 'The conjugation of "sein" for "wir" is "sind".',
      category: 'Verb Conjugation',
    },
    {
      id: 'verb3',
      question: 'The verb "sprechen" changes to what form for "du"?',
      options: ['sprechst', 'sprichst', 'spricht', 'spreche'],
      correct: 1,
      explanation: '"Sprechen" is a stem-changing verb (e → i). For "du" it becomes "sprichst".',
      category: 'Stem-Changing Verbs',
    },
    {
      id: 'verb4',
      question: 'What is the correct ending for verbs when stem ends in "ß"?',
      options: ['du heißst', 'du heißest', 'du heißt', 'du heiß'],
      correct: 2,
      explanation: 'When the stem ends in s, ß, or z, the du-form ends with -t only (not -st).',
      category: 'Verb Rules',
    },
    {
      id: 'verb5',
      question: 'What is "ich bin" in English?',
      options: ['I have', 'I am', 'I go', 'I do'],
      correct: 1,
      explanation: '"Ich bin" is the conjugation of "sein" (to be) for "ich".',
      category: 'Verb Conjugation',
    },
  ];
}

export function generateWordOrderMCQs(): MCQ[] {
  return [
    {
      id: 'wo1',
      question: 'Which sentence has correct German word order?',
      options: [
        'Heute ich gehe ins Kino.',
        'Heute gehe ich ins Kino.',
        'Ich heute gehe ins Kino.',
        'Gehe ich heute ins Kino.',
      ],
      correct: 1,
      explanation: 'In German main clauses, the verb must be in second position. When time comes first, subject follows verb.',
      category: 'Word Order',
    },
    {
      id: 'wo2',
      question: 'Where does the verb go in a "weil" (because) clause?',
      options: ['First position', 'Second position', 'Third position', 'Last position'],
      correct: 3,
      explanation: 'In subordinate clauses with "weil", "obwohl", or "dass", the verb goes to the end.',
      category: 'Word Order',
    },
    {
      id: 'wo3',
      question: 'Complete: "Weil ich in England wohne, ___"',
      options: [
        'ich spreche Englisch.',
        'spreche ich Englisch.',
        'Englisch ich spreche.',
        'spreche Englisch ich.',
      ],
      correct: 1,
      explanation:
        'After a subordinate clause, the main clause verb comes first (inverted word order).',
      category: 'Word Order',
    },
  ];
}

export function generatePossessiveMCQs(): MCQ[] {
  return [
    {
      id: 'poss1',
      question: 'How do you say "my brother" in German?',
      options: ['meine Bruder', 'mein Bruder', 'meiner Bruder', 'meinem Bruder'],
      correct: 1,
      explanation: '"Bruder" is masculine, so we use "mein" (without ending).',
      category: 'Possessives',
    },
    {
      id: 'poss2',
      question: 'How do you say "my sister" in German?',
      options: ['mein Schwester', 'meine Schwester', 'meiner Schwester', 'meinem Schwester'],
      correct: 1,
      explanation: '"Schwester" is feminine, so we use "meine" (with -e ending).',
      category: 'Possessives',
    },
    {
      id: 'poss3',
      question: 'How do you say "his mother" in German?',
      options: ['sein Mutter', 'seine Mutter', 'seiner Mutter', 'ihr Mutter'],
      correct: 1,
      explanation: '"Mutter" is feminine, so we use "seine" (with -e ending for feminine nouns).',
      category: 'Possessives',
    },
    {
      id: 'poss4',
      question: 'How do you say "her father" in German?',
      options: ['sein Vater', 'ihre Vater', 'ihr Vater', 'ihrer Vater'],
      correct: 2,
      explanation: '"Vater" is masculine, so we use "ihr" (without ending).',
      category: 'Possessives',
    },
  ];
}

export function generateAllMCQs(): MCQ[] {
  return [...generateNegationMCQs(), ...generateVerbMCQs(), ...generateWordOrderMCQs(), ...generatePossessiveMCQs()];
}

// ============================================================
// C. FILL-IN-THE-BLANK GENERATORS
// ============================================================

export function generateVerbFillBlanks(): FillInTheBlank[] {
  return [
    {
      sentence: 'Ich ___ aus Deutschland.',
      answer: 'komme',
      hint: 'kommen (ich)',
      category: 'Verbs',
    },
    {
      sentence: 'Du ___ in Berlin.',
      answer: 'wohnst',
      hint: 'wohnen (du)',
      category: 'Verbs',
    },
    {
      sentence: 'Er ___ Deutsch.',
      answer: 'spricht',
      hint: 'sprechen (er) - stem change!',
      category: 'Verbs',
    },
    {
      sentence: 'Wir ___ einen Bruder.',
      answer: 'haben',
      hint: 'haben (wir)',
      category: 'Verbs',
    },
    {
      sentence: 'Sie ___ sehr freundlich.',
      answer: 'ist',
      hint: 'sein (sie)',
      category: 'Verbs',
    },
    {
      sentence: 'Ich ___ zwanzig Jahre alt.',
      answer: 'bin',
      hint: 'sein (ich)',
      category: 'Verbs',
    },
  ];
}

export function generatePossessiveFillBlanks(): FillInTheBlank[] {
  return [
    {
      sentence: 'Das ist ___ Bruder. (my)',
      answer: 'mein',
      hint: 'Bruder is masculine',
      category: 'Possessives',
    },
    {
      sentence: 'Das ist ___ Schwester. (my)',
      answer: 'meine',
      hint: 'Schwester is feminine',
      category: 'Possessives',
    },
    {
      sentence: '___ Mutter heißt Anna. (his)',
      answer: 'Seine',
      hint: 'Mutter is feminine',
      category: 'Possessives',
    },
    {
      sentence: '___ Vater arbeitet hier. (her)',
      answer: 'Ihr',
      hint: 'Vater is masculine',
      category: 'Possessives',
    },
    {
      sentence: 'Wie heißt ___ Freund? (your informal)',
      answer: 'dein',
      hint: 'Freund is masculine',
      category: 'Possessives',
    },
  ];
}

export function generateNegationFillBlanks(): FillInTheBlank[] {
  return [
    {
      sentence: 'Ich spreche ___ Spanisch.',
      answer: 'kein',
      hint: 'Negating a noun (language)',
      category: 'Negation',
    },
    {
      sentence: 'Er wohnt ___ in München.',
      answer: 'nicht',
      hint: 'Negating a phrase',
      category: 'Negation',
    },
    {
      sentence: 'Ich habe ___ Schwester.',
      answer: 'keine',
      hint: 'Schwester is feminine',
      category: 'Negation',
    },
    {
      sentence: 'Sie kommt heute ___.',
      answer: 'nicht',
      hint: 'Negating the verb',
      category: 'Negation',
    },
  ];
}

export function generateSeitFillBlanks(): FillInTheBlank[] {
  return [
    {
      sentence: 'Ich lerne ___ zwei Monaten Deutsch.',
      answer: 'seit',
      hint: 'Ongoing action from the past',
      category: 'Seit',
    },
    {
      sentence: 'Er wohnt ___ fünf Jahren in Berlin.',
      answer: 'seit',
      hint: 'Ongoing action from the past',
      category: 'Seit',
    },
  ];
}

export function generateAllFillBlanks(): FillInTheBlank[] {
  return [
    ...generateVerbFillBlanks(),
    ...generatePossessiveFillBlanks(),
    ...generateNegationFillBlanks(),
    ...generateSeitFillBlanks(),
  ];
}

// ============================================================
// D. TRANSLATION EXERCISE GENERATORS
// ============================================================

export function generateGreetingsTranslations(): TranslationExercise[] {
  const exercises: TranslationExercise[] = [];

  // EN to DE
  exercises.push(
    { source: "What's your name?", target: 'Wie heißt du?', direction: 'EN_TO_DE', category: 'Greetings' },
    { source: 'Where do you live?', target: 'Wo wohnst du?', direction: 'EN_TO_DE', category: 'Greetings' },
    { source: 'I come from Germany.', target: 'Ich komme aus Deutschland.', direction: 'EN_TO_DE', category: 'Greetings' },
    { source: 'I speak German.', target: 'Ich spreche Deutsch.', direction: 'EN_TO_DE', category: 'Greetings' }
  );

  // DE to EN
  exercises.push(
    { source: 'Wie geht es dir?', target: 'How are you?', direction: 'DE_TO_EN', category: 'Greetings' },
    { source: 'Woher kommen Sie?', target: 'Where do you come from? (formal)', direction: 'DE_TO_EN', category: 'Greetings' },
    { source: 'Ich wohne in Berlin.', target: 'I live in Berlin.', direction: 'DE_TO_EN', category: 'Greetings' },
    { source: 'Freut mich!', target: 'Nice to meet you!', direction: 'DE_TO_EN', category: 'Greetings' }
  );

  return exercises;
}

export function generateFamilyTranslations(): TranslationExercise[] {
  return [
    { source: 'This is my brother.', target: 'Das ist mein Bruder.', direction: 'EN_TO_DE', category: 'Family' },
    { source: 'This is my sister.', target: 'Das ist meine Schwester.', direction: 'EN_TO_DE', category: 'Family' },
    { source: 'I have a brother.', target: 'Ich habe einen Bruder.', direction: 'EN_TO_DE', category: 'Family' },
    { source: 'Das sind meine Eltern.', target: 'These are my parents.', direction: 'DE_TO_EN', category: 'Family' },
    { source: 'Seine Mutter ist nett.', target: 'His mother is nice.', direction: 'DE_TO_EN', category: 'Family' },
    { source: 'Ihre Schwester spricht Deutsch.', target: 'Her sister speaks German.', direction: 'DE_TO_EN', category: 'Family' },
  ];
}

export function generateNegationTranslations(): TranslationExercise[] {
  return [
    { source: "I don't speak German.", target: 'Ich spreche kein Deutsch.', direction: 'EN_TO_DE', category: 'Negation' },
    { source: "I don't live in Berlin.", target: 'Ich wohne nicht in Berlin.', direction: 'EN_TO_DE', category: 'Negation' },
    { source: "I don't have a sister.", target: 'Ich habe keine Schwester.', direction: 'EN_TO_DE', category: 'Negation' },
    { source: 'Er kommt heute nicht.', target: "He's not coming today.", direction: 'DE_TO_EN', category: 'Negation' },
  ];
}

export function generateAllTranslations(): TranslationExercise[] {
  return [...generateGreetingsTranslations(), ...generateFamilyTranslations(), ...generateNegationTranslations()];
}

// ============================================================
// E. DIALOGUE GENERATORS
// ============================================================

export function generateIntroductionDialogue(): Dialogue {
  return {
    title: 'Meeting Someone New',
    context: 'Two people meet at a café and introduce themselves.',
    lines: [
      { speaker: 'A', de: 'Hallo!', en: 'Hello!' },
      { speaker: 'B', de: 'Hallo! Wie heißt du?', en: 'Hello! What is your name?' },
      { speaker: 'A', de: 'Ich heiße Anna. Und du?', en: 'My name is Anna. And you?' },
      { speaker: 'B', de: 'Ich bin Max. Freut mich!', en: 'I am Max. Nice to meet you!' },
      { speaker: 'A', de: 'Freut mich auch! Woher kommst du?', en: 'Nice to meet you too! Where are you from?' },
      { speaker: 'B', de: 'Ich komme aus Deutschland. Und du?', en: 'I come from Germany. And you?' },
      { speaker: 'A', de: 'Ich komme aus England.', en: 'I come from England.' },
      { speaker: 'B', de: 'Sprichst du Deutsch?', en: 'Do you speak German?' },
      { speaker: 'A', de: 'Ja, ich spreche ein bisschen Deutsch.', en: 'Yes, I speak a little German.' },
      { speaker: 'B', de: 'Das ist toll!', en: 'That is great!' },
      { speaker: 'A', de: 'Tschüss!', en: 'Bye!' },
      { speaker: 'B', de: 'Auf Wiedersehen!', en: 'Goodbye!' },
    ],
  };
}

export function generateFormalDialogue(): Dialogue {
  return {
    title: 'Formal Introduction',
    context: 'A formal meeting between colleagues at work.',
    lines: [
      { speaker: 'A', de: 'Guten Tag!', en: 'Good day!' },
      { speaker: 'B', de: 'Guten Tag! Wie heißen Sie?', en: 'Good day! What is your name?' },
      { speaker: 'A', de: 'Mein Name ist Müller. Und Sie?', en: 'My name is Müller. And you?' },
      { speaker: 'B', de: 'Ich bin Herr Schmidt. Es freut mich, Sie kennenzulernen.', en: 'I am Mr. Schmidt. Nice to meet you.' },
      { speaker: 'A', de: 'Sehr angenehm. Wo wohnen Sie?', en: 'Pleased to meet you. Where do you live?' },
      { speaker: 'B', de: 'Ich wohne in München.', en: 'I live in Munich.' },
      { speaker: 'A', de: 'Und welche Sprachen sprechen Sie?', en: 'And what languages do you speak?' },
      { speaker: 'B', de: 'Ich spreche Deutsch und Englisch.', en: 'I speak German and English.' },
      { speaker: 'A', de: 'Auf Wiedersehen!', en: 'Goodbye!' },
      { speaker: 'B', de: 'Auf Wiedersehen! Einen schönen Tag noch!', en: 'Goodbye! Have a nice day!' },
    ],
  };
}

export function generateFamilyDialogue(): Dialogue {
  return {
    title: 'Talking About Family',
    context: 'Two friends discussing their families.',
    lines: [
      { speaker: 'A', de: 'Hast du Geschwister?', en: 'Do you have siblings?' },
      { speaker: 'B', de: 'Ja, ich habe einen Bruder und eine Schwester.', en: 'Yes, I have a brother and a sister.' },
      { speaker: 'A', de: 'Wie heißt dein Bruder?', en: 'What is your brother called?' },
      { speaker: 'B', de: 'Er heißt Thomas. Und du? Hast du Geschwister?', en: 'He is called Thomas. And you? Do you have siblings?' },
      { speaker: 'A', de: 'Nein, ich habe keine Geschwister.', en: 'No, I don\'t have any siblings.' },
      { speaker: 'B', de: 'Wie heißt deine Mutter?', en: 'What is your mother called?' },
      { speaker: 'A', de: 'Meine Mutter heißt Maria.', en: 'My mother is called Maria.' },
      { speaker: 'B', de: 'Das ist ein schöner Name!', en: 'That is a beautiful name!' },
    ],
  };
}

export function generateAllDialogues(): Dialogue[] {
  return [generateIntroductionDialogue(), generateFormalDialogue(), generateFamilyDialogue()];
}

// ============================================================
// F. PRONUNCIATION TASK GENERATORS
// ============================================================

export function generateVowelLengthTasks(): PronunciationTask[] {
  return pronunciationRules.longVsShortVowels.examples.map((ex) => ({
    type: 'long_short_vowel' as const,
    question: `Is the vowel in "${ex.word}" long or short?`,
    answer: ex.length,
    explanation: ex.note || `The vowel "${ex.vowel}" in "${ex.word}" is ${ex.length}.`,
  }));
}

export function generatePronunciationRuleTasks(): PronunciationTask[] {
  const tasks: PronunciationTask[] = [];

  // Consonant rules
  for (const rule of pronunciationRules.consonants) {
    tasks.push({
      type: 'pronunciation_rule',
      question: `How is "${rule.pattern}" pronounced in German? Example: ${rule.examples[0]}`,
      answer: rule.pronunciation,
      explanation: `"${rule.pattern}" is pronounced ${rule.pronunciation}. Examples: ${rule.examples.join(', ')}`,
    });
  }

  // Diphthongs
  for (const rule of pronunciationRules.diphthongs) {
    tasks.push({
      type: 'pronunciation_rule',
      question: `How is "${rule.pattern}" pronounced in German? Example: ${rule.examples[0]}`,
      answer: rule.pronunciation,
      explanation: `"${rule.pattern}" is pronounced ${rule.pronunciation}. Examples: ${rule.examples.join(', ')}`,
    });
  }

  return tasks;
}

export function generateUmlautTasks(): PronunciationTask[] {
  return pronunciationRules.umlauts.letters.map((umlaut) => ({
    type: 'umlaut' as const,
    question: `How do you pronounce "${umlaut.letter}"? Example: ${umlaut.examples[0]}`,
    answer: umlaut.pronunciation,
    explanation: `"${umlaut.letter}" is pronounced ${umlaut.pronunciation}. Examples: ${umlaut.examples.join(', ')}`,
  }));
}

export function generateAllPronunciationTasks(): PronunciationTask[] {
  return [...generateVowelLengthTasks(), ...generatePronunciationRuleTasks(), ...generateUmlautTasks()];
}

// ============================================================
// EXPORT ALL CURRICULUM DATA
// ============================================================

export {
  greetingsQuestions,
  pronunciationRules,
  negation,
  nationalities,
  familyVocab,
  possessives,
  verbHaben,
  verbSein,
  regularVerbRule,
  stemChangingVerbs,
  duEndingRule,
  numbers,
  ageExpressions,
  seitUsage,
  wordOrder,
  dialogueComponents,
  languages,
};
