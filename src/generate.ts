import type { Question, Topic } from "./types";

/** Consecutive repeats after which a topic is treated as having run out of new questions. */
const MAX_MISSES = 400;

/**
 * Builds up to `count` questions with no repeated prompt. Topics are picked at random;
 * a topic that keeps returning questions we already have is dropped from the pool.
 * Returns fewer than `count` only if the chosen topics genuinely have fewer distinct questions.
 */
export function generateUniqueQuestions(topics: Topic[], count: number): Question[] {
  const seen = new Set<string>();
  const questions: Question[] = [];
  const misses = new Map<string, number>();
  let active = [...topics];

  while (questions.length < count && active.length > 0) {
    const topic = active[Math.floor(Math.random() * active.length)];
    const question = topic.generate();
    if (seen.has(question.prompt)) {
      const missed = (misses.get(topic.id) ?? 0) + 1;
      misses.set(topic.id, missed);
      if (missed >= MAX_MISSES) active = active.filter((t) => t.id !== topic.id);
      continue;
    }
    seen.add(question.prompt);
    misses.set(topic.id, 0);
    questions.push({ ...question, topicId: topic.id });
  }

  return questions;
}
