export type Figure =
  | { kind: "rectangle"; width: number; height: number; unit: string }
  | { kind: "triangleBase"; base: number; height: number; unit: string }
  | {
      kind: "rightTriangle";
      legA: number;
      legB: number;
      hyp: number;
      unit: string;
      unknown: "hyp" | "legA" | "legB";
    }
  | { kind: "angleOnLine"; known: number }
  | { kind: "triangleAngles"; a: number; b: number }
  | { kind: "cartesian"; extent: number; points: { label: string; x: number; y: number }[] };

export interface Question {
  prompt: string;
  answer: string;
  options?: string[];
  figure?: Figure;
  /** Worked steps or a short reason, shown for wrong answers and in answer keys. Lines are separated by \n. */
  explanation?: string;
  /** Which topic produced this question, so results can be broken down by topic. */
  topicId?: string;
}

export interface Topic {
  id: string;
  label: string;
  /** Lets the topic list group topics; anything without one is a plain skills topic. */
  category?: "word-problems";
  generate: () => Question;
}

export type Subject =
  | "maths"
  | "english"
  | "general"
  | "accounting"
  | "business"
  | "economics"
  | "biology"
  | "chemistry"
  | "physics";
export type Syllabus = "vic" | "cambridge";
export type Difficulty = "standard" | "advanced";
