import { jsPDF } from "jspdf";
import { drawFigure, figureHeightMm } from "./figurePdf";
import type { FormulaEntry } from "./formulas";
import type { Question, Subject } from "./types";

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const OPTION_LETTERS = ["A", "B", "C", "D"];
const FOOTER_TEXT = "Learn Aid (c) 2026 jsklabs-works. All rights reserved. For personal and classroom use.";

interface WorksheetInfo {
  subject: Subject;
  subjectLabel: string;
  grade: number;
  topicLabels: string[];
  questions: Question[];
}

function newDoc(): jsPDF {
  return new jsPDF({ unit: "mm", format: "a4" });
}

/**
 * jsPDF's standard fonts only support WinAnsi encoding, which is missing the
 * Unicode minus sign (−), root sign (√), pi, prime and integral signs used in on-screen question text.
 */
function sanitizeForPdf(text: string): string {
  return text
    .replace(/√(\d+)/g, "sqrt($1)")
    .replace(/−/g, "-")
    .replace(/π/g, "pi")
    .replace(/′/g, "'")
    .replace(/θ/g, "theta")
    .replace(/λ/g, "lambda")
    .replace(/ρ/g, "rho")
    .replace(/→/g, "->")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/∫ ?/g, "integral of ");
}

function addHeader(doc: jsPDF, title: string, topicLabels: string[]): number {
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(sanitizeForPdf(title), MARGIN, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90);
  const topicsText = sanitizeForPdf(`Topics: ${topicLabels.join(", ")}`);
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

function addFooters(doc: jsPDF): void {
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(140);
    doc.text(FOOTER_TEXT, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: "center" });
  }
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
  const title = `Grade ${info.grade} ${info.subjectLabel} Worksheet`;

  let y = addHeader(doc, title, info.topicLabels);
  doc.setFontSize(12);

  info.questions.forEach((q, index) => {
    const number = `${index + 1}.`;
    const promptLines = doc.splitTextToSize(sanitizeForPdf(q.prompt), CONTENT_WIDTH - 10);
    const optionsLine = q.options
      ? sanitizeForPdf(q.options.map((opt, i) => `${OPTION_LETTERS[i]}) ${opt}`).join("     "))
      : null;
    const optionLines = optionsLine ? doc.splitTextToSize(optionsLine, CONTENT_WIDTH - 10) : [];

    const figureHeight = q.figure ? figureHeightMm(q.figure) : 0;
    const blockHeight = promptLines.length * 6 + optionLines.length * 6 + figureHeight + (q.options ? 6 : 12);
    y = ensureSpace(doc, y, blockHeight);

    doc.setFont("helvetica", "bold");
    doc.text(number, MARGIN, y);
    doc.setFont("helvetica", "normal");
    doc.text(promptLines, MARGIN + 8, y);
    y += promptLines.length * 6;

    if (q.figure) {
      drawFigure(doc, q.figure, MARGIN + 8, y);
      y += figureHeight;
    }

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
    const text = sanitizeForPdf(`${index + 1}. ${q.answer}`);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    const steps = q.explanation
      ? doc.splitTextToSize(sanitizeForPdf(q.explanation), CONTENT_WIDTH - 8)
      : [];
    ay = ensureSpace(doc, ay, lines.length * 6 + steps.length * 4.5 + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(lines, MARGIN, ay);
    ay += lines.length * 6;
    if (steps.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(90);
      doc.text(steps, MARGIN + 8, ay - 1);
      ay += steps.length * 4.5;
      doc.setTextColor(0);
      doc.setFontSize(12);
    }
    ay += 2;
  });

  addFooters(doc);

  const fileName = `grade-${info.grade}-${info.subject}-worksheet.pdf`;
  doc.save(fileName);
}

interface FormulaSheetInfo {
  subject: Subject;
  subjectLabel: string;
  grade: number;
  groups: { topic: string; entries: FormulaEntry[] }[];
}

export function generateFormulaPdf(info: FormulaSheetInfo): void {
  const doc = newDoc();
  let y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(sanitizeForPdf(`Grade ${info.grade} ${info.subjectLabel} formula sheet`), MARGIN, y);
  y += 6;
  doc.setDrawColor(200);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 9;

  for (const group of info.groups) {
    y = ensureSpace(doc, y, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text(sanitizeForPdf(group.topic), MARGIN, y);
    y += 7;

    for (const entry of group.entries) {
      const formulaLines = doc.setFont("courier", "normal").setFontSize(10).splitTextToSize(sanitizeForPdf(entry.formula), CONTENT_WIDTH - 6);
      doc.setFont("helvetica", "normal").setFontSize(9);
      const noteLines = entry.note ? doc.splitTextToSize(sanitizeForPdf(entry.note), CONTENT_WIDTH - 6) : [];
      const exampleLines = entry.example ? doc.splitTextToSize(sanitizeForPdf(`Example: ${entry.example}`), CONTENT_WIDTH - 6) : [];
      const height = 5.5 + formulaLines.length * 4.6 + noteLines.length * 4 + exampleLines.length * 4 + 3;
      y = ensureSpace(doc, y, height);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(0);
      doc.text(sanitizeForPdf(entry.name), MARGIN, y);
      y += 5.5;

      doc.setFont("courier", "normal");
      doc.setFontSize(10);
      doc.text(formulaLines, MARGIN + 3, y);
      y += formulaLines.length * 4.6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(90);
      if (noteLines.length > 0) {
        doc.text(noteLines, MARGIN + 3, y);
        y += noteLines.length * 4;
      }
      if (exampleLines.length > 0) {
        doc.text(exampleLines, MARGIN + 3, y);
        y += exampleLines.length * 4;
      }
      y += 3;
    }
    y += 3;
  }

  doc.setTextColor(0);
  addFooters(doc);
  doc.save(`grade-${info.grade}-${info.subject}-formula-sheet.pdf`);
}
