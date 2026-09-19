import type { Difficulty, Syllabus, Topic } from "../types";
import { bankFill, bankMCQ, pick } from "./utils";
import { unpack } from "./codec";

const DEFINITIONS: Record<string, string> = {
  personification: "gives human qualities or actions to something that is not human",
  simile: 'compares two things using "like" or "as"',
  metaphor: "says one thing is another to make a comparison",
  hyperbole: "is an extreme exaggeration used for effect",
  alliteration: "repeats the same starting sound in words that are close together",
  onomatopoeia: "uses a word that sounds like the noise it describes",
  idiom: "is a phrase whose meaning is different from the literal meaning of its words",
  irony: "is when the outcome is the opposite of what you would expect",
  oxymoron: "puts two opposite ideas together",
  statistics: "uses numbers or data to make a claim seem convincing",
  "rhetorical question": "asks a question that needs no answer, to make the reader agree",
  repetition: "repeats words or phrases to add emphasis",
  "expert opinion": "quotes an authority to make a claim seem trustworthy",
  "emotive language": "uses words chosen to stir up strong feelings",
  bandwagon: "suggests that everyone is doing it, so you should too",
  urgency: "pushes the reader to act quickly",
  anaphora: "repeats the same words at the start of successive phrases",
  "appeal to authority": "relies on an expert or important figure instead of evidence",
  "loaded language": "uses emotionally charged words to influence opinion",
  "false dichotomy": "presents only two options when more exist",
  asyndeton: "leaves out linking words such as and or but, for a punchy effect",
  antithesis: "places opposite ideas side by side for contrast",
  "ad hominem": "attacks the person instead of their argument",
  "slippery slope": "claims that one small step will lead to extreme consequences",
  "appeal to emotion": "tries to win agreement through feelings rather than evidence",
  "to instruct": "gives steps or directions to follow",
  "to persuade": "tries to make the reader agree or take action",
  "to describe": "paints a picture using sensory detail",
  "to inform": "gives facts and information",
  "to entertain": "tells a story or amuses the reader",
  sarcastic: "says the opposite of what is meant, to mock",
  urgent: "signals that something must be done quickly",
  nostalgic: "looks back fondly on the past",
  formal: "uses serious, official language",
  indifferent: "shows no interest or concern",
  enthusiastic: "shows great excitement",
  noun: "names a person, place or thing",
  verb: "shows an action or state",
  adjective: "describes a noun",
};

const HOMOPHONE_MEANINGS: Record<string, string> = {
  "they're": "they are",
  there: "in that place",
  their: "belonging to them",
  hear: "to notice sound with your ears",
  here: "in this place",
  horse: "the animal",
  hoarse: "having a rough, croaky voice",
  close: "to shut",
  clothes: "things you wear",
  pie: "a baked food",
  pi: "the number 3.14 used for circles",
  pass: "to hand over or go by",
  past: "the time before now",
  shoes: "things worn on your feet",
  choose: "to pick",
};

const CONTRACTION_NOTES: Record<string, string> = {
  "won't": '"will not" is irregular: it becomes "won\'t", not "willn\'t".',
  "can't": '"cannot" loses the letters "no", and the apostrophe replaces them.',
};

