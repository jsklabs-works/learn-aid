import { GRADES, SUBJECTS } from "./curriculum";
import type { Difficulty, Subject, Syllabus } from "./types";

const PREFIX = "LA1";
const MAX_NAME = 40;

export interface ResultPayload {
  name: string;
  subject: Subject;
  grade: number;
  syllabus: Syllabus;
  difficulty: Difficulty;
  correct: number;
  total: number;
  /** The seed of the shared or generated test, so a teacher can group students who sat the same test. */
  seed: string;
  /** topic id, correct, answered */
  topics: [string, number, number][];
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
  const binary = atob(padded);
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

/** A short checksum that catches typos and truncated pastes. It is not a security measure. */
function checksum(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}

export function encodeResult(p: ResultPayload): string {
  const body = toBase64Url(
    JSON.stringify([
      1,
      p.name.trim().slice(0, MAX_NAME),
      p.subject,
      p.grade,
      p.syllabus === "vic" ? "v" : "c",
      p.difficulty === "standard" ? "s" : "a",
      p.correct,
      p.total,
      p.seed,
      p.topics,
    ]),
  );
  const head = `${PREFIX}-${body}`;
  return `${head}-${checksum(head)}`;
}

export type DecodeResult = { ok: true; payload: ResultPayload } | { ok: false; error: string };

export function decodeResult(code: string): DecodeResult {
  const match = code.trim().match(/^LA1-([A-Za-z0-9_-]+)-([0-9a-f]{6})$/);
  if (!match) return { ok: false, error: "Not a Learn Aid result code" };
  if (checksum(`${PREFIX}-${match[1]}`) !== match[2]) return { ok: false, error: "Code looks damaged or incomplete" };
  try {
    const data: unknown = JSON.parse(fromBase64Url(match[1]));
    if (!Array.isArray(data) || data[0] !== 1) return { ok: false, error: "Unsupported code version" };
    const [, name, subject, grade, y, d, correct, total, seed, topics] = data as unknown[];
    const validSubject = SUBJECTS.find((s) => s.id === subject)?.id;
    if (
      typeof name !== "string" ||
      !validSubject ||
      typeof grade !== "number" ||
      !GRADES.includes(grade) ||
      (y !== "v" && y !== "c") ||
      (d !== "s" && d !== "a") ||
      typeof correct !== "number" ||
      typeof total !== "number" ||
      !Number.isInteger(correct) ||
      !Number.isInteger(total) ||
      correct < 0 ||
      total < 1 ||
      total > 50 ||
      correct > total ||
      typeof seed !== "string" ||
      seed.length > 16 ||
      !Array.isArray(topics) ||
      topics.length > 40 ||
      !topics.every(
        (t) =>
          Array.isArray(t) &&
          typeof t[0] === "string" &&
          Number.isInteger(t[1]) &&
          Number.isInteger(t[2]) &&
          t[1] >= 0 &&
          t[2] >= 1 &&
          t[1] <= t[2],
      )
    ) {
      return { ok: false, error: "Code is not valid" };
    }
    return {
      ok: true,
      payload: {
        name: name.slice(0, MAX_NAME),
        subject: validSubject,
        grade,
        syllabus: y === "v" ? "vic" : "cambridge",
        difficulty: d === "s" ? "standard" : "advanced",
        correct,
        total,
        seed,
        topics: topics as [string, number, number][],
      },
    };
  } catch {
    return { ok: false, error: "Code is not valid" };
  }
}
