import type { Question, Topic } from "../types";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  return b === 0 ? a || 1 : gcd(b, a % b);
}

export function ordinal(n: number): string {
  const rem100 = n % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

/** Reduce a fraction, normalising sign onto the numerator. */
export function simplifyFraction(num: number, den: number): string {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  const n = num / g;
  const d = den / g;
  return d === 1 ? String(n) : `${n}/${d}`;
}

interface BankItem {
  prompt: string;
  answer: string;
  explanation?: string;
}

/** A topic whose questions are picked verbatim from a fixed bank. */
export function bankFill(id: string, label: string, items: BankItem[]): Topic {
  return {
    id,
    label,
    generate: (): Question => pick(items),
  };
}

/**
 * A multiple-choice topic. Distractors are drawn at random from the other
 * items' answers (or an explicit pool), so authoring only needs prompt+answer.
 */
export function bankMCQ(
  id: string,
  label: string,
  items: BankItem[],
  pool?: string[],
): Topic {
  const distractorPool = Array.from(new Set(pool ?? items.map((i) => i.answer)));
  return {
    id,
    label,
    generate: (): Question => {
      const item = pick(items);
      const others = distractorPool.filter((p) => p !== item.answer);
      const distractors = shuffle(others).slice(0, 3);
      const options = shuffle([item.answer, ...distractors]);
      return { prompt: item.prompt, answer: item.answer, options, explanation: item.explanation };
    },
  };
}