const EDIT_RULES: [RegExp, string][] = [
  [/me and him/, 'Use subject pronouns (he and I) when they do the action; "me and him" are object pronouns.'],
  [/neither of the answers are/, '"Neither" is singular, so it takes a singular verb (is).'],
  [/she don't/, 'With he, she and it, use "doesn\'t", not "don\'t".'],
  [/their going/, '"They\'re" means "they are"; "their" shows belonging.'],
  [/team are/, "A team is one group, so it takes a singular verb (is)."],
  [/could of/, 'It is "could have" (could\'ve), never "could of".'],
  [/everyone should bring their/, '"Everyone" is singular, so use "his or her".'],
  [/tallest out of the two/, 'When comparing two things use the comparative (taller); "tallest" is for three or more.'],
  [/between you and i/, 'After a preposition such as "between", use the object pronoun "me".'],
  [/^its raining/, '"It\'s" means "it is"; "its" shows belonging.'],
  [/is because/, 'Say "the reason is that", not "the reason is because".'],
  [/less people/, 'Use "fewer" for things you can count and "less" for amounts you cannot count.'],
  [/whom do you think/, '"Who" is the subject here (who will win); "whom" is used for objects.'],
  [/me and my friend was/, 'Put the other person first and use the subject pronoun: "my friend and I". The subject is plural, so use "were".'],
  [/it's tail/, '"Its" shows belonging; "it\'s" means "it is".'],
  [/he run faster/, 'The past tense of "run" is "ran".'],
  [/each of the students have/, '"Each" is singular, so use "has" and "his or her".'],
  [/walking into the room, the lights/, "This is a dangling modifier: the opening phrase must describe the subject that comes next (the person walking)."],
  [/inconclusive, it needs/, "Two complete sentences joined only by a comma make a comma splice; use a semicolon or a full stop."],
  [/already started/, "Use the past perfect (had started) for an action that finished before another past action."],
  [/proofread your work/, 'Keep pronouns consistent: "one" goes with "one\'s own".'],
  [/having finished the exam, the room/, "This is a dangling modifier: the person who finished the exam must be the subject."],
  [/^its important/, '"It\'s" means "it is".'],
  [/company are/, "A company is one group, so it takes a singular verb (is)."],
  [/students who is/, '"Who" refers to "students" (plural), so the verb is "are".'],
  [/committee have/, "A committee is one group, so it takes a singular verb (has)."],
  [/running to catch the bus, her bag/, "This is a dangling modifier: the person running must be the subject."],
  [/neither the teacher nor the students was/, 'With "neither... nor", the verb agrees with the nearer subject (students), so use "were".'],
];

function editExplanation(wrong: string, right: string): string {
  const rule = EDIT_RULES.find(([pattern]) => pattern.test(wrong.toLowerCase()))?.[1];
  return `${rule ?? "Compare the corrected sentence with the original to find what changed."} Correct sentence: "${right}"`;
}

function commonSuffix(a: string, b: string): string {
  let i = 0;
  while (i < a.length && i < b.length && a[a.length - 1 - i] === b[b.length - 1 - i]) i++;
  return a.slice(a.length - i);
}

function pluralExplanation(word: string, plural: string): string {
  const ending = word.match(/(s|x|z|ch|sh)$/)?.[1];
  if (ending && plural === `${word}es`) return `Words ending in -${ending} add -es, so "${word}" becomes "${plural}".`;
  if (/[^aeiou]y$/.test(word) && plural === `${word.slice(0, -1)}ies`) {
    return `Words ending in a consonant + y change the y to i and add -es, so "${word}" becomes "${plural}".`;
  }
  if (plural === `${word}s`) return `Most words just add -s, so "${word}" becomes "${plural}".`;
  if (/fe?$/.test(word) && plural.endsWith("ves")) {
    return `Some words ending in -f change the f to v and add -es, so "${word}" becomes "${plural}".`;
  }
  return `"${word}" has an irregular plural. It does not follow the usual rules, so it has to be learned: "${plural}".`;
}

function basicPunctuationNote(broken: string, fixed: string): string {
  const parts = ["A sentence starts with a capital letter."];
  if (/^i /.test(broken)) parts.push('The word "I" is always a capital letter.');
  if (fixed.endsWith("?")) parts.push("It asks a question, so it ends with a question mark (?).");
  else if (fixed.endsWith("!")) parts.push("It shows strong feeling, so it ends with an exclamation mark (!).");
  else parts.push("It is a statement, so it ends with a full stop (.).");
  return `${parts.join(" ")} Correct: "${fixed}"`;
}

function midPunctuationNote(broken: string, fixed: string): string {
  const parts = ["Start sentences and names with capital letters."];
  if (fixed.split(",").length > broken.split(",").length) {
    parts.push("Add commas to separate list items or to follow an opening word or phrase.");
  }
  if (/'/.test(fixed) && !/'/.test(broken)) {
    parts.push("Add apostrophes to show belonging (Jason's bike) or missing letters (that's, haven't).");
  }
  if (/[!?]$/.test(fixed)) parts.push("End with the right mark: ! for strong feeling, ? for a question.");
  return `${parts.join(" ")} Correct: "${fixed}"`;
}

function partOfSpeechExplanation(sentence: string, word: string, pos: string): string {
  return `In "${sentence}", the word "${word}" ${DEFINITIONS[pos]}, so it is ${pos === "adjective" ? "an" : "a"} ${pos}.`;
}

function pastTenseExplanation(present: string, past: string): string {
  if (!/ed$/.test(past)) {
    return `"${present}" is an irregular verb. It does not add -ed; its past tense is "${past}", which has to be learned.`;
  }
  const detail =
    past === `${present.slice(0, -1)}ied`
      ? " (after a consonant + y, change the y to i first)"
      : past === `${present}d`
        ? " (just -d, because it already ends in e)"
        : "";
  return `"${present}" is a regular verb, so add -ed${detail}: "${past}".`;
}

function homophoneExplanation(answer: string, distractors: string[]): string {
  const meaning = (w: string) => HOMOPHONE_MEANINGS[w.toLowerCase()] ?? "a different word";
  const others = distractors.map((d) => `"${d}" means ${meaning(d)}`).join("; ");
  return `The sentence needs "${answer}", which means ${meaning(answer)}. ${others}.`;
}

// ---------- Grades 1-2 ----------

const OPPOSITES: [string, string][] = unpack("W1siaG90IiwiY29sZCJdLFsiYmlnIiwic21hbGwiXSxbInVwIiwiZG93biJdLFsiZmFzdCIsInNsb3ciXSxbImhhcHB5Iiwic2FkIl0sWyJvcGVuIiwiY2xvc2VkIl0sWyJkYXkiLCJuaWdodCJdLFsid2V0IiwiZHJ5Il0sWyJpbiIsIm91dCJdLFsiZnVsbCIsImVtcHR5Il0sWyJvbGQiLCJuZXciXSxbImxpZ2h0IiwiZGFyayJdLFsibG91ZCIsInF1aWV0Il0sWyJjbGVhbiIsImRpcnR5Il0sWyJoYXJkIiwic29mdCJdXQ==");

function opposites(): Topic {
  const items = OPPOSITES.flatMap(([a, b]) => [
    {
      prompt: `What is the opposite of "${a}"?`,
      answer: b,
      explanation: `Opposites have meanings that are as different as possible. The opposite of "${a}" is "${b}".`,
    },
    {
      prompt: `What is the opposite of "${b}"?`,
      answer: a,
      explanation: `Opposites have meanings that are as different as possible. The opposite of "${b}" is "${a}".`,
    },
  ]);
  return bankMCQ("opposites", "Opposites", items);
}

const PLURALS: [string, string][] = unpack("W1siY2F0IiwiY2F0cyJdLFsiZG9nIiwiZG9ncyJdLFsiYm9vayIsImJvb2tzIl0sWyJib3giLCJib3hlcyJdLFsiYnJ1c2giLCJicnVzaGVzIl0sWyJnbGFzcyIsImdsYXNzZXMiXSxbImJhYnkiLCJiYWJpZXMiXSxbImNpdHkiLCJjaXRpZXMiXSxbImxlYWYiLCJsZWF2ZXMiXSxbImNoaWxkIiwiY2hpbGRyZW4iXSxbIm1vdXNlIiwibWljZSJdLFsiZm9vdCIsImZlZXQiXSxbImJ1cyIsImJ1c2VzIl0sWyJmb3giLCJmb3hlcyJdXQ==");

function plurals(): Topic {
  const items = PLURALS.map(([word, plural]) => ({
    prompt: `What is the plural of "${word}"?`,
    answer: plural,
    explanation: pluralExplanation(word, plural),
  }));
  return bankFill("plurals", "Plurals", items);
}

const RHYMES: { word: string; rhyme: string }[] = unpack("W3sid29yZCI6ImNhdCIsInJoeW1lIjoiaGF0In0seyJ3b3JkIjoiZG9nIiwicmh5bWUiOiJsb2cifSx7IndvcmQiOiJzdW4iLCJyaHltZSI6ImZ1biJ9LHsid29yZCI6InRyZWUiLCJyaHltZSI6ImJlZSJ9LHsid29yZCI6ImNhciIsInJoeW1lIjoic3RhciJ9LHsid29yZCI6ImJhbGwiLCJyaHltZSI6IndhbGwifSx7IndvcmQiOiJjYWtlIiwicmh5bWUiOiJsYWtlIn0seyJ3b3JkIjoiZnJvZyIsInJoeW1lIjoiam9nIn0seyJ3b3JkIjoiYm9hdCIsInJoeW1lIjoiY29hdCJ9LHsid29yZCI6ImJ1ZyIsInJoeW1lIjoicnVnIn1d");

function rhymingWords(): Topic {
  const items = RHYMES.map((r) => ({
    prompt: `Which word rhymes with "${r.word}"?`,
    answer: r.rhyme,
    explanation: `Rhyming words end with the same sound. "${r.word}" and "${r.rhyme}" both end in "-${commonSuffix(r.word, r.rhyme)}".`,
  }));
  return bankMCQ("rhyming-words", "Rhyming words", items, RHYMES.map((r) => r.rhyme));
}

const PUNCTUATION_BASIC: [string, string][] = unpack("W1sidGhlIGNhdCBpcyBzbGVlcGluZyIsIlRoZSBjYXQgaXMgc2xlZXBpbmcuIl0sWyJ3aGVyZSBpcyBteSBiYWciLCJXaGVyZSBpcyBteSBiYWc/Il0sWyJpIGxpa2UgaWNlIGNyZWFtIiwiSSBsaWtlIGljZSBjcmVhbS4iXSxbImNhbiB5b3UgaGVscCBtZSIsIkNhbiB5b3UgaGVscCBtZT8iXSxbIm15IGRvZyBpcyBicm93biIsIk15IGRvZyBpcyBicm93bi4iXSxbIndoYXQgYSBncmVhdCBkYXkiLCJXaGF0IGEgZ3JlYXQgZGF5ISJdLFsid2Ugd2VudCB0byB0aGUgcGFyayIsIldlIHdlbnQgdG8gdGhlIHBhcmsuIl0sWyJpcyBpdCByYWluaW5nIiwiSXMgaXQgcmFpbmluZz8iXSxbInNoZSBoYXMgYSByZWQgYmlrZSIsIlNoZSBoYXMgYSByZWQgYmlrZS4iXSxbInN0b3AgcmlnaHQgdGhlcmUiLCJTdG9wIHJpZ2h0IHRoZXJlISJdXQ==");

function punctuationBasic(): Topic {
  const items = PUNCTUATION_BASIC.map(([broken, fixed]) => ({
    prompt: `Rewrite this sentence correctly: "${broken}"`,
    answer: fixed,
    explanation: basicPunctuationNote(broken, fixed),
  }));
  return bankFill("punctuation-basic", "Capital letters and punctuation", items);
}

const NOUN_VERB_SENTENCES: { sentence: string; word: string; pos: "noun" | "verb" }[] = unpack("W3sic2VudGVuY2UiOiJUaGUgZG9nIHJ1bnMgZmFzdC4iLCJ3b3JkIjoicnVucyIsInBvcyI6InZlcmIifSx7InNlbnRlbmNlIjoiVGhlIGRvZyBydW5zIGZhc3QuIiwid29yZCI6ImRvZyIsInBvcyI6Im5vdW4ifSx7InNlbnRlbmNlIjoiU2hlIHJlYWRzIGEgYm9vay4iLCJ3b3JkIjoiYm9vayIsInBvcyI6Im5vdW4ifSx7InNlbnRlbmNlIjoiU2hlIHJlYWRzIGEgYm9vay4iLCJ3b3JkIjoicmVhZHMiLCJwb3MiOiJ2ZXJiIn0seyJzZW50ZW5jZSI6IlRoZSBiaXJkIGZsaWVzIGhpZ2guIiwid29yZCI6ImZsaWVzIiwicG9zIjoidmVyYiJ9LHsic2VudGVuY2UiOiJUaGUgYmlyZCBmbGllcyBoaWdoLiIsIndvcmQiOiJiaXJkIiwicG9zIjoibm91biJ9LHsic2VudGVuY2UiOiJIZSBraWNrcyB0aGUgYmFsbC4iLCJ3b3JkIjoiYmFsbCIsInBvcyI6Im5vdW4ifSx7InNlbnRlbmNlIjoiSGUga2lja3MgdGhlIGJhbGwuIiwid29yZCI6ImtpY2tzIiwicG9zIjoidmVyYiJ9LHsic2VudGVuY2UiOiJUaGUgY2hpbGRyZW4gcGxheSBvdXRzaWRlLiIsIndvcmQiOiJwbGF5IiwicG9zIjoidmVyYiJ9LHsic2VudGVuY2UiOiJUaGUgY2hpbGRyZW4gcGxheSBvdXRzaWRlLiIsIndvcmQiOiJjaGlsZHJlbiIsInBvcyI6Im5vdW4ifV0=");

function nounsAndVerbs(): Topic {
  const items = NOUN_VERB_SENTENCES.map((s) => ({
    prompt: `In the sentence "${s.sentence}" is the word "${s.word}" a noun or a verb?`,
    answer: s.pos,
    explanation: partOfSpeechExplanation(s.sentence, s.word, s.pos),
  }));
  return bankMCQ("nouns-verbs", "Nouns and verbs", items, ["noun", "verb"]);
}

// ---------- Grades 3-4 ----------

const SYNONYMS_EASY: [string, string][] = unpack("W1siaGFwcHkiLCJqb3lmdWwiXSxbImJpZyIsImxhcmdlIl0sWyJzbWFsbCIsInRpbnkiXSxbImZhc3QiLCJxdWljayJdLFsic21hcnQiLCJjbGV2ZXIiXSxbInNhZCIsInVuaGFwcHkiXSxbImFuZ3J5IiwibWFkIl0sWyJwcmV0dHkiLCJiZWF1dGlmdWwiXSxbInNjYXJlZCIsImFmcmFpZCJdLFsidGlyZWQiLCJzbGVlcHkiXSxbImJlZ2luIiwic3RhcnQiXSxbImVuZCIsImZpbmlzaCJdXQ==");

function synonymsEasy(): Topic {
  const items = SYNONYMS_EASY.map(([word, syn]) => ({
    prompt: `Which word means the same as "${word}"?`,
    answer: syn,
    explanation: `Synonyms are words with a similar meaning. "${syn}" means the same as "${word}".`,
  }));
  return bankMCQ("synonyms-easy", "Synonyms", items, SYNONYMS_EASY.map((s) => s[1]));
}

const ANTONYMS_MID: [string, string][] = unpack("W1siYW5jaWVudCIsIm1vZGVybiJdLFsiZ2VuZXJvdXMiLCJzdGluZ3kiXSxbInBvbGl0ZSIsInJ1ZGUiXSxbImJyYXZlIiwiY293YXJkbHkiXSxbInZpY3RvcnkiLCJkZWZlYXQiXSxbImFycml2ZSIsImRlcGFydCJdLFsiaW5jcmVhc2UiLCJkZWNyZWFzZSJdLFsiZ2VudWluZSIsImZha2UiXSxbInBlcm1pdCIsImZvcmJpZCJdLFsiZXhwYW5kIiwic2hyaW5rIl1d");

function antonymsMid(): Topic {
  const items = ANTONYMS_MID.map(([word, ant]) => ({
    prompt: `Which word is the opposite of "${word}"?`,
    answer: ant,
    explanation: `Antonyms are words with opposite meanings. The opposite of "${word}" is "${ant}".`,
  }));
  return bankMCQ("antonyms-mid", "Antonyms", items, ANTONYMS_MID.map((s) => s[1]));
}

const CONTRACTIONS: [string, string][] = unpack("W1siZG8gbm90IiwiZG9uJ3QiXSxbImNhbm5vdCIsImNhbid0Il0sWyJ3aWxsIG5vdCIsIndvbid0Il0sWyJJIGFtIiwiSSdtIl0sWyJ0aGV5IGFyZSIsInRoZXkncmUiXSxbIndlIHdpbGwiLCJ3ZSdsbCJdLFsiaXMgbm90IiwiaXNuJ3QiXSxbImRpZCBub3QiLCJkaWRuJ3QiXSxbInlvdSBhcmUiLCJ5b3UncmUiXSxbInNob3VsZCBub3QiLCJzaG91bGRuJ3QiXV0=");

function contractions(): Topic {
  const items = CONTRACTIONS.map(([words, contraction]) => ({
    prompt: `What is the contraction for "${words}"?`,
    answer: contraction,
    explanation: `A contraction joins two words into one, and an apostrophe replaces the missing letters. ${CONTRACTION_NOTES[contraction] ?? ""} "${words}" becomes "${contraction}".`.replace("  ", " "),
  }));
  return bankFill("contractions", "Contractions", items);
}

const PUNCTUATION_MID: [string, string][] = unpack("W1sibXkgZmF2b3VyaXRlIGZydWl0cyBhcmUgYXBwbGVzIG9yYW5nZXMgYW5kIGdyYXBlcyIsIk15IGZhdm91cml0ZSBmcnVpdHMgYXJlIGFwcGxlcywgb3JhbmdlcywgYW5kIGdyYXBlcy4iXSxbInRoYXRzIGphc29ucyBiaWtlIiwiVGhhdCdzIEphc29uJ3MgYmlrZS4iXSxbImFmdGVyIHNjaG9vbCB3ZSB3ZW50IHRvIHRoZSBsaWJyYXJ5IiwiQWZ0ZXIgc2Nob29sLCB3ZSB3ZW50IHRvIHRoZSBsaWJyYXJ5LiJdLFsieWVzIGkgd291bGQgbG92ZSB0byBjb21lIiwiWWVzLCBJIHdvdWxkIGxvdmUgdG8gY29tZS4iXSxbInRoZSBkb2dzIGJvbmUgd2FzIGJ1cmllZCBpbiB0aGUgeWFyZCIsIlRoZSBkb2cncyBib25lIHdhcyBidXJpZWQgaW4gdGhlIHlhcmQuIl0sWyJ3ZWxsIGkgc3VwcG9zZSB3ZSBjb3VsZCB0cnkiLCJXZWxsLCBJIHN1cHBvc2Ugd2UgY291bGQgdHJ5LiJdLFsibXkgc2lzdGVycyBuYW1lIGlzIGVtbWEiLCJNeSBzaXN0ZXIncyBuYW1lIGlzIEVtbWEuIl0sWyJvbiBzYXR1cmRheSB3ZSB2aXNpdGVkIG5hbiBhbmQgcG9wIiwiT24gU2F0dXJkYXksIHdlIHZpc2l0ZWQgTmFuIGFuZCBQb3AuIl0sWyJ0aGUgbW92aWUgd2hpY2ggd2Ugd2F0Y2hlZCBsYXN0IG5pZ2h0IHdhcyB0ZXJyaWZ5aW5nIiwiVGhlIG1vdmllLCB3aGljaCB3ZSB3YXRjaGVkIGxhc3QgbmlnaHQsIHdhcyB0ZXJyaWZ5aW5nLiJdLFsicGxlYXNlIGJyaW5nIGEgcGVuIGEgbm90ZWJvb2sgYW5kIGEgcnVsZXIiLCJQbGVhc2UgYnJpbmcgYSBwZW4sIGEgbm90ZWJvb2ssIGFuZCBhIHJ1bGVyLiJdLFsid293IHRoYXQgd2FzIGFuIGFtYXppbmcgZ29hbCIsIldvdywgdGhhdCB3YXMgYW4gYW1hemluZyBnb2FsISJdLFsibWFya3MgZmF2b3VyaXRlIHN1YmplY3RzIGFyZSBzY2llbmNlIGFuZCBhcnQiLCJNYXJrJ3MgZmF2b3VyaXRlIHN1YmplY3RzIGFyZSBzY2llbmNlIGFuZCBhcnQuIl0sWyJubyBpIGhhdmVudCBmaW5pc2hlZCBteSBob21ld29yayB5ZXQiLCJObywgSSBoYXZlbid0IGZpbmlzaGVkIG15IGhvbWV3b3JrIHlldC4iXV0=");

function punctuationMid(): Topic {
  const items = PUNCTUATION_MID.map(([broken, fixed]) => ({
    prompt: `Rewrite this sentence with correct punctuation: "${broken}"`,
    answer: fixed,
    explanation: midPunctuationNote(broken, fixed),
  }));
  return bankFill("punctuation-mid", "Punctuation practice", items);
}

const PARTS_OF_SPEECH: { sentence: string; word: string; pos: "noun" | "verb" | "adjective" }[] = unpack("W3sic2VudGVuY2UiOiJUaGUgdGFsbCBib3kganVtcGVkIG92ZXIgdGhlIGZlbmNlLiIsIndvcmQiOiJ0YWxsIiwicG9zIjoiYWRqZWN0aXZlIn0seyJzZW50ZW5jZSI6IlRoZSB0YWxsIGJveSBqdW1wZWQgb3ZlciB0aGUgZmVuY2UuIiwid29yZCI6Imp1bXBlZCIsInBvcyI6InZlcmIifSx7InNlbnRlbmNlIjoiVGhlIHRhbGwgYm95IGp1bXBlZCBvdmVyIHRoZSBmZW5jZS4iLCJ3b3JkIjoiZmVuY2UiLCJwb3MiOiJub3VuIn0seyJzZW50ZW5jZSI6IkEgYnJpZ2h0IGxpZ2h0IGZpbGxlZCB0aGUgZGFyayByb29tLiIsIndvcmQiOiJicmlnaHQiLCJwb3MiOiJhZGplY3RpdmUifSx7InNlbnRlbmNlIjoiQSBicmlnaHQgbGlnaHQgZmlsbGVkIHRoZSBkYXJrIHJvb20uIiwid29yZCI6ImZpbGxlZCIsInBvcyI6InZlcmIifSx7InNlbnRlbmNlIjoiQSBicmlnaHQgbGlnaHQgZmlsbGVkIHRoZSBkYXJrIHJvb20uIiwid29yZCI6InJvb20iLCJwb3MiOiJub3VuIn0seyJzZW50ZW5jZSI6IlRoZSBvbGQgbWFuIHdhbGtlZCBzbG93bHkgdG8gdGhlIHNoaW55IGNhci4iLCJ3b3JkIjoib2xkIiwicG9zIjoiYWRqZWN0aXZlIn0seyJzZW50ZW5jZSI6IlRoZSBvbGQgbWFuIHdhbGtlZCBzbG93bHkgdG8gdGhlIHNoaW55IGNhci4iLCJ3b3JkIjoid2Fsa2VkIiwicG9zIjoidmVyYiJ9LHsic2VudGVuY2UiOiJUaGUgb2xkIG1hbiB3YWxrZWQgc2xvd2x5IHRvIHRoZSBzaGlueSBjYXIuIiwid29yZCI6InNoaW55IiwicG9zIjoiYWRqZWN0aXZlIn0seyJzZW50ZW5jZSI6IlRoZSBjdXJpb3VzIGNhdCBleHBsb3JlZCB0aGUgZW1wdHkgaG91c2UuIiwid29yZCI6ImN1cmlvdXMiLCJwb3MiOiJhZGplY3RpdmUifSx7InNlbnRlbmNlIjoiVGhlIGN1cmlvdXMgY2F0IGV4cGxvcmVkIHRoZSBlbXB0eSBob3VzZS4iLCJ3b3JkIjoiZXhwbG9yZWQiLCJwb3MiOiJ2ZXJiIn0seyJzZW50ZW5jZSI6IlRoZSBjdXJpb3VzIGNhdCBleHBsb3JlZCB0aGUgZW1wdHkgaG91c2UuIiwid29yZCI6ImhvdXNlIiwicG9zIjoibm91biJ9LHsic2VudGVuY2UiOiJBIGdlbnRsZSBicmVlemUgY29vbGVkIHRoZSB0aXJlZCBoaWtlcnMuIiwid29yZCI6ImdlbnRsZSIsInBvcyI6ImFkamVjdGl2ZSJ9LHsic2VudGVuY2UiOiJBIGdlbnRsZSBicmVlemUgY29vbGVkIHRoZSB0aXJlZCBoaWtlcnMuIiwid29yZCI6ImNvb2xlZCIsInBvcyI6InZlcmIifSx7InNlbnRlbmNlIjoiQSBnZW50bGUgYnJlZXplIGNvb2xlZCB0aGUgdGlyZWQgaGlrZXJzLiIsIndvcmQiOiJoaWtlcnMiLCJwb3MiOiJub3VuIn1d");

function partsOfSpeech(): Topic {
  const items = PARTS_OF_SPEECH.map((s) => ({
    prompt: `In "${s.sentence}", what part of speech is "${s.word}"?`,
    answer: s.pos,
    explanation: partOfSpeechExplanation(s.sentence, s.word, s.pos),
  }));
  return bankMCQ("parts-of-speech", "Parts of speech", items, ["noun", "verb", "adjective"]);
}

// ---------- Grades 5-6 ----------

const VERB_TENSES: [string, string][] = unpack("W1siZ28iLCJ3ZW50Il0sWyJydW4iLCJyYW4iXSxbImVhdCIsImF0ZSJdLFsic2VlIiwic2F3Il0sWyJ3cml0ZSIsIndyb3RlIl0sWyJzcGVhayIsInNwb2tlIl0sWyJ0YWtlIiwidG9vayJdLFsiZ2l2ZSIsImdhdmUiXSxbImJlZ2luIiwiYmVnYW4iXSxbInN3aW0iLCJzd2FtIl0sWyJ3YWxrIiwid2Fsa2VkIl0sWyJqdW1wIiwianVtcGVkIl0sWyJsYXVnaCIsImxhdWdoZWQiXSxbImNhcnJ5IiwiY2FycmllZCJdLFsiZmx5IiwiZmxldyJdXQ==");

function verbTenses(): Topic {
  const items = VERB_TENSES.map(([present, past]) => ({
    prompt: `What is the past tense of "${present}"?`,
    answer: past,
    explanation: pastTenseExplanation(present, past),
  }));
  return bankFill("verb-tenses", "Verb tenses", items);
}

const FIGURATIVE_LANGUAGE: { sentence: string; technique: string }[] = unpack("W3sic2VudGVuY2UiOiJUaGUgc3RhcnMgZGFuY2VkIGluIHRoZSBza3kuIiwidGVjaG5pcXVlIjoicGVyc29uaWZpY2F0aW9uIn0seyJzZW50ZW5jZSI6IkhlciBzbWlsZSB3YXMgYXMgYnJpZ2h0IGFzIHRoZSBzdW4uIiwidGVjaG5pcXVlIjoic2ltaWxlIn0seyJzZW50ZW5jZSI6IkhlIGlzIGEgY291Y2ggcG90YXRvLiIsInRlY2huaXF1ZSI6Im1ldGFwaG9yIn0seyJzZW50ZW5jZSI6IkkndmUgdG9sZCB5b3UgYSBtaWxsaW9uIHRpbWVzLiIsInRlY2huaXF1ZSI6Imh5cGVyYm9sZSJ9LHsic2VudGVuY2UiOiJQZXRlciBQaXBlciBwaWNrZWQgYSBwZWNrIG9mIHBpY2tsZWQgcGVwcGVycy4iLCJ0ZWNobmlxdWUiOiJhbGxpdGVyYXRpb24ifSx7InNlbnRlbmNlIjoiVGhlIHdpbmQgd2hpc3BlcmVkIHRocm91Z2ggdGhlIHRyZWVzLiIsInRlY2huaXF1ZSI6InBlcnNvbmlmaWNhdGlvbiJ9LHsic2VudGVuY2UiOiJMaWZlIGlzIGEgcm9sbGVyY29hc3Rlci4iLCJ0ZWNobmlxdWUiOiJtZXRhcGhvciJ9LHsic2VudGVuY2UiOiJTaGUgd2FzIGFzIGJyYXZlIGFzIGEgbGlvbi4iLCJ0ZWNobmlxdWUiOiJzaW1pbGUifSx7InNlbnRlbmNlIjoiVGhlIGJlZXMgYnV6emVkIGJ1c2lseSBieSB0aGUgYmxvc3NvbXMuIiwidGVjaG5pcXVlIjoiYWxsaXRlcmF0aW9uIn0seyJzZW50ZW5jZSI6IkknbSBzbyBodW5ncnkgSSBjb3VsZCBlYXQgYSBob3JzZS4iLCJ0ZWNobmlxdWUiOiJoeXBlcmJvbGUifV0=");

function figurativeLanguage(): Topic {
  const items = FIGURATIVE_LANGUAGE.map((f) => ({
    prompt: `Which technique is used in: "${f.sentence}"?`,
    answer: f.technique,
    explanation: `The technique is ${f.technique}: it ${DEFINITIONS[f.technique]}.`,
  }));
  return bankMCQ("figurative-language", "Figurative language", items, [
    "personification",
    "simile",
    "metaphor",
    "hyperbole",
    "alliteration",
  ]);
}

const HOMOPHONES: { sentence: string; answer: string; distractors: string[] }[] = unpack("W3sic2VudGVuY2UiOiJfX18gZ29pbmcgdG8gdGhlIHNob3AgbGF0ZXIuIiwiYW5zd2VyIjoiVGhleSdyZSIsImRpc3RyYWN0b3JzIjpbIlRoZXJlIiwiVGhlaXIiXX0seyJzZW50ZW5jZSI6IlB1dCB0aGUgYm9vayBvdmVyIF9fXy4iLCJhbnN3ZXIiOiJ0aGVyZSIsImRpc3RyYWN0b3JzIjpbInRoZWlyIiwidGhleSdyZSJdfSx7InNlbnRlbmNlIjoiVGhhdCBpcyBfX18gaG91c2UuIiwiYW5zd2VyIjoidGhlaXIiLCJkaXN0cmFjdG9ycyI6WyJ0aGVyZSIsInRoZXkncmUiXX0seyJzZW50ZW5jZSI6IkkgY2FuIF9fXyB0aGUgbXVzaWMgZnJvbSBoZXJlLiIsImFuc3dlciI6ImhlYXIiLCJkaXN0cmFjdG9ycyI6WyJoZXJlIl19LHsic2VudGVuY2UiOiJDb21lIG92ZXIgX19fLCBwbGVhc2UuIiwiYW5zd2VyIjoiaGVyZSIsImRpc3RyYWN0b3JzIjpbImhlYXIiXX0seyJzZW50ZW5jZSI6IlRoZSBrbmlnaHQgcm9kZSBoaXMgX19fIGludG8gYmF0dGxlLiIsImFuc3dlciI6ImhvcnNlIiwiZGlzdHJhY3RvcnMiOlsiaG9hcnNlIl19LHsic2VudGVuY2UiOiJNeSB2b2ljZSBpcyBfX18gZnJvbSBzaG91dGluZy4iLCJhbnN3ZXIiOiJob2Fyc2UiLCJkaXN0cmFjdG9ycyI6WyJob3JzZSJdfSx7InNlbnRlbmNlIjoiU2hlIHdvcmUgYSBuZXcgX19fIHRvIHRoZSBwYXJ0eS4iLCJhbnN3ZXIiOiJkcmVzcyIsImRpc3RyYWN0b3JzIjpbXX0seyJzZW50ZW5jZSI6IlBsZWFzZSBfX18gdGhlIGRvb3IuIiwiYW5zd2VyIjoiY2xvc2UiLCJkaXN0cmFjdG9ycyI6WyJjbG90aGVzIl19LHsic2VudGVuY2UiOiJJIGJvdWdodCBuZXcgX19fIGZvciB3aW50ZXIuIiwiYW5zd2VyIjoiY2xvdGhlcyIsImRpc3RyYWN0b3JzIjpbImNsb3NlIl19LHsic2VudGVuY2UiOiJXZSBhdGUgYSBkZWxpY2lvdXMgX19fIGZvciBkZXNzZXJ0LiIsImFuc3dlciI6InBpZSIsImRpc3RyYWN0b3JzIjpbInBpIl19LHsic2VudGVuY2UiOiJUaGUgdmFsdWUgb2YgX19fIGlzIHJvdWdobHkgMy4xNC4iLCJhbnN3ZXIiOiJwaSIsImRpc3RyYWN0b3JzIjpbInBpZSJdfSx7InNlbnRlbmNlIjoiU2hlIHdpbGwgX19fIHRoZSBiYWxsIHRvIGhlciB0ZWFtbWF0ZS4iLCJhbnN3ZXIiOiJwYXNzIiwiZGlzdHJhY3RvcnMiOlsicGFzdCJdfSx7InNlbnRlbmNlIjoiVGhhdCBoYXBwZW5lZCBpbiB0aGUgX19fLiIsImFuc3dlciI6InBhc3QiLCJkaXN0cmFjdG9ycyI6WyJwYXNzIl19LHsic2VudGVuY2UiOiJJIG5lZWQgdG8gYnV5IGEgbmV3IHBhaXIgb2YgX19fLiIsImFuc3dlciI6InNob2VzIiwiZGlzdHJhY3RvcnMiOlsiY2hvb3NlIl19LHsic2VudGVuY2UiOiJXaGljaCBvbmUgd2lsbCB5b3UgX19fPyIsImFuc3dlciI6ImNob29zZSIsImRpc3RyYWN0b3JzIjpbInNob2VzIl19XQ==");

function homophones(): Topic {
  const items = HOMOPHONES.filter((h) => h.distractors.length > 0).map((h) => ({
    prompt: `Choose the correct word: "${h.sentence}"`,
    answer: h.answer,
    distractors: h.distractors,
    explanation: homophoneExplanation(h.answer, h.distractors),
  }));
  return {
    id: "homophones",
    label: "Homophones",
    generate: () => {
      const item = items[Math.floor(Math.random() * items.length)];
      const options = [item.answer, ...item.distractors].sort(() => Math.random() - 0.5);
      return { prompt: item.prompt, answer: item.answer, options, explanation: item.explanation };
    },
  };
}

const PREFIXES: { word: string; prefix: string; meaning: string }[] = unpack("W3sid29yZCI6InVuaGFwcHkiLCJwcmVmaXgiOiJ1bi0iLCJtZWFuaW5nIjoibm90In0seyJ3b3JkIjoicmV3cml0ZSIsInByZWZpeCI6InJlLSIsIm1lYW5pbmciOiJhZ2FpbiJ9LHsid29yZCI6ImRpc2FncmVlIiwicHJlZml4IjoiZGlzLSIsIm1lYW5pbmciOiJub3QgLyBvcHBvc2l0ZSBvZiJ9LHsid29yZCI6InByZWhlYXQiLCJwcmVmaXgiOiJwcmUtIiwibWVhbmluZyI6ImJlZm9yZSJ9LHsid29yZCI6Im1pc3NwZWxsIiwicHJlZml4IjoibWlzLSIsIm1lYW5pbmciOiJ3cm9uZ2x5In0seyJ3b3JkIjoiaW1wb3NzaWJsZSIsInByZWZpeCI6ImltLSIsIm1lYW5pbmciOiJub3QifSx7IndvcmQiOiJub25zZW5zZSIsInByZWZpeCI6Im5vbi0iLCJtZWFuaW5nIjoibm90In0seyJ3b3JkIjoib3ZlcmVhdCIsInByZWZpeCI6Im92ZXItIiwibWVhbmluZyI6InRvbyBtdWNoIn0seyJ3b3JkIjoic3VibWFyaW5lIiwicHJlZml4Ijoic3ViLSIsIm1lYW5pbmciOiJ1bmRlciJ9LHsid29yZCI6ImJpY3ljbGUiLCJwcmVmaXgiOiJiaS0iLCJtZWFuaW5nIjoidHdvIn0seyJ3b3JkIjoidHJpYW5nbGUiLCJwcmVmaXgiOiJ0cmktIiwibWVhbmluZyI6InRocmVlIn0seyJ3b3JkIjoiZXhwb3J0IiwicHJlZml4IjoiZXgtIiwibWVhbmluZyI6Im91dCJ9LHsid29yZCI6ImludGVybmF0aW9uYWwiLCJwcmVmaXgiOiJpbnRlci0iLCJtZWFuaW5nIjoiYmV0d2VlbiJ9LHsid29yZCI6ImF1dG9ncmFwaCIsInByZWZpeCI6ImF1dG8tIiwibWVhbmluZyI6InNlbGYifV0=");

function prefixMeanings(): Topic {
  const items = PREFIXES.map((p) => ({
    prompt: `What does the prefix "${p.prefix}" mean in the word "${p.word}"?`,
    answer: p.meaning,
    explanation: `The prefix "${p.prefix}" means "${p.meaning}", and it changes the meaning of the base word. In "${p.word}" it adds the idea of "${p.meaning}".`,
  }));
  return bankFill("prefixes", "Prefixes", items);
}

// ---------- Grades 7-8 ----------

const ACTIVE_PASSIVE: [string, string][] = unpack("W1siVGhlIGNoZWYgY29va2VkIHRoZSBtZWFsLiIsIlRoZSBtZWFsIHdhcyBjb29rZWQgYnkgdGhlIGNoZWYuIl0sWyJUaGUgdGVhY2hlciBncmFkZWQgdGhlIHRlc3RzLiIsIlRoZSB0ZXN0cyB3ZXJlIGdyYWRlZCBieSB0aGUgdGVhY2hlci4iXSxbIkxpZ2h0bmluZyBzdHJ1Y2sgdGhlIHRyZWUuIiwiVGhlIHRyZWUgd2FzIHN0cnVjayBieSBsaWdodG5pbmcuIl0sWyJUaGUgY29tcGFueSBsYXVuY2hlZCBhIG5ldyBwcm9kdWN0LiIsIkEgbmV3IHByb2R1Y3Qgd2FzIGxhdW5jaGVkIGJ5IHRoZSBjb21wYW55LiJdLFsiVGhlIGRvZyBjaGFzZWQgdGhlIGNhdC4iLCJUaGUgY2F0IHdhcyBjaGFzZWQgYnkgdGhlIGRvZy4iXSxbIlRoZSBhcnRpc3QgcGFpbnRlZCB0aGUgbXVyYWwuIiwiVGhlIG11cmFsIHdhcyBwYWludGVkIGJ5IHRoZSBhcnRpc3QuIl0sWyJUaGUgc3Rvcm0gZGFtYWdlZCB0aGUgcm9vZi4iLCJUaGUgcm9vZiB3YXMgZGFtYWdlZCBieSB0aGUgc3Rvcm0uIl0sWyJUaGUgY29tbWl0dGVlIGFwcHJvdmVkIHRoZSBwbGFuLiIsIlRoZSBwbGFuIHdhcyBhcHByb3ZlZCBieSB0aGUgY29tbWl0dGVlLiJdLFsiVGhlIGdhcmRlbmVyIHBsYW50ZWQgdGhlIHJvc2VzLiIsIlRoZSByb3NlcyB3ZXJlIHBsYW50ZWQgYnkgdGhlIGdhcmRlbmVyLiJdLFsiQSBmYW1vdXMgYXV0aG9yIHdyb3RlIHRoZSBub3ZlbC4iLCJUaGUgbm92ZWwgd2FzIHdyaXR0ZW4gYnkgYSBmYW1vdXMgYXV0aG9yLiJdLFsiVGhlIGVhcnRocXVha2UgZGVzdHJveWVkIHRoZSBicmlkZ2UuIiwiVGhlIGJyaWRnZSB3YXMgZGVzdHJveWVkIGJ5IHRoZSBlYXJ0aHF1YWtlLiJdLFsiVGhlIHdpbmQgYmxldyBkb3duIHRoZSBvbGQgZmVuY2UuIiwiVGhlIG9sZCBmZW5jZSB3YXMgYmxvd24gZG93biBieSB0aGUgd2luZC4iXSxbIlNjaWVudGlzdHMgZGlzY292ZXJlZCBhIG5ldyBzcGVjaWVzLiIsIkEgbmV3IHNwZWNpZXMgd2FzIGRpc2NvdmVyZWQgYnkgc2NpZW50aXN0cy4iXSxbIlRoZSBzdHVkZW50cyBwYWludGVkIHRoZSBjbGFzc3Jvb20gd2FsbHMuIiwiVGhlIGNsYXNzcm9vbSB3YWxscyB3ZXJlIHBhaW50ZWQgYnkgdGhlIHN0dWRlbnRzLiJdXQ==");

function activePassive(): Topic {
  const items = ACTIVE_PASSIVE.map(([active, passive]) => ({
    prompt: `Rewrite in the passive voice: "${active}"`,
    answer: passive,
    explanation: `In the passive voice the thing receiving the action becomes the subject, and the doer follows "by". Use "was/were" plus the past participle. Passive: "${passive}"`,
  }));
  return bankFill("active-passive", "Active and passive voice", items);
}

const CLAUSES: { sentence: string; clause: string; kind: "independent" | "dependent" }[] = unpack("W3sic2VudGVuY2UiOiJBbHRob3VnaCBpdCB3YXMgcmFpbmluZywgd2Ugd2VudCBmb3IgYSB3YWxrLiIsImNsYXVzZSI6IkFsdGhvdWdoIGl0IHdhcyByYWluaW5nIiwia2luZCI6ImRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJBbHRob3VnaCBpdCB3YXMgcmFpbmluZywgd2Ugd2VudCBmb3IgYSB3YWxrLiIsImNsYXVzZSI6IndlIHdlbnQgZm9yIGEgd2FsayIsImtpbmQiOiJpbmRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJTaGUgZmluaXNoZWQgaGVyIGhvbWV3b3JrIGJlZm9yZSBzaGUgd2F0Y2hlZCBUVi4iLCJjbGF1c2UiOiJiZWZvcmUgc2hlIHdhdGNoZWQgVFYiLCJraW5kIjoiZGVwZW5kZW50In0seyJzZW50ZW5jZSI6IlNoZSBmaW5pc2hlZCBoZXIgaG9tZXdvcmsgYmVmb3JlIHNoZSB3YXRjaGVkIFRWLiIsImNsYXVzZSI6InNoZSBmaW5pc2hlZCBoZXIgaG9tZXdvcmsiLCJraW5kIjoiaW5kZXBlbmRlbnQifSx7InNlbnRlbmNlIjoiQmVjYXVzZSBoZSB3YXMgdGlyZWQsIGhlIHdlbnQgdG8gYmVkIGVhcmx5LiIsImNsYXVzZSI6IkJlY2F1c2UgaGUgd2FzIHRpcmVkIiwia2luZCI6ImRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJCZWNhdXNlIGhlIHdhcyB0aXJlZCwgaGUgd2VudCB0byBiZWQgZWFybHkuIiwiY2xhdXNlIjoiaGUgd2VudCB0byBiZWQgZWFybHkiLCJraW5kIjoiaW5kZXBlbmRlbnQifSx7InNlbnRlbmNlIjoiV2hlbiB0aGUgYmVsbCByYW5nLCB0aGUgc3R1ZGVudHMgcnVzaGVkIG91dHNpZGUuIiwiY2xhdXNlIjoiV2hlbiB0aGUgYmVsbCByYW5nIiwia2luZCI6ImRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJXaGVuIHRoZSBiZWxsIHJhbmcsIHRoZSBzdHVkZW50cyBydXNoZWQgb3V0c2lkZS4iLCJjbGF1c2UiOiJ0aGUgc3R1ZGVudHMgcnVzaGVkIG91dHNpZGUiLCJraW5kIjoiaW5kZXBlbmRlbnQifSx7InNlbnRlbmNlIjoiVGhlIG1vdmllLCB3aGljaCB3ZSB3YXRjaGVkIHR3aWNlLCB3YXMgZXhjZWxsZW50LiIsImNsYXVzZSI6IndoaWNoIHdlIHdhdGNoZWQgdHdpY2UiLCJraW5kIjoiZGVwZW5kZW50In0seyJzZW50ZW5jZSI6IlRoZSBtb3ZpZSwgd2hpY2ggd2Ugd2F0Y2hlZCB0d2ljZSwgd2FzIGV4Y2VsbGVudC4iLCJjbGF1c2UiOiJUaGUgbW92aWUgd2FzIGV4Y2VsbGVudCIsImtpbmQiOiJpbmRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJVbmxlc3MgeW91IHN0dWR5LCB5b3Ugd2lsbCBmYWlsIHRoZSB0ZXN0LiIsImNsYXVzZSI6IlVubGVzcyB5b3Ugc3R1ZHkiLCJraW5kIjoiZGVwZW5kZW50In0seyJzZW50ZW5jZSI6IlVubGVzcyB5b3Ugc3R1ZHksIHlvdSB3aWxsIGZhaWwgdGhlIHRlc3QuIiwiY2xhdXNlIjoieW91IHdpbGwgZmFpbCB0aGUgdGVzdCIsImtpbmQiOiJpbmRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJJZiB5b3UgaGVhdCBpY2UsIGl0IG1lbHRzLiIsImNsYXVzZSI6IklmIHlvdSBoZWF0IGljZSIsImtpbmQiOiJkZXBlbmRlbnQifSx7InNlbnRlbmNlIjoiSWYgeW91IGhlYXQgaWNlLCBpdCBtZWx0cy4iLCJjbGF1c2UiOiJpdCBtZWx0cyIsImtpbmQiOiJpbmRlcGVuZGVudCJ9LHsic2VudGVuY2UiOiJTaGUgc21pbGVkIGJlY2F1c2UgdGhlIGdpZnQgd2FzIHBlcmZlY3QuIiwiY2xhdXNlIjoiYmVjYXVzZSB0aGUgZ2lmdCB3YXMgcGVyZmVjdCIsImtpbmQiOiJkZXBlbmRlbnQifSx7InNlbnRlbmNlIjoiU2hlIHNtaWxlZCBiZWNhdXNlIHRoZSBnaWZ0IHdhcyBwZXJmZWN0LiIsImNsYXVzZSI6IlNoZSBzbWlsZWQiLCJraW5kIjoiaW5kZXBlbmRlbnQifV0=");

function clauseTypes(): Topic {
  const items = CLAUSES.map((c) => ({
    prompt: `In "${c.sentence}", is the clause "${c.clause}" independent or dependent?`,
    answer: c.kind,
    explanation: `"${c.clause}" ${c.kind === "independent" ? "is a complete idea that can stand alone as a sentence" : "does not make sense on its own; it depends on the rest of the sentence"}, so it is ${c.kind}.`,
  }));
  return bankMCQ("clauses", "Independent and dependent clauses", items, ["independent", "dependent"]);
}

const PERSUASIVE_TECHNIQUES: { example: string; technique: string }[] = unpack("W3siZXhhbXBsZSI6Ijkgb3V0IG9mIDEwIGRlbnRpc3RzIHJlY29tbWVuZCB0aGlzIHRvb3RocGFzdGUuIiwidGVjaG5pcXVlIjoic3RhdGlzdGljcyJ9LHsiZXhhbXBsZSI6IkRvbid0IHlvdSB3YW50IHRoZSBiZXN0IGZvciB5b3VyIGZhbWlseT8iLCJ0ZWNobmlxdWUiOiJyaGV0b3JpY2FsIHF1ZXN0aW9uIn0seyJleGFtcGxlIjoiQnV5IG5vdywgYnV5IG5vdywgYnV5IG5vdyEiLCJ0ZWNobmlxdWUiOiJyZXBldGl0aW9uIn0seyJleGFtcGxlIjoiTGVhZGluZyBzY2llbnRpc3RzIGFncmVlIHRoYXQgdGhpcyBpcyB0aGUgc2FmZXN0IG9wdGlvbi4iLCJ0ZWNobmlxdWUiOiJleHBlcnQgb3BpbmlvbiJ9LHsiZXhhbXBsZSI6IlRoaXMgaGVhcnRicmVha2luZyBzdG9yeSB3aWxsIGNoYW5nZSBob3cgeW91IHNlZSB0aGUgd29ybGQuIiwidGVjaG5pcXVlIjoiZW1vdGl2ZSBsYW5ndWFnZSJ9LHsiZXhhbXBsZSI6IkV2ZXJ5b25lIHdobyBtYXR0ZXJzIGFscmVhZHkgb3ducyBvbmUuIiwidGVjaG5pcXVlIjoiYmFuZHdhZ29uIn0seyJleGFtcGxlIjoiT25seSAzIHNlYXRzIGxlZnQgYXQgdGhpcyBwcmljZSDigJQgYm9vayBub3chIiwidGVjaG5pcXVlIjoidXJnZW5jeSJ9LHsiZXhhbXBsZSI6IkFzIGEgcGFyZW50LCBkb24ndCB5b3Ugd2FudCB0byBrZWVwIHlvdXIga2lkcyBzYWZlPyIsInRlY2huaXF1ZSI6InJoZXRvcmljYWwgcXVlc3Rpb24ifSx7ImV4YW1wbGUiOiJUaGlzIHByb2R1Y3Qgd2lsbCBjaGFuZ2UgeW91ciBsaWZlIGZvcmV2ZXIuIiwidGVjaG5pcXVlIjoiZW1vdGl2ZSBsYW5ndWFnZSJ9LHsiZXhhbXBsZSI6IlN0dWRpZXMgc2hvdyA4NyUgb2YgdXNlcnMgc2F3IHJlc3VsdHMgd2l0aGluIGEgd2Vlay4iLCJ0ZWNobmlxdWUiOiJzdGF0aXN0aWNzIn0seyJleGFtcGxlIjoiT3VyIGZvdW5kZXIsIGEgZm9ybWVyIHN1cmdlb24sIGRlc2lnbmVkIHRoaXMgZm9yIHJlYWwgc2FmZXR5LiIsInRlY2huaXF1ZSI6ImV4cGVydCBvcGluaW9uIn0seyJleGFtcGxlIjoiSm9pbiB0aGUgbWlsbGlvbnMgd2hvIGhhdmUgYWxyZWFkeSBtYWRlIHRoZSBzd2l0Y2guIiwidGVjaG5pcXVlIjoiYmFuZHdhZ29uIn1d");

function persuasiveTechniques(): Topic {
  const items = PERSUASIVE_TECHNIQUES.map((p) => ({
    prompt: `What persuasive technique is used in: "${p.example}"?`,
    answer: p.technique,
    explanation: `The technique is ${p.technique}: it ${DEFINITIONS[p.technique]}.`,
  }));
  return bankMCQ(
    "persuasive-techniques",
    "Persuasive techniques",
    items,
    PERSUASIVE_TECHNIQUES.map((p) => p.technique),
  );
}

const VOCAB_CONTEXT: { sentence: string; word: string; meaning: string; distractors: string[] }[] = unpack("W3sic2VudGVuY2UiOiJUaGUgYWJ1bmRhbnQgaGFydmVzdCBmZWQgdGhlIHdob2xlIHZpbGxhZ2UuIiwid29yZCI6ImFidW5kYW50IiwibWVhbmluZyI6InBsZW50aWZ1bCIsImRpc3RyYWN0b3JzIjpbInNjYXJjZSIsInJvdHRlbiIsImV4cGVuc2l2ZSJdfSx7InNlbnRlbmNlIjoiSGUgd2FzIHJlbHVjdGFudCB0byBhZG1pdCBoaXMgbWlzdGFrZS4iLCJ3b3JkIjoicmVsdWN0YW50IiwibWVhbmluZyI6InVud2lsbGluZyIsImRpc3RyYWN0b3JzIjpbImVhZ2VyIiwicHJvdWQiLCJjZXJ0YWluIl19LHsic2VudGVuY2UiOiJIZXIgcGVyc2lzdGVudCBlZmZvcnRzIGZpbmFsbHkgcGFpZCBvZmYuIiwid29yZCI6InBlcnNpc3RlbnQiLCJtZWFuaW5nIjoiZGV0ZXJtaW5lZCIsImRpc3RyYWN0b3JzIjpbImxhenkiLCJicmllZiIsInF1aWV0Il19LHsic2VudGVuY2UiOiJUaGUgYW5jaWVudCBydWlucyB3ZXJlIGEgbXlzdGVyeSB0byBhcmNoYWVvbG9naXN0cy4iLCJ3b3JkIjoiYW5jaWVudCIsIm1lYW5pbmciOiJ2ZXJ5IG9sZCIsImRpc3RyYWN0b3JzIjpbIm5ld2x5IGJ1aWx0IiwiaGlkZGVuIiwiZGFuZ2Vyb3VzIl19LHsic2VudGVuY2UiOiJUaGUgcG9saXRpY2lhbidzIHNwZWVjaCB3YXMgZnVsbCBvZiBhbWJpZ3VvdXMgc3RhdGVtZW50cy4iLCJ3b3JkIjoiYW1iaWd1b3VzIiwibWVhbmluZyI6InVuY2xlYXIiLCJkaXN0cmFjdG9ycyI6WyJob25lc3QiLCJsb3VkIiwiYnJpZWYiXX0seyJzZW50ZW5jZSI6IlRoZSB2b2x1bnRlZXJzIHdvcmtlZCB3aXRoIGdyZWF0IGRpbGlnZW5jZSB0byBmaW5pc2ggb24gdGltZS4iLCJ3b3JkIjoiZGlsaWdlbmNlIiwibWVhbmluZyI6ImNhcmVmdWwgZWZmb3J0IiwiZGlzdHJhY3RvcnMiOlsibGF6aW5lc3MiLCJhbmdlciIsInNwZWVkIl19LHsic2VudGVuY2UiOiJIaXMgY2FuZGlkIHJlc3BvbnNlIHN1cnByaXNlZCB0aGUgaW50ZXJ2aWV3ZXIuIiwid29yZCI6ImNhbmRpZCIsIm1lYW5pbmciOiJob25lc3QgYW5kIGRpcmVjdCIsImRpc3RyYWN0b3JzIjpbImV2YXNpdmUiLCJydWRlIiwibmVydm91cyJdfSx7InNlbnRlbmNlIjoiVGhlIGNpdHkncyBpbmZyYXN0cnVjdHVyZSB3YXMgaW4gYSBkaWxhcGlkYXRlZCBzdGF0ZS4iLCJ3b3JkIjoiZGlsYXBpZGF0ZWQiLCJtZWFuaW5nIjoicnVuLWRvd24iLCJkaXN0cmFjdG9ycyI6WyJicmFuZCBuZXciLCJjb2xvdXJmdWwiLCJleHBlbnNpdmUiXX0seyJzZW50ZW5jZSI6IlNoZSBnYXZlIGEgc3VjY2luY3Qgc3VtbWFyeSBvZiB0aGUgcmVwb3J0LiIsIndvcmQiOiJzdWNjaW5jdCIsIm1lYW5pbmciOiJicmllZiBhbmQgY2xlYXIiLCJkaXN0cmFjdG9ycyI6WyJsZW5ndGh5IiwiY29uZnVzaW5nIiwiYm9yaW5nIl19LHsic2VudGVuY2UiOiJUaGUgY3Jvd2Qgd2FzIHN1YmR1ZWQgYWZ0ZXIgdGhlIGFubm91bmNlbWVudC4iLCJ3b3JkIjoic3ViZHVlZCIsIm1lYW5pbmciOiJxdWlldCBhbmQgcmVzZXJ2ZWQiLCJkaXN0cmFjdG9ycyI6WyJleGNpdGVkIiwiZnVyaW91cyIsImNvbmZ1c2VkIl19LHsic2VudGVuY2UiOiJIaXMgYXJndW1lbnRzIHdlcmUgYm90aCBjb2dlbnQgYW5kIHBlcnN1YXNpdmUuIiwid29yZCI6ImNvZ2VudCIsIm1lYW5pbmciOiJjbGVhciBhbmQgY29udmluY2luZyIsImRpc3RyYWN0b3JzIjpbIndlYWsiLCJpcnJlbGV2YW50IiwiYWdncmVzc2l2ZSJdfSx7InNlbnRlbmNlIjoiVGhlIGRldGVjdGl2ZSB3YXMga25vd24gZm9yIGhlciB0ZW5hY2l0eS4iLCJ3b3JkIjoidGVuYWNpdHkiLCJtZWFuaW5nIjoicGVyc2lzdGVuY2UiLCJkaXN0cmFjdG9ycyI6WyJraW5kbmVzcyIsImNhcmVsZXNzbmVzcyIsInNoeW5lc3MiXX0seyJzZW50ZW5jZSI6IlRoZSB0ZWFjaGVyJ3MgbGVuaWVudCBtYXJraW5nIHBsZWFzZWQgdGhlIGNsYXNzLiIsIndvcmQiOiJsZW5pZW50IiwibWVhbmluZyI6Im5vdCBzdHJpY3QiLCJkaXN0cmFjdG9ycyI6WyJ2ZXJ5IGhhcnNoIiwidW5mYWlyIiwic2xvdyJdfSx7InNlbnRlbmNlIjoiVGhlIGV4cGVkaXRpb24gZmFjZWQgYSB0cmVhY2hlcm91cyBjbGltYi4iLCJ3b3JkIjoidHJlYWNoZXJvdXMiLCJtZWFuaW5nIjoiZGFuZ2Vyb3VzIiwiZGlzdHJhY3RvcnMiOlsiZWFzeSIsInNob3J0Iiwic2NlbmljIl19LHsic2VudGVuY2UiOiJIZXIgZnJ1Z2FsIGhhYml0cyBoZWxwZWQgaGVyIHNhdmUgbW9uZXkuIiwid29yZCI6ImZydWdhbCIsIm1lYW5pbmciOiJjYXJlZnVsIHdpdGggbW9uZXkiLCJkaXN0cmFjdG9ycyI6WyJ3YXN0ZWZ1bCIsImdlbmVyb3VzIiwiZm9yZ2V0ZnVsIl19XQ==");

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
        explanation: `In this sentence "${item.word}" means "${item.meaning}". Use the other words in the sentence as clues to work out the meaning.`,
      };
    },
  };
}

