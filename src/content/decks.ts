import type { Deck } from '../types';

export const greetingsDeck: Deck = {
  id: 'greetings',
  name: 'Greetings & Basics',
  description: 'Essential German greetings and basic phrases',
  cards: [
    { id: 'g1', de: 'Hallo', en: 'Hello', partOfSpeech: 'phrase' },
    { id: 'g2', de: 'Guten Morgen', en: 'Good morning', partOfSpeech: 'phrase' },
    { id: 'g3', de: 'Guten Tag', en: 'Good day', partOfSpeech: 'phrase' },
    { id: 'g4', de: 'Guten Abend', en: 'Good evening', partOfSpeech: 'phrase' },
    { id: 'g5', de: 'Gute Nacht', en: 'Good night', partOfSpeech: 'phrase' },
    { id: 'g6', de: 'Tschüss', en: 'Bye', partOfSpeech: 'phrase' },
    { id: 'g7', de: 'Auf Wiedersehen', en: 'Goodbye', partOfSpeech: 'phrase' },
    { id: 'g8', de: 'Danke', en: 'Thank you', partOfSpeech: 'phrase' },
    { id: 'g9', de: 'Bitte', en: 'Please / You\'re welcome', partOfSpeech: 'phrase' },
    { id: 'g10', de: 'Entschuldigung', en: 'Excuse me / Sorry', partOfSpeech: 'phrase' },
    { id: 'g11', de: 'Ja', en: 'Yes', partOfSpeech: 'phrase' },
    { id: 'g12', de: 'Nein', en: 'No', partOfSpeech: 'phrase' },
    { id: 'g13', de: 'Wie geht es Ihnen?', en: 'How are you? (formal)', partOfSpeech: 'phrase' },
    { id: 'g14', de: 'Wie geht\'s?', en: 'How are you? (informal)', partOfSpeech: 'phrase' },
    { id: 'g15', de: 'Gut', en: 'Good', partOfSpeech: 'adj' },
  ],
};

export const numbersDeck: Deck = {
  id: 'numbers',
  name: 'Numbers 1-20',
  description: 'Basic German numbers',
  cards: [
    { id: 'n1', de: 'eins', en: 'one', partOfSpeech: 'adj' },
    { id: 'n2', de: 'zwei', en: 'two', partOfSpeech: 'adj' },
    { id: 'n3', de: 'drei', en: 'three', partOfSpeech: 'adj' },
    { id: 'n4', de: 'vier', en: 'four', partOfSpeech: 'adj' },
    { id: 'n5', de: 'fünf', en: 'five', partOfSpeech: 'adj' },
    { id: 'n6', de: 'sechs', en: 'six', partOfSpeech: 'adj' },
    { id: 'n7', de: 'sieben', en: 'seven', partOfSpeech: 'adj' },
    { id: 'n8', de: 'acht', en: 'eight', partOfSpeech: 'adj' },
    { id: 'n9', de: 'neun', en: 'nine', partOfSpeech: 'adj' },
    { id: 'n10', de: 'zehn', en: 'ten', partOfSpeech: 'adj' },
    { id: 'n11', de: 'elf', en: 'eleven', partOfSpeech: 'adj' },
    { id: 'n12', de: 'zwölf', en: 'twelve', partOfSpeech: 'adj' },
    { id: 'n13', de: 'dreizehn', en: 'thirteen', partOfSpeech: 'adj' },
    { id: 'n14', de: 'vierzehn', en: 'fourteen', partOfSpeech: 'adj' },
    { id: 'n15', de: 'fünfzehn', en: 'fifteen', partOfSpeech: 'adj' },
    { id: 'n16', de: 'sechzehn', en: 'sixteen', partOfSpeech: 'adj' },
    { id: 'n17', de: 'siebzehn', en: 'seventeen', partOfSpeech: 'adj' },
    { id: 'n18', de: 'achtzehn', en: 'eighteen', partOfSpeech: 'adj' },
    { id: 'n19', de: 'neunzehn', en: 'nineteen', partOfSpeech: 'adj' },
    { id: 'n20', de: 'zwanzig', en: 'twenty', partOfSpeech: 'adj' },
  ],
};

export const daysDeck: Deck = {
  id: 'days',
  name: 'Days & Time',
  description: 'Days of the week and time-related words',
  cards: [
    { id: 'd1', de: 'Montag', en: 'Monday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd2', de: 'Dienstag', en: 'Tuesday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd3', de: 'Mittwoch', en: 'Wednesday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd4', de: 'Donnerstag', en: 'Thursday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd5', de: 'Freitag', en: 'Friday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd6', de: 'Samstag', en: 'Saturday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd7', de: 'Sonntag', en: 'Sunday', article: 'der', partOfSpeech: 'noun' },
    { id: 'd8', de: 'heute', en: 'today', partOfSpeech: 'adv' },
    { id: 'd9', de: 'morgen', en: 'tomorrow', partOfSpeech: 'adv' },
    { id: 'd10', de: 'gestern', en: 'yesterday', partOfSpeech: 'adv' },
  ],
};

