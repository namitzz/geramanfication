/**
 * Phase 2 Learning Content - Daily Routines and Applied Usage
 * Structured written explanations extracted from slides and worksheets
 * 
 * Phase 2 Focus: Production over recognition
 * - Sentence building and correction
 * - Active recall exercises
 * - Grammar rules applied to daily-life contexts
 */

export interface Phase2Section {
  id: string;
  title: string;
  description: string;
  content: string;
  examples?: { de: string; en: string; note?: string }[];
  exercises?: { type: string; prompt: string; hints?: string[] }[];
}

// ============================================================
// 1. DAILY ROUTINE VOCABULARY (ALLTAGSROUTINE)
// ============================================================

export const dailyRoutineVocab: Phase2Section = {
  id: 'daily-routine-vocab',
  title: 'Daily Routine Vocabulary (Alltagsroutine)',
  description: 'Essential vocabulary for describing your daily routine in German',
  content: `Learning to describe your daily routine is a fundamental skill in German. This vocabulary builds on Phase 1 fundamentals and introduces you to real-world usage patterns.

**Key Time Expressions:**
- der Morgen (morning)
- der Vormittag (late morning/forenoon)
- der Mittag (noon/midday)
- der Nachmittag (afternoon)
- der Abend (evening)
- die Nacht (night)

**Essential Routine Verbs:**
These verbs are the building blocks of describing your day. Pay attention to which ones are separable, reflexive, or inseparable.

**Daily Activities:**
- frühstücken (to have breakfast)
- zu Mittag essen (to have lunch)
- zu Abend essen (to have dinner)
- arbeiten (to work)
- zur Arbeit gehen/fahren (to go to work)
- nach Hause kommen (to come home)
- kochen (to cook)
- essen (to eat)
- trinken (to drink)`,
  examples: [
    { de: 'Ich frühstücke jeden Morgen um sieben Uhr.', en: 'I have breakfast every morning at seven o\'clock.' },
    { de: 'Meine Morgenroutine beginnt um halb sieben.', en: 'My morning routine begins at half past six.' },
    { de: 'Am Abend koche ich Abendessen.', en: 'In the evening I cook dinner.' },
    { de: 'Nach der Arbeit gehe ich nach Hause.', en: 'After work I go home.' },
    { de: 'Am Wochenende schlafe ich länger.', en: 'On the weekend I sleep longer.' },
  ],
  exercises: [
    {
      type: 'sentence-building',
      prompt: 'Describe your morning routine using at least 4 activities. Include time expressions.',
      hints: ['Use aufstehen, sich waschen, frühstücken, zur Arbeit gehen', 'Include specific times: um 7 Uhr, um halb acht'],
    },
    {
      type: 'translation',
      prompt: 'Translate to German: "In the morning I get up at 6 o\'clock. Then I shower and get dressed. At 7:30 I have breakfast."',
    },
  ],
};

// ============================================================
// 2. SEPARABLE VS INSEPARABLE VERBS
// ============================================================