// ---------- Grades 9-10 ----------

const GRAMMAR_EDITING: [string, string][] = unpack("W1siTWUgYW5kIGhpbSB3ZW50IHRvIHRoZSBzdG9yZS4iLCJIZSBhbmQgSSB3ZW50IHRvIHRoZSBzdG9yZS4iXSxbIk5laXRoZXIgb2YgdGhlIGFuc3dlcnMgYXJlIGNvcnJlY3QuIiwiTmVpdGhlciBvZiB0aGUgYW5zd2VycyBpcyBjb3JyZWN0LiJdLFsiU2hlIGRvbid0IGxpa2UgdmVnZXRhYmxlcy4iLCJTaGUgZG9lc24ndCBsaWtlIHZlZ2V0YWJsZXMuIl0sWyJUaGVpciBnb2luZyB0byB0aGUgY29uY2VydCB0b25pZ2h0LiIsIlRoZXkncmUgZ29pbmcgdG8gdGhlIGNvbmNlcnQgdG9uaWdodC4iXSxbIlRoZSB0ZWFtIGFyZSBwbGF5aW5nIHdlbGwgdGhpcyBzZWFzb24uIiwiVGhlIHRlYW0gaXMgcGxheWluZyB3ZWxsIHRoaXMgc2Vhc29uLiJdLFsiSSBjb3VsZCBvZiBmaW5pc2hlZCBpdCB5ZXN0ZXJkYXkuIiwiSSBjb3VsZCBoYXZlIGZpbmlzaGVkIGl0IHllc3RlcmRheS4iXSxbIkV2ZXJ5b25lIHNob3VsZCBicmluZyB0aGVpciBvd24gbHVuY2guIiwiRXZlcnlvbmUgc2hvdWxkIGJyaW5nIGhpcyBvciBoZXIgb3duIGx1bmNoLiJdLFsiSGUgaXMgdGhlIHRhbGxlc3Qgb3V0IG9mIHRoZSB0d28uIiwiSGUgaXMgdGhlIHRhbGxlciBvZiB0aGUgdHdvLiJdLFsiQmV0d2VlbiB5b3UgYW5kIEksIHRoaXMgaXMgYSBiYWQgaWRlYS4iLCJCZXR3ZWVuIHlvdSBhbmQgbWUsIHRoaXMgaXMgYSBiYWQgaWRlYS4iXSxbIkl0cyByYWluaW5nIG91dHNpZGUsIGJyaW5nIHlvdXIgdW1icmVsbGEuIiwiSXQncyByYWluaW5nIG91dHNpZGUsIGJyaW5nIHlvdXIgdW1icmVsbGEuIl0sWyJUaGUgcmVhc29uIGhlIGZhaWxlZCBpcyBiZWNhdXNlIGhlIGRpZG4ndCBzdHVkeS4iLCJUaGUgcmVhc29uIGhlIGZhaWxlZCBpcyB0aGF0IGhlIGRpZG4ndCBzdHVkeS4iXSxbIkxlc3MgcGVvcGxlIGNhbWUgdGhhbiB3ZSBleHBlY3RlZC4iLCJGZXdlciBwZW9wbGUgY2FtZSB0aGFuIHdlIGV4cGVjdGVkLiJdLFsiV2hvbSBkbyB5b3UgdGhpbmsgd2lsbCB3aW4/IiwiV2hvIGRvIHlvdSB0aGluayB3aWxsIHdpbj8iXSxbIk1lIGFuZCBteSBmcmllbmQgd2FzIGxhdGUgZm9yIGNsYXNzLiIsIk15IGZyaWVuZCBhbmQgSSB3ZXJlIGxhdGUgZm9yIGNsYXNzLiJdLFsiVGhlIGRvZyB3YWdnZWQgaXQncyB0YWlsIGhhcHBpbHkuIiwiVGhlIGRvZyB3YWdnZWQgaXRzIHRhaWwgaGFwcGlseS4iXSxbIkhlIHJ1biBmYXN0ZXIgdGhhbiBhbnlvbmUgZWxzZSBpbiB0aGUgcmFjZS4iLCJIZSByYW4gZmFzdGVyIHRoYW4gYW55b25lIGVsc2UgaW4gdGhlIHJhY2UuIl1d");

