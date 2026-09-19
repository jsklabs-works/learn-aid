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
  | { kind: "triangleAngles"; a: number; b: number };

export interface Question {
  prompt: string;
  answer: string;
  options?: string[];
  figure?: Figure;
}

export interface Topic {
  id: string;
  label: string;
  generate: () => Question;
}

export type Subject = "maths" | "english" | "accounting";
export type Syllabus = "vic" | "cambridge";
export type Difficulty = "standard" | "advanced";
