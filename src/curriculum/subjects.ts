import type { Difficulty, Subject, Syllabus, Topic } from "../types";
import { getAccountingTopics } from "./accounting";
import { getBiologyTopics } from "./biology";
import { getBusinessTopics } from "./business";
import { getChemistryTopics } from "./chemistry";
import { getEconomicsTopics } from "./economics";
import { getEnglishTopics } from "./english";
import { getMathsTopics } from "./maths";
import { getPhysicsTopics } from "./physics";

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
  { id: "business", label: "Business Studies", minGrade: 9, group: "elective", getTopics: getBusinessTopics },
  { id: "economics", label: "Economics", minGrade: 9, group: "elective", getTopics: getEconomicsTopics },
  { id: "biology", label: "Biology", minGrade: 9, group: "elective", getTopics: getBiologyTopics },
  { id: "chemistry", label: "Chemistry", minGrade: 9, group: "elective", getTopics: getChemistryTopics },
  { id: "physics", label: "Physics", minGrade: 9, group: "elective", getTopics: getPhysicsTopics },
];

export function getSubject(id: Subject): SubjectDef {
  const subject = SUBJECTS.find((s) => s.id === id);
  if (!subject) throw new Error(`Unknown subject: ${id}`);
  return subject;
}
