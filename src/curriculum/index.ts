import type { Subject, Topic } from "../types";
import { getMathsTopics } from "./maths";
import { getEnglishTopics } from "./english";

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function getTopics(subject: Subject, grade: number): Topic[] {
  return subject === "maths" ? getMathsTopics(grade) : getEnglishTopics(grade);
}

export function gradeLabel(grade: number): string {
  return `Grade ${grade}`;
}
