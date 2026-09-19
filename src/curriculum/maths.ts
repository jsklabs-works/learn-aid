import type { Question, Topic } from "../types";
import { gcd, ordinal, pick, randInt, simplifyFraction } from "./utils";

// ---------- Grades 1-2 ----------

function additionWithin(max: number): Topic {
  return {
    id: `add-${max}`,
    label: `Addition within ${max}`,
    generate: () => {
      const a = randInt(0, max);
      const b = randInt(0, max - a);
      return { prompt: `${a} + ${b} = ?`, answer: String(a + b) };
    },
  };
}

function subtractionWithin(max: number): Topic {
  return {
    id: `sub-${max}`,
    label: `Subtraction within ${max}`,
    generate: () => {
      const a = randInt(0, max);
      const b = randInt(0, a);
      return { prompt: `${a} − ${b} = ?`, answer: String(a - b) };
    },
  };
}

function skipCounting(): Topic {
  const steps = [2, 5, 10];
  return {
    id: "skip-counting",
    label: "Skip counting",
    generate: () => {
      const step = pick(steps);
      const start = randInt(0, 10) * step;
      const seq = [0, 1, 2, 3].map((i) => start + i * step);
      return {
        prompt: `${seq[0]}, ${seq[1]}, ${seq[2]}, ${seq[3]}, ? (counting by ${step}s)`,
        answer: String(start + 4 * step),
      };
    },
  };
}

function numberSequence(): Topic {
  return {
    id: "number-sequence",
    label: "Number sequences",
    generate: () => {
      const start = randInt(1, 90);
      return {
        prompt: `What number comes next? ${start}, ${start + 1}, ${start + 2}, ?`,
        answer: String(start + 3),
      };
    },
  };
}

function shapeSides(): Topic {
  const shapes: [string, number][] = [
    ["triangle", 3],
    ["square", 4],
    ["rectangle", 4],
    ["pentagon", 5],
    ["hexagon", 6],
    ["octagon", 8],
  ];
  return {
    id: "shape-sides",
    label: "Shape recognition",
    generate: () => {
      const [name, sides] = pick(shapes);
      return { prompt: `How many sides does a ${name} have?`, answer: String(sides) };
    },
  };
}

// ---------- Grades 3-4 ----------

function multiplicationTables(minTable: number, maxTable: number): Topic {
  return {
    id: `mult-${minTable}-${maxTable}`,
    label: "Multiplication tables",
    generate: () => {
      const a = randInt(minTable, maxTable);
      const b = randInt(2, 12);
      return { prompt: `${a} × ${b} = ?`, answer: String(a * b) };
    },
  };
}

function divisionFacts(maxDivisor: number, maxQuotient: number): Topic {
  return {
    id: "division-facts",
    label: "Division facts",
    generate: () => {
      const divisor = randInt(2, maxDivisor);
      const quotient = randInt(2, maxQuotient);
      return { prompt: `${divisor * quotient} ÷ ${divisor} = ?`, answer: String(quotient) };
    },
  };
}

function timeReading(): Topic {
  return {
    id: "time-reading",
    label: "Telling the time",
    generate: () => {
      const hour = randInt(1, 12);
      const minute = pick([0, 15, 30, 45]);
      const time = `${hour}:${minute === 0 ? "00" : minute}`;
      if (minute === 0) {
        return { prompt: `It is ${time}. How many minutes past the hour is it?`, answer: "0" };
      }
      return { prompt: `It is ${time}. How many minutes past ${hour} o'clock is it?`, answer: String(minute) };
    },
  };
}

function moneyProblems(): Topic {
  return {
    id: "money-problems",
    label: "Money problems",
    generate: () => {
      const price = randInt(2, 15);
      const paid = price + pick([1, 2, 5, 10]);
      return {
        prompt: `An item costs $${price}. You pay with $${paid}. How much change do you get?`,
        answer: `$${paid - price}`,
      };
    },
  };
}

