import { jsPDF } from "jspdf";
import type { Question, Subject } from "./types";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const OPTION_LETTERS = ["A", "B", "C", "D"];

interface WorksheetInfo {
  subject: Subject;
  grade: number;
  topicLabels: string[];
  questions: Question[];
}

function newDoc(): jsPDF {
  return new jsPDF({ unit: "mm", format: "a4" });
}

function addHeader(doc: jsPDF, title: string, topicLabels: string[]): number {
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  const topicsText = `Topics: ${topicLabels.join(", ")}`;
  const topicLines = doc.splitTextToSize(topicsText, CONTENT_WIDTH);
  doc.text(topicLines, MARGIN, y);
  y += topicLines.length * 4.5 + 6;
  doc.setTextColor(0);

  doc.setFontSize(11);
  doc.text("Name: ___________________________", MARGIN, y);
  doc.text("Date: _______________", MARGIN + 110, y);
  y += 10;

  doc.setDrawColor(200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;
  return y;
}

function ensureSpace(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_HEIGHT - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

export function generateWorksheetPdf(info: WorksheetInfo): void {
  const doc = newDoc();
  const subjectLabel = info.subject === "maths" ? "Maths" : "English";
  const title = `Grade ${info.grade} ${subjectLabel} Worksheet`;

  let y = addHeader(doc, title, info.topicLabels);
  doc.setFontSize(12);

  info.questions.forEach((q, index) => {
    const number = `${index + 1}.`;
    const promptLines = doc.splitTextToSize(q.prompt, CONTENT_WIDTH - 10);
    const optionsLine = q.options
      ? q.options.map((opt, i) => `${OPTION_LETTERS[i]}) ${opt}`).join("     ")
      : null;
    const optionLines = optionsLine ? doc.splitTextToSize(optionsLine, CONTENT_WIDTH - 10) : [];

    const blockHeight = promptLines.length * 6 + optionLines.length * 6 + (q.options ? 6 : 12);
    y = ensureSpace(doc, y, blockHeight);

    doc.setFont("helvetica", "bold");
    doc.text(number, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.text(promptLines, MARGIN + 8, y);
    y += promptLines.length * 6;

    if (optionLines.length > 0) {
      doc.text(optionLines, MARGIN + 8, y);
      y += optionLines.length * 6 + 4;
    } else {
      y += 10;
    }
  });

  doc.addPage();
  let ay = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Answer Key", MARGIN, ay);
  ay += 10;
  doc.setDrawColor(200);
  doc.line(MARGIN, ay, PAGE_WIDTH - MARGIN, ay);
  ay += 8;

  doc.setFontSize(12);
  info.questions.forEach((q, index) => {
    const text = `${index + 1}. ${q.answer}`;
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    ay = ensureSpace(doc, ay, lines.length * 6 + 2);
    doc.setFont("helvetica", "normal");
    doc.text(lines, MARGIN, ay);
    ay += lines.length * 6 + 2;
  });

  const fileName = `grade-${info.grade}-${info.subject}-worksheet.pdf`;
  doc.save(fileName);
}
