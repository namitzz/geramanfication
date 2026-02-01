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

export const nationalitiesDeck: Deck = {
  id: 'nationalities',
  name: 'Nationalities',
  description: 'Learn nationalities in masculine and feminine forms',
  cards: [
    { id: 'nat1', de: 'Franzose / Französin', en: 'French (m/f)', partOfSpeech: 'noun', note: 'from Frankreich' },
    { id: 'nat2', de: 'Italiener / Italienerin', en: 'Italian (m/f)', partOfSpeech: 'noun', note: 'from Italien' },
    { id: 'nat3', de: 'Spanier / Spanierin', en: 'Spanish (m/f)', partOfSpeech: 'noun', note: 'from Spanien' },
    { id: 'nat4', de: 'Amerikaner / Amerikanerin', en: 'American (m/f)', partOfSpeech: 'noun', note: 'from USA' },
    { id: 'nat5', de: 'Deutscher / Deutsche', en: 'German (m/f)', partOfSpeech: 'noun', note: 'from Deutschland' },
    { id: 'nat6', de: 'Schweizer', en: 'Swiss (m/f)', partOfSpeech: 'noun', note: 'from Schweiz - same for both' },
    { id: 'nat7', de: 'Brite / Britin', en: 'British (m/f)', partOfSpeech: 'noun', note: 'from Vereinigtes Königreich' },
    { id: 'nat8', de: 'Engländer / Engländerin', en: 'English (m/f)', partOfSpeech: 'noun', note: 'from England' },
    { id: 'nat9', de: 'Österreicher / Österreicherin', en: 'Austrian (m/f)', partOfSpeech: 'noun', note: 'from Österreich' },
    { id: 'nat10', de: 'Pole / Polin', en: 'Polish (m/f)', partOfSpeech: 'noun', note: 'from Polen' },
    { id: 'nat11', de: 'Russe / Russin', en: 'Russian (m/f)', partOfSpeech: 'noun', note: 'from Russland' },
    { id: 'nat12', de: 'Türke / Türkin', en: 'Turkish (m/f)', partOfSpeech: 'noun', note: 'from Türkei' },
    { id: 'nat13', de: 'Chinese / Chinesin', en: 'Chinese (m/f)', partOfSpeech: 'noun', note: 'from China' },
    { id: 'nat14', de: 'Japaner / Japanerin', en: 'Japanese (m/f)', partOfSpeech: 'noun', note: 'from Japan' },
    { id: 'nat15', de: 'Brasilianer / Brasilianerin', en: 'Brazilian (m/f)', partOfSpeech: 'noun', note: 'from Brasilien' },
  ],
};