function perimeterRectangle(maxSide: number): Topic {
  return {
    id: "perimeter-rectangle",
    label: "Perimeter of a rectangle",
    generate: () => {
      const l = randInt(2, maxSide);
      const w = randInt(2, maxSide);
      return {
        prompt: `Find the perimeter of a rectangle with length ${l} cm and width ${w} cm.`,
        answer: `${2 * (l + w)} cm`,
      };
    },
  };
}

function fractionOfShape(): Topic {
  return {
    id: "fraction-of-shape",
    label: "Simple fractions",
    generate: () => {
      const denom = pick([2, 3, 4, 5, 6, 8, 10]);
      const num = randInt(1, denom - 1);
      return {
        prompt: `A shape is divided into ${denom} equal parts. ${num} ${num === 1 ? "part is" : "parts are"} shaded. What fraction is shaded?`,
        answer: `${num}/${denom}`,
      };
    },
  };
}

// ---------- Grades 5-6 ----------

function multiDigitMultiplication(): Topic {
  return {
    id: "multi-digit-mult",
    label: "Multi-digit multiplication",
    generate: () => {
      const a = randInt(11, 99);
      const b = randInt(2, 20);
      return { prompt: `${a} × ${b} = ?`, answer: String(a * b) };
    },
  };
}

function longDivision(): Topic {
  return {
    id: "long-division",
    label: "Long division",
    generate: () => {
      const divisor = randInt(2, 12);
      const quotient = randInt(10, 99);
      return { prompt: `${divisor * quotient} ÷ ${divisor} = ?`, answer: String(quotient) };
    },
  };
}

function fractionAddSameDenom(maxDenom: number): Topic {
  return {
    id: "fraction-add-same-denom",
    label: "Adding fractions (same denominator)",
    generate: () => {
      const d = randInt(3, maxDenom);
      const a = randInt(1, d - 1);
      const b = randInt(1, d - a);
      return { prompt: `${a}/${d} + ${b}/${d} = ?`, answer: simplifyFraction(a + b, d) };
    },
  };
}

function decimalAddSubtract(): Topic {
  return {
    id: "decimal-add-sub",
    label: "Adding and subtracting decimals",
    generate: () => {
      const a = randInt(1, 200) / 10;
      const b = randInt(1, 200) / 10;
      const op = pick(["+", "−"] as const);
      const [x, y] = op === "−" ? [Math.max(a, b), Math.min(a, b)] : [a, b];
      const result = op === "+" ? x + y : x - y;
      return { prompt: `${x.toFixed(1)} ${op} ${y.toFixed(1)} = ?`, answer: result.toFixed(1) };
    },
  };
}

function percentageOf(): Topic {
  return {
    id: "percentage-of",
    label: "Percentage of a number",
    generate: () => {
      const pct = pick([5, 10, 20, 25, 50, 75]);
      const base = randInt(1, 40) * 4;
      const value = (base * pct) / 100;
      return { prompt: `What is ${pct}% of ${base}?`, answer: String(Math.round(value * 100) / 100) };
    },
  };
}

function areaRectangle(maxSide: number): Topic {
  return {
    id: "area-rectangle",
    label: "Area of a rectangle",
    generate: () => {
      const l = randInt(2, maxSide);
      const w = randInt(2, maxSide);
      return {
        prompt: `Find the area of a rectangle with length ${l} cm and width ${w} cm.`,
        answer: `${l * w} cm²`,
      };
    },
  };
}

function areaTriangle(maxBase: number): Topic {
  return {
    id: "area-triangle",
    label: "Area of a triangle",
    generate: () => {
      const base = randInt(2, maxBase) * 2;
      const height = randInt(2, maxBase);
      return {
        prompt: `Find the area of a triangle with base ${base} cm and height ${height} cm.`,
        answer: `${(base * height) / 2} cm²`,
      };
    },
  };
}