export const separableVsInseparableVerbs: Phase2Section = {
  id: 'separable-inseparable-verbs',
  title: 'Separable vs Inseparable Verbs',
  description: 'Understanding the crucial difference between separable and inseparable verb prefixes',
  content: `German verbs with prefixes fall into two categories, and knowing the difference is essential for proper sentence construction.

**SEPARABLE VERBS (Trennbare Verben)**

Separable verbs have stressed prefixes that separate from the verb stem in present tense sentences.

**Common Separable Prefixes:**
ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, weg-, zu-, zurück-

**How They Work:**
In main clauses (present tense), the prefix goes to the END of the sentence:
- Infinitive: aufstehen (to get up)
- Present: Ich stehe um 7 Uhr auf. (I get up at 7 o'clock.)

**INSEPARABLE VERBS (Untrennbare Verben)**

Inseparable verbs have unstressed prefixes that NEVER separate from the verb stem.

**Inseparable Prefixes (Always Together):**
be-, emp-, ent-, er-, ge-, miss-, ver-, zer-

**How They Work:**
The prefix stays attached to the verb:
- Infinitive: beginnen (to begin)
- Present: Ich beginne um 8 Uhr. (I begin at 8 o'clock.)
- Infinitive: verstehen (to understand)
- Present: Ich verstehe Deutsch. (I understand German.)

**KEY CONTRAST:**
Some verb stems can take BOTH separable and inseparable prefixes with different meanings:

stehen (to stand)
→ aufstehen (to get up) - SEPARABLE
→ verstehen (to understand) - INSEPARABLE

kommen (to come)
→ ankommen (to arrive) - SEPARABLE
→ bekommen (to receive/get) - INSEPARABLE

**MEMORY TIP:**
If you can stress the prefix when speaking, it's separable. If the prefix is unstressed, it's inseparable.`,
  examples: [
    { de: 'Ich stehe jeden Tag um 6 Uhr auf.', en: 'I get up every day at 6 o\'clock.', note: 'aufstehen - separable' },
    { de: 'Der Film beginnt um 20 Uhr.', en: 'The movie begins at 8 PM.', note: 'beginnen - inseparable' },
    { de: 'Wir kaufen im Supermarkt ein.', en: 'We shop in the supermarket.', note: 'einkaufen - separable' },
    { de: 'Sie verbringt viel Zeit zu Hause.', en: 'She spends a lot of time at home.', note: 'verbringen - inseparable' },
    { de: 'Kommst du mit?', en: 'Are you coming along?', note: 'mitkommen - separable, prefix at end even in questions' },
    { de: 'Er erklärt die Grammatik.', en: 'He explains the grammar.', note: 'erklären - inseparable' },
  ],
  exercises: [
    {
      type: 'identification',
      prompt: 'Identify whether these verbs are separable or inseparable: aufwachen, beenden, ausgehen, verstehen, zurückkommen, empfehlen',
    },
    {
      type: 'sentence-correction',
      prompt: 'Correct these sentences: 1) Ich aufstehe um 7 Uhr. 2) Der Unterricht befinnt um 9 Uhr. 3) Sie geht am Abend aus.',
      hints: ['Check verb position', 'Is the prefix separable or inseparable?'],
    },
    {
      type: 'practice',
      prompt: 'Write 3 sentences about your daily routine using separable verbs (aufstehen, einkaufen, fernsehen) and 2 sentences using inseparable verbs (beginnen, verbringen).',
    },
  ],
};

// ============================================================
// 3. REFLEXIVE VERBS
// ============================================================

export const reflexiveVerbs: Phase2Section = {
  id: 'reflexive-verbs',
  title: 'Reflexive Verbs (Reflexive Verben)',
  description: 'Verbs that refer back to the subject - essential for daily routine descriptions',
  content: `Reflexive verbs are verbs where the subject and object are the same person. In English we say "I wash myself," but in German reflexive verbs are much more common and often required.

**REFLEXIVE PRONOUNS (Akkusativ):**

- ich → mich (myself)
- du → dich (yourself)
- er/sie/es → sich (himself/herself/itself)
- wir → uns (ourselves)
- ihr → euch (yourselves)
- sie/Sie → sich (themselves/yourself formal)

**COMMON REFLEXIVE VERBS IN DAILY ROUTINES:**

**Mandatory Reflexive (must use reflexive pronoun):**
- sich waschen (to wash oneself)
- sich anziehen (to get dressed)
- sich ausziehen (to get undressed)
- sich duschen (to shower)
- sich kämmen (to comb one's hair)
- sich rasieren (to shave)
- sich schminken (to put on makeup)
- sich beeilen (to hurry)
- sich entspannen (to relax)
- sich freuen (to be happy/look forward to)

**Special Case: Dative Reflexive Pronouns**
Some reflexive verbs use DATIVE reflexive pronouns, especially with body parts:

Dative pronouns: mir, dir, sich, uns, euch, sich

Example: sich die Zähne putzen (to brush one's teeth)
→ Ich putze mir die Zähne. (I brush my teeth.)

**WORD ORDER WITH REFLEXIVE VERBS:**

The reflexive pronoun typically comes right after the conjugated verb:
- Ich wasche mich jeden Morgen. (I wash myself every morning.)
- Du ziehst dich schnell an. (You get dressed quickly.)

**REFLEXIVE + SEPARABLE:**
Some verbs are BOTH reflexive AND separable. The reflexive pronoun comes after the conjugated verb, and the prefix goes to the end:

- sich anziehen → Ich ziehe mich an. (I get dressed.)
- sich ausziehen → Er zieht sich aus. (He gets undressed.)

**MEMORY TIP:**
If an action is done to yourself (washing yourself, dressing yourself), you probably need a reflexive verb in German.`,
  examples: [
    { de: 'Ich wasche mich jeden Morgen.', en: 'I wash (myself) every morning.', note: 'Mandatory reflexive' },
    { de: 'Er zieht sich schnell an.', en: 'He gets dressed quickly.', note: 'Reflexive + separable verb' },
    { de: 'Wir entspannen uns am Wochenende.', en: 'We relax on the weekend.', note: 'uns = ourselves' },
    { de: 'Sie beeilt sich, weil sie spät ist.', en: 'She hurries because she is late.', note: 'sich with she' },
    { de: 'Ich putze mir die Zähne zweimal am Tag.', en: 'I brush my teeth twice a day.', note: 'Dative reflexive with body part' },
    { de: 'Du kämmst dich vor dem Spiegel.', en: 'You comb your hair in front of the mirror.', note: 'dich = yourself' },
  ],
  exercises: [
    {
      type: 'conjugation',
      prompt: 'Conjugate "sich waschen" for all persons (ich, du, er/sie, wir, ihr, sie/Sie)',
    },
    {
      type: 'fill-in',
      prompt: 'Complete with correct reflexive pronoun: 1) Ich ziehe ___ an. 2) Du wäschst ___ . 3) Er beeilt ___. 4) Wir entspannen ___. 5) Ihr putzt ___ die Zähne.',
    },
    {
      type: 'sentence-building',
      prompt: 'Describe your morning routine using at least 5 reflexive verbs.',
      hints: ['sich waschen, sich anziehen, sich die Zähne putzen, sich kämmen, sich beeilen'],
    },
  ],
};