function grammarEditing(): Topic {
  const items = GRAMMAR_EDITING.map(([wrong, right]) => ({
    prompt: `Correct the grammar error: "${wrong}"`,
    answer: right,
    explanation: editExplanation(wrong, right),
  }));
  return bankFill("grammar-editing", "Grammar editing", items);
}

const LITERARY_DEVICES: { example: string; device: string }[] = unpack("W3siZXhhbXBsZSI6Ikl0J3MgcmFpbmluZyBjYXRzIGFuZCBkb2dzLiIsImRldmljZSI6ImlkaW9tIn0seyJleGFtcGxlIjoiVGhlIGZpcmUgZmlnaHRlciB3YXMgYXMgYnJhdmUgYXMgYSBsaW9uLiIsImRldmljZSI6InNpbWlsZSJ9LHsiZXhhbXBsZSI6IlRoZSBjbGFzc3Jvb20gd2FzIGEgem9vLiIsImRldmljZSI6Im1ldGFwaG9yIn0seyJleGFtcGxlIjoiVGhlIGJ1enppbmcgYmVlcyBmbGV3IGJ5LiIsImRldmljZSI6Im9ub21hdG9wb2VpYSJ9LHsiZXhhbXBsZSI6IkEgZmlyZSBzdGF0aW9uIGJ1cm5lZCBkb3duLiIsImRldmljZSI6Imlyb255In0seyJleGFtcGxlIjoiVGhlIHNpbGVuY2Ugd2FzIGRlYWZlbmluZy4iLCJkZXZpY2UiOiJveHltb3JvbiJ9LHsiZXhhbXBsZSI6IkRlYXRoIGxheSBoaXMgaWN5IGhhbmQgb24ga2luZ3MuIiwiZGV2aWNlIjoicGVyc29uaWZpY2F0aW9uIn0seyJleGFtcGxlIjoiVGhlIGNyYXNoIG9mIHRodW5kZXIgc2hvb2sgdGhlIGhvdXNlLiIsImRldmljZSI6Im9ub21hdG9wb2VpYSJ9LHsiZXhhbXBsZSI6IlRoaXMgaXMgYSBqdW1ibyBzaHJpbXAgb2YgYSBwcm9ibGVtLiIsImRldmljZSI6Im94eW1vcm9uIn0seyJleGFtcGxlIjoiSGUncyBiZWVuIHdvcmtpbmcgbGlrZSBhIG1hY2hpbmUgYWxsIGRheS4iLCJkZXZpY2UiOiJzaW1pbGUifSx7ImV4YW1wbGUiOiJUaGUgd29ybGQgaXMgYSBzdGFnZS4iLCJkZXZpY2UiOiJtZXRhcGhvciJ9LHsiZXhhbXBsZSI6IlRoZSB3aW5kIGhvd2xlZCB0aHJvdWdoIHRoZSBlbXB0eSBzdHJlZXRzLiIsImRldmljZSI6InBlcnNvbmlmaWNhdGlvbiJ9LHsiZXhhbXBsZSI6IlRoZSBzaXp6bGluZyBiYWNvbiBwb3BwZWQgaW4gdGhlIHBhbi4iLCJkZXZpY2UiOiJvbm9tYXRvcG9laWEifSx7ImV4YW1wbGUiOiJJdCB3YXMgc28gY29sZCB0aGF0IGV2ZW4gdGhlIHBlbmd1aW5zIHdvcmUgamFja2V0cy4iLCJkZXZpY2UiOiJoeXBlcmJvbGUifSx7ImV4YW1wbGUiOiJIZXIgdm9pY2Ugd2FzIG11c2ljIHRvIGhpcyBlYXJzLiIsImRldmljZSI6Im1ldGFwaG9yIn1d");

