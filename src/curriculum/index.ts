import type { Difficulty, Subject, Syllabus, Topic } from "../types";
import { getSubject } from "./subjects";

export { SUBJECTS, getSubject } from "./subjects";

export const GRADES = Array.from({ length: 12 }, (_, i) => i + 1);

export function getTopics(
  subject: Subject,
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  return getSubject(subject).getTopics(grade, syllabus, difficulty);
}

export function gradeLabel(grade: number): string {
  return `Grade ${grade}`;
}