// ============================================================
// 4. TIME EXPRESSIONS
// ============================================================

export const timeExpressions: Phase2Section = {
  id: 'time-expressions',
  title: 'Time Expressions (Zeitausdrücke)',
  description: 'How to tell time in German: um, halb, Viertel, and 12h vs 24h formats',
  content: `Germans use both 12-hour and 24-hour time formats, but the 24-hour clock is more common in formal contexts (train schedules, business hours, TV programs).

**ASKING FOR TIME:**
- Wie viel Uhr ist es? (What time is it?)
- Wie spät ist es? (How late is it? / What time is it?)
- Um wie viel Uhr? (At what time?)

**BASIC TIME (on the hour):**
- Es ist ein Uhr. (It is one o'clock.) - 1:00
- Es ist acht Uhr. (It is eight o'clock.) - 8:00
- Es ist zwanzig Uhr. (It is twenty o'clock.) - 20:00 (8 PM)

**HALF HOUR - HALB:**
⚠️ IMPORTANT: German counts FORWARD to the next hour!

- Es ist halb neun. (It is half [to] nine.) = 8:30 (NOT 9:30!)
- Es ist halb sieben. (It is half [to] seven.) = 6:30
- Es ist halb eins. (It is half [to] one.) = 12:30

Think: "halfway to nine" = 8:30

**QUARTER HOURS - VIERTEL:**

Viertel nach (quarter past):
- Es ist Viertel nach acht. = 8:15
- Es ist Viertel nach drei. = 3:15

Viertel vor (quarter to):
- Es ist Viertel vor neun. = 8:45
- Es ist Viertel vor zwei. = 1:45

**MINUTES:**

nach (past/after):
- Es ist fünf nach acht. = 8:05
- Es ist zehn nach sieben. = 7:10
- Es ist zwanzig nach vier. = 4:20

vor (to/before):
- Es ist fünf vor neun. = 8:55
- Es ist zehn vor zwei. = 1:50
- Es ist zwanzig vor elf. = 10:40

**24-HOUR FORMAT:**
Very straightforward - just state the hours and minutes:
- 08:00 Uhr - acht Uhr (8 AM)
- 14:30 Uhr - vierzehn Uhr dreißig (2:30 PM)
- 20:15 Uhr - zwanzig Uhr fünfzehn (8:15 PM)
- 23:45 Uhr - dreiundzwanzig Uhr fünfundvierzig (11:45 PM)

**PREPOSITION "UM" (at):**
Use "um" to say "at" a specific time:
- Ich stehe um 7 Uhr auf. (I get up at 7 o'clock.)
- Der Film beginnt um halb neun. (The movie begins at 8:30.)
- Wir essen um 18 Uhr. (We eat at 6 PM / 18:00.)

**TIME OF DAY EXPRESSIONS:**
- am Morgen (in the morning) - approximately 5-10 AM
- am Vormittag (in the late morning) - approximately 10-12 AM
- am Mittag (at noon) - around 12 PM
- am Nachmittag (in the afternoon) - approximately 12-6 PM
- am Abend (in the evening) - approximately 6-10 PM
- in der Nacht (at night) - approximately 10 PM-5 AM`,
  examples: [
    { de: 'Es ist halb acht.', en: 'It is 7:30 (half to eight).', note: 'Remember: halb counts forward!' },
    { de: 'Ich stehe um Viertel nach sechs auf.', en: 'I get up at quarter past six (6:15).', note: 'Viertel nach = quarter past' },
    { de: 'Der Zug fährt um Viertel vor neun ab.', en: 'The train departs at quarter to nine (8:45).', note: 'Viertel vor = quarter to' },
    { de: 'Die Besprechung beginnt um 14 Uhr.', en: 'The meeting begins at 2 PM (14:00).', note: '24-hour format' },
    { de: 'Ich esse am Abend um halb sieben.', en: 'I eat in the evening at 6:30.', note: 'Combining time of day + specific time' },
    { de: 'Es ist zehn vor acht.', en: 'It is 7:50 (ten to eight).', note: 'vor = minutes before the hour' },
  ],
  exercises: [
    {
      type: 'time-practice',
      prompt: 'Write in German: 1) 8:30, 2) 7:15, 3) 9:45, 4) 6:50, 5) 14:30',
      hints: ['Remember halb counts forward!', 'Use Viertel nach/vor for :15 and :45'],
    },
    {
      type: 'sentence-building',
      prompt: 'Write 5 sentences describing your daily schedule with specific times using "um".',
      hints: ['Ich stehe um... auf', 'Ich esse um... Frühstück', 'Ich gehe um... zur Arbeit'],
    },
    {
      type: 'translation',
      prompt: 'Translate to German: "I wake up at 6:30. I leave the house at quarter to eight. I arrive at work at 8:15. I go home at 5:30 PM."',
    },
  ],
};

