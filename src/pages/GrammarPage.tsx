import { BookOpen } from 'lucide-react';

const GrammarPage = () => {
  const grammarTopics = [
    {
      title: 'German Articles',
      content: `German nouns have three genders, each with its own article:
      
• der (masculine) - der Mann (the man), der Tisch (the table), der Bruder (the brother)
• die (feminine) - die Frau (the woman), die Tür (the door), die Schwester (the sister)
• das (neuter) - das Kind (the child), das Haus (the house)

Tip: Always learn nouns with their articles!`,
    },
    {
      title: 'du / Sie / ihr - Address Forms',
      content: `German has different ways to say "you":

• du - familiar/informal (friends, family, children)
• Sie - respectful/formal (strangers, elders, professional settings)
• ihr - plural familiar (group of friends/family)

Examples:
• Wie heißt du? - What's your name? (informal)
• Wie heißen Sie? - What's your name? (formal)
• Woher kommt ihr? - Where do you (all) come from?`,
    },
    {
      title: 'Verb: sein (to be)',
      content: `Present tense conjugation:

• ich bin - I am
• du bist - you are (informal)
• er/sie/es ist - he/she/it is
• wir sind - we are
• ihr seid - you are (plural informal)
• sie/Sie sind - they are / you are (formal)

Example: Ich bin müde. (I am tired.)
Note: Use "sein" for age! Ich bin 20 Jahre alt.`,
    },
    {
      title: 'Verb: haben (to have)',
      content: `Present tense conjugation:

• ich habe - I have
• du hast - you have (informal)
• er/sie/es hat - he/she/it has
• wir haben - we have
• ihr habt - you have (plural informal)
• sie/Sie haben - they have / you have (formal)

Example: Ich habe einen Bruder. (I have a brother.)`,
    },
    {
      title: 'Regular Verbs (-en ending)',
      content: `Regular verbs follow a pattern. Stem = infinitive minus -en.

Example with "wohnen" (to live):
• ich wohne - I live
• du wohnst - you live
• er/sie/es wohnt - he/she/it lives
• wir wohnen - we live
• ihr wohnt - you live (plural)
• sie/Sie wohnen - they/you live (formal)

Other regular verbs: lernen, machen, arbeiten, kommen`,
    },
    {
      title: 'Stem-Changing Verbs',
      content: `Some verbs change their stem vowel in du and er/sie/es forms:

• sprechen (to speak): e → i
  du sprichst, er spricht

• sehen (to see): e → ie
  du siehst, er sieht

• lesen (to read): e → ie
  du liest, er liest

• fahren (to drive): a → ä
  du fährst, er fährt

• nehmen (to take): e → i
  du nimmst, er nimmt`,
    },
    {
      title: 'Special du-Form Rule',
      content: `When the verb stem ends in s, ß, or z, the du-form ends with -t (not -st):

• tanzen → du tanzt (not tanzst)
• heißen → du heißt (not heißst)

Examples:
• Wie heißt du? - What's your name?
• Du tanzt gut! - You dance well!`,
    },
    {
      title: 'Negation: nicht vs kein',
      content: `German has two ways to negate:

KEIN - negates nouns (replaces ein/eine)
• Ich spreche kein Deutsch. - I don't speak German.
• Ich habe keine Schwester. - I don't have a sister.
  (kein/keine/kein depends on gender)

NICHT - negates verbs, adverbs, phrases
• Ich wohne nicht in Berlin. - I don't live in Berlin.
• Er kommt heute nicht. - He's not coming today.

DOCH - contradicts a negative question
• "Sprichst du kein Deutsch?" → "Doch!" (Yes, I do!)`,
    },
    {
      title: 'Possessives (mein, dein, sein, ihr)',
      content: `Possessive pronouns change based on noun gender:

           my      your(inf)  his     her
Masc.     mein    dein       sein    ihr
Fem.      meine   deine      seine   ihre
Neuter    mein    dein       sein    ihr
Plural    meine   deine      seine   ihre

Examples:
• Das ist mein Bruder. (my brother - masc.)
• Das ist meine Schwester. (my sister - fem.)
• Das sind meine Eltern. (my parents - plural)
• Seine Mutter spricht Deutsch. (His mother...)
• Ihre Schwester wohnt in Berlin. (Her sister...)`,
    },
    {
      title: 'Word Order: Verb Second',
      content: `In main clauses, the verb is always in second position:

Subject + Verb + Object
• Ich sehe sie. - I see her.

When something else comes first, the subject moves:
• Dort sehe ich sie. - There I see her.
• Heute gehe ich ins Kino. - Today I go to the cinema.

The verb "hugs" whatever comes first!`,
    },
    {
      title: 'Word Order: Subordinate Clauses',
      content: `In subordinate clauses (with weil, obwohl, dass), the verb goes to the END:

Conjunctions:
• weil - because
• obwohl - although
• dass - that

Examples:
• Weil ich in England wohne, spreche ich Englisch.
  (Because I live in England, I speak English.)

• Obwohl er in Schottland wohnt, spricht er Deutsch.
  (Although he lives in Scotland, he speaks German.)

• Ich denke, dass ich sie dort sehe.
  (I think that I see her there.)`,
    },
    {
      title: 'Using "seit" (since/for)',
      content: `"Seit" + present tense describes ongoing actions:

• Ich studiere seit sechs Wochen Deutsch.
  (I have been studying German for six weeks.)

• Sie wohnt seit sieben Jahren in Genf.
  (She has been living in Geneva for seven years.)

• Er arbeitet seit zwei Monaten hier.
  (He has been working here for two months.)

Note: German uses present tense with "seit"!`,
    },
    {
      title: 'Nationalities (Masculine / Feminine)',
      content: `Nationalities have different forms for men and women:

Rule: Add -in for feminine (sometimes with changes)
• -er → -erin: Italiener → Italienerin
• -e → -in: Franzose → Französin, Brite → Britin

Examples:
• Deutschland: Deutscher / Deutsche
• England: Engländer / Engländerin
• Frankreich: Franzose / Französin
• USA: Amerikaner / Amerikanerin
• Schweiz: Schweizer (same for both!)

Usage: Ich bin Deutscher. / Ich bin Deutsche.`,
    },
    {
      title: 'Pronunciation: Umlauts (ä, ö, ü)',
      content: `Umlauts change vowel sounds:

• ä - like "e" in "bed"
  Examples: Mädchen, Bär, Engländer

• ö - like "i" in "bird" with rounded lips
  Examples: schön, München, Öl

• ü - say "ee" then round your lips
  Examples: Tschüss, München, zurück, über

Practice: schön (beautiful), Tür (door), fünf (five)`,
    },
    {
      title: 'Pronunciation: Special Consonants',
      content: `German consonants with special pronunciations:

• ch - soft sound after e, i: ich, nicht, Mädchen
• sch - like English "sh": schreiben, schön
• sp - "shp" at word start: sprechen, spielen
• st - "sht" at word start: Stadt, studieren
• tsch - like English "ch": Tschüss, Deutsch
• s - "z" sound at word start: Sie, sind, sehen
• ß - sharp "ss": heiße, Straße
• w - like English "v": Wiedersehen, wohnen
• v - like English "f": Vater, vier
• z - like "ts": zehn, zwei`,
    },
    {
      title: 'Question Words (W-Fragen)',
      content: `Common question words:

• Was? - What?
• Wer? - Who?
• Wo? - Where?
• Wann? - When?
• Wie? - How?
• Warum? - Why?
• Wie viel? - How much?
• Woher? - Where from?
• Welche? - Which?

Examples:
• Wie heißt du? - What's your name?
• Woher kommst du? - Where do you come from?
• Welche Sprachen sprichst du? - What languages do you speak?`,
    },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Grammar</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Essential German grammar lessons
        </p>
      </header>

      <div className="space-y-4">
        {grammarTopics.map((topic, index) => (
          <details
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
          >
            <summary className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="text-purple-500" size={24} />
                <h2 className="text-xl font-semibold">{topic.title}</h2>
              </div>
            </summary>
            <div className="px-6 pb-6">
              <pre className="whitespace-pre-wrap font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                {topic.content}
              </pre>
            </div>
          </details>
        ))}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="font-semibold mb-2">💡 Learning Tip</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Grammar is best learned through practice! Use the flashcards and quizzes to reinforce
          these concepts while building your vocabulary.
        </p>
      </div>
    </div>
  );
};

export default GrammarPage;