function literaryDevices(): Topic {
  const items = LITERARY_DEVICES.map((l) => ({
    prompt: `Identify the literary device: "${l.example}"`,
    answer: l.device,
    explanation: `The technique is ${l.device}: it ${DEFINITIONS[l.device]}.`,
  }));
  return bankMCQ("literary-devices", "Literary devices", items, LITERARY_DEVICES.map((l) => l.device));
}

const WORD_ROOTS: { root: string; meaning: string; example: string }[] = unpack("W3sicm9vdCI6ImJpbyIsIm1lYW5pbmciOiJsaWZlIiwiZXhhbXBsZSI6ImJpb2xvZ3kifSx7InJvb3QiOiJncmFwaCIsIm1lYW5pbmciOiJ3cml0ZSIsImV4YW1wbGUiOiJhdXRvZ3JhcGgifSx7InJvb3QiOiJ0ZWxlIiwibWVhbmluZyI6ImZhciIsImV4YW1wbGUiOiJ0ZWxlc2NvcGUifSx7InJvb3QiOiJhdWQiLCJtZWFuaW5nIjoiaGVhciIsImV4YW1wbGUiOiJhdWRpZW5jZSJ9LHsicm9vdCI6InZpcy92aWQiLCJtZWFuaW5nIjoic2VlIiwiZXhhbXBsZSI6InZpc2libGUifSx7InJvb3QiOiJjaHJvbiIsIm1lYW5pbmciOiJ0aW1lIiwiZXhhbXBsZSI6ImNocm9ub2xvZ3kifSx7InJvb3QiOiJnZW8iLCJtZWFuaW5nIjoiZWFydGgiLCJleGFtcGxlIjoiZ2VvZ3JhcGh5In0seyJyb290IjoicGhvbiIsIm1lYW5pbmciOiJzb3VuZCIsImV4YW1wbGUiOiJ0ZWxlcGhvbmUifSx7InJvb3QiOiJwb3J0IiwibWVhbmluZyI6ImNhcnJ5IiwiZXhhbXBsZSI6InRyYW5zcG9ydCJ9LHsicm9vdCI6InNjcmliL3NjcmlwdCIsIm1lYW5pbmciOiJ3cml0ZSIsImV4YW1wbGUiOiJtYW51c2NyaXB0In0seyJyb290IjoiZGljdCIsIm1lYW5pbmciOiJzcGVhayIsImV4YW1wbGUiOiJwcmVkaWN0In0seyJyb290Ijoic3BlY3QiLCJtZWFuaW5nIjoibG9vayIsImV4YW1wbGUiOiJpbnNwZWN0In0seyJyb290IjoibWl0L21pc3MiLCJtZWFuaW5nIjoic2VuZCIsImV4YW1wbGUiOiJ0cmFuc21pdCJ9LHsicm9vdCI6InJ1cHQiLCJtZWFuaW5nIjoiYnJlYWsiLCJleGFtcGxlIjoiaW50ZXJydXB0In1d");

