import type { Topic } from "../types";
import { bankFill, bankMCQ } from "./utils";

// ---------- Grades 1-2 ----------

const OPPOSITES: [string, string][] = [
  ["hot", "cold"],
  ["big", "small"],
  ["up", "down"],
  ["fast", "slow"],
  ["happy", "sad"],
  ["open", "closed"],
  ["day", "night"],
  ["wet", "dry"],
  ["in", "out"],
  ["full", "empty"],
  ["old", "new"],
  ["light", "dark"],
  ["loud", "quiet"],
  ["clean", "dirty"],
  ["hard", "soft"],
];

function opposites(): Topic {
  const items = OPPOSITES.flatMap(([a, b]) => [
    { prompt: `What is the opposite of "${a}"?`, answer: b },
    { prompt: `What is the opposite of "${b}"?`, answer: a },
  ]);
  return bankMCQ("opposites", "Opposites", items);
}

const PLURALS: [string, string][] = [
  ["cat", "cats"],
  ["dog", "dogs"],
  ["book", "books"],
  ["box", "boxes"],
  ["brush", "brushes"],
  ["glass", "glasses"],
  ["baby", "babies"],
  ["city", "cities"],
  ["leaf", "leaves"],
  ["child", "children"],
  ["mouse", "mice"],
  ["foot", "feet"],
  ["bus", "buses"],
  ["fox", "foxes"],
];

function plurals(): Topic {
  const items = PLURALS.map(([word, plural]) => ({
    prompt: `What is the plural of "${word}"?`,
    answer: plural,
  }));
  return bankFill("plurals", "Plurals", items);
}

const RHYMES: { word: string; rhyme: string }[] = [
  { word: "cat", rhyme: "hat" },
  { word: "dog", rhyme: "log" },
  { word: "sun", rhyme: "fun" },
  { word: "tree", rhyme: "bee" },
  { word: "car", rhyme: "star" },
  { word: "ball", rhyme: "wall" },
  { word: "cake", rhyme: "lake" },
  { word: "frog", rhyme: "jog" },
  { word: "boat", rhyme: "coat" },
  { word: "bug", rhyme: "rug" },
];

function rhymingWords(): Topic {
  const items = RHYMES.map((r) => ({ prompt: `Which word rhymes with "${r.word}"?`, answer: r.rhyme }));
  return bankMCQ("rhyming-words", "Rhyming words", items, RHYMES.map((r) => r.rhyme));
}

const PUNCTUATION_BASIC: [string, string][] = [
  ["the cat is sleeping", "The cat is sleeping."],
  ["where is my bag", "Where is my bag?"],
  ["i like ice cream", "I like ice cream."],
  ["can you help me", "Can you help me?"],
  ["my dog is brown", "My dog is brown."],
  ["what a great day", "What a great day!"],
  ["we went to the park", "We went to the park."],
  ["is it raining", "Is it raining?"],
  ["she has a red bike", "She has a red bike."],
  ["stop right there", "Stop right there!"],
];

function punctuationBasic(): Topic {
  const items = PUNCTUATION_BASIC.map(([broken, fixed]) => ({
    prompt: `Rewrite this sentence correctly: "${broken}"`,
    answer: fixed,
  }));
  return bankFill("punctuation-basic", "Capital letters and punctuation", items);
}

const NOUN_VERB_SENTENCES: { sentence: string; word: string; pos: "noun" | "verb" }[] = [
  { sentence: "The dog runs fast.", word: "runs", pos: "verb" },
  { sentence: "The dog runs fast.", word: "dog", pos: "noun" },
  { sentence: "She reads a book.", word: "book", pos: "noun" },
  { sentence: "She reads a book.", word: "reads", pos: "verb" },
  { sentence: "The bird flies high.", word: "flies", pos: "verb" },
  { sentence: "The bird flies high.", word: "bird", pos: "noun" },
  { sentence: "He kicks the ball.", word: "ball", pos: "noun" },
  { sentence: "He kicks the ball.", word: "kicks", pos: "verb" },
  { sentence: "The children play outside.", word: "play", pos: "verb" },
  { sentence: "The children play outside.", word: "children", pos: "noun" },
];

function nounsAndVerbs(): Topic {
  const items = NOUN_VERB_SENTENCES.map((s) => ({
    prompt: `In the sentence "${s.sentence}" is the word "${s.word}" a noun or a verb?`,
    answer: s.pos,
  }));
  return bankMCQ("nouns-verbs", "Nouns and verbs", items, ["noun", "verb"]);
}

