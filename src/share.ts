import { GRADES, SUBJECTS, getSubject, getTopics } from "./curriculum";
import type { Difficulty, Subject, Syllabus } from "./types";

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