export const familyDeck: Deck = {
  id: 'family',
  name: 'Family Members',
  description: 'Learn German family vocabulary with articles',
  cards: [
    { id: 'fam1', de: 'Bruder', en: 'brother', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam2', de: 'Schwester', en: 'sister', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam3', de: 'Kind', en: 'child', article: 'das', partOfSpeech: 'noun' },
    { id: 'fam4', de: 'Eltern', en: 'parents', article: 'die', partOfSpeech: 'noun', note: 'plural only' },
    { id: 'fam5', de: 'Mutter', en: 'mother', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam6', de: 'Vater', en: 'father', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam7', de: 'Onkel', en: 'uncle', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam8', de: 'Tante', en: 'aunt', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam9', de: 'Nichte', en: 'niece', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam10', de: 'Neffe', en: 'nephew', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam11', de: 'Großmutter', en: 'grandmother', article: 'die', partOfSpeech: 'noun', note: 'informal: Oma' },
    { id: 'fam12', de: 'Großvater', en: 'grandfather', article: 'der', partOfSpeech: 'noun', note: 'informal: Opa' },
    { id: 'fam13', de: 'Oma', en: 'grandma', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam14', de: 'Opa', en: 'grandpa', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam15', de: 'Cousin', en: 'male cousin', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam16', de: 'Kusine', en: 'female cousin', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam17', de: 'Freund', en: 'male friend / boyfriend', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam18', de: 'Freundin', en: 'female friend / girlfriend', article: 'die', partOfSpeech: 'noun' },
    { id: 'fam19', de: 'Sohn', en: 'son', article: 'der', partOfSpeech: 'noun' },
    { id: 'fam20', de: 'Tochter', en: 'daughter', article: 'die', partOfSpeech: 'noun' },
  ],
};

export const possessivesDeck: Deck = {
  id: 'possessives',
  name: 'Possessives',
  description: 'Learn possessive pronouns: mein, dein, sein, ihr',
  cards: [
    { id: 'pos1', de: 'mein Bruder', en: 'my brother', partOfSpeech: 'phrase', note: 'masculine - no ending' },
    { id: 'pos2', de: 'meine Schwester', en: 'my sister', partOfSpeech: 'phrase', note: 'feminine - add -e' },
    { id: 'pos3', de: 'mein Kind', en: 'my child', partOfSpeech: 'phrase', note: 'neuter - no ending' },
    { id: 'pos4', de: 'meine Eltern', en: 'my parents', partOfSpeech: 'phrase', note: 'plural - add -e' },
    { id: 'pos5', de: 'dein Freund', en: 'your friend (informal)', partOfSpeech: 'phrase', note: 'masculine - no ending' },
    { id: 'pos6', de: 'deine Freundin', en: 'your friend (informal, f)', partOfSpeech: 'phrase', note: 'feminine - add -e' },
    { id: 'pos7', de: 'sein Vater', en: 'his father', partOfSpeech: 'phrase', note: 'masculine - no ending' },
    { id: 'pos8', de: 'seine Mutter', en: 'his mother', partOfSpeech: 'phrase', note: 'feminine - add -e' },
    { id: 'pos9', de: 'ihr Bruder', en: 'her brother', partOfSpeech: 'phrase', note: 'masculine - no ending' },
    { id: 'pos10', de: 'ihre Schwester', en: 'her sister', partOfSpeech: 'phrase', note: 'feminine - add -e' },
    { id: 'pos11', de: 'Das ist mein Bruder.', en: 'This is my brother.', partOfSpeech: 'phrase' },
    { id: 'pos12', de: 'Das ist meine Schwester.', en: 'This is my sister.', partOfSpeech: 'phrase' },
    { id: 'pos13', de: 'Wie heißt dein Freund?', en: 'What is your friend called?', partOfSpeech: 'phrase' },
    { id: 'pos14', de: 'Sein Bruder spricht Deutsch.', en: 'His brother speaks German.', partOfSpeech: 'phrase' },
    { id: 'pos15', de: 'Ihre Schwester spricht kein Deutsch.', en: "Her sister doesn't speak German.", partOfSpeech: 'phrase' },
  ],
};

export const languagesDeck: Deck = {
  id: 'languages',
  name: 'Languages',
  description: 'Learn how to say different languages in German',
  cards: [
    { id: 'lang1', de: 'Deutsch', en: 'German', partOfSpeech: 'noun' },
    { id: 'lang2', de: 'Englisch', en: 'English', partOfSpeech: 'noun' },
    { id: 'lang3', de: 'Französisch', en: 'French', partOfSpeech: 'noun' },
    { id: 'lang4', de: 'Spanisch', en: 'Spanish', partOfSpeech: 'noun' },
    { id: 'lang5', de: 'Italienisch', en: 'Italian', partOfSpeech: 'noun' },
    { id: 'lang6', de: 'Russisch', en: 'Russian', partOfSpeech: 'noun' },
    { id: 'lang7', de: 'Arabisch', en: 'Arabic', partOfSpeech: 'noun' },
    { id: 'lang8', de: 'Chinesisch', en: 'Chinese', partOfSpeech: 'noun' },
    { id: 'lang9', de: 'Japanisch', en: 'Japanese', partOfSpeech: 'noun' },
    { id: 'lang10', de: 'Portugiesisch', en: 'Portuguese', partOfSpeech: 'noun' },
    { id: 'lang11', de: 'Ich spreche Deutsch.', en: 'I speak German.', partOfSpeech: 'phrase' },
    { id: 'lang12', de: 'Ich spreche ein bisschen Deutsch.', en: 'I speak a little German.', partOfSpeech: 'phrase' },
    { id: 'lang13', de: 'Welche Sprachen sprichst du?', en: 'What languages do you speak?', partOfSpeech: 'phrase' },
    { id: 'lang14', de: 'Ich spreche kein Spanisch.', en: "I don't speak Spanish.", partOfSpeech: 'phrase' },
    { id: 'lang15', de: 'Sprechen Sie Englisch?', en: 'Do you speak English? (formal)', partOfSpeech: 'phrase' },
  ],
};

// ============================================================
// PHASE 2 DECKS - Modular Learning with Practice
// ============================================================

// Phase 2.1: Daily Routine Vocabulary
export const phase2DailyRoutineVocabDeck: Deck = {
  id: 'phase2-daily-routine-vocab',
  name: 'Daily Routine Vocabulary',
  description: 'Essential vocabulary for describing your daily routine (Alltagsroutine)',
  cards: [
    { id: 'p2drv1', de: 'Morgen', en: 'morning', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2drv2', de: 'Vormittag', en: 'late morning/forenoon', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2drv3', de: 'Mittag', en: 'noon/midday', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2drv4', de: 'Nachmittag', en: 'afternoon', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2drv5', de: 'Abend', en: 'evening', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2drv6', de: 'Nacht', en: 'night', article: 'die', partOfSpeech: 'noun' },
    { id: 'p2drv7', de: 'frühstücken', en: 'to have breakfast', partOfSpeech: 'verb' },
    { id: 'p2drv8', de: 'zu Mittag essen', en: 'to have lunch', partOfSpeech: 'phrase' },
    { id: 'p2drv9', de: 'zu Abend essen', en: 'to have dinner', partOfSpeech: 'phrase' },
    { id: 'p2drv10', de: 'arbeiten', en: 'to work', partOfSpeech: 'verb' },
    { id: 'p2drv11', de: 'zur Arbeit gehen', en: 'to go to work', partOfSpeech: 'phrase' },
    { id: 'p2drv12', de: 'nach Hause kommen', en: 'to come home', partOfSpeech: 'phrase' },
    { id: 'p2drv13', de: 'kochen', en: 'to cook', partOfSpeech: 'verb' },
    { id: 'p2drv14', de: 'Morgenroutine', en: 'morning routine', article: 'die', partOfSpeech: 'noun' },
    { id: 'p2drv15', de: 'Frühstück', en: 'breakfast', article: 'das', partOfSpeech: 'noun' },
  ],
};

// Phase 2.2: Separable vs Inseparable Verbs
export const phase2SeparableInseparableDeck: Deck = {
  id: 'phase2-separable-inseparable',
  name: 'Separable vs Inseparable Verbs',
  description: 'Master the crucial difference between separable and inseparable verb prefixes',
  cards: [
    { id: 'p2si1', de: 'aufstehen', en: 'to get up', partOfSpeech: 'verb', note: 'Separable: Ich stehe auf' },
    { id: 'p2si2', de: 'aufwachen', en: 'to wake up', partOfSpeech: 'verb', note: 'Separable: Ich wache auf' },
    { id: 'p2si3', de: 'einkaufen', en: 'to go shopping', partOfSpeech: 'verb', note: 'Separable: Ich kaufe ein' },
    { id: 'p2si4', de: 'ausgehen', en: 'to go out', partOfSpeech: 'verb', note: 'Separable: Ich gehe aus' },
    { id: 'p2si5', de: 'ankommen', en: 'to arrive', partOfSpeech: 'verb', note: 'Separable: Ich komme an' },
    { id: 'p2si6', de: 'zurückkommen', en: 'to come back', partOfSpeech: 'verb', note: 'Separable: Ich komme zurück' },
    { id: 'p2si7', de: 'fernsehen', en: 'to watch TV', partOfSpeech: 'verb', note: 'Separable: Ich sehe fern' },
    { id: 'p2si8', de: 'beginnen', en: 'to begin', partOfSpeech: 'verb', note: 'Inseparable: Ich beginne' },
    { id: 'p2si9', de: 'verstehen', en: 'to understand', partOfSpeech: 'verb', note: 'Inseparable: Ich verstehe' },
    { id: 'p2si10', de: 'verbringen', en: 'to spend (time)', partOfSpeech: 'verb', note: 'Inseparable: Ich verbringe' },
    { id: 'p2si11', de: 'erklären', en: 'to explain', partOfSpeech: 'verb', note: 'Inseparable: Ich erkläre' },
    { id: 'p2si12', de: 'bekommen', en: 'to receive/get', partOfSpeech: 'verb', note: 'Inseparable: Ich bekomme' },
    { id: 'p2si13', de: 'Ich stehe um 7 Uhr auf.', en: 'I get up at 7 o\'clock.', partOfSpeech: 'phrase', note: 'Separable verb example' },
    { id: 'p2si14', de: 'Der Film beginnt um 20 Uhr.', en: 'The movie begins at 8 PM.', partOfSpeech: 'phrase', note: 'Inseparable verb example' },
    { id: 'p2si15', de: 'Kommst du mit?', en: 'Are you coming along?', partOfSpeech: 'phrase', note: 'mitkommen - separable' },
  ],
};

// Phase 2.3: Reflexive Verbs
export const phase2ReflexiveVerbsDeck: Deck = {
  id: 'phase2-reflexive-verbs',
  name: 'Reflexive Verbs',
  description: 'Verbs that refer back to the subject - essential for daily routines',
  cards: [
    { id: 'p2rv1', de: 'sich waschen', en: 'to wash (oneself)', partOfSpeech: 'verb', note: 'Ich wasche mich' },
    { id: 'p2rv2', de: 'sich anziehen', en: 'to get dressed', partOfSpeech: 'verb', note: 'Ich ziehe mich an' },
    { id: 'p2rv3', de: 'sich ausziehen', en: 'to get undressed', partOfSpeech: 'verb', note: 'Ich ziehe mich aus' },
    { id: 'p2rv4', de: 'sich duschen', en: 'to shower', partOfSpeech: 'verb', note: 'Ich dusche mich' },
    { id: 'p2rv5', de: 'sich kämmen', en: 'to comb (one\'s hair)', partOfSpeech: 'verb', note: 'Ich kämme mich' },
    { id: 'p2rv6', de: 'sich rasieren', en: 'to shave', partOfSpeech: 'verb', note: 'Ich rasiere mich' },
    { id: 'p2rv7', de: 'sich schminken', en: 'to put on makeup', partOfSpeech: 'verb', note: 'Ich schminke mich' },
    { id: 'p2rv8', de: 'sich die Zähne putzen', en: 'to brush one\'s teeth', partOfSpeech: 'verb', note: 'Ich putze mir die Zähne (dative)' },
    { id: 'p2rv9', de: 'sich beeilen', en: 'to hurry', partOfSpeech: 'verb', note: 'Ich beeile mich' },
    { id: 'p2rv10', de: 'sich entspannen', en: 'to relax', partOfSpeech: 'verb', note: 'Ich entspanne mich' },
    { id: 'p2rv11', de: 'sich freuen', en: 'to be happy/look forward', partOfSpeech: 'verb', note: 'Ich freue mich' },
    { id: 'p2rv12', de: 'Ich wasche mich jeden Morgen.', en: 'I wash myself every morning.', partOfSpeech: 'phrase' },
    { id: 'p2rv13', de: 'Er zieht sich schnell an.', en: 'He gets dressed quickly.', partOfSpeech: 'phrase' },
    { id: 'p2rv14', de: 'Wir entspannen uns am Wochenende.', en: 'We relax on the weekend.', partOfSpeech: 'phrase' },
    { id: 'p2rv15', de: 'Sie beeilt sich, weil sie spät ist.', en: 'She hurries because she is late.', partOfSpeech: 'phrase' },
  ],
};

// Phase 2.4: Time Expressions
export const phase2TimeExpressionsDeck: Deck = {
  id: 'phase2-time-expressions',
  name: 'Time Expressions',
  description: 'How to tell time in German: um, halb, Viertel, 12h vs 24h formats',
  cards: [
    { id: 'p2te1', de: 'Um wie viel Uhr?', en: 'At what time?', partOfSpeech: 'phrase' },
    { id: 'p2te2', de: 'Wie viel Uhr ist es?', en: 'What time is it?', partOfSpeech: 'phrase' },
    { id: 'p2te3', de: 'Es ist acht Uhr.', en: 'It is eight o\'clock.', partOfSpeech: 'phrase', note: '8:00' },
    { id: 'p2te4', de: 'Es ist halb neun.', en: 'It is half past eight.', partOfSpeech: 'phrase', note: '8:30 - half TO nine!' },
    { id: 'p2te5', de: 'Es ist Viertel vor zehn.', en: 'It is quarter to ten.', partOfSpeech: 'phrase', note: '9:45' },
    { id: 'p2te6', de: 'Es ist Viertel nach sieben.', en: 'It is quarter past seven.', partOfSpeech: 'phrase', note: '7:15' },
    { id: 'p2te7', de: 'Es ist zehn nach acht.', en: 'It is ten past eight.', partOfSpeech: 'phrase', note: '8:10' },
    { id: 'p2te8', de: 'Es ist fünf vor neun.', en: 'It is five to nine.', partOfSpeech: 'phrase', note: '8:55' },
    { id: 'p2te9', de: 'am Morgen', en: 'in the morning', partOfSpeech: 'phrase' },
    { id: 'p2te10', de: 'am Vormittag', en: 'in the late morning', partOfSpeech: 'phrase' },
    { id: 'p2te11', de: 'am Nachmittag', en: 'in the afternoon', partOfSpeech: 'phrase' },
    { id: 'p2te12', de: 'am Abend', en: 'in the evening', partOfSpeech: 'phrase' },
    { id: 'p2te13', de: 'in der Nacht', en: 'at night', partOfSpeech: 'phrase' },
    { id: 'p2te14', de: 'Ich stehe um 7 Uhr auf.', en: 'I get up at 7 o\'clock.', partOfSpeech: 'phrase' },
    { id: 'p2te15', de: 'Der Film beginnt um halb neun.', en: 'The movie begins at 8:30.', partOfSpeech: 'phrase' },
  ],
};

// Phase 2.5: Wohin (Akkusativ) vs Wo (Dativ)
export const phase2WohinWoDeck: Deck = {
  id: 'phase2-wohin-wo',
  name: 'Wohin vs Wo (Direction vs Location)',
  description: 'Master the difference between direction (where to?) and location (where?)',
  cards: [
    { id: 'p2ww1', de: 'Wo bist du?', en: 'Where are you?', partOfSpeech: 'phrase', note: 'Location - Dativ' },
    { id: 'p2ww2', de: 'Wohin gehst du?', en: 'Where are you going?', partOfSpeech: 'phrase', note: 'Direction - Akkusativ' },
    { id: 'p2ww3', de: 'Ich bin im Park.', en: 'I am in the park.', partOfSpeech: 'phrase', note: 'Location - Dativ' },
    { id: 'p2ww4', de: 'Ich gehe in den Park.', en: 'I am going to the park.', partOfSpeech: 'phrase', note: 'Direction - Akkusativ' },
    { id: 'p2ww5', de: 'Das Buch liegt auf dem Tisch.', en: 'The book is on the table.', partOfSpeech: 'phrase', note: 'liegen - location' },
    { id: 'p2ww6', de: 'Ich lege das Buch auf den Tisch.', en: 'I put the book on the table.', partOfSpeech: 'phrase', note: 'legen - direction' },
    { id: 'p2ww7', de: 'zu Hause', en: 'at home', partOfSpeech: 'phrase', note: 'Location' },
    { id: 'p2ww8', de: 'nach Hause', en: 'homeward/going home', partOfSpeech: 'phrase', note: 'Direction' },
    { id: 'p2ww9', de: 'im Büro', en: 'in the office', partOfSpeech: 'phrase', note: 'Location - Dativ' },
    { id: 'p2ww10', de: 'ins Büro', en: 'to the office', partOfSpeech: 'phrase', note: 'Direction - Akkusativ (in das)' },
    { id: 'p2ww11', de: 'Sie steht vor der Schule.', en: 'She is standing in front of the school.', partOfSpeech: 'phrase', note: 'Location' },
    { id: 'p2ww12', de: 'Sie geht vor die Schule.', en: 'She is going in front of the school.', partOfSpeech: 'phrase', note: 'Direction' },
    { id: 'p2ww13', de: 'liegen', en: 'to lie/be lying', partOfSpeech: 'verb', note: 'Location verb' },
    { id: 'p2ww14', de: 'legen', en: 'to lay/put down', partOfSpeech: 'verb', note: 'Direction verb' },
    { id: 'p2ww15', de: 'stehen', en: 'to stand/be standing', partOfSpeech: 'verb', note: 'Location verb' },
  ],
};

// Phase 2.6: Reading Comprehension - Herr Ihßen
export const phase2HerrIhssenDeck: Deck = {
  id: 'phase2-herr-ihssen',
  name: 'Reading: Herr Ihßen (Journalist)',
  description: 'Reading comprehension: A day in the life of a journalist',
  cards: [
    { id: 'p2hi1', de: 'Zeitung', en: 'newspaper', article: 'die', partOfSpeech: 'noun' },
    { id: 'p2hi2', de: 'Journalist', en: 'journalist', article: 'der', partOfSpeech: 'noun' },
    { id: 'p2hi3', de: 'zuerst', en: 'first', partOfSpeech: 'adv' },
    { id: 'p2hi4', de: 'danach', en: 'after that', partOfSpeech: 'adv' },
    { id: 'p2hi5', de: 'dabei', en: 'while doing so', partOfSpeech: 'adv' },
    { id: 'p2hi6', de: 'überprüfen', en: 'to check', partOfSpeech: 'verb' },
    { id: 'p2hi7', de: 'verlassen', en: 'to leave', partOfSpeech: 'verb', note: 'Inseparable' },
    { id: 'p2hi8', de: 'U-Bahn', en: 'subway', article: 'die', partOfSpeech: 'noun' },
    { id: 'p2hi9', de: 'dauern', en: 'to last/take time', partOfSpeech: 'verb' },
    { id: 'p2hi10', de: 'begrüßen', en: 'to greet', partOfSpeech: 'verb' },
    { id: 'p2hi11', de: 'besprechen', en: 'to discuss', partOfSpeech: 'verb', note: 'Inseparable' },
    { id: 'p2hi12', de: 'recherchieren', en: 'to research', partOfSpeech: 'verb' },
    { id: 'p2hi13', de: 'Kantine', en: 'cafeteria', article: 'die', partOfSpeech: 'noun' },
    { id: 'p2hi14', de: 'auf dem Heimweg', en: 'on the way home', partOfSpeech: 'phrase' },
    { id: 'p2hi15', de: 'sich treffen', en: 'to meet up', partOfSpeech: 'verb', note: 'Reflexive' },
  ],
};

// Phase 2.7: Practice Sentences
export const phase2PracticeSentencesDeck: Deck = {
  id: 'phase2-practice-sentences',
  name: 'Phase 2: Practice Sentences',
  description: 'Complete sentences combining all Phase 2 grammar concepts',
  cards: [
    { id: 'p2ps1', de: 'Ich wache um 6 Uhr auf und stehe sofort auf.', en: 'I wake up at 6 and get up immediately.', partOfSpeech: 'phrase' },
    { id: 'p2ps2', de: 'Ich dusche mich jeden Morgen.', en: 'I shower every morning.', partOfSpeech: 'phrase' },
    { id: 'p2ps3', de: 'Ich ziehe mich schnell an.', en: 'I get dressed quickly.', partOfSpeech: 'phrase' },
    { id: 'p2ps4', de: 'Um halb acht frühstücke ich.', en: 'At half past seven I have breakfast.', partOfSpeech: 'phrase' },
    { id: 'p2ps5', de: 'Ich gehe um 9 Uhr aus dem Haus.', en: 'I leave the house at 9 o\'clock.', partOfSpeech: 'phrase' },
    { id: 'p2ps6', de: 'Abends entspanne ich mich.', en: 'In the evening I relax.', partOfSpeech: 'phrase' },
    { id: 'p2ps7', de: 'Ich schlafe um 23 Uhr ein.', en: 'I fall asleep at 11 PM.', partOfSpeech: 'phrase' },
    { id: 'p2ps8', de: 'Ich bin im Büro.', en: 'I am in the office.', partOfSpeech: 'phrase', note: 'Location - Dativ' },
    { id: 'p2ps9', de: 'Ich gehe ins Büro.', en: 'I am going to the office.', partOfSpeech: 'phrase', note: 'Direction - Akkusativ' },
    { id: 'p2ps10', de: 'Der Unterricht beginnt um Viertel nach neun.', en: 'The class begins at quarter past nine.', partOfSpeech: 'phrase' },
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
  nationalitiesDeck,
  familyDeck,
  possessivesDeck,
  languagesDeck,
  phase2DailyRoutineVocabDeck,
  phase2SeparableInseparableDeck,
  phase2ReflexiveVerbsDeck,
  phase2TimeExpressionsDeck,
  phase2WohinWoDeck,
  phase2HerrIhssenDeck,
  phase2PracticeSentencesDeck,
];