function wordRoots(): Topic {
  const items = WORD_ROOTS.map((w) => ({
    prompt: `What does the root "${w.root}" mean, as in "${w.example}"?`,
    answer: w.meaning,
    explanation: `The root "${w.root}" comes from Greek or Latin and means "${w.meaning}". You can see it in "${w.example}", which is about the idea of "${w.meaning}".`,
  }));
  return bankFill("word-roots", "Word roots", items);
}

const RUN_ON_SENTENCES: [string, string][] = unpack("W1siSSB3ZW50IHRvIHRoZSBzaG9wIEkgYm91Z2h0IHNvbWUgbWlsay4iLCJJIHdlbnQgdG8gdGhlIHNob3AuIEkgYm91Z2h0IHNvbWUgbWlsay4iXSxbIkl0IHN0YXJ0ZWQgdG8gcmFpbiB3ZSByYW4gaW5zaWRlLiIsIkl0IHN0YXJ0ZWQgdG8gcmFpbiwgc28gd2UgcmFuIGluc2lkZS4iXSxbIlNoZSBsb3ZlcyB0byByZWFkIHNoZSB2aXNpdHMgdGhlIGxpYnJhcnkgZXZlcnkgd2Vlay4iLCJTaGUgbG92ZXMgdG8gcmVhZCwgYW5kIHNoZSB2aXNpdHMgdGhlIGxpYnJhcnkgZXZlcnkgd2Vlay4iXSxbIkhlIHdhcyB0aXJlZCBoZSBrZXB0IHdvcmtpbmcuIiwiSGUgd2FzIHRpcmVkLCBidXQgaGUga2VwdCB3b3JraW5nLiJdLFsiVGhlIG1vdmllIHdhcyBsb25nIHdlIHN0aWxsIGVuam95ZWQgaXQuIiwiVGhlIG1vdmllIHdhcyBsb25nLCBidXQgd2Ugc3RpbGwgZW5qb3llZCBpdC4iXSxbIldlIGFycml2ZWQgZWFybHkgdGhlIGRvb3JzIHdlcmUgc3RpbGwgbG9ja2VkLiIsIldlIGFycml2ZWQgZWFybHksIGJ1dCB0aGUgZG9vcnMgd2VyZSBzdGlsbCBsb2NrZWQuIl0sWyJUaGUgc3VuIHNldCB0aGUgc2t5IHR1cm5lZCBvcmFuZ2UuIiwiVGhlIHN1biBzZXQsIGFuZCB0aGUgc2t5IHR1cm5lZCBvcmFuZ2UuIl0sWyJJIGNhbGxlZCBoZXIgdHdpY2Ugc2hlIG5ldmVyIGFuc3dlcmVkLiIsIkkgY2FsbGVkIGhlciB0d2ljZSwgYnV0IHNoZSBuZXZlciBhbnN3ZXJlZC4iXSxbIlRoZSByZWNpcGUgbG9va2VkIHNpbXBsZSBpdCB0b29rIGhvdXJzIHRvIG1ha2UuIiwiVGhlIHJlY2lwZSBsb29rZWQgc2ltcGxlLCBidXQgaXQgdG9vayBob3VycyB0byBtYWtlLiJdLFsiVGhlIGJ1cyB3YXMgbGF0ZSB3ZSB3YWxrZWQgdG8gc2Nob29sLiIsIlRoZSBidXMgd2FzIGxhdGUsIHNvIHdlIHdhbGtlZCB0byBzY2hvb2wuIl0sWyJJIGxvdmUgcGl6emEgbXkgYnJvdGhlciBwcmVmZXJzIHBhc3RhLiIsIkkgbG92ZSBwaXp6YSwgYnV0IG15IGJyb3RoZXIgcHJlZmVycyBwYXN0YS4iXV0=");

function fixRunOnSentences(): Topic {
  const items = RUN_ON_SENTENCES.map(([runOn, fixed]) => ({
    prompt: `Fix this run-on sentence: "${runOn}"`,
    answer: fixed,
    explanation: `A run-on sentence joins two complete sentences with no punctuation or joining word. Fix it with a full stop, or with a comma and a joining word (and, but, so). Correct: "${fixed}"`,
  }));
  return bankFill("run-on-sentences", "Fixing run-on sentences", items);
}

// ---------- Grades 11-12 ----------

const ADVANCED_VOCAB: { word: string; meaning: string; distractors: string[] }[] = unpack("W3sid29yZCI6InViaXF1aXRvdXMiLCJtZWFuaW5nIjoicHJlc2VudCBldmVyeXdoZXJlIiwiZGlzdHJhY3RvcnMiOlsicmFyZSIsImV4cGVuc2l2ZSIsImRhbmdlcm91cyJdfSx7IndvcmQiOiJlcGhlbWVyYWwiLCJtZWFuaW5nIjoibGFzdGluZyBhIHNob3J0IHRpbWUiLCJkaXN0cmFjdG9ycyI6WyJwZXJtYW5lbnQiLCJlbm9ybW91cyIsImNvbG91cmZ1bCJdfSx7IndvcmQiOiJjb2dlbnQiLCJtZWFuaW5nIjoiY2xlYXIgYW5kIGNvbnZpbmNpbmciLCJkaXN0cmFjdG9ycyI6WyJjb25mdXNpbmciLCJib3JpbmciLCJhZ2dyZXNzaXZlIl19LHsid29yZCI6ImFtYml2YWxlbnQiLCJtZWFuaW5nIjoiaGF2aW5nIG1peGVkIGZlZWxpbmdzIiwiZGlzdHJhY3RvcnMiOlsiY29uZmlkZW50IiwiZnVyaW91cyIsImluZGlmZmVyZW50Il19LHsid29yZCI6InByYWdtYXRpYyIsIm1lYW5pbmciOiJwcmFjdGljYWwiLCJkaXN0cmFjdG9ycyI6WyJpZGVhbGlzdGljIiwiZW1vdGlvbmFsIiwiY2hhb3RpYyJdfSx7IndvcmQiOiJtZXRpY3Vsb3VzIiwibWVhbmluZyI6InZlcnkgY2FyZWZ1bCBhbmQgcHJlY2lzZSIsImRpc3RyYWN0b3JzIjpbImNhcmVsZXNzIiwiaHVycmllZCIsImdlbmVyb3VzIl19LHsid29yZCI6InJlc2lsaWVudCIsIm1lYW5pbmciOiJhYmxlIHRvIHJlY292ZXIgcXVpY2tseSIsImRpc3RyYWN0b3JzIjpbImZyYWdpbGUiLCJzdHViYm9ybiIsImxvdWQiXX0seyJ3b3JkIjoiY2FuZGlkIiwibWVhbmluZyI6ImhvbmVzdCBhbmQgZGlyZWN0IiwiZGlzdHJhY3RvcnMiOlsic2VjcmV0aXZlIiwic2h5IiwiYXJyb2dhbnQiXX0seyJ3b3JkIjoiYXVzdGVyZSIsIm1lYW5pbmciOiJwbGFpbiBhbmQgc2V2ZXJlIiwiZGlzdHJhY3RvcnMiOlsibHV4dXJpb3VzIiwiY29sb3VyZnVsIiwiZnJpZW5kbHkiXX0seyJ3b3JkIjoiYmVuZXZvbGVudCIsIm1lYW5pbmciOiJraW5kIGFuZCBnZW5lcm91cyIsImRpc3RyYWN0b3JzIjpbImNydWVsIiwic2VsZmlzaCIsIm5lcnZvdXMiXX0seyJ3b3JkIjoiY29uc3BpY3VvdXMiLCJtZWFuaW5nIjoiZWFzaWx5IG5vdGljZWQiLCJkaXN0cmFjdG9ycyI6WyJoaWRkZW4iLCJib3JpbmciLCJzbWFsbCJdfSx7IndvcmQiOiJ2aW5kaWNhdGUiLCJtZWFuaW5nIjoiY2xlYXIgb2YgYmxhbWUiLCJkaXN0cmFjdG9ycyI6WyJhY2N1c2UiLCJpZ25vcmUiLCJwdW5pc2giXX0seyJ3b3JkIjoiaW1wZXR1b3VzIiwibWVhbmluZyI6ImFjdGluZyB3aXRob3V0IHRoaW5raW5nIiwiZGlzdHJhY3RvcnMiOlsiY2FyZWZ1bCIsInBhdGllbnQiLCJzaHkiXX0seyJ3b3JkIjoiZmFzdGlkaW91cyIsIm1lYW5pbmciOiJ2ZXJ5IGF0dGVudGl2ZSB0byBkZXRhaWwiLCJkaXN0cmFjdG9ycyI6WyJjYXJlbGVzcyIsImxhenkiLCJnZW5lcm91cyJdfSx7IndvcmQiOiJvYnNlcXVpb3VzIiwibWVhbmluZyI6ImV4Y2Vzc2l2ZWx5IGVhZ2VyIHRvIHBsZWFzZSIsImRpc3RyYWN0b3JzIjpbInJlYmVsbGlvdXMiLCJpbmRpZmZlcmVudCIsImNvbmZpZGVudCJdfSx7IndvcmQiOiJwcnVkZW50IiwibWVhbmluZyI6InNlbnNpYmxlIGFuZCBjYXV0aW91cyIsImRpc3RyYWN0b3JzIjpbInJlY2tsZXNzIiwiYXJyb2dhbnQiLCJuYWl2ZSJdfSx7IndvcmQiOiJsdWNpZCIsIm1lYW5pbmciOiJjbGVhciBhbmQgZWFzeSB0byB1bmRlcnN0YW5kIiwiZGlzdHJhY3RvcnMiOlsiY29uZnVzaW5nIiwibGVuZ3RoeSIsImhpZGRlbiJdfSx7IndvcmQiOiJncmVnYXJpb3VzIiwibWVhbmluZyI6InNvY2lhYmxlIGFuZCBlbmpveXMgY29tcGFueSIsImRpc3RyYWN0b3JzIjpbInNoeSIsImFuZ3J5IiwiZ3JlZWR5Il19LHsid29yZCI6ImxhY29uaWMiLCJtZWFuaW5nIjoidXNpbmcgdmVyeSBmZXcgd29yZHMiLCJkaXN0cmFjdG9ycyI6WyJ0YWxrYXRpdmUiLCJsb3VkIiwicnVkZSJdfSx7IndvcmQiOiJjYXByaWNpb3VzIiwibWVhbmluZyI6ImNoYW5naW5nIG1vb2Qgb3IgYmVoYXZpb3VyIHN1ZGRlbmx5IiwiZGlzdHJhY3RvcnMiOlsic3RlYWR5IiwiZ2VuZXJvdXMiLCJjbGV2ZXIiXX0seyJ3b3JkIjoiZWxvcXVlbnQiLCJtZWFuaW5nIjoiZmx1ZW50IGFuZCBwZXJzdWFzaXZlIGluIHNwZWVjaCIsImRpc3RyYWN0b3JzIjpbImhlc2l0YW50IiwiY29uZnVzZWQiLCJxdWlldCJdfSx7IndvcmQiOiJwZXJuaWNpb3VzIiwibWVhbmluZyI6ImhhdmluZyBhIGhhcm1mdWwgZWZmZWN0LCBvZnRlbiBncmFkdWFsbHkiLCJkaXN0cmFjdG9ycyI6WyJoZWxwZnVsIiwib2J2aW91cyIsInN1ZGRlbiJdfV0=");