// ---------- Grades 3-4 ----------

const SYNONYMS_EASY: [string, string][] = [
  ["happy", "joyful"],
  ["big", "large"],
  ["small", "tiny"],
  ["fast", "quick"],
  ["smart", "clever"],
  ["sad", "unhappy"],
  ["angry", "mad"],
  ["pretty", "beautiful"],
  ["scared", "afraid"],
  ["tired", "sleepy"],
  ["begin", "start"],
  ["end", "finish"],
];

function synonymsEasy(): Topic {
  const items = SYNONYMS_EASY.map(([word, syn]) => ({
    prompt: `Which word means the same as "${word}"?`,
    answer: syn,
  }));
  return bankMCQ("synonyms-easy", "Synonyms", items, SYNONYMS_EASY.map((s) => s[1]));
}

const ANTONYMS_MID: [string, string][] = [
  ["ancient", "modern"],
  ["generous", "stingy"],
  ["polite", "rude"],
  ["brave", "cowardly"],
  ["victory", "defeat"],
  ["arrive", "depart"],
  ["increase", "decrease"],
  ["genuine", "fake"],
  ["permit", "forbid"],
  ["expand", "shrink"],
];

function antonymsMid(): Topic {
  const items = ANTONYMS_MID.map(([word, ant]) => ({
    prompt: `Which word is the opposite of "${word}"?`,
    answer: ant,
  }));
  return bankMCQ("antonyms-mid", "Antonyms", items, ANTONYMS_MID.map((s) => s[1]));
}

const CONTRACTIONS: [string, string][] = [
  ["do not", "don't"],
  ["cannot", "can't"],
  ["will not", "won't"],
  ["I am", "I'm"],
  ["they are", "they're"],
  ["we will", "we'll"],
  ["is not", "isn't"],
  ["did not", "didn't"],
  ["you are", "you're"],
  ["should not", "shouldn't"],
];

function contractions(): Topic {
  const items = CONTRACTIONS.map(([words, contraction]) => ({
    prompt: `What is the contraction for "${words}"?`,
    answer: contraction,
  }));
  return bankFill("contractions", "Contractions", items);
}

const PUNCTUATION_MID: [string, string][] = [
  ["my favourite fruits are apples oranges and grapes", "My favourite fruits are apples, oranges, and grapes."],
  ["thats jasons bike", "That's Jason's bike."],
  ["after school we went to the library", "After school, we went to the library."],
  ["yes i would love to come", "Yes, I would love to come."],
  ["the dogs bone was buried in the yard", "The dog's bone was buried in the yard."],
  ["well i suppose we could try", "Well, I suppose we could try."],
  ["my sisters name is emma", "My sister's name is Emma."],
  ["on saturday we visited nan and pop", "On Saturday, we visited Nan and Pop."],
];

function punctuationMid(): Topic {
  const items = PUNCTUATION_MID.map(([broken, fixed]) => ({
    prompt: `Rewrite this sentence with correct punctuation: "${broken}"`,
    answer: fixed,
  }));
  return bankFill("punctuation-mid", "Punctuation practice", items);
}

const PARTS_OF_SPEECH: { sentence: string; word: string; pos: "noun" | "verb" | "adjective" }[] = [
  { sentence: "The tall boy jumped over the fence.", word: "tall", pos: "adjective" },
  { sentence: "The tall boy jumped over the fence.", word: "jumped", pos: "verb" },
  { sentence: "The tall boy jumped over the fence.", word: "fence", pos: "noun" },
  { sentence: "A bright light filled the dark room.", word: "bright", pos: "adjective" },
  { sentence: "A bright light filled the dark room.", word: "filled", pos: "verb" },
  { sentence: "A bright light filled the dark room.", word: "room", pos: "noun" },
  { sentence: "The old man walked slowly to the shiny car.", word: "old", pos: "adjective" },
  { sentence: "The old man walked slowly to the shiny car.", word: "walked", pos: "verb" },
  { sentence: "The old man walked slowly to the shiny car.", word: "shiny", pos: "adjective" },
];

function partsOfSpeech(): Topic {
  const items = PARTS_OF_SPEECH.map((s) => ({
    prompt: `In "${s.sentence}", what part of speech is "${s.word}"?`,
    answer: s.pos,
  }));
  return bankMCQ("parts-of-speech", "Parts of speech", items, ["noun", "verb", "adjective"]);
}

