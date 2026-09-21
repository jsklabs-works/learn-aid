import type { Difficulty, Subject, Syllabus } from "./types";

const KEY = "learnaid.history.v1";
const MAX_SETS = 20;
/** Once a topic has this many answers, older ones count for half so recent practice matters most. */
const DECAY_AT = 30;

export const WEAK_THRESHOLD = 0.7;
const MIN_ANSWERED = 2;

export interface HistorySettings {
  subject: Subject;
  grade: number;
  syllabus: Syllabus;
  difficulty: Difficulty;
}

export interface HistorySet extends HistorySettings {
  updated: number;
  /** topic id -> [correct, answered] */
  topics: Record<string, [number, number]>;
}

type Store = Record<string, HistorySet>;

const keyFor = (s: HistorySettings) => `${s.subject}|${s.grade}|${s.syllabus}|${s.difficulty}`;

function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    return {};
  }
}

function write(store: Store): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    // Storage can be blocked (private windows, school policies); history is just skipped.
  }
}

export function recordResult(settings: HistorySettings, results: { topicId: string; correct: boolean }[]): void {
  if (results.length === 0) return;
  const store = read();
  const key = keyFor(settings);
  const set: HistorySet = store[key] ?? { ...settings, updated: 0, topics: {} };
  for (const { topicId, correct } of results) {
    let [right, total] = set.topics[topicId] ?? [0, 0];
    right += correct ? 1 : 0;
    total += 1;
    if (total > DECAY_AT) {
      right = Math.round(right / 2);
      total = Math.round(total / 2);
    }
    set.topics[topicId] = [right, total];
  }
  set.updated = Date.now();
  store[key] = set;

  const keys = Object.keys(store).sort((a, b) => store[b].updated - store[a].updated);
  for (const old of keys.slice(MAX_SETS)) delete store[old];
  write(store);
}

export function listHistory(): HistorySet[] {
  return Object.values(read())
    .filter((s) => s && typeof s.updated === "number" && s.topics)
    .sort((a, b) => b.updated - a.updated);
}

export function clearHistory(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export interface TopicScore {
  id: string;
  correct: number;
  total: number;
}

/** Topics answered at least a few times with under 70% right, weakest first. */
export function weakTopics(topics: Record<string, [number, number]>): TopicScore[] {
  return Object.entries(topics)
    .map(([id, [correct, total]]) => ({ id, correct, total }))
    .filter((t) => t.total >= MIN_ANSWERED && t.correct / t.total < WEAK_THRESHOLD)
    .sort((a, b) => a.correct / a.total - b.correct / b.total);
}