function advancedVocabulary(): Topic {
  return {
    id: "advanced-vocab",
    label: "Advanced vocabulary",
    generate: () => {
      const item = ADVANCED_VOCAB[Math.floor(Math.random() * ADVANCED_VOCAB.length)];
      const options = [item.meaning, ...item.distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `What does "${item.word}" mean?`,
        answer: item.meaning,
        options,
        explanation: `"${item.word}" means "${item.meaning}". The other options describe different meanings: ${item.distractors.join(", ")}.`,
      };
    },
  };
}

const RHETORICAL_TECHNIQUES: { example: string; technique: string }[] = unpack("W3siZXhhbXBsZSI6IldlIHNoYWxsIGZpZ2h0IG9uIHRoZSBiZWFjaGVzLCB3ZSBzaGFsbCBmaWdodCBvbiB0aGUgbGFuZGluZyBncm91bmRzLi4uIiwidGVjaG5pcXVlIjoiYW5hcGhvcmEifSx7ImV4YW1wbGUiOiJJcyBpdCBub3QgdGltZSB3ZSBkZW1hbmRlZCBiZXR0ZXIgZnJvbSBvdXIgbGVhZGVycz8iLCJ0ZWNobmlxdWUiOiJyaGV0b3JpY2FsIHF1ZXN0aW9uIn0seyJleGFtcGxlIjoiQXMgdGhlIGxlYWRpbmcgZXhwZXJ0IGhhcyBjb25maXJtZWQsIHRoaXMgcG9saWN5IHdvcmtzLiIsInRlY2huaXF1ZSI6ImFwcGVhbCB0byBhdXRob3JpdHkifSx7ImV4YW1wbGUiOiJUaGVzZSByZWNrbGVzcyBjcmltaW5hbHMgdGhyZWF0ZW4gZXZlcnl0aGluZyB3ZSBob2xkIGRlYXIuIiwidGVjaG5pcXVlIjoibG9hZGVkIGxhbmd1YWdlIn0seyJleGFtcGxlIjoiRWl0aGVyIHdlIGFjdCBub3csIG9yIHdlIGxvc2UgZXZlcnl0aGluZy4iLCJ0ZWNobmlxdWUiOiJmYWxzZSBkaWNob3RvbXkifSx7ImV4YW1wbGUiOiJGcmVlZG9tLiBPcHBvcnR1bml0eS4gUHJvc3Blcml0eS4gVGhhdCBpcyB3aGF0IHdlIG9mZmVyLiIsInRlY2huaXF1ZSI6ImFzeW5kZXRvbiJ9LHsiZXhhbXBsZSI6IkFzayBub3Qgd2hhdCB5b3VyIGNvdW50cnkgY2FuIGRvIGZvciB5b3UuIiwidGVjaG5pcXVlIjoiYW50aXRoZXNpcyJ9LHsiZXhhbXBsZSI6IlRoaXMgc28tY2FsbGVkICdleHBlcnQnIGhhcyBuZXZlciBldmVuIHJ1biBhIGJ1c2luZXNzLiIsInRlY2huaXF1ZSI6ImFkIGhvbWluZW0ifSx7ImV4YW1wbGUiOiJJdCB3YXMgdGhlIGJlc3Qgb2YgdGltZXMsIGl0IHdhcyB0aGUgd29yc3Qgb2YgdGltZXMuIiwidGVjaG5pcXVlIjoiYW50aXRoZXNpcyJ9LHsiZXhhbXBsZSI6IkkgaGF2ZSBhIGRyZWFtIHRoYXQgb25lIGRheSB0aGlzIG5hdGlvbiB3aWxsIHJpc2UgdXAuIEkgaGF2ZSBhIGRyZWFtIHRoYXQgYWxsIHBlb3BsZSB3aWxsIGJlIGZyZWUuIiwidGVjaG5pcXVlIjoiYW5hcGhvcmEifSx7ImV4YW1wbGUiOiJJZiB3ZSBiYW4gdGhpcywgbmV4dCB0aGV5IHdpbGwgYmFuIGV2ZXJ5dGhpbmcgd2UgbG92ZS4iLCJ0ZWNobmlxdWUiOiJzbGlwcGVyeSBzbG9wZSJ9LHsiZXhhbXBsZSI6IlRoaW5rIG9mIHRoZSBwb29yIGNoaWxkcmVuIHdobyB3aWxsIHN1ZmZlciBpZiB5b3Ugdm90ZSBuby4iLCJ0ZWNobmlxdWUiOiJhcHBlYWwgdG8gZW1vdGlvbiJ9XQ==");

function rhetoricalTechniques(): Topic {
  const items = RHETORICAL_TECHNIQUES.map((r) => ({
    prompt: `Identify the technique used in: "${r.example}"`,
    answer: r.technique,
    explanation: `The technique is ${r.technique}: it ${DEFINITIONS[r.technique]}.`,
  }));
  return bankMCQ(
    "rhetorical-techniques",
    "Rhetorical techniques",
    items,
    RHETORICAL_TECHNIQUES.map((r) => r.technique),
  );
}

const ADVANCED_GRAMMAR_EDITING: [string, string][] = unpack("W1siRWFjaCBvZiB0aGUgc3R1ZGVudHMgaGF2ZSBzdWJtaXR0ZWQgdGhlaXIgZXNzYXkuIiwiRWFjaCBvZiB0aGUgc3R1ZGVudHMgaGFzIHN1Ym1pdHRlZCBoaXMgb3IgaGVyIGVzc2F5LiJdLFsiV2Fsa2luZyBpbnRvIHRoZSByb29tLCB0aGUgbGlnaHRzIHdlcmUgdHVybmVkIG9uIGJ5IGhlci4iLCJXYWxraW5nIGludG8gdGhlIHJvb20sIHNoZSB0dXJuZWQgb24gdGhlIGxpZ2h0cy4iXSxbIlRoZSBkYXRhIHNob3dzIHRoYXQgdGhlIHJlc3VsdHMgYXJlIGluY29uY2x1c2l2ZSwgaXQgbmVlZHMgbW9yZSBhbmFseXNpcy4iLCJUaGUgZGF0YSBzaG93cyB0aGF0IHRoZSByZXN1bHRzIGFyZSBpbmNvbmNsdXNpdmU7IGl0IG5lZWRzIG1vcmUgYW5hbHlzaXMuIl0sWyJCeSB0aGUgdGltZSB3ZSBhcnJpdmVkLCB0aGUgbWVldGluZyBhbHJlYWR5IHN0YXJ0ZWQuIiwiQnkgdGhlIHRpbWUgd2UgYXJyaXZlZCwgdGhlIG1lZXRpbmcgaGFkIGFscmVhZHkgc3RhcnRlZC4iXSxbIk9uZSBzaG91bGQgYWx3YXlzIHByb29mcmVhZCB5b3VyIHdvcmsuIiwiT25lIHNob3VsZCBhbHdheXMgcHJvb2ZyZWFkIG9uZSdzIG93biB3b3JrLiJdLFsiSGF2aW5nIGZpbmlzaGVkIHRoZSBleGFtLCB0aGUgcm9vbSBmZWx0IHF1aWV0LiIsIkhhdmluZyBmaW5pc2hlZCB0aGUgZXhhbSwgc2hlIG5vdGljZWQgdGhlIHJvb20gZmVsdCBxdWlldC4iXSxbIkl0cyBpbXBvcnRhbnQgdGhhdCBldmVyeW9uZSBzdWJtaXRzIHRoZWlyIGZvcm0gb24gdGltZS4iLCJJdCdzIGltcG9ydGFudCB0aGF0IGV2ZXJ5b25lIHN1Ym1pdHMgdGhlaXIgZm9ybSBvbiB0aW1lLiJdLFsiVGhlIGNvbXBhbnkgYXJlIHBsYW5uaW5nIHRvIHJlbG9jYXRlIGl0cyBoZWFkcXVhcnRlcnMuIiwiVGhlIGNvbXBhbnkgaXMgcGxhbm5pbmcgdG8gcmVsb2NhdGUgaXRzIGhlYWRxdWFydGVycy4iXSxbIkhlIGlzIG9uZSBvZiB0aGUgc3R1ZGVudHMgd2hvIGlzIGFsd2F5cyBvbiB0aW1lLiIsIkhlIGlzIG9uZSBvZiB0aGUgc3R1ZGVudHMgd2hvIGFyZSBhbHdheXMgb24gdGltZS4iXSxbIlRoZSBjb21taXR0ZWUgaGF2ZSBtYWRlIGl0cyBkZWNpc2lvbi4iLCJUaGUgY29tbWl0dGVlIGhhcyBtYWRlIGl0cyBkZWNpc2lvbi4iXSxbIlJ1bm5pbmcgdG8gY2F0Y2ggdGhlIGJ1cywgaGVyIGJhZyBmZWxsIG9wZW4uIiwiUnVubmluZyB0byBjYXRjaCB0aGUgYnVzLCBzaGUgbGV0IGhlciBiYWcgZmFsbCBvcGVuLiJdLFsiTmVpdGhlciB0aGUgdGVhY2hlciBub3IgdGhlIHN0dWRlbnRzIHdhcyByZWFkeS4iLCJOZWl0aGVyIHRoZSB0ZWFjaGVyIG5vciB0aGUgc3R1ZGVudHMgd2VyZSByZWFkeS4iXV0=");

function advancedGrammarEditing(): Topic {
  const items = ADVANCED_GRAMMAR_EDITING.map(([wrong, right]) => ({
    prompt: `Correct the error: "${wrong}"`,
    answer: right,
    explanation: editExplanation(wrong, right),
  }));
  return bankFill("advanced-grammar", "Advanced grammar editing", items);
}

const TEXT_PURPOSE: { excerpt: string; purpose: string }[] = unpack("W3siZXhjZXJwdCI6Ik1peCB0d28gY3VwcyBvZiBmbG91ciB3aXRoIG9uZSB0ZWFzcG9vbiBvZiBiYWtpbmcgc29kYS4iLCJwdXJwb3NlIjoidG8gaW5zdHJ1Y3QifSx7ImV4Y2VycHQiOiJWb3RlIHllcyB0byBwcm90ZWN0IG91ciBsb2NhbCBwYXJrcyBmb3IgZnV0dXJlIGdlbmVyYXRpb25zLiIsInB1cnBvc2UiOiJ0byBwZXJzdWFkZSJ9LHsiZXhjZXJwdCI6IlRoZSBidXN0bGluZyBtYXJrZXRzIG9mIE1hcnJha2VjaCBvdmVyd2hlbG1lZCB0aGUgc2Vuc2VzLiIsInB1cnBvc2UiOiJ0byBkZXNjcmliZSJ9LHsiZXhjZXJwdCI6IlVuZW1wbG95bWVudCBmZWxsIGJ5IDAuNCUgaW4gdGhlIGxhc3QgcXVhcnRlciwgbmV3IGRhdGEgc2hvd3MuIiwicHVycG9zZSI6InRvIGluZm9ybSJ9LHsiZXhjZXJwdCI6Ik9uY2UgdXBvbiBhIHRpbWUsIGluIGEgdmlsbGFnZSBieSB0aGUgc2VhLCBsaXZlZCBhIGN1cmlvdXMgZ2lybC4iLCJwdXJwb3NlIjoidG8gZW50ZXJ0YWluIn0seyJleGNlcnB0IjoiVHVybiBvZmYgdGhlIHBvd2VyIHN1cHBseSBiZWZvcmUgcmVtb3ZpbmcgdGhlIGJhY2sgcGFuZWwuIiwicHVycG9zZSI6InRvIGluc3RydWN0In0seyJleGNlcnB0IjoiVGhpcyBwb2xpY3kgd2lsbCBkZXZhc3RhdGUgc21hbGwgYnVzaW5lc3NlcyBhY3Jvc3MgdGhlIHJlZ2lvbi4iLCJwdXJwb3NlIjoidG8gcGVyc3VhZGUifSx7ImV4Y2VycHQiOiJUaGUgb2xkIGxpYnJhcnkgc21lbGxlZCBvZiBkdXN0IGFuZCBmb3Jnb3R0ZW4gc3Rvcmllcy4iLCJwdXJwb3NlIjoidG8gZGVzY3JpYmUifSx7ImV4Y2VycHQiOiJUaGUgY291bmNpbCB3aWxsIHZvdGUgb24gdGhlIG5ldyBidWRnZXQgbmV4dCBUdWVzZGF5LiIsInB1cnBvc2UiOiJ0byBpbmZvcm0ifSx7ImV4Y2VycHQiOiJQcmVoZWF0IHRoZSBvdmVuIHRvIDE4MCBkZWdyZWVzIGFuZCBncmVhc2UgdGhlIHRpbi4iLCJwdXJwb3NlIjoidG8gaW5zdHJ1Y3QifSx7ImV4Y2VycHQiOiJFdmVyeSBjaGlsZCBkZXNlcnZlcyBhIHNhZmUgcGxhY2UgdG8gbGVhcm4sIHNvIHBsZWFzZSBkb25hdGUgdG9kYXkuIiwicHVycG9zZSI6InRvIHBlcnN1YWRlIn0seyJleGNlcnB0IjoiTWlzdCBjdXJsZWQgYmV0d2VlbiB0aGUgcGluZXMgYXMgdGhlIHN1biBjcmVwdCBvdmVyIHRoZSByaWRnZS4iLCJwdXJwb3NlIjoidG8gZGVzY3JpYmUifV0=");

