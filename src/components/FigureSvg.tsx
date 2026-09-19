import type { Figure } from "../types";

const VIEW_W = 220;
const VIEW_H = 150;
const STROKE = "currentColor";

function fit(a: number, b: number, maxA: number, maxB: number): [number, number] {
  const s = Math.min(maxA / a, maxB / b);
  return [a * s, b * s];
}

export function FigureSvg({ figure }: { figure: Figure }) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      width={VIEW_W}
      height={VIEW_H}
      className="figure-svg"
      role="img"
      aria-label="Diagram for this question"
    >
      {renderFigure(figure)}
    </svg>
  );
}

function renderFigure(figure: Figure) {
  switch (figure.kind) {
    case "rectangle":
      return <RectangleFigure figure={figure} />;
    case "triangleBase":
      return <TriangleBaseFigure figure={figure} />;
    case "rightTriangle":
      return <RightTriangleFigure figure={figure} />;
    case "angleOnLine":
      return <AngleOnLineFigure figure={figure} />;
    case "triangleAngles":
      return <TriangleAnglesFigure figure={figure} />;
  }
}

function RectangleFigure({ figure }: { figure: Extract<Figure, { kind: "rectangle" }> }) {
  const [w, h] = fit(figure.width, figure.height, 150, 90);
  const x = (VIEW_W - w) / 2;
  const y = (VIEW_H - h) / 2 - 5;
  return (
    <g stroke={STROKE} fill="none" strokeWidth={1.5}>
      <rect x={x} y={y} width={w} height={h} />
      <text x={x + w / 2} y={y + h + 16} textAnchor="middle" fill={STROKE} stroke="none" fontSize="11">
        {figure.width} {figure.unit}
      </text>
      <text
        x={x - 8}
        y={y + h / 2}
        textAnchor="middle"
        fill={STROKE}
        stroke="none"
        fontSize="11"
        transform={`rotate(-90 ${x - 8} ${y + h / 2})`}
      >
        {figure.height} {figure.unit}
      </text>
    </g>
  );
}

function TriangleBaseFigure({ figure }: { figure: Extract<Figure, { kind: "triangleBase" }> }) {
  const [b, h] = fit(figure.base, figure.height, 150, 80);
  const x = (VIEW_W - b) / 2;
  const yBase = VIEW_H / 2 + h / 2;
  const apexX = x + b * 0.4;
  return (
    <g stroke={STROKE} fill="none" strokeWidth={1.5}>
      <polygon points={`${x},${yBase} ${x + b},${yBase} ${apexX},${yBase - h}`} />
      <line x1={apexX} y1={yBase} x2={apexX} y2={yBase - h} strokeDasharray="3,3" />
      <text x={x + b / 2} y={yBase + 16} textAnchor="middle" fill={STROKE} stroke="none" fontSize="11">
        base = {figure.base} {figure.unit}
      </text>
      <text x={apexX + 8} y={yBase - h / 2} textAnchor="start" fill={STROKE} stroke="none" fontSize="11">
        height = {figure.height} {figure.unit}
      </text>
    </g>
  );
}

function RightTriangleFigure({ figure }: { figure: Extract<Figure, { kind: "rightTriangle" }> }) {
  const [a, b] = fit(figure.legA, figure.legB, 130, 90);
  const x0 = (VIEW_W - a) / 2;
  const y0 = VIEW_H / 2 + b / 2;
  const p1 = { x: x0, y: y0 };
  const p2 = { x: x0 + a, y: y0 };
  const p3 = { x: x0, y: y0 - b };
  const legALabel = figure.unknown === "legA" ? "?" : `${figure.legA} ${figure.unit}`;
  const legBLabel = figure.unknown === "legB" ? "?" : `${figure.legB} ${figure.unit}`;
  const hypLabel = figure.unknown === "hyp" ? "?" : `${figure.hyp} ${figure.unit}`;
  return (
    <g stroke={STROKE} fill="none" strokeWidth={1.5}>
      <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} />
      <rect x={p1.x} y={p1.y - 8} width={8} height={8} />
      <text x={(p1.x + p2.x) / 2} y={p1.y + 16} textAnchor="middle" fill={STROKE} stroke="none" fontSize="11">
        {legALabel}
      </text>
      <text
        x={p1.x - 8}
        y={(p1.y + p3.y) / 2}
        textAnchor="middle"
        fill={STROKE}
        stroke="none"
        fontSize="11"
        transform={`rotate(-90 ${p1.x - 8} ${(p1.y + p3.y) / 2})`}
      >
        {legBLabel}
      </text>
      <text
        x={(p2.x + p3.x) / 2 + 10}
        y={(p2.y + p3.y) / 2 - 4}
        textAnchor="middle"
        fill={STROKE}
        stroke="none"
        fontSize="11"
      >
        {hypLabel}
      </text>
    </g>
  );
}

function AngleOnLineFigure({ figure }: { figure: Extract<Figure, { kind: "angleOnLine" }> }) {
  const cx = VIEW_W / 2;
  const cy = VIEW_H / 2 + 15;
  const r = 70;
  const angleRad = (figure.known * Math.PI) / 180;
  const armX = cx + r * Math.cos(Math.PI - angleRad);
  const armY = cy - r * Math.sin(Math.PI - angleRad);
  return (
    <g stroke={STROKE} fill="none" strokeWidth={1.5}>
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} />
      <line x1={cx} y1={cy} x2={armX} y2={armY} />
      <text x={cx - r / 2} y={cy - 10} textAnchor="middle" fill={STROKE} stroke="none" fontSize="11">
        {figure.known}°
      </text>
      <text x={cx + r / 2} y={cy - 10} textAnchor="middle" fill={STROKE} stroke="none" fontSize="11">
        ?
      </text>
    </g>
  );
}

function TriangleAnglesFigure({ figure }: { figure: Extract<Figure, { kind: "triangleAngles" }> }) {
  const x0 = VIEW_W / 2 - 75;
  const y0 = VIEW_H / 2 + 45;
  const p1 = { x: x0, y: y0 };
  const p2 = { x: x0 + 150, y: y0 };
  const p3 = { x: x0 + 60, y: y0 - 90 };
  return (
    <g stroke={STROKE} fill="none" strokeWidth={1.5}>
      <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} />
      <text x={p1.x + 14} y={p1.y - 8} fill={STROKE} stroke="none" fontSize="11">
        {figure.a}°
      </text>
      <text x={p2.x - 24} y={p2.y - 8} fill={STROKE} stroke="none" fontSize="11">
        {figure.b}°
      </text>
      <text x={p3.x - 4} y={p3.y + 20} fill={STROKE} stroke="none" fontSize="11">
        ?
      </text>
    </g>
  );
}