// ============================================================
// 5. WOHIN (AKKUSATIV) VS WO (DATIV)
// ============================================================

export const wohinVsWo: Phase2Section = {
  id: 'wohin-wo',
  title: 'Wohin (Akkusativ) vs Wo (Dativ)',
  description: 'Understanding direction (where to?) vs location (where?)',
  content: `One of the most important distinctions in German is between motion/direction and static location. This affects which case you use.

**WO? (Where?) - LOCATION (Dativ)**
Use "wo" when asking about a location where someone/something IS (no movement):
- Wo bist du? (Where are you?)
- Wo wohnst du? (Where do you live?)
- Wo ist das Buch? (Where is the book?)

**WOHIN? (Where to?) - DIRECTION (Akkusativ)**
Use "wohin" when asking about direction/destination (movement toward):
- Wohin gehst du? (Where are you going [to]?)
- Wohin fährst du? (Where are you driving [to]?)
- Wohin stellst du das Buch? (Where are you putting the book?)

**TWO-WAY PREPOSITIONS (Wechselpräpositionen):**
These prepositions can take either Dative (location) or Akkusativ (direction):

in, an, auf, über, unter, vor, hinter, neben, zwischen

**LOCATION (Dativ) - WO?**
- in dem = im
- Ich bin im Haus. (I am in the house.) - LOCATION
- Das Buch liegt auf dem Tisch. (The book is lying on the table.) - LOCATION
- Sie steht vor der Tür. (She is standing in front of the door.) - LOCATION

**DIRECTION (Akkusativ) - WOHIN?**
- in das = ins
- Ich gehe ins Haus. (I am going into the house.) - DIRECTION
- Ich lege das Buch auf den Tisch. (I am putting the book on the table.) - DIRECTION
- Sie geht vor die Tür. (She is going in front of the door.) - DIRECTION

**KEY VERB PAIRS:**
Some verb pairs help distinguish location vs direction:

LOCATION (Wo? + Dativ):
- liegen (to lie/be lying)
- stehen (to stand/be standing)
- sitzen (to sit/be sitting)
- hängen (to hang/be hanging)

DIRECTION (Wohin? + Akkusativ):
- legen (to lay/put down)
- stellen (to place/put standing)
- setzen (to set/put sitting)
- hängen (to hang up)

**COMMON EXPRESSIONS:**

With WO (Location):
- zu Hause (at home) - Ich bin zu Hause.
- im Büro (in the office) - Er arbeitet im Büro.
- in der Schule (at school) - Die Kinder sind in der Schule.

With WOHIN (Direction):
- nach Hause (home/homeward) - Ich gehe nach Hause.
- ins Büro (to the office) - Er fährt ins Büro.
- in die Schule (to school) - Die Kinder gehen in die Schule.

**SPECIAL CASE:**
- nach (always Dativ) - for cities and countries: nach Berlin, nach Deutschland
- zu (always Dativ) - for people and places: zum Arzt (to the doctor), zur Arbeit (to work)`,
  examples: [
    { de: 'Wo bist du? - Ich bin im Park.', en: 'Where are you? - I am in the park.', note: 'Location - Dativ' },
    { de: 'Wohin gehst du? - Ich gehe in den Park.', en: 'Where are you going? - I am going to the park.', note: 'Direction - Akkusativ' },
    { de: 'Das Buch liegt auf dem Tisch.', en: 'The book is (lying) on the table.', note: 'liegen + Wo + Dativ' },
    { de: 'Ich lege das Buch auf den Tisch.', en: 'I put the book on the table.', note: 'legen + Wohin + Akkusativ' },
    { de: 'Ich bin zu Hause.', en: 'I am at home.', note: 'Location - zu Hause (fixed expression)' },
    { de: 'Ich gehe nach Hause.', en: 'I am going home.', note: 'Direction - nach Hause (fixed expression)' },
    { de: 'Sie steht vor der Schule.', en: 'She is standing in front of the school.', note: 'stehen + Wo + Dativ (die Schule)' },
    { de: 'Sie geht vor die Schule.', en: 'She is going in front of the school.', note: 'gehen + Wohin + Akkusativ' },
  ],
  exercises: [
    {
      type: 'identification',
      prompt: 'For each sentence, identify if it shows location (Wo/Dativ) or direction (Wohin/Akkusativ): 1) Ich gehe ins Kino. 2) Das Auto steht in der Garage. 3) Sie fährt in die Stadt. 4) Er sitzt auf dem Sofa.',
    },
    {
      type: 'fill-in',
      prompt: 'Complete with correct article (der/das/die → dem/den): 1) Ich gehe in ___ Schule. (die) 2) Das Buch ist in ___ Tasche. (die) 3) Wir fahren in ___ Park. (der) 4) Sie sitzt auf ___ Stuhl. (der)',
      hints: ['Direction = Akkusativ (die/den)', 'Location = Dativ (der/dem, die→der, das→dem)'],
    },
    {
      type: 'sentence-building',
      prompt: 'Write 3 sentences describing where things are (Wo + Dativ) and 3 sentences describing where you are going (Wohin + Akkusativ).',
    },
  ],
};