// ---------- Grades 5-6 ----------

const VERB_TENSES: [string, string][] = [
  ["go", "went"],
  ["run", "ran"],
  ["eat", "ate"],
  ["see", "saw"],
  ["write", "wrote"],
  ["speak", "spoke"],
  ["take", "took"],
  ["give", "gave"],
  ["begin", "began"],
  ["swim", "swam"],
  ["walk", "walked"],
  ["jump", "jumped"],
  ["laugh", "laughed"],
  ["carry", "carried"],
  ["fly", "flew"],
];

function verbTenses(): Topic {
  const items = VERB_TENSES.map(([present, past]) => ({
    prompt: `What is the past tense of "${present}"?`,
    answer: past,
  }));
  return bankFill("verb-tenses", "Verb tenses", items);
}

const FIGURATIVE_LANGUAGE: { sentence: string; technique: string }[] = [
  { sentence: "The stars danced in the sky.", technique: "personification" },
  { sentence: "Her smile was as bright as the sun.", technique: "simile" },
  { sentence: "He is a couch potato.", technique: "metaphor" },
  { sentence: "I've told you a million times.", technique: "hyperbole" },
  { sentence: "Peter Piper picked a peck of pickled peppers.", technique: "alliteration" },
  { sentence: "The wind whispered through the trees.", technique: "personification" },
  { sentence: "Life is a rollercoaster.", technique: "metaphor" },
  { sentence: "She was as brave as a lion.", technique: "simile" },
  { sentence: "The bees buzzed busily by the blossoms.", technique: "alliteration" },
  { sentence: "I'm so hungry I could eat a horse.", technique: "hyperbole" },
];

function figurativeLanguage(): Topic {
  const items = FIGURATIVE_LANGUAGE.map((f) => ({
    prompt: `Which technique is used in: "${f.sentence}"?`,
    answer: f.technique,
  }));
  return bankMCQ("figurative-language", "Figurative language", items, [
    "personification",
    "simile",
    "metaphor",
    "hyperbole",
    "alliteration",
  ]);
}

const HOMOPHONES: { sentence: string; answer: string; distractors: string[] }[] = [
  { sentence: "___ going to the shop later.", answer: "They're", distractors: ["There", "Their"] },
  { sentence: "Put the book over ___.", answer: "there", distractors: ["their", "they're"] },
  { sentence: "That is ___ house.", answer: "their", distractors: ["there", "they're"] },
  { sentence: "I can ___ the music from here.", answer: "hear", distractors: ["here"] },
  { sentence: "Come over ___, please.", answer: "here", distractors: ["hear"] },
  { sentence: "The knight rode his ___ into battle.", answer: "horse", distractors: ["hoarse"] },
  { sentence: "My voice is ___ from shouting.", answer: "hoarse", distractors: ["horse"] },
  { sentence: "She wore a new ___ to the party.", answer: "dress", distractors: [] },
  { sentence: "Please ___ the door.", answer: "close", distractors: ["clothes"] },
  { sentence: "I bought new ___ for winter.", answer: "clothes", distractors: ["close"] },
];

function homophones(): Topic {
  const items = HOMOPHONES.filter((h) => h.distractors.length > 0).map((h) => ({
    prompt: `Choose the correct word: "${h.sentence}"`,
    answer: h.answer,
    distractors: h.distractors,
  }));
  return {
    id: "homophones",
    label: "Homophones",
    generate: () => {
      const item = items[Math.floor(Math.random() * items.length)];
      const options = [item.answer, ...item.distractors].sort(() => Math.random() - 0.5);
      return { prompt: item.prompt, answer: item.answer, options };
    },
  };
}

const PREFIXES: { word: string; prefix: string; meaning: string }[] = [
  { word: "unhappy", prefix: "un-", meaning: "not" },
  { word: "rewrite", prefix: "re-", meaning: "again" },
  { word: "disagree", prefix: "dis-", meaning: "not / opposite of" },
  { word: "preheat", prefix: "pre-", meaning: "before" },
  { word: "misspell", prefix: "mis-", meaning: "wrongly" },
  { word: "impossible", prefix: "im-", meaning: "not" },
  { word: "nonsense", prefix: "non-", meaning: "not" },
  { word: "overeat", prefix: "over-", meaning: "too much" },
  { word: "submarine", prefix: "sub-", meaning: "under" },
  { word: "bicycle", prefix: "bi-", meaning: "two" },
];

