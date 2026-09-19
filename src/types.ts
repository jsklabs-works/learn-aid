export interface Question {
  prompt: string;
  answer: string;
  options?: string[];
}

export interface Topic {
  id: string;
  label: string;
  generate: () => Question;
}

export type Subject = "maths" | "english";
