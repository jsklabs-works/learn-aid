import type { Figure } from "../types";

const VIEW_W = 220;
const VIEW_H = 150;
const STROKE = "currentColor";

function fit(a: number, b: number, maxA: number, maxB: number): [number, number] {
  const s = Math.min(maxA / a, maxB / b);
  return [a * s, b * s];
}

const CARTESIAN_SIZE = 240;

export function FigureSvg({ figure }: { figure: Figure }) {
  const width = figure.kind === "cartesian" ? CARTESIAN_SIZE : VIEW_W;
  const height = figure.kind === "cartesian" ? CARTESIAN_SIZE : VIEW_H;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
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
    case "cartesian":
      return <CartesianFigure figure={figure} />;
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

function CartesianFigure({ figure }: { figure: Extract<Figure, { kind: "cartesian" }> }) {
  const n = figure.extent;
  const size = 200;
  const unit = size / (2 * n);
  const centre = CARTESIAN_SIZE / 2;
  const px = (x: number) => centre + x * unit;
  const py = (y: number) => centre - y * unit;
  const ticks = Array.from({ length: 2 * n + 1 }, (_, i) => i - n);
  return (
    <g stroke={STROKE} fill="none">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={px(t)} y1={py(-n)} x2={px(t)} y2={py(n)} strokeOpacity={0.15} strokeWidth={0.6} />
          <line x1={px(-n)} y1={py(t)} x2={px(n)} y2={py(t)} strokeOpacity={0.15} strokeWidth={0.6} />
        </g>
      ))}
      <line x1={px(-n)} y1={py(0)} x2={px(n)} y2={py(0)} strokeWidth={1.4} />
      <line x1={px(0)} y1={py(-n)} x2={px(0)} y2={py(n)} strokeWidth={1.4} />
      {ticks
        .filter((t) => t !== 0)
        .map((t) => (
          <g key={`l${t}`} fill={STROKE} stroke="none" fontSize="7.5">
            <text x={px(t)} y={py(0) + 9} textAnchor="middle">
              {t}
            </text>
            <text x={px(0) - 4} y={py(t) + 2.5} textAnchor="end">
              {t}
            </text>
          </g>
        ))}
      <text x={px(n) + 1} y={py(0) - 4} fill={STROKE} stroke="none" fontSize="9" fontStyle="italic">
        x
      </text>
      <text x={px(0) + 4} y={py(n) - 1} fill={STROKE} stroke="none" fontSize="9" fontStyle="italic">
        y
      </text>
      {figure.points.map((pt) => (
        <g key={pt.label}>
          <circle cx={px(pt.x)} cy={py(pt.y)} r={3.4} fill={STROKE} />
          <text x={px(pt.x) + 5} y={py(pt.y) - 5} fill={STROKE} stroke="none" fontSize="11" fontWeight="bold">
            {pt.label}
          </text>
        </g>
      ))}
    </g>
  );
}