function prefixMeanings(): Topic {
  const items = PREFIXES.map((p) => ({
    prompt: `What does the prefix "${p.prefix}" mean in the word "${p.word}"?`,
    answer: p.meaning,
  }));
  return bankFill("prefixes", "Prefixes", items);
}

// ---------- Grades 7-8 ----------

const ACTIVE_PASSIVE: [string, string][] = [
  ["The chef cooked the meal.", "The meal was cooked by the chef."],
  ["The teacher graded the tests.", "The tests were graded by the teacher."],
  ["Lightning struck the tree.", "The tree was struck by lightning."],
  ["The company launched a new product.", "A new product was launched by the company."],
  ["The dog chased the cat.", "The cat was chased by the dog."],
  ["The artist painted the mural.", "The mural was painted by the artist."],
  ["The storm damaged the roof.", "The roof was damaged by the storm."],
  ["The committee approved the plan.", "The plan was approved by the committee."],
];

function activePassive(): Topic {
  const items = ACTIVE_PASSIVE.map(([active, passive]) => ({
    prompt: `Rewrite in the passive voice: "${active}"`,
    answer: passive,
  }));
  return bankFill("active-passive", "Active and passive voice", items);
}

const CLAUSES: { sentence: string; clause: string; kind: "independent" | "dependent" }[] = [
  { sentence: "Although it was raining, we went for a walk.", clause: "Although it was raining", kind: "dependent" },
  { sentence: "Although it was raining, we went for a walk.", clause: "we went for a walk", kind: "independent" },
  { sentence: "She finished her homework before she watched TV.", clause: "before she watched TV", kind: "dependent" },
  { sentence: "She finished her homework before she watched TV.", clause: "she finished her homework", kind: "independent" },
  { sentence: "Because he was tired, he went to bed early.", clause: "Because he was tired", kind: "dependent" },
  { sentence: "Because he was tired, he went to bed early.", clause: "he went to bed early", kind: "independent" },
];

function clauseTypes(): Topic {
  const items = CLAUSES.map((c) => ({
    prompt: `In "${c.sentence}", is the clause "${c.clause}" independent or dependent?`,
    answer: c.kind,
  }));
  return bankMCQ("clauses", "Independent and dependent clauses", items, ["independent", "dependent"]);
}

const PERSUASIVE_TECHNIQUES: { example: string; technique: string }[] = [
  { example: "9 out of 10 dentists recommend this toothpaste.", technique: "statistics" },
  { example: "Don't you want the best for your family?", technique: "rhetorical question" },
  { example: "Buy now, buy now, buy now!", technique: "repetition" },
  { example: "Leading scientists agree that this is the safest option.", technique: "expert opinion" },
  { example: "This heartbreaking story will change how you see the world.", technique: "emotive language" },
  { example: "Everyone who matters already owns one.", technique: "bandwagon" },
];

function persuasiveTechniques(): Topic {
  const items = PERSUASIVE_TECHNIQUES.map((p) => ({
    prompt: `What persuasive technique is used in: "${p.example}"?`,
    answer: p.technique,
  }));
  return bankMCQ(
    "persuasive-techniques",
    "Persuasive techniques",
    items,
    PERSUASIVE_TECHNIQUES.map((p) => p.technique),
  );
}

const VOCAB_CONTEXT: { sentence: string; word: string; meaning: string; distractors: string[] }[] = [
  { sentence: "The abundant harvest fed the whole village.", word: "abundant", meaning: "plentiful", distractors: ["scarce", "rotten", "expensive"] },
  { sentence: "He was reluctant to admit his mistake.", word: "reluctant", meaning: "unwilling", distractors: ["eager", "proud", "certain"] },
  { sentence: "Her persistent efforts finally paid off.", word: "persistent", meaning: "determined", distractors: ["lazy", "brief", "quiet"] },
  { sentence: "The ancient ruins were a mystery to archaeologists.", word: "ancient", meaning: "very old", distractors: ["newly built", "hidden", "dangerous"] },
  { sentence: "The politician's speech was full of ambiguous statements.", word: "ambiguous", meaning: "unclear", distractors: ["honest", "loud", "brief"] },
];

function vocabularyInContext(): Topic {
  return {
    id: "vocab-context",
    label: "Vocabulary in context",
    generate: () => {
      const item = VOCAB_CONTEXT[Math.floor(Math.random() * VOCAB_CONTEXT.length)];
      const options = [item.meaning, ...item.distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `In "${item.sentence}", what does "${item.word}" mean?`,
        answer: item.meaning,
        options,
      };
    },
  };
}

