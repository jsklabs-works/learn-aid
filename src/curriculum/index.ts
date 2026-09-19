import type { Difficulty, Subject, Syllabus, Topic } from "../types";
import { getMathsTopics } from "./maths";
import { getEnglishTopics } from "./english";

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function getTopics(
  subject: Subject,
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  return subject === "maths"
    ? getMathsTopics(grade, syllabus, difficulty)
    : getEnglishTopics(grade, syllabus, difficulty);
}

export function gradeLabel(grade: number): string {
  return `Grade ${grade}`;
}