// ============================================================
// 6. READING TASK: HERR IHßEN
// ============================================================

export const herrIhssenReading: Phase2Section = {
  id: 'herr-ihssen-reading',
  title: 'Reading: Herr Ihßen – Ein Tag im Leben eines Journalisten',
  description: 'Reading comprehension task with daily routine in context',
  content: `Read the following text about Herr Ihßen's day and notice how separable verbs, reflexive verbs, and time expressions are used in context.

**Text: Ein Tag im Leben von Herrn Ihßen**

Herr Ihßen ist Journalist und arbeitet für eine große Zeitung in Hamburg. Sein Tag beginnt früh.

Er wacht jeden Morgen um 6 Uhr auf. Zuerst bleibt er noch fünf Minuten im Bett liegen, dann steht er auf. Er geht ins Badezimmer und duscht sich. Danach rasiert er sich und zieht sich an. Um halb sieben ist er fertig.

Zum Frühstück trinkt er einen Kaffee und isst ein Brötchen. Er liest dabei die Zeitung und überprüft seine E-Mails auf dem Handy. Um Viertel nach sieben verlässt er die Wohnung.

Er fährt mit der U-Bahn zur Arbeit. Die Fahrt dauert 20 Minuten. Um Viertel vor acht kommt er im Büro an. Er begrüßt seine Kollegen und macht sich einen Kaffee.

Der Arbeitstag beginnt um 8 Uhr mit einer Redaktionssitzung. Herr Ihßen und seine Kollegen besprechen die Themen des Tages. Dann schreibt er Artikel, führt Interviews und recherchiert für neue Geschichten.

Um 12 Uhr macht er Mittagspause. Er geht mit Kollegen in die Kantine oder kauft sich ein Sandwich. Nach der Pause arbeitet er weiter bis 17 Uhr.

Auf dem Heimweg kauft er im Supermarkt ein. Er braucht Brot, Milch und Gemüse. Um 18 Uhr kommt er zu Hause an.

Am Abend kocht er Abendessen und entspannt sich. Er sieht fern oder liest ein Buch. Manchmal trifft er sich mit Freunden. Um 23 Uhr geht er ins Bett und schläft schnell ein.

**Vocabulary Help:**
- die Zeitung (newspaper)
- zuerst (first)
- danach (after that)
- dabei (while doing so)
- überprüfen (to check)
- verlassen (to leave)
- die U-Bahn (subway)
- dauern (to last/take time)
- begrüßen (to greet)
- die Redaktionssitzung (editorial meeting)
- besprechen (to discuss)
- führen (to conduct)
- recherchieren (to research)
- die Geschichte (story)
- die Kantine (cafeteria)
- weiterarbeiten (to continue working)
- auf dem Heimweg (on the way home)
- sich treffen (to meet up)`,
  examples: [],
  exercises: [
    {
      type: 'comprehension',
      prompt: 'Answer these questions in German: 1) Um wie viel Uhr wacht Herr Ihßen auf? 2) Wie fährt er zur Arbeit? 3) Wann beginnt der Arbeitstag? 4) Was macht er in der Mittagspause? 5) Um wie viel Uhr kommt er nach Hause?',
    },
    {
      type: 'verb-identification',
      prompt: 'Find and list: a) 5 separable verbs from the text, b) 3 reflexive verbs, c) 3 inseparable verbs',
      hints: ['Separable: aufwachen, aufstehen...', 'Reflexive: sich duschen, sich rasieren...', 'Inseparable: beginnen, besprechen...'],
    },
    {
      type: 'time-expressions',
      prompt: 'List all time expressions from the text and write them in both 12h and 24h formats.',
    },
    {
      type: 'writing',
      prompt: 'Write a similar paragraph about your own day. Use at least: 3 separable verbs, 2 reflexive verbs, 5 time expressions.',
    },
  ],
};