function orderOfOperations(): Topic {
  const templates: { text: (a: number, b: number, c: number) => string; calc: (a: number, b: number, c: number) => number }[] = [
    { text: (a, b, c) => `${a} + ${b} × ${c}`, calc: (a, b, c) => a + b * c },
    { text: (a, b, c) => `(${a} + ${b}) × ${c}`, calc: (a, b, c) => (a + b) * c },
    { text: (a, b, c) => `${a} × ${b} − ${c}`, calc: (a, b, c) => a * b - c },
    { text: (a, b, c) => `${a} × (${b} − ${c})`, calc: (a, b, c) => a * (b - c) },
  ];
  return {
    id: "order-of-operations",
    label: "Order of operations",
    generate: () => {
      const a = randInt(1, 10);
      const b = randInt(1, 10);
      const c = randInt(1, 10);
      const t = pick(templates);
      return { prompt: `${t.text(a, b, c)} = ?`, answer: String(t.calc(a, b, c)) };
    },
  };
}

function integerOperations(maxAbs: number): Topic {
  return {
    id: `integer-ops-${maxAbs}`,
    label: "Operations with negative numbers",
    generate: () => {
      const op = pick(["+", "−", "×"] as const);
      const a = randInt(-maxAbs, maxAbs);
      const b = randInt(-maxAbs, maxAbs);
      let answer: number;
      if (op === "+") answer = a + b;
      else if (op === "−") answer = a - b;
      else answer = a * b;
      return { prompt: `(${a}) ${op} (${b}) = ?`, answer: String(answer) };
    },
  };
}

// ---------- Grades 7-8 ----------

function simplifyLikeTerms(): Topic {
  return {
    id: "simplify-like-terms",
    label: "Simplifying algebraic expressions",
    generate: () => {
      const variable = pick(["x", "y", "a", "n"]);
      const coefA = randInt(2, 9);
      const coefB = randInt(2, 9);
      const op = pick(["+", "−"] as const);
      if (op === "+") {
        return { prompt: `${coefA}${variable} + ${coefB}${variable} = ?`, answer: `${coefA + coefB}${variable}` };
      }
      const [big, small] = coefA >= coefB ? [coefA, coefB] : [coefB, coefA];
      return { prompt: `${big}${variable} − ${small}${variable} = ?`, answer: `${big - small}${variable}` };
    },
  };
}

function solveOneStep(): Topic {
  return {
    id: "solve-one-step",
    label: "Solving one-step equations",
    generate: () => {
      const x = randInt(-15, 15);
      const kind = pick(["add", "mult"] as const);
      if (kind === "add") {
        const a = randInt(-20, 20);
        return { prompt: `x + ${a} = ${x + a}. Find x.`, answer: String(x) };
      }
      const m = pick([2, 3, 4, 5, -2, -3]);
      return { prompt: `${m}x = ${m * x}. Find x.`, answer: String(x) };
    },
  };
}

function ratioSimplify(): Topic {
  return {
    id: "ratio-simplify",
    label: "Simplifying ratios",
    generate: () => {
      const factor = randInt(2, 6);
      const m = randInt(1, 12);
      const n = randInt(1, 12);
      const a = m * factor;
      const b = n * factor;
      const g = gcd(a, b);
      return { prompt: `Simplify the ratio ${a}:${b}`, answer: `${a / g}:${b / g}` };
    },
  };
}

function percentageChange(): Topic {
  return {
    id: "percentage-change",
    label: "Percentage increase and decrease",
    generate: () => {
      const base = randInt(2, 40) * 5;
      const pct = pick([10, 20, 25, 50]);
      const direction = pick(["increase", "decrease"] as const);
      const change = (base * pct) / 100;
      const result = direction === "increase" ? base + change : base - change;
      return {
        prompt: `${direction === "increase" ? "Increase" : "Decrease"} ${base} by ${pct}%.`,
        answer: String(result),
      };
    },
  };
}

function angleTriangle(): Topic {
  return {
    id: "angle-triangle",
    label: "Angles in a triangle",
    generate: () => {
      const a = randInt(30, 100);
      const b = randInt(30, 160 - a);
      const c = 180 - a - b;
      return {
        prompt: `Two angles of a triangle are ${a}° and ${b}°. What is the third angle?`,
        answer: `${c}°`,
      };
    },
  };
}

