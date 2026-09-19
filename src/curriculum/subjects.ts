import type { Difficulty, Subject, Syllabus, Topic } from "../types";
import { getAccountingTopics } from "./accounting";
import { getEnglishTopics } from "./english";
import { getMathsTopics } from "./maths";

export interface SubjectDef {
  id: Subject;
  label: string;
  minGrade: number;
  group: "core" | "elective";
  getTopics: (grade: number, syllabus: Syllabus, difficulty: Difficulty) => Topic[];
}

export const SUBJECTS: SubjectDef[] = [
  { id: "maths", label: "Maths", minGrade: 1, group: "core", getTopics: getMathsTopics },
  { id: "english", label: "English", minGrade: 1, group: "core", getTopics: getEnglishTopics },
  { id: "accounting", label: "Accounting", minGrade: 9, group: "elective", getTopics: getAccountingTopics },
];

export function getSubject(id: Subject): SubjectDef {
  const subject = SUBJECTS.find((s) => s.id === id);
  if (!subject) throw new Error(`Unknown subject: ${id}`);
  return subject;
}