// ============================================================
// 7. RETRIEVAL PRACTICE QUESTIONS
// ============================================================

export const retrievalPractice: Phase2Section = {
  id: 'retrieval-practice',
  title: 'Retrieval Practice – Tägliche Routine',
  description: 'Active recall exercises to strengthen memory and application',
  content: `Practice retrieving information from memory. Don't look at your notes first - try to answer from memory, then check your answers.

**CATEGORY 1: Verb Classification**
Without looking at notes, classify these verbs as: Separable (S), Inseparable (I), or Reflexive (R). Some may have multiple categories.

1. aufstehen
2. beginnen
3. sich waschen
4. einkaufen
5. verstehen
6. sich anziehen
7. verbringen
8. aufwachen
9. sich beeilen
10. erkären

**CATEGORY 2: Time Recall**
Write what time it is in German (use conversational format, not 24h):

1. 7:30
2. 8:15
3. 9:45
4. 12:30
5. 6:50

**CATEGORY 3: Conjugation Recall**
Conjugate these verbs in present tense for "ich":

1. aufstehen (to get up)
2. sich waschen (to wash oneself)
3. beginnen (to begin)
4. einkaufen (to shop)
5. sich anziehen (to get dressed)

**CATEGORY 4: Case Selection**
Choose Akkusativ or Dativ and explain why:

1. Ich gehe ___ den/dem Park.
2. Das Buch liegt ___ den/dem Tisch.
3. Sie fährt ___ die/der Stadt.
4. Er sitzt ___ das/dem Sofa.

**CATEGORY 5: Sentence Building from Prompts**
Create complete German sentences:

1. You get up at 6:30.
2. He showers every morning.
3. We go shopping in the afternoon.
4. The book is on the table.
5. I am going to the supermarket.

**CATEGORY 6: Error Detection**
Find and correct the errors in these sentences:

1. Ich aufstehe um 7 Uhr.
2. Er wascht jeden Morgen.
3. Wir gehen in dem Park. (direction intended)
4. Es ist halb zehn. (meaning 9:30)
5. Sie beeilt.

**CATEGORY 7: Translation Challenge**
Translate these sentences to German:

1. I wake up at 7 o'clock and get up immediately.
2. She gets dressed quickly because she is late.
3. We are going to the cinema. (use ins Kino)
4. The cat is lying on the sofa.
5. At 8:30 I eat breakfast.`,
  examples: [],
  exercises: [
    {
      type: 'self-test',
      prompt: 'Complete all 7 categories without looking at your notes. Check your answers afterward and identify weak areas.',
    },
    {
      type: 'spaced-repetition',
      prompt: 'Review your errors daily for the next 3 days. Focus on patterns, not memorizing individual answers.',
    },
  ],
};