function textPurpose(): Topic {
  const items = TEXT_PURPOSE.map((t) => ({
    prompt: `What is the main purpose of this text: "${t.excerpt}"?`,
    answer: t.purpose,
    explanation: `The purpose is ${t.purpose}: writing like this ${DEFINITIONS[t.purpose]}.`,
  }));
  return bankMCQ("text-purpose", "Text purpose", items, TEXT_PURPOSE.map((t) => t.purpose));
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

const IDIOMS: { idiom: string; meaning: string; distractors: string[] }[] = unpack("W3siaWRpb20iOiJiaXRlIHRoZSBidWxsZXQiLCJtZWFuaW5nIjoiZmFjZSBhIGRpZmZpY3VsdCBzaXR1YXRpb24gYnJhdmVseSIsImRpc3RyYWN0b3JzIjpbImF2b2lkIGEgcHJvYmxlbSIsImNlbGVicmF0ZSBhIHdpbiIsImdpdmUgdXAgcXVpY2tseSJdfSx7ImlkaW9tIjoiY29zdCBhbiBhcm0gYW5kIGEgbGVnIiwibWVhbmluZyI6ImJlIHZlcnkgZXhwZW5zaXZlIiwiZGlzdHJhY3RvcnMiOlsiYmUgZnJlZSIsImJlIGRhbmdlcm91cyIsImJlIHF1aWNrIl19LHsiaWRpb20iOiJvbmNlIGluIGEgYmx1ZSBtb29uIiwibWVhbmluZyI6InZlcnkgcmFyZWx5IiwiZGlzdHJhY3RvcnMiOlsidmVyeSBvZnRlbiIsImF0IG1pZG5pZ2h0IiwidW5leHBlY3RlZGx5Il19LHsiaWRpb20iOiJ0aGUgYmFsbCBpcyBpbiB5b3VyIGNvdXJ0IiwibWVhbmluZyI6Iml0J3MgeW91ciBkZWNpc2lvbiBub3ciLCJkaXN0cmFjdG9ycyI6WyJ5b3UgYXJlIGxvc2luZyIsInRoZSBnYW1lIGlzIG92ZXIiLCJpdCdzIGEgdGVhbSBlZmZvcnQiXX0seyJpZGlvbSI6ImxldCB0aGUgY2F0IG91dCBvZiB0aGUgYmFnIiwibWVhbmluZyI6InJldmVhbCBhIHNlY3JldCIsImRpc3RyYWN0b3JzIjpbImNhdXNlIGNoYW9zIiwiYWRvcHQgYSBwZXQiLCJtYWtlIGEgbWlzdGFrZSJdfSx7ImlkaW9tIjoiYnVybiB0aGUgbWlkbmlnaHQgb2lsIiwibWVhbmluZyI6IndvcmsgbGF0ZSBpbnRvIHRoZSBuaWdodCIsImRpc3RyYWN0b3JzIjpbIndhc3RlIHRpbWUiLCJzdGFydCBhIGZpcmUiLCJ3YWtlIHVwIGVhcmx5Il19LHsiaWRpb20iOiJhIGJsZXNzaW5nIGluIGRpc2d1aXNlIiwibWVhbmluZyI6InNvbWV0aGluZyBnb29kIHRoYXQgc2VlbWVkIGJhZCBhdCBmaXJzdCIsImRpc3RyYWN0b3JzIjpbImFuIG9idmlvdXMgZ2lmdCIsImJhZCBsdWNrIiwiYSByZWxpZ2lvdXMgZXZlbnQiXX0seyJpZGlvbSI6ImJlYXQgYXJvdW5kIHRoZSBidXNoIiwibWVhbmluZyI6ImF2b2lkIGdldHRpbmcgdG8gdGhlIHBvaW50IiwiZGlzdHJhY3RvcnMiOlsid29yayBvdXRkb29ycyIsImFyZ3VlIGxvdWRseSIsInNwZWFrIGhvbmVzdGx5Il19XQ==");

function idioms(): Topic {
  const items = IDIOMS.map((i) => ({
    prompt: `What does the idiom "${i.idiom}" mean?`,
    answer: i.meaning,
    distractors: i.distractors,
    explanation: `"${i.idiom}" is an idiom, so it does not mean what the words literally say. It means "${i.meaning}".`,
  }));
  return {
    id: "idioms",
    label: "Idioms and expressions",
    generate: () => {
      const item = pick(items);
      const options = [item.answer, ...item.distractors].sort(() => Math.random() - 0.5);
      return { prompt: item.prompt, answer: item.answer, options, explanation: item.explanation };
    },
  };
}

const TONE_EXAMPLES: { excerpt: string; tone: string }[] = unpack("W3siZXhjZXJwdCI6IkhvdyB3b25kZXJmdWwg4oCUIGFub3RoZXIgTW9uZGF5IG1vcm5pbmcgbWVldGluZy4iLCJ0b25lIjoic2FyY2FzdGljIn0seyJleGNlcnB0IjoiV2UgbXVzdCBhY3QgaW1tZWRpYXRlbHk7IGV2ZXJ5IHNlY29uZCB3ZSBkZWxheSBjb3N0cyBsaXZlcy4iLCJ0b25lIjoidXJnZW50In0seyJleGNlcnB0IjoiSSByZW1lbWJlciB0aGUgc21lbGwgb2YgR3JhbmRtYSdzIGtpdGNoZW4gZXZlcnkgYXV0dW1uLiIsInRvbmUiOiJub3N0YWxnaWMifSx7ImV4Y2VycHQiOiJUaGUgdW5kZXJzaWduZWQgaGVyZWJ5IGFncmVlcyB0byB0aGUgdGVybXMgb3V0bGluZWQgYWJvdmUuIiwidG9uZSI6ImZvcm1hbCJ9LHsiZXhjZXJwdCI6IkhvbmVzdGx5LCB3aG8gZXZlbiBjYXJlcyBhbnltb3JlPyIsInRvbmUiOiJpbmRpZmZlcmVudCJ9LHsiZXhjZXJwdCI6IkkgYW0gYWJzb2x1dGVseSB0aHJpbGxlZCB0byBhbm5vdW5jZSB0aGlzIGluY3JlZGlibGUgbmV3cyEiLCJ0b25lIjoiZW50aHVzaWFzdGljIn1d");

function toneAnalysis(): Topic {
  const items = TONE_EXAMPLES.map((t) => ({
    prompt: `What is the tone of: "${t.excerpt}"?`,
    answer: t.tone,
    explanation: `The tone is ${t.tone}: writing like this ${DEFINITIONS[t.tone]}.`,
  }));
  return bankMCQ("tone-analysis", "Analysing tone", items, TONE_EXAMPLES.map((t) => t.tone));
}

function advancedEnglishExtras(grade: number): Topic[] {
  if (grade <= 2) return [synonymsEasy(), antonymsMid()];
  if (grade <= 4) return [verbTenses(), figurativeLanguage()];
  if (grade <= 6) return [activePassive(), clauseTypes()];
  if (grade <= 8) return [grammarEditing(), literaryDevices()];
  if (grade <= 10) return [advancedVocabulary(), rhetoricalTechniques()];
  return [idioms(), toneAnalysis()];
}

// ---------- Cambridge International extras (Grade 9+) ----------

const REGISTER_EXAMPLES: { casual: string; formal: string }[] = unpack("W3siY2FzdWFsIjoiSGV5LCBjYW4geW91IHNlbmQgbWUgdGhhdCBmaWxlPyIsImZvcm1hbCI6IkNvdWxkIHlvdSBwbGVhc2Ugc2VuZCBtZSB0aGF0IGZpbGU/In0seyJjYXN1YWwiOiJZZWFoLCBJIHJlY2tvbiB0aGF0J3MgYSBnb29kIGlkZWEuIiwiZm9ybWFsIjoiWWVzLCBJIGJlbGlldmUgdGhhdCBpcyBhIGdvb2QgaWRlYS4ifSx7ImNhc3VhbCI6IlNvcnJ5LCBjYW4ndCBtYWtlIGl0LCBnb3R0YSBiYWlsLiIsImZvcm1hbCI6IlVuZm9ydHVuYXRlbHksIEkgYW0gdW5hYmxlIHRvIGF0dGVuZC4ifSx7ImNhc3VhbCI6IlRoYW5rcyBoZWFwcyBmb3IgeW91ciBoZWxwISIsImZvcm1hbCI6IlRoYW5rIHlvdSB2ZXJ5IG11Y2ggZm9yIHlvdXIgYXNzaXN0YW5jZS4ifSx7ImNhc3VhbCI6IkxldCdzIGdyYWIgYSBjb2ZmZWUgc29tZXRpbWUuIiwiZm9ybWFsIjoiUGVyaGFwcyB3ZSBjb3VsZCBhcnJhbmdlIHRvIG1lZXQgZm9yIGNvZmZlZS4ifV0=");

function formalInformalRegister(): Topic {
  const items = REGISTER_EXAMPLES.map((r) => ({
    prompt: `Rewrite this informally-worded sentence in a formal register: "${r.casual}"`,
    answer: r.formal,
    explanation: `Formal writing avoids slang and casual phrases, and uses polite, complete wording. Formal version: "${r.formal}"`,
  }));
  return bankFill("register", "Formal and informal register", items);
}

const INFERENCE_EXAMPLES: { passage: string; inference: string; distractors: string[] }[] = unpack("W3sicGFzc2FnZSI6Ik1hcmlhIGNoZWNrZWQgaGVyIHdhdGNoIGZvciB0aGUgdGhpcmQgdGltZSBhbmQgZ2xhbmNlZCBhdCB0aGUgZW1wdHkgZG9vcndheSBhZ2Fpbi4iLCJpbmZlcmVuY2UiOiJTaGUgaXMgd2FpdGluZyBhbnhpb3VzbHkgZm9yIHNvbWVvbmUgd2hvIGlzIGxhdGUiLCJkaXN0cmFjdG9ycyI6WyJTaGUgaGFzIG5vd2hlcmUgdG8gYmUiLCJTaGUgaXMgYWJvdXQgdG8gbGVhdmUgdGhlIGJ1aWxkaW5nIiwiU2hlIGRpc2xpa2VzIHdlYXJpbmcgd2F0Y2hlcyJdfSx7InBhc3NhZ2UiOiJUaGUgY29hY2ggYmVuY2hlZCB0aGVpciBzdGFyIHBsYXllciBmb3IgdGhlIGZpbmFsIHF1YXJ0ZXIgd2l0aG91dCBhbnkgZXhwbGFuYXRpb24uIiwiaW5mZXJlbmNlIjoiVGhlcmUgbWF5IGJlIGEgZGlzY2lwbGluYXJ5IG9yIHN0cmF0ZWdpYyByZWFzb24gbm90IHN0YXRlZCBkaXJlY3RseSIsImRpc3RyYWN0b3JzIjpbIlRoZSBwbGF5ZXIgYXNrZWQgdG8gc2l0IG91dCIsIlRoZSB0ZWFtIHdhcyBsb3NpbmcgYmFkbHkiLCJUaGUgcGxheWVyIHdhcyBpbmp1cmVkIl19LHsicGFzc2FnZSI6IkRlc3BpdGUgdGhlIHJhaW4sIHRoZSBzdGFkaXVtIHdhcyBjb21wbGV0ZWx5IGZ1bGwgYW4gaG91ciBiZWZvcmUga2lja29mZi4iLCJpbmZlcmVuY2UiOiJUaGUgbWF0Y2ggd2FzIGhpZ2hseSBhbnRpY2lwYXRlZCBieSBmYW5zIiwiZGlzdHJhY3RvcnMiOlsiVGhlIHN0YWRpdW0gaGFzIGEgc21hbGwgY2FwYWNpdHkiLCJUaWNrZXRzIHdlcmUgZnJlZSB0aGF0IGRheSIsIlRoZSByYWluIGhhZCBqdXN0IHN0YXJ0ZWQiXX1d");

function inferenceMeaning(): Topic {
  return {
    id: "inference",
    label: "Inference and implication",
    generate: () => {
      const item = pick(INFERENCE_EXAMPLES);
      const options = [item.inference, ...item.distractors].sort(() => Math.random() - 0.5);
      return {
        prompt: `What can be inferred from: "${item.passage}"?`,
        answer: item.inference,
        options,
        explanation: `An inference is a conclusion drawn from clues in the text, not something stated directly. The clues in this passage point to: "${item.inference}".`,
      };
    },
  };
}

function cambridgeEnglishExtras(grade: number): Topic[] {
  return grade >= 9 ? [formalInformalRegister(), inferenceMeaning()] : [];
}

function baseEnglishTopics(grade: number): Topic[] {
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

export function getEnglishTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseEnglishTopics(grade);
  const advanced = difficulty === "advanced" ? advancedEnglishExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeEnglishExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}
