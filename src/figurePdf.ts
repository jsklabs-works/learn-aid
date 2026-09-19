import type { jsPDF } from "jspdf";
import type { Figure } from "./types";

export const FIGURE_HEIGHT_MM = 34;
const FIGURE_WIDTH_MM = 55;

function fit(a: number, b: number, maxA: number, maxB: number): [number, number] {
  const s = Math.min(maxA / a, maxB / b);
  return [a * s, b * s];
}

/** Draws a small vector diagram for a question, anchored top-left at (x, y). */
export function drawFigure(doc: jsPDF, figure: Figure, x: number, y: number): void {
  const originalFontSize = doc.getFontSize();
  const originalLineWidth = doc.getLineWidth();
  doc.setDrawColor(60);
  doc.setTextColor(60);
  doc.setFontSize(8);
  doc.setLineWidth(0.3);

  switch (figure.kind) {
    case "rectangle": {
      const [w, h] = fit(figure.width, figure.height, FIGURE_WIDTH_MM - 10, FIGURE_HEIGHT_MM - 14);
      const rx = x + 5;
      const ry = y + 2;
      doc.rect(rx, ry, w, h);
      doc.text(`${figure.width} ${figure.unit}`, rx + w / 2, ry + h + 6, { align: "center" });
      doc.text(`${figure.height} ${figure.unit}`, rx - 2, ry + h / 2, { align: "right" });
      break;
    }
    case "triangleBase": {
      const [b, h] = fit(figure.base, figure.height, FIGURE_WIDTH_MM - 10, FIGURE_HEIGHT_MM - 16);
      const bx = x + 5;
      const yBase = y + h + 4;
      const apexX = bx + b * 0.4;
      doc.lines(
        [
          [b, 0],
          [-(b - apexX + bx), -h],
          [-(apexX - bx), h],
        ],
        bx,
        yBase,
      );
      doc.text(`base ${figure.base} ${figure.unit}`, bx + b / 2, yBase + 6, { align: "center" });
      doc.text(`h ${figure.height} ${figure.unit}`, apexX + 3, yBase - h / 2);
      break;
    }
    case "rightTriangle": {
      const [a, b] = fit(figure.legA, figure.legB, FIGURE_WIDTH_MM - 15, FIGURE_HEIGHT_MM - 16);
      const rx = x + 5;
      const ry = y + b + 2;
      doc.lines(
        [
          [a, 0],
          [-a, -b],
          [0, b],
        ],
        rx,
        ry,
      );
      const legA = figure.unknown === "legA" ? "?" : `${figure.legA} ${figure.unit}`;
      const legB = figure.unknown === "legB" ? "?" : `${figure.legB} ${figure.unit}`;
      const hyp = figure.unknown === "hyp" ? "?" : `${figure.hyp} ${figure.unit}`;
      doc.text(legA, rx + a / 2, ry + 6, { align: "center" });
      doc.text(legB, rx - 2, ry - b / 2, { align: "right" });
      doc.text(hyp, rx + a / 2 + 2, ry - b / 2 - 2);
      break;
    }
    case "angleOnLine": {
      const cx = x + FIGURE_WIDTH_MM / 2;
      const cy = y + FIGURE_HEIGHT_MM / 2 + 4;
      const r = 18;
      doc.line(cx - r, cy, cx + r, cy);
      const rad = (figure.known * Math.PI) / 180;
      doc.line(cx, cy, cx + r * Math.cos(Math.PI - rad), cy - r * Math.sin(Math.PI - rad));
      doc.text(`${figure.known}°`, cx - r / 2, cy - 3, { align: "center" });
      doc.text("?", cx + r / 2, cy - 3, { align: "center" });
      break;
    }
    case "triangleAngles": {
      const bx = x + 8;
      const by = y + FIGURE_HEIGHT_MM - 6;
      doc.lines(
        [
          [38, 0],
          [-22, -24],
          [-16, 24],
        ],
        bx,
        by,
      );
      doc.text(`${figure.a}°`, bx + 4, by - 3);
      doc.text(`${figure.b}°`, bx + 30, by - 3);
      doc.text("?", bx + 15, by - 24);
      break;
    }
  }
  doc.setTextColor(0);
  doc.setDrawColor(0);
  doc.setFontSize(originalFontSize);
  doc.setLineWidth(originalLineWidth);
}