function angleStraightLine(): Topic {
  return {
    id: "angle-straight-line",
    label: "Angles on a straight line",
    generate: () => {
      const a = randInt(10, 170);
      return {
        prompt: `An angle on a straight line is split into two parts. One part is ${a}°. What is the other part?`,
        answer: `${180 - a}°`,
      };
    },
  };
}

function simpleProbability(): Topic {
  return {
    id: "simple-probability",
    label: "Probability",
    generate: () => {
      const total = randInt(5, 20);
      const favourable = randInt(1, total - 1);
      return {
        prompt: `A bag has ${total} marbles, ${favourable} of which are red. What is the probability of picking a red marble? (as a fraction)`,
        answer: simplifyFraction(favourable, total),
      };
    },
  };
}

// ---------- Grades 9-10 ----------

function solveTwoStep(): Topic {
  return {
    id: "solve-two-step",
    label: "Solving two-step equations",
    generate: () => {
      const x = randInt(-12, 12);
      const a = pick([2, 3, 4, 5, -2, -3, -4]);
      const b = randInt(-15, 15);
      const bTerm = b === 0 ? "" : ` ${b > 0 ? "+" : "−"} ${Math.abs(b)}`;
      return { prompt: `${a}x${bTerm} = ${a * x + b}. Find x.`, answer: String(x) };
    },
  };
}

function simultaneousEquations(): Topic {
  return {
    id: "simultaneous-equations",
    label: "Simultaneous equations",
    generate: () => {
      let a1: number, b1: number, a2: number, b2: number;
      do {
        a1 = randInt(1, 5);
        b1 = randInt(1, 5);
        a2 = randInt(1, 5);
        b2 = randInt(1, 5);
      } while (a1 * b2 - a2 * b1 === 0);
      const x = randInt(1, 10);
      const y = randInt(1, 10);
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      const term = (coef: number, variable: string) => (coef === 1 ? variable : `${coef}${variable}`);
      return {
        prompt: `Solve: ${term(a1, "x")} + ${term(b1, "y")} = ${c1}  and  ${term(a2, "x")} + ${term(b2, "y")} = ${c2}`,
        answer: `x = ${x}, y = ${y}`,
      };
    },
  };
}

function formatSigned(coefficient: number, variable: string): string {
  if (coefficient === 0) return "";
  const sign = coefficient > 0 ? "+" : "−";
  const abs = Math.abs(coefficient);
  return ` ${sign} ${abs === 1 ? "" : abs}${variable}`;
}

function quadraticFactoring(): Topic {
  return {
    id: "quadratic-factoring",
    label: "Solving quadratics by factoring",
    generate: () => {
      let p = randInt(-9, 9);
      let q = randInt(-9, 9);
      if (p === 0) p = 1;
      if (q === 0) q = -1;
      const b = -(p + q);
      const c = p * q;
      const expr = `x²${formatSigned(b, "x")}${c !== 0 ? ` ${c > 0 ? "+" : "−"} ${Math.abs(c)}` : ""} = 0`;
      return { prompt: `Solve for x: ${expr}`, answer: `x = ${p} or x = ${q}` };
    },
  };
}

const PYTHAGOREAN_TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [6, 8, 10],
  [9, 12, 15],
];

function pythagoras(): Topic {
  return {
    id: "pythagoras",
    label: "Pythagoras' theorem",
    generate: () => {
      const [a, b, c] = pick(PYTHAGOREAN_TRIPLES);
      const k = randInt(1, 3);
      const [A, B, C] = [a * k, b * k, c * k];
      const askHypotenuse = Math.random() < 0.5;
      if (askHypotenuse) {
        return {
          prompt: `A right triangle has legs of length ${A} cm and ${B} cm. Find the hypotenuse.`,
          answer: `${C} cm`,
        };
      }
      return {
        prompt: `A right triangle has a hypotenuse of ${C} cm and one leg of ${A} cm. Find the other leg.`,
        answer: `${B} cm`,
      };
    },
  };
}

