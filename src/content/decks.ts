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

export const sentencesDeck: Deck = {
  id: 'german-sentences',
  name: 'German Sentences',
  description: 'Complete sentences for real-world conversations',
  cards: [
    // Greetings & Introductions
    { id: 's1', de: 'Hallo!', en: 'Hello!', partOfSpeech: 'phrase' },
    { id: 's2', de: 'Guten Morgen!', en: 'Good morning!', partOfSpeech: 'phrase' },
    { id: 's3', de: 'Guten Tag!', en: 'Good day!', partOfSpeech: 'phrase' },
    { id: 's4', de: 'Guten Abend!', en: 'Good evening!', partOfSpeech: 'phrase' },
    { id: 's5', de: 'Tschüss!', en: 'Bye!', partOfSpeech: 'phrase' },
    { id: 's6', de: 'Auf Wiedersehen!', en: 'Goodbye (formal)', partOfSpeech: 'phrase' },
    { id: 's7', de: 'Ich heiße Namit.', en: 'I\'m called Namit.', partOfSpeech: 'phrase' },
    { id: 's8', de: 'Mein Name ist Namit.', en: 'My name is Namit.', partOfSpeech: 'phrase' },
    { id: 's9', de: 'Ich bin Namit.', en: 'I am Namit.', partOfSpeech: 'phrase' },
    { id: 's10', de: 'Freut mich!', en: 'Pleased to meet you!', partOfSpeech: 'phrase' },
    
    // Where You're From / Live
    { id: 's11', de: 'Ich komme aus England.', en: 'I come from England.', partOfSpeech: 'phrase' },
    { id: 's12', de: 'Ich wohne in Leicester.', en: 'I live in Leicester.', partOfSpeech: 'phrase' },
    { id: 's13', de: 'Wohnst du in Deutschland?', en: 'Do you live in Germany?', partOfSpeech: 'phrase' },
    { id: 's14', de: 'Nein, ich wohne nicht in Deutschland.', en: 'No, I don\'t live in Germany.', partOfSpeech: 'phrase' },
    { id: 's15', de: 'Wo wohnst du?', en: 'Where do you live?', partOfSpeech: 'phrase' },
    { id: 's16', de: 'Woher kommst du?', en: 'Where do you come from?', partOfSpeech: 'phrase' },
    { id: 's17', de: 'Woher sind Sie?', en: 'Where are you from? (formal)', partOfSpeech: 'phrase' },
    { id: 's18', de: 'Ich bin Engländer. / Ich bin Engländerin.', en: 'I\'m English (m/f).', partOfSpeech: 'phrase' },
    { id: 's19', de: 'Bist du Deutscher? / Bist du Deutsche?', en: 'Are you German? (m/f)', partOfSpeech: 'phrase' },
    { id: 's20', de: 'Ja, ich bin Deutscher.', en: 'Yes, I\'m German.', partOfSpeech: 'phrase' },
    { id: 's21', de: 'Nein, ich bin kein Deutscher.', en: 'No, I\'m not German.', partOfSpeech: 'phrase' },
    
    // Talking About Language & Skills
    { id: 's22', de: 'Sprichst du Deutsch?', en: 'Do you speak German?', partOfSpeech: 'phrase' },
    { id: 's23', de: 'Ich spreche ein bisschen Deutsch.', en: 'I speak a little German.', partOfSpeech: 'phrase' },
    { id: 's24', de: 'Sprechen Sie Deutsch?', en: 'Do you speak German? (formal)', partOfSpeech: 'phrase' },
    { id: 's25', de: 'Ja, ich spreche Deutsch.', en: 'Yes, I speak German.', partOfSpeech: 'phrase' },
    { id: 's26', de: 'Nein, ich spreche kein Deutsch.', en: 'No, I don\'t speak German.', partOfSpeech: 'phrase' },
    { id: 's27', de: 'Welche Sprachen sprichst du?', en: 'What languages do you speak?', partOfSpeech: 'phrase' },
    { id: 's28', de: 'Ich spreche Englisch und ein bisschen Deutsch.', en: 'I speak English and a little German.', partOfSpeech: 'phrase' },
    
    // Feelings / Well-being
    { id: 's29', de: 'Wie geht es dir?', en: 'How are you?', partOfSpeech: 'phrase' },
    { id: 's30', de: 'Es geht mir gut.', en: 'I\'m good.', partOfSpeech: 'phrase' },
    { id: 's31', de: 'Es geht mir sehr gut, danke!', en: 'I\'m very good, thanks!', partOfSpeech: 'phrase' },
    { id: 's32', de: 'Und dir?', en: 'And you?', partOfSpeech: 'phrase' },
    { id: 's33', de: 'Wie geht es Ihnen?', en: 'How are you? (formal)', partOfSpeech: 'phrase' },
    { id: 's34', de: 'Geht es Ihnen gut?', en: 'Are you well? (formal)', partOfSpeech: 'phrase' },
    { id: 's35', de: 'Es geht mir so lala.', en: 'I\'m so-so.', partOfSpeech: 'phrase' },
    { id: 's36', de: 'Es geht so.', en: 'It\'s okay / could be better.', partOfSpeech: 'phrase' },
    
    // Polite and Formal Forms
    { id: 's37', de: 'Wie heißen Sie?', en: 'What\'s your name? (formal)', partOfSpeech: 'phrase' },
    { id: 's38', de: 'Ich bin Ed. Und Sie?', en: 'I\'m Ed. And you?', partOfSpeech: 'phrase' },
    { id: 's39', de: 'Wo wohnen Sie?', en: 'Where do you live? (formal)', partOfSpeech: 'phrase' },
    { id: 's40', de: 'Wo kommen Sie her?', en: 'Where do you come from? (formal)', partOfSpeech: 'phrase' },
    { id: 's41', de: 'Es geht mir gut. Und Ihnen?', en: 'I\'m fine. And you? (formal)', partOfSpeech: 'phrase' },
    { id: 's42', de: 'Guten Tag, Herr Müller.', en: 'Good day, Mr. Müller.', partOfSpeech: 'phrase' },
    { id: 's43', de: 'Guten Tag, Frau Schmidt.', en: 'Good day, Mrs. Schmidt.', partOfSpeech: 'phrase' },
    
    // Miscellaneous Useful Phrases
    { id: 's44', de: 'Einen schönen Tag noch!', en: 'Have a nice day!', partOfSpeech: 'phrase' },
    { id: 's45', de: 'Danke schön!', en: 'Thank you very much!', partOfSpeech: 'phrase' },
    { id: 's46', de: 'Bitte schön!', en: 'You\'re very welcome!', partOfSpeech: 'phrase' },
    { id: 's47', de: 'Ich arbeite an der Universität.', en: 'I work at the university.', partOfSpeech: 'phrase' },
    { id: 's48', de: 'Ich esse gern Hähnchen.', en: 'I like eating chicken.', partOfSpeech: 'phrase' },
    { id: 's49', de: 'Ich mag Musik.', en: 'I like music.', partOfSpeech: 'phrase' },
    { id: 's50', de: 'Ich habe einen Bruder.', en: 'I have a brother.', partOfSpeech: 'phrase' },
  ],
};

export const allDecks: Deck[] = [
  greetingsDeck,
  numbersDeck,
  daysDeck,
  verbsDeck,
  a1BasicsDeck,
  travelPhrasebookDeck,
  sentencesDeck,
];