export const verbsDeck: Deck = {
  id: 'common-verbs',
  name: 'Common Verbs',
  description: 'Essential German verbs',
  cards: [
    { id: 'v1', de: 'sein', en: 'to be', partOfSpeech: 'verb', note: 'Irregular verb' },
    { id: 'v2', de: 'haben', en: 'to have', partOfSpeech: 'verb', note: 'Irregular verb' },
    { id: 'v3', de: 'gehen', en: 'to go', partOfSpeech: 'verb' },
    { id: 'v4', de: 'machen', en: 'to do/make', partOfSpeech: 'verb' },
    { id: 'v5', de: 'sprechen', en: 'to speak', partOfSpeech: 'verb' },
    { id: 'v6', de: 'lernen', en: 'to learn', partOfSpeech: 'verb' },
    { id: 'v7', de: 'kommen', en: 'to come', partOfSpeech: 'verb' },
    { id: 'v8', de: 'sehen', en: 'to see', partOfSpeech: 'verb' },
    { id: 'v9', de: 'essen', en: 'to eat', partOfSpeech: 'verb' },
    { id: 'v10', de: 'trinken', en: 'to drink', partOfSpeech: 'verb' },
    { id: 'v11', de: 'wohnen', en: 'to live/reside', partOfSpeech: 'verb' },
    { id: 'v12', de: 'arbeiten', en: 'to work', partOfSpeech: 'verb' },
  ],
};

export const a1BasicsDeck: Deck = {
  id: 'a1-basics',
  name: 'A1 Basics',
  description: 'Basic nouns and words for A1 level',
  cards: [
    { id: 'a1', de: 'Mann', en: 'man', article: 'der', partOfSpeech: 'noun' },
    { id: 'a2', de: 'Frau', en: 'woman', article: 'die', partOfSpeech: 'noun' },
    { id: 'a3', de: 'Kind', en: 'child', article: 'das', partOfSpeech: 'noun' },
    { id: 'a4', de: 'Haus', en: 'house', article: 'das', partOfSpeech: 'noun' },
    { id: 'a5', de: 'Auto', en: 'car', article: 'das', partOfSpeech: 'noun' },
    { id: 'a6', de: 'Buch', en: 'book', article: 'das', partOfSpeech: 'noun' },
    { id: 'a7', de: 'Tisch', en: 'table', article: 'der', partOfSpeech: 'noun' },
    { id: 'a8', de: 'Stuhl', en: 'chair', article: 'der', partOfSpeech: 'noun' },
    { id: 'a9', de: 'Tür', en: 'door', article: 'die', partOfSpeech: 'noun' },
    { id: 'a10', de: 'Fenster', en: 'window', article: 'das', partOfSpeech: 'noun' },
    { id: 'a11', de: 'Wasser', en: 'water', article: 'das', partOfSpeech: 'noun' },
    { id: 'a12', de: 'Brot', en: 'bread', article: 'das', partOfSpeech: 'noun' },
    { id: 'a13', de: 'Milch', en: 'milk', article: 'die', partOfSpeech: 'noun' },
    { id: 'a14', de: 'Kaffee', en: 'coffee', article: 'der', partOfSpeech: 'noun' },
    { id: 'a15', de: 'Tee', en: 'tea', article: 'der', partOfSpeech: 'noun' },
  ],
};

export const travelPhrasebookDeck: Deck = {
  id: 'travel-phrasebook',
  name: 'Travel Phrasebook',
  description: 'Useful phrases for traveling in Germany',
  cards: [
    { id: 't1', de: 'Wo ist...?', en: 'Where is...?', partOfSpeech: 'phrase' },
    { id: 't2', de: 'Wie viel kostet das?', en: 'How much does this cost?', partOfSpeech: 'phrase' },
    { id: 't3', de: 'Ich verstehe nicht', en: 'I don\'t understand', partOfSpeech: 'phrase' },
    { id: 't4', de: 'Sprechen Sie Englisch?', en: 'Do you speak English?', partOfSpeech: 'phrase' },
    { id: 't5', de: 'Ich brauche Hilfe', en: 'I need help', partOfSpeech: 'phrase' },
    { id: 't6', de: 'Die Rechnung, bitte', en: 'The bill, please', partOfSpeech: 'phrase' },
    { id: 't7', de: 'Wo ist die Toilette?', en: 'Where is the bathroom?', partOfSpeech: 'phrase' },
    { id: 't8', de: 'Ein Ticket nach...', en: 'One ticket to...', partOfSpeech: 'phrase' },
    { id: 't9', de: 'Ich bin verloren', en: 'I am lost', partOfSpeech: 'phrase' },
    { id: 't10', de: 'Können Sie mir helfen?', en: 'Can you help me?', partOfSpeech: 'phrase' },
  ],
};

export const allDecks: Deck[] = [
  greetingsDeck,
  numbersDeck,
  daysDeck,
  verbsDeck,
  a1BasicsDeck,
  travelPhrasebookDeck,
];