function trigRatio(): Topic {
  const angles = [30, 45, 60];
  return {
    id: "trig-ratio",
    label: "Right-triangle trigonometry",
    generate: () => {
      const angle = pick(angles);
      const hyp = randInt(5, 20);
      const useSin = Math.random() < 0.5;
      const value = useSin ? Math.sin((angle * Math.PI) / 180) : Math.cos((angle * Math.PI) / 180);
      const side = (hyp * value).toFixed(1);
      const relation = useSin ? "opposite" : "adjacent to";
      return {
        prompt: `In a right triangle the hypotenuse is ${hyp} cm and one angle is ${angle}°. Find the side ${relation} this angle (to 1 decimal place).`,
        answer: `${side} cm`,
      };
    },
  };
}

function indexLaws(): Topic {
  return {
    id: "index-laws",
    label: "Index laws",
    generate: () => {
      const base = randInt(2, 6);
      const e1 = randInt(2, 6);
      const e2 = randInt(1, e1 - 1 < 1 ? 1 : e1 - 1);
      const op = pick(["multiply", "divide"] as const);
      if (op === "multiply") {
        return { prompt: `${base}^${e1} × ${base}^${e2} = ${base}^?`, answer: String(e1 + e2) };
      }
      return { prompt: `${base}^${e1} ÷ ${base}^${e2} = ${base}^?`, answer: String(e1 - e2) };
    },
  };
}