// ============================================================
// 8. WRITING PROMPTS & SENTENCE CORRECTION
// ============================================================

export const writingPrompts: Phase2Section = {
  id: 'writing-prompts',
  title: 'Writing Prompts & Sentence Correction',
  description: 'Production tasks to actively use Phase 2 grammar and vocabulary',
  content: `These writing prompts move you from recognition to production - the key to fluency.

**WRITING PROMPT 1: Meine Alltagsroutine (My Daily Routine)**

Write a paragraph (8-10 sentences) describing your typical weekday routine. Include:
- At least 3 separable verbs
- At least 2 reflexive verbs  
- At least 5 specific time expressions
- Use both "um" (at) and time-of-day expressions (am Morgen, am Abend, etc.)

Example start: "Ich wache jeden Morgen um halb sieben auf. Zuerst..."

**WRITING PROMPT 2: Ein besonderer Tag (A Special Day)**

Describe a special day (birthday, weekend, holiday). Minimum 6 sentences with:
- What you did (past events, but use present tense for practice)
- Where you went (practice Wohin + Akkusativ)
- Where you were (practice Wo + Dativ)

**WRITING PROMPT 3: Vergleich - Wochentag vs Wochenende**
(Comparison - Weekday vs Weekend)

Write two short paragraphs comparing your weekday routine to your weekend routine. Use:
- "Am Wochentag..." (On weekdays...)
- "Am Wochenende..." (On the weekend...)
- Highlight the differences in times, activities, and places

**SENTENCE CORRECTION EXERCISES:**

Correct the errors in these sentences. Each sentence has 1-2 errors.

1. Ich stehe auf um 7 Uhr jeden Tag.
2. Er sich wäscht im Badezimmer.
3. Wir gehen in dem Supermarkt. (direction - we are going to)
4. Sie beginnt die Arbeit um halb neun. (meaning 8:30)
5. Das Buch ist auf den Tisch. (location - book is on the table)
6. Ich mich ziehe schnell an.
7. Er aufwacht um 6 Uhr.
8. Es ist halb elf. (trying to say 10:30)
9. Ich gehe nach dem Park.
10. Sie kauft im Supermarkt ein. (word order issue - which is correct?)

**ADVANCED CHALLENGE:**

Write a dialogue between two friends comparing their daily routines. Include:
- Questions: "Um wie viel Uhr stehst du auf?"
- Separable verbs: "Ich stehe um... auf."
- Reflexive verbs: "Ich dusche mich..."
- Location and direction: "Ich gehe zur Arbeit / Ich bin im Büro"
- At least 10 exchanges (5 per person)`,
  examples: [
    { de: 'Ich wache um 6 Uhr auf und stehe sofort auf.', en: 'I wake up at 6 o\'clock and get up immediately.', note: 'Two separable verbs with time' },
    { de: 'Dann gehe ich ins Badezimmer und dusche mich.', en: 'Then I go into the bathroom and shower.', note: 'Direction (ins) + reflexive verb' },
    { de: 'Nach dem Frühstück fahre ich zur Arbeit.', en: 'After breakfast I drive to work.', note: 'zur = zu + der (Dativ)' },
  ],
  exercises: [
    {
      type: 'paragraph-writing',
      prompt: 'Complete Writing Prompt 1 (Meine Alltagsroutine). Aim for 10 sentences.',
      hints: ['Start with waking up', 'Include morning routine', 'Mention work/school', 'Describe evening', 'End with bedtime'],
    },
    {
      type: 'correction',
      prompt: 'Correct all 10 sentences in the Sentence Correction section. Explain what was wrong.',
    },
    {
      type: 'dialogue',
      prompt: 'Write the dialogue described in Advanced Challenge (10 exchanges minimum).',
    },
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
  retrievalPractice,
  writingPrompts,
];

export default allPhase2Sections;