// ---------- Grades 9-10 ----------

const GRAMMAR_EDITING: [string, string][] = [
  ["Me and him went to the store.", "He and I went to the store."],
  ["Neither of the answers are correct.", "Neither of the answers is correct."],
  ["She don't like vegetables.", "She doesn't like vegetables."],
  ["Their going to the concert tonight.", "They're going to the concert tonight."],
  ["The team are playing well this season.", "The team is playing well this season."],
  ["I could of finished it yesterday.", "I could have finished it yesterday."],
  ["Everyone should bring their own lunch.", "Everyone should bring his or her own lunch."],
  ["He is the tallest out of the two.", "He is the taller of the two."],
];

function grammarEditing(): Topic {
  const items = GRAMMAR_EDITING.map(([wrong, right]) => ({
    prompt: `Correct the grammar error: "${wrong}"`,
    answer: right,
  }));
  return bankFill("grammar-editing", "Grammar editing", items);
}

const LITERARY_DEVICES: { example: string; device: string }[] = [
  { example: "It's raining cats and dogs.", device: "idiom" },
  { example: "The fire fighter was as brave as a lion.", device: "simile" },
  { example: "The classroom was a zoo.", device: "metaphor" },
  { example: "The buzzing bees flew by.", device: "onomatopoeia" },
  { example: "A fire station burned down.", device: "irony" },
  { example: "The silence was deafening.", device: "oxymoron" },
  { example: "Death lay his icy hand on kings.", device: "personification" },
];

function literaryDevices(): Topic {
  const items = LITERARY_DEVICES.map((l) => ({
    prompt: `Identify the literary device: "${l.example}"`,
    answer: l.device,
  }));
  return bankMCQ("literary-devices", "Literary devices", items, LITERARY_DEVICES.map((l) => l.device));
}

const WORD_ROOTS: { root: string; meaning: string; example: string }[] = [
  { root: "bio", meaning: "life", example: "biology" },
  { root: "graph", meaning: "write", example: "autograph" },
  { root: "tele", meaning: "far", example: "telescope" },
  { root: "aud", meaning: "hear", example: "audience" },
  { root: "vis/vid", meaning: "see", example: "visible" },
  { root: "chron", meaning: "time", example: "chronology" },
  { root: "geo", meaning: "earth", example: "geography" },
  { root: "phon", meaning: "sound", example: "telephone" },
];

function wordRoots(): Topic {
  const items = WORD_ROOTS.map((w) => ({
    prompt: `What does the root "${w.root}" mean, as in "${w.example}"?`,
    answer: w.meaning,
  }));
  return bankFill("word-roots", "Word roots", items);
}

const RUN_ON_SENTENCES: [string, string][] = [
  ["I went to the shop I bought some milk.", "I went to the shop. I bought some milk."],
  ["It started to rain we ran inside.", "It started to rain, so we ran inside."],
  ["She loves to read she visits the library every week.", "She loves to read, and she visits the library every week."],
  ["He was tired he kept working.", "He was tired, but he kept working."],
  ["The movie was long we still enjoyed it.", "The movie was long, but we still enjoyed it."],
];

function fixRunOnSentences(): Topic {
  const items = RUN_ON_SENTENCES.map(([runOn, fixed]) => ({
    prompt: `Fix this run-on sentence: "${runOn}"`,
    answer: fixed,
  }));
  return bankFill("run-on-sentences", "Fixing run-on sentences", items);
}

// ---------- Grades 11-12 ----------

const ADVANCED_VOCAB: { word: string; meaning: string; distractors: string[] }[] = [
  { word: "ubiquitous", meaning: "present everywhere", distractors: ["rare", "expensive", "dangerous"] },
  { word: "ephemeral", meaning: "lasting a short time", distractors: ["permanent", "enormous", "colourful"] },
  { word: "cogent", meaning: "clear and convincing", distractors: ["confusing", "boring", "aggressive"] },
  { word: "ambivalent", meaning: "having mixed feelings", distractors: ["confident", "furious", "indifferent"] },
  { word: "pragmatic", meaning: "practical", distractors: ["idealistic", "emotional", "chaotic"] },
  { word: "meticulous", meaning: "very careful and precise", distractors: ["careless", "hurried", "generous"] },
  { word: "resilient", meaning: "able to recover quickly", distractors: ["fragile", "stubborn", "loud"] },
  { word: "candid", meaning: "honest and direct", distractors: ["secretive", "shy", "arrogant"] },
  { word: "austere", meaning: "plain and severe", distractors: ["luxurious", "colourful", "friendly"] },
  { word: "benevolent", meaning: "kind and generous", distractors: ["cruel", "selfish", "nervous"] },
];