function gradientBetweenPoints(): Topic {
  return {
    id: "gradient",
    label: "Gradient between two points",
    generate: () => {
      const x1 = randInt(-8, 8);
      const x2Options = Array.from({ length: 17 }, (_, i) => i - 8).filter((v) => v !== x1);
      const x2 = pick(x2Options);
      const y1 = randInt(-8, 8);
      const y2 = randInt(-8, 8);
      return {
        prompt: `Find the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
        answer: simplifyFraction(y2 - y1, x2 - x1),
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function derivativePowerRule(): Topic {
  return {
    id: "derivative-power-rule",
    label: "Differentiation (power rule)",
    generate: () => {
      const a = randInt(2, 9);
      const n = randInt(2, 6);
      const newCoef = a * n;
      const newPower = n - 1;
      const powerText = newPower === 1 ? "x" : newPower === 0 ? "" : `x^${newPower}`;
      return {
        prompt: `Differentiate: y = ${a}x^${n}`,
        answer: `dy/dx = ${newCoef}${powerText}`,
      };
    },
  };
}

function logLaws(): Topic {
  return {
    id: "log-laws",
    label: "Logarithm laws",
    generate: () => {
      const base = pick([2, 3, 5, 10]);
      const x = randInt(2, 9);
      const y = randInt(2, 9);
      const op = pick(["add", "subtract"] as const);
      if (op === "add") {
        return {
          prompt: `Write as a single logarithm: log${base}(${x}) + log${base}(${y})`,
          answer: `log${base}(${x * y})`,
        };
      }
      return {
        prompt: `Write as a single logarithm: log${base}(${x * y}) − log${base}(${y})`,
        answer: `log${base}(${x})`,
      };
    },
  };
}

function compoundInterest(): Topic {
  return {
    id: "compound-interest",
    label: "Compound interest",
    generate: () => {
      const principal = randInt(1, 20) * 500;
      const rate = pick([2, 4, 5, 8, 10]);
      const years = randInt(1, 4);
      const amount = principal * Math.pow(1 + rate / 100, years);
      return {
        prompt: `$${principal} is invested at ${rate}% p.a. compound interest. What is it worth after ${years} ${years === 1 ? "year" : "years"} (to the nearest cent)?`,
        answer: `$${amount.toFixed(2)}`,
      };
    },
  };
}

function arithmeticSequence(): Topic {
  return {
    id: "arithmetic-sequence",
    label: "Arithmetic sequences",
    generate: () => {
      const a1 = randInt(1, 10);
      const d = randInt(2, 9);
      const n = randInt(5, 15);
      return {
        prompt: `An arithmetic sequence starts at ${a1} with common difference ${d}. Find the ${ordinal(n)} term.`,
        answer: String(a1 + (n - 1) * d),
      };
    },
  };
}

function geometricSequence(): Topic {
  return {
    id: "geometric-sequence",
    label: "Geometric sequences",
    generate: () => {
      const a1 = randInt(1, 5);
      const r = pick([2, 3]);
      const n = randInt(3, 6);
      return {
        prompt: `A geometric sequence starts at ${a1} with common ratio ${r}. Find the ${ordinal(n)} term.`,
        answer: String(a1 * Math.pow(r, n - 1)),
      };
    },
  };
}

const UNIT_CIRCLE: { angle: string; sin: string; cos: string; tan: string }[] = [
  { angle: "0°", sin: "0", cos: "1", tan: "0" },
  { angle: "30°", sin: "1/2", cos: "√3/2", tan: "1/√3" },
  { angle: "45°", sin: "√2/2", cos: "√2/2", tan: "1" },
  { angle: "60°", sin: "√3/2", cos: "1/2", tan: "√3" },
  { angle: "90°", sin: "1", cos: "0", tan: "undefined" },
];

function unitCircleValues(): Topic {
  return {
    id: "unit-circle",
    label: "Exact trig values",
    generate: () => {
      const entry = pick(UNIT_CIRCLE);
      const func = pick(["sin", "cos", "tan"] as const);
      return { prompt: `${func}(${entry.angle}) = ?`, answer: entry[func] };
    },
  };
}

function quadraticDiscriminant(): Topic {
  return {
    id: "quadratic-discriminant",
    label: "The discriminant",
    generate: () => {
      const a = randInt(1, 4);
      let b = randInt(-9, 9);
      let c = randInt(-9, 9);
      if (b === 0) b = 3;
      if (c === 0) c = -2;
      const expr = `${a === 1 ? "" : a}x²${formatSigned(b, "x")} ${c > 0 ? "+" : "−"} ${Math.abs(c)} = 0`;
      const discriminant = b * b - 4 * a * c;
      return { prompt: `For ${expr}, calculate the discriminant (b² − 4ac).`, answer: String(discriminant) };
    },
  };
}

export function getMathsTopics(grade: number): Topic[] {
  if (grade <= 2) {
    return [
      additionWithin(grade === 1 ? 20 : 50),
      subtractionWithin(grade === 1 ? 20 : 50),
      skipCounting(),
      numberSequence(),
      shapeSides(),
    ];
  }
  if (grade <= 4) {
    return [
      additionWithin(1000),
      subtractionWithin(1000),
      multiplicationTables(2, 12),
      divisionFacts(12, 12),
      fractionOfShape(),
      timeReading(),
      moneyProblems(),
      perimeterRectangle(20),
    ];
  }
  if (grade <= 6) {
    return [
      multiDigitMultiplication(),
      longDivision(),
      fractionAddSameDenom(12),
      decimalAddSubtract(),
      percentageOf(),
      areaRectangle(20),
      areaTriangle(20),
      orderOfOperations(),
      integerOperations(20),
    ];
  }
  if (grade <= 8) {
    return [
      integerOperations(50),
      simplifyLikeTerms(),
      solveOneStep(),
      ratioSimplify(),
      percentageChange(),
      angleTriangle(),
      angleStraightLine(),
      simpleProbability(),
    ];
  }
  if (grade <= 10) {
    return [
      solveTwoStep(),
      simultaneousEquations(),
      quadraticFactoring(),
      pythagoras(),
      trigRatio(),
      indexLaws(),
      gradientBetweenPoints(),
    ];
  }
  return [
    derivativePowerRule(),
    logLaws(),
    compoundInterest(),
    arithmeticSequence(),
    geometricSequence(),
    unitCircleValues(),
    quadraticDiscriminant(),
  ];
}

export type { Question };
