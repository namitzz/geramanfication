import { BookOpen } from 'lucide-react';

const GrammarPage = () => {
  const grammarTopics = [
    {
      title: 'German Articles',
      content: `German nouns have three genders, each with its own article:
      
• der (masculine) - der Mann (the man), der Tisch (the table)
• die (feminine) - die Frau (the woman), die Tür (the door)
• das (neuter) - das Kind (the child), das Haus (the house)

Tip: Always learn nouns with their articles!`,
    },
    {
      title: 'Verb: sein (to be)',
      content: `Present tense conjugation:

• ich bin - I am
• du bist - you are (informal)
• er/sie/es ist - he/she/it is
• wir sind - we are
• ihr seid - you are (plural)
• sie/Sie sind - they/you are (formal)

Example: Ich bin müde. (I am tired.)`,
    },
    {
      title: 'Verb: haben (to have)',
      content: `Present tense conjugation:

• ich habe - I have
• du hast - you have (informal)
• er/sie/es hat - he/she/it has
• wir haben - we have
• ihr habt - you have (plural)
• sie/Sie haben - they/you have (formal)

Example: Ich habe ein Buch. (I have a book.)`,
    },
    {
      title: 'Regular Verbs',
      content: `Regular verbs follow a pattern. Example with "lernen" (to learn):

• ich lerne - I learn
• du lernst - you learn
• er/sie/es lernt - he/she/it learns
• wir lernen - we learn
• ihr lernt - you learn (plural)
• sie/Sie lernen - they/you learn (formal)

Other regular verbs: machen (to do), arbeiten (to work), wohnen (to live)`,
    },
    {
      title: 'Basic Word Order',
      content: `German word order in simple sentences:

Subject + Verb + Object

Examples:
• Ich trinke Wasser. (I drink water.)
• Sie lernt Deutsch. (She learns German.)
• Wir essen Brot. (We eat bread.)

The verb is always in the second position!`,
    },
    {
      title: 'Question Words',
      content: `Common question words (W-Fragen):

• Was? - What?
• Wer? - Who?
• Wo? - Where?
• Wann? - When?
• Wie? - How?
• Warum? - Why?
• Wie viel? - How much?

Example: Wo ist das Haus? (Where is the house?)`,
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
