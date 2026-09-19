/**
 * Answer checking for online tests.
 *
 * Answers are compared leniently: case, spacing and stray punctuation are ignored,
 * numbers are compared by value (so 17250 = 17250.00), and the unit is optional.
 * If a unit is written it must mean the same thing as the expected one, so
 * "45", "45°", "45 degree" and "45 degrees" are all accepted, as are "24 cm2",
 * "24 sq cm" and "24 square centimetres" for 24 cm², but "24 cm" is not.
 */

export function normalizeAnswer(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/−/g, "-")
    .replace(/[×*]/g, "x")
    .replace(/\s*=\s*/g, "=")
    .replace(/\s*:\s*/g, ":")
    .replace(/\s+/g, " ")
    .replace(/,/g, "")
    .replace(/\.(?!\d)/g, "")
    .trim();
}

const NUMBER = /^([$£€]?)\s*(-?(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|-?\.\d+)\s*(.*)$/;

const WORD_UNITS: [RegExp, string][] = [
  [/\bkilometres?\b|\bkilometers?\b/g, "km"],
  [/\bcentimetres?\b|\bcentimeters?\b/g, "cm"],
  [/\bmillimetres?\b|\bmillimeters?\b/g, "mm"],
  [/\bmetres?\b|\bmeters?\b/g, "m"],
  [/\blitres?\b|\bliters?\b/g, "l"],
  [/\bkilograms?\b|\bkgs\b/g, "kg"],
  [/\bgrams?\b/g, "g"],
  [/\bseconds?\b|\bsecs?\b/g, "s"],
  [/\bminutes?\b|\bmins?\b/g, "min"],
  [/\bhours?\b|\bhrs?\b/g, "h"],
  [/\bdegrees?\b|\bdeg\b|°/g, "deg"],
  [/\bper ?cent\b|\bpercent\b|%/g, "%"],
  [/\bdollars?\b|\$/g, "$"],
  [/\bjoules?\b/g, "j"],
  [/\bwatts?\b/g, "w"],
  [/\bnewtons?\b/g, "n"],
  [/\bpascals?\b/g, "pa"],
  [/\bvolts?\b/g, "v"],
  [/\bamperes?\b|\bamps?\b/g, "a"],
  [/\bhertz\b/g, "hz"],
  [/\bohms?\b/g, "ohm"],
  [/\bunits?\b/g, "units"],
  [/\bper\b/g, "/"],
];

/** Reduce a unit written in any common way to one canonical form. */
export function canonicalUnit(unit: string): string {
  let u = unit.toLowerCase().trim();
  for (const [pattern, replacement] of WORD_UNITS) u = u.replace(pattern, replacement);
  u = u.replace(/\s+/g, " ").trim();
  u = u.replace(/^(?:sq\.?|square)\s*([a-z/]+)$/, (_, base: string) => `${base}2`);
  u = u.replace(/^(?:cubic|cu\.?)\s*([a-z/]+)$/, (_, base: string) => `${base}3`);
  u = u.replace(/([a-z])\s*(?:squared|\^\s*2|²|2)$/, (_, last: string) => `${last}2`);
  u = u.replace(/([a-z])\s*(?:cubed|\^\s*3|³|3)$/, (_, last: string) => `${last}3`);
  return u.replace(/[\s.·]/g, "");
}

interface Measure {
  value: number;
  unit: string;
  shownUnit: string;
}

function parseMeasure(text: string): Measure | null {
  const m = text.trim().match(NUMBER);
  if (!m) return null;
  const rest = m[3].trim();
  // A unit starts with a letter or symbol; "/4", ":30" or "× 10^5" mean a fraction, time or standard form.
  if (rest && !/^[a-z°%²³^$]/i.test(rest)) return null;
  const value = parseFloat(m[2].replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  const unit = canonicalUnit(rest) || (m[1] ? "$" : "");
  return { value, unit, shownUnit: rest || (m[1] ? m[1] : "") };
}

const closeEnough = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

const COORDINATE = /^\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?$/;

const TWO_ROOTS = /^x=(-?\d+(?:\.\d+)?) or x=(-?\d+(?:\.\d+)?)$/;

export function isCorrectAnswer(userAnswer: string, correctAnswer: string): boolean {
  const user = normalizeAnswer(userAnswer);
  const correct = normalizeAnswer(correctAnswer);
  if (!user) return false;
  if (user === correct) return true;

  const cp = correctAnswer.replace(/−/g, "-").trim().match(COORDINATE);
  const up = userAnswer.replace(/−/g, "-").trim().match(COORDINATE);
  if (cp && up) return closeEnough(+cp[1], +up[1]) && closeEnough(+cp[2], +up[2]);

  const c = parseMeasure(correctAnswer);
  const u = parseMeasure(userAnswer);
  if (c && u && closeEnough(c.value, u.value) && (!u.unit || !c.unit || u.unit === c.unit)) return true;

  const cr = correct.match(TWO_ROOTS);
  const ur = user.match(TWO_ROOTS);
  if (cr && ur) return [cr[1], cr[2]].map(Number).sort().join() === [ur[1], ur[2]].map(Number).sort().join();

  return false;
}

/** A one-line note on what was off, for the cases we can identify exactly; otherwise null. */
export function diagnoseAnswer(userAnswer: string, correctAnswer: string): string | null {
  if (!userAnswer.trim()) return "No answer was entered.";
  const c = parseMeasure(correctAnswer);
  const u = parseMeasure(userAnswer);
  if (c && u && closeEnough(c.value, u.value) && u.unit && c.unit && u.unit !== c.unit) {
    return `The number is right, but the unit should be ${c.shownUnit}.`;
  }
  return null;
}
