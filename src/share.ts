import { GRADES, SUBJECTS, getSubject, getTopics } from "./curriculum";
import { generateUniqueQuestions } from "./generate";
import type { Difficulty, Question, Subject, Syllabus } from "./types";

/** Bump when a content change would make an old link produce different questions. */
export const SHARE_VERSION = 2;
const MAX_QUESTIONS = 50;
const SEED_PATTERN = /^[a-z0-9]{4,16}$/;

export interface ShareSpec {
  subject: Subject;
  grade: number;
  syllabus: Syllabus;
  difficulty: Difficulty;
  count: number;
  /** null means every topic for the chosen subject and grade. */
  topicIds: string[] | null;
  seed: string;
  /** Whether to show the correct answers and explanations after the test is submitted. */
  reveal: boolean;
  version: number;
}

export function newSeed(): string {
  return Math.random().toString(36).slice(2, 10).padEnd(8, "0");
}

function hashSeed(seed: string): number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507);
  h = Math.imul(h ^ (h >>> 13), 3266489909);
  return (h ^ (h >>> 16)) >>> 0;
}

function mulberry32(start: number): () => number {
  let a = start;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Runs fn with Math.random replaced by a generator seeded from `seed`, so the same seed gives the same questions. */
export function withSeed<T>(seed: string, fn: () => T): T {
  const original = Math.random;
  Math.random = mulberry32(hashSeed(seed));
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

export function buildShareUrl(spec: ShareSpec): string {
  const params = new URLSearchParams();
  params.set("v", String(spec.version));
  params.set("s", spec.subject);
  params.set("g", String(spec.grade));
  params.set("y", spec.syllabus);
  params.set("d", spec.difficulty);
  params.set("n", String(spec.count));
  params.set("r", spec.seed);
  if (spec.topicIds) params.set("t", spec.topicIds.join(","));
  if (!spec.reveal) params.set("a", "0");
  const { origin, pathname } = window.location;
  return `${origin}${pathname}#/t?${params.toString()}`;
}

/** Reads a share link's hash. Returns null unless every part is valid, so bad links fall back to the normal app. */
export function parseShareHash(hash: string): ShareSpec | null {
  const match = hash.match(/^#\/t\?(.+)$/);
  if (!match) return null;
  const params = new URLSearchParams(match[1]);

  const subject = SUBJECTS.find((s) => s.id === params.get("s"))?.id;
  const grade = Number(params.get("g"));
  const syllabus = params.get("y");
  const difficulty = params.get("d");
  const count = Number(params.get("n"));
  const seed = params.get("r") ?? "";
  if (!subject || !GRADES.includes(grade) || grade < getSubject(subject).minGrade) return null;
  if (syllabus !== "vic" && syllabus !== "cambridge") return null;
  if (difficulty !== "standard" && difficulty !== "advanced") return null;
  if (!Number.isInteger(count) || count < 1 || count > MAX_QUESTIONS) return null;
  if (!SEED_PATTERN.test(seed)) return null;

  const available = new Set(getTopics(subject, grade, syllabus, difficulty).map((t) => t.id));
  const requested = params.get("t");
  const chosen = requested ? requested.split(",").filter((id) => available.has(id)) : [];
  const topicIds = requested && chosen.length > 0 && chosen.length < available.size ? chosen : null;

  return {
    subject,
    grade,
    syllabus,
    difficulty,
    count,
    topicIds,
    seed,
    reveal: params.get("a") !== "0",
    version: Number(params.get("v")) || 0,
  };
}

/** Builds the questions for a spec. The same spec always gives the same questions, on any device. */
export function generateFor(spec: ShareSpec): Question[] {
  const all = getTopics(spec.subject, spec.grade, spec.syllabus, spec.difficulty);
  const pool = spec.topicIds ? all.filter((t) => spec.topicIds?.includes(t.id)) : all;
  return withSeed(spec.seed, () => generateUniqueQuestions(pool, spec.count));
}

function keyChecksum(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 4);
}

/**
 * A short, typeable key printed on the questions-only PDF. It holds the same information as a share link
 * (settings, topics and seed), so entering it later rebuilds the identical questions with their answers.
 * Topics are stored as a bit mask over the subject's topic list, or "all".
 */
export function encodeWorksheetKey(spec: ShareSpec): string {
  const all = getTopics(spec.subject, spec.grade, spec.syllabus, spec.difficulty);
  let mask = "all";
  if (spec.topicIds) {
    const bits = all.map((t) => (spec.topicIds?.includes(t.id) ? "1" : "0")).join("");
    mask = BigInt(`0b${bits}`).toString(16);
  }
  const body = [
    `lw${spec.version}`,
    spec.subject,
    spec.grade,
    spec.syllabus === "vic" ? "v" : "c",
    spec.difficulty === "standard" ? "s" : "a",
    spec.count,
    spec.seed,
    mask,
  ].join(".");
  return `${body}.${keyChecksum(body)}`;
}

export type KeyResult = { ok: true; spec: ShareSpec } | { ok: false; error: string };

export function decodeWorksheetKey(input: string): KeyResult {
  const key = input.trim().replace(/\s+/g, "").toLowerCase();
  const parts = key.split(".");
  if (parts.length !== 9 || !/^lw\d+$/.test(parts[0])) return { ok: false, error: "That does not look like a worksheet key." };
  const body = parts.slice(0, 8).join(".");
  if (keyChecksum(body) !== parts[8]) return { ok: false, error: "The key looks wrong. Check it against the printed worksheet." };

  const [, subjectId, gradeText, y, d, countText, seed, mask] = parts;
  const subject = SUBJECTS.find((s) => s.id === subjectId)?.id;
  const grade = Number(gradeText);
  const count = Number(countText);
  if (!subject || !GRADES.includes(grade) || grade < getSubject(subject).minGrade) return { ok: false, error: "The key is not valid." };
  if ((y !== "v" && y !== "c") || (d !== "s" && d !== "a")) return { ok: false, error: "The key is not valid." };
  if (!Number.isInteger(count) || count < 1 || count > MAX_QUESTIONS || !SEED_PATTERN.test(seed)) {
    return { ok: false, error: "The key is not valid." };
  }
  const syllabus: Syllabus = y === "v" ? "vic" : "cambridge";
  const difficulty: Difficulty = d === "s" ? "standard" : "advanced";

  let topicIds: string[] | null = null;
  if (mask !== "all") {
    if (!/^[0-9a-f]+$/.test(mask)) return { ok: false, error: "The key is not valid." };
    const all = getTopics(subject, grade, syllabus, difficulty);
    const bits = BigInt(`0x${mask}`).toString(2).padStart(all.length, "0");
    const chosen = all.filter((_, i) => bits[bits.length - all.length + i] === "1").map((t) => t.id);
    if (chosen.length === 0) return { ok: false, error: "The key is not valid." };
    topicIds = chosen.length < all.length ? chosen : null;
  }

  return {
    ok: true,
    spec: { subject, grade, syllabus, difficulty, count, topicIds, seed, reveal: true, version: Number(parts[0].slice(2)) },
  };
}