function advancedVocabulary(): Topic {
  return {
    id: "advanced-vocab",
    label: "Advanced vocabulary",
    generate: () => {
      const item = ADVANCED_VOCAB[Math.floor(Math.random() * ADVANCED_VOCAB.length)];
      const options = [item.meaning, ...item.distractors].sort(() => Math.random() - 0.5);
      return { prompt: `What does "${item.word}" mean?`, answer: item.meaning, options };
    },
  };
}

const RHETORICAL_TECHNIQUES: { example: string; technique: string }[] = [
  { example: "We shall fight on the beaches, we shall fight on the landing grounds...", technique: "anaphora" },
  { example: "Is it not time we demanded better from our leaders?", technique: "rhetorical question" },
  { example: "As the leading expert has confirmed, this policy works.", technique: "appeal to authority" },
  { example: "These reckless criminals threaten everything we hold dear.", technique: "loaded language" },
  { example: "Either we act now, or we lose everything.", technique: "false dichotomy" },
];

function rhetoricalTechniques(): Topic {
  const items = RHETORICAL_TECHNIQUES.map((r) => ({
    prompt: `Identify the technique used in: "${r.example}"`,
    answer: r.technique,
  }));
  return bankMCQ(
    "rhetorical-techniques",
    "Rhetorical techniques",
    items,
    RHETORICAL_TECHNIQUES.map((r) => r.technique),
  );
}

const ADVANCED_GRAMMAR_EDITING: [string, string][] = [
  ["Each of the students have submitted their essay.", "Each of the students has submitted his or her essay."],
  ["Walking into the room, the lights were turned on by her.", "Walking into the room, she turned on the lights."],
  ["The data shows that the results are inconclusive, it needs more analysis.", "The data shows that the results are inconclusive; it needs more analysis."],
  ["By the time we arrived, the meeting already started.", "By the time we arrived, the meeting had already started."],
  ["One should always proofread your work.", "One should always proofread one's own work."],
];

function advancedGrammarEditing(): Topic {
  const items = ADVANCED_GRAMMAR_EDITING.map(([wrong, right]) => ({
    prompt: `Correct the error: "${wrong}"`,
    answer: right,
  }));
  return bankFill("advanced-grammar", "Advanced grammar editing", items);
}

const TEXT_PURPOSE: { excerpt: string; purpose: string }[] = [
  { excerpt: "Mix two cups of flour with one teaspoon of baking soda.", purpose: "to instruct" },
  { excerpt: "Vote yes to protect our local parks for future generations.", purpose: "to persuade" },
  { excerpt: "The bustling markets of Marrakech overwhelmed the senses.", purpose: "to describe" },
  { excerpt: "Unemployment fell by 0.4% in the last quarter, new data shows.", purpose: "to inform" },
  { excerpt: "Once upon a time, in a village by the sea, lived a curious girl.", purpose: "to entertain" },
];

function textPurpose(): Topic {
  const items = TEXT_PURPOSE.map((t) => ({
    prompt: `What is the main purpose of this text: "${t.excerpt}"?`,
    answer: t.purpose,
  }));
  return bankMCQ("text-purpose", "Text purpose", items, TEXT_PURPOSE.map((t) => t.purpose));
}

export function getEnglishTopics(grade: number): Topic[] {
  if (grade <= 2) {
    return [opposites(), plurals(), rhymingWords(), punctuationBasic(), nounsAndVerbs()];
  }
  if (grade <= 4) {
    return [synonymsEasy(), antonymsMid(), contractions(), punctuationMid(), partsOfSpeech()];
  }
  if (grade <= 6) {
    return [verbTenses(), figurativeLanguage(), homophones(), prefixMeanings()];
  }
  if (grade <= 8) {
    return [activePassive(), clauseTypes(), persuasiveTechniques(), vocabularyInContext()];
  }
  if (grade <= 10) {
    return [grammarEditing(), literaryDevices(), wordRoots(), fixRunOnSentences()];
  }
  return [advancedVocabulary(), rhetoricalTechniques(), advancedGrammarEditing(), textPurpose()];
}
