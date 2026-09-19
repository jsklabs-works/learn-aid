import type { Difficulty, Question, Syllabus, Topic } from "../types";
import { gcd, ordinal, pick, randInt, simplifyFraction } from "./utils";
import { moreMathsTopics } from "./mathsMore";
import { mathsWordProblems } from "./wordProblems";

// ---------- Grades 1-2 ----------

function additionWithin(max: number): Topic {
  return {
    id: `add-${max}`,
    label: `Addition within ${max}`,
    generate: () => {
      const a = randInt(0, max);
      const b = randInt(0, max - a);
      return {
        prompt: `${a} + ${b} = ?`,
        answer: String(a + b),
        explanation: `Add the two numbers: ${a} + ${b} = ${a + b}.`,
      };
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
      return {
        prompt: `${a} − ${b} = ?`,
        answer: String(a - b),
        explanation: `Take ${b} away from ${a}: ${a} - ${b} = ${a - b}. Check by adding back: ${a - b} + ${b} = ${a}.`,
      };
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
        explanation: `The numbers go up by ${step} each time. The last number shown is ${seq[3]}, so the next is ${seq[3]} + ${step} = ${start + 4 * step}.`,
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
        explanation: `Each number is 1 more than the one before. The last number shown is ${start + 2}, so the next is ${start + 2} + 1 = ${start + 3}.`,
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
      const note: Record<string, string> = {
        triangle: "tri- means three",
        square: "4 equal sides",
        rectangle: "2 long sides and 2 short sides",
        pentagon: "penta- means five",
        hexagon: "hexa- means six",
        octagon: "octa- means eight",
      };
      return {
        prompt: `How many sides does a ${name} have?`,
        answer: String(sides),
        explanation: `${/^[aeiou]/.test(name) ? "An" : "A"} ${name} has ${sides} sides (${note[name]}).`,
      };
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
      return {
        prompt: `${a} × ${b} = ?`,
        answer: String(a * b),
        explanation: `${a} × ${b} means ${b} groups of ${a}. Counting on in ${a}s, ${b} times, gives ${a * b}.`,
      };
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
      return {
        prompt: `${divisor * quotient} ÷ ${divisor} = ?`,
        answer: String(quotient),
        explanation: `Ask: what times ${divisor} makes ${divisor * quotient}? ${divisor} × ${quotient} = ${divisor * quotient}, so ${divisor * quotient} ÷ ${divisor} = ${quotient}.`,
      };
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
        return {
          prompt: `It is ${time}. How many minutes past the hour is it?`,
          answer: "0",
          explanation: `The time is exactly ${hour} o'clock, so it is 0 minutes past the hour.`,
        };
      }
      return {
        prompt: `It is ${time}. How many minutes past ${hour} o'clock is it?`,
        answer: String(minute),
        explanation: `Each number on the clock face is 5 minutes. The minute hand points at ${minute / 5}, so it is ${minute / 5} × 5 = ${minute} minutes past ${hour}.`,
      };
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
        explanation: `Change = amount paid - price = $${paid} - $${price} = $${paid - price}.`,
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
        explanation: `Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = 2 × ${l + w} = ${2 * (l + w)} cm.`,
        figure: { kind: "rectangle", width: l, height: w, unit: "cm" },
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
        explanation: `The shape has ${denom} equal parts in total and ${num} ${num === 1 ? "is" : "are"} shaded. Fraction = shaded parts / total parts = ${num}/${denom}.`,
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
      return {
        prompt: `${a} × ${b} = ?`,
        answer: String(a * b),
        explanation:
          b > 10
            ? `Split ${b} into 10 + ${b - 10}. ${a} × 10 = ${a * 10} and ${a} × ${b - 10} = ${a * (b - 10)}. Add them: ${a * 10} + ${a * (b - 10)} = ${a * b}.`
            : `Multiply ${a} by ${b}, working through the tens and ones: ${a} × ${b} = ${a * b}.`,
      };
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
      return {
        prompt: `${divisor * quotient} ÷ ${divisor} = ?`,
        answer: String(quotient),
        explanation: `Work out how many times ${divisor} goes into ${divisor * quotient}. Check by multiplying: ${quotient} × ${divisor} = ${divisor * quotient}, so the answer is ${quotient}.`,
      };
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
      const total = a + b;
      const simplified = simplifyFraction(total, d);
      return {
        prompt: `${a}/${d} + ${b}/${d} = ?`,
        answer: simplified,
        explanation: `The denominators are the same (${d}), so add the numerators and keep the denominator: ${a} + ${b} = ${total}, giving ${total}/${d}.${simplified !== `${total}/${d}` ? ` Simplify: ${total}/${d} = ${simplified}.` : ""}`,
      };
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
      return {
        prompt: `${x.toFixed(1)} ${op} ${y.toFixed(1)} = ?`,
        answer: result.toFixed(1),
        explanation: `Line up the decimal points and ${op === "+" ? "add" : "subtract"} column by column: ${x.toFixed(1)} ${op} ${y.toFixed(1)} = ${result.toFixed(1)}.`,
      };
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
      const shown = String(Math.round(value * 100) / 100);
      return {
        prompt: `What is ${pct}% of ${base}?`,
        answer: shown,
        explanation: `${pct}% means ${pct}/100. So ${pct}% of ${base} = ${pct}/100 × ${base} = ${shown}.`,
      };
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
        explanation: `Area of a rectangle = length × width = ${l} × ${w} = ${l * w} cm².`,
        figure: { kind: "rectangle", width: l, height: w, unit: "cm" },
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
        explanation: `Area of a triangle = 1/2 × base × height = 1/2 × ${base} × ${height} = ${(base * height) / 2} cm².`,
        figure: { kind: "triangleBase", base, height, unit: "cm" },
      };
    },
  };
}

function orderOfOperations(): Topic {
  type Fn3<T> = (a: number, b: number, c: number) => T;
  const templates: { text: Fn3<string>; calc: Fn3<number>; steps: Fn3<string> }[] = [
    {
      text: (a, b, c) => `${a} + ${b} × ${c}`,
      calc: (a, b, c) => a + b * c,
      steps: (a, b, c) => `Multiply before adding: ${b} × ${c} = ${b * c}. Then add: ${a} + ${b * c} = ${a + b * c}.`,
    },
    {
      text: (a, b, c) => `(${a} + ${b}) × ${c}`,
      calc: (a, b, c) => (a + b) * c,
      steps: (a, b, c) => `Brackets first: ${a} + ${b} = ${a + b}. Then multiply: ${a + b} × ${c} = ${(a + b) * c}.`,
    },
    {
      text: (a, b, c) => `${a} × ${b} − ${c}`,
      calc: (a, b, c) => a * b - c,
      steps: (a, b, c) => `Multiply before subtracting: ${a} × ${b} = ${a * b}. Then subtract: ${a * b} - ${c} = ${a * b - c}.`,
    },
    {
      text: (a, b, c) => `${a} × (${b} − ${c})`,
      calc: (a, b, c) => a * (b - c),
      steps: (a, b, c) => `Brackets first: ${b} - ${c} = ${b - c}. Then multiply: ${a} × ${b - c} = ${a * (b - c)}.`,
    },
  ];
  return {
    id: "order-of-operations",
    label: "Order of operations",
    generate: () => {
      const a = randInt(1, 10);
      const b = randInt(1, 10);
      const c = randInt(1, 10);
      const t = pick(templates);
      return {
        prompt: `${t.text(a, b, c)} = ?`,
        answer: String(t.calc(a, b, c)),
        explanation: `Follow the order of operations (brackets, then multiply/divide, then add/subtract). ${t.steps(a, b, c)}`,
      };
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
      let explanation: string;
      if (op === "+") {
        explanation = `Adding ${b < 0 ? "a negative number moves you left" : "a positive number moves you right"} on the number line: ${a} + (${b}) = ${answer}.`;
      } else if (op === "−") {
        explanation = `Subtracting ${b} is the same as adding ${-b}: ${a} - (${b}) = ${a} + (${-b}) = ${answer}.`;
      } else if (a === 0 || b === 0) {
        explanation = "Anything multiplied by 0 is 0.";
      } else {
        explanation = `Multiply the sizes: ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(answer)}. ${a < 0 === b < 0 ? "The signs are the same, so the answer is positive" : "The signs are different, so the answer is negative"}: ${a} × (${b}) = ${answer}.`;
      }
      return { prompt: `(${a}) ${op} (${b}) = ?`, answer: String(answer), explanation };
    },
  };
}

// ---------- Cartesian plane (Grade 6) ----------

const QUADRANT_TEXT =
  "Positive x and positive y is the first quadrant (top right); negative x and positive y is the second (top left); negative x and negative y is the third (bottom left); positive x and negative y is the fourth (bottom right).";

function unitsText(n: number): string {
  return `${n} ${n === 1 ? "unit" : "units"}`;
}

function cartesianPlane(): Topic {
  const coordinate = () => randInt(1, 6) * pick([1, -1]);
  const moves = (x: number, y: number) =>
    `Start at the origin (0, 0). Move ${unitsText(Math.abs(x))} ${x > 0 ? "right" : "left"}, then ${unitsText(Math.abs(y))} ${y > 0 ? "up" : "down"}.`;
  return {
    id: "cartesian-plane",
    label: "The Cartesian plane",
    generate: () => {
      const kind = pick(["read", "quadrant", "locate", "reflect", "translate", "distance"] as const);

      if (kind === "read") {
        const x = coordinate();
        const y = coordinate();
        return {
          prompt: "What are the coordinates of point A? (write them as (x, y))",
          answer: `(${x}, ${y})`,
          figure: { kind: "cartesian", extent: 6, points: [{ label: "A", x, y }] },
          explanation: `Read across first, then up or down. From the origin, point A is ${unitsText(Math.abs(x))} ${x > 0 ? "right" : "left"} and ${unitsText(Math.abs(y))} ${y > 0 ? "up" : "down"}. Coordinates are written (x, y), so A is (${x}, ${y}).`,
        };
      }

      if (kind === "quadrant") {
        const x = coordinate();
        const y = coordinate();
        const answer = x > 0 && y > 0 ? "first" : x < 0 && y > 0 ? "second" : x < 0 && y < 0 ? "third" : "fourth";
        return {
          prompt: "In which quadrant is point P?",
          answer,
          options: ["first", "second", "third", "fourth"],
          figure: { kind: "cartesian", extent: 6, points: [{ label: "P", x, y }] },
          explanation: `P is at (${x}, ${y}): x is ${x > 0 ? "positive" : "negative"} and y is ${y > 0 ? "positive" : "negative"}. ${QUADRANT_TEXT} So P is in the ${answer} quadrant.`,
        };
      }

      if (kind === "locate") {
        const seen = new Set<string>();
        const points: { label: string; x: number; y: number }[] = [];
        for (const label of ["A", "B", "C", "D"]) {
          let x: number, y: number;
          do {
            x = coordinate();
            y = coordinate();
          } while (seen.has(`${x},${y}`));
          seen.add(`${x},${y}`);
          points.push({ label, x, y });
        }
        const target = pick(points);
        return {
          prompt: `Which point is at (${target.x}, ${target.y})?`,
          answer: target.label,
          options: ["A", "B", "C", "D"],
          figure: { kind: "cartesian", extent: 6, points },
          explanation: `${moves(target.x, target.y)} That is point ${target.label}.`,
        };
      }

      if (kind === "reflect") {
        const x = coordinate();
        const y = coordinate();
        const inXAxis = Math.random() < 0.5;
        const image = inXAxis ? `(${x}, ${-y})` : `(${-x}, ${y})`;
        return {
          prompt: `Point A is at (${x}, ${y}). What are the coordinates of its reflection in the ${inXAxis ? "x-axis" : "y-axis"}?`,
          answer: image,
          figure: { kind: "cartesian", extent: 6, points: [{ label: "A", x, y }] },
          explanation: inXAxis
            ? `Reflecting in the x-axis flips the point up or down: the x-coordinate stays the same and the y-coordinate changes sign. (${x}, ${y}) becomes ${image}.`
            : `Reflecting in the y-axis flips the point left or right: the y-coordinate stays the same and the x-coordinate changes sign. (${x}, ${y}) becomes ${image}.`,
        };
      }

      if (kind === "translate") {
        const x = randInt(1, 5) * pick([1, -1]);
        const y = randInt(1, 5) * pick([1, -1]);
        const dx = randInt(1, 3) * pick([1, -1]);
        const dy = randInt(1, 3) * pick([1, -1]);
        return {
          prompt: `Point A is at (${x}, ${y}). It is moved ${unitsText(Math.abs(dx))} ${dx > 0 ? "right" : "left"} and ${unitsText(Math.abs(dy))} ${dy > 0 ? "up" : "down"}. What are its new coordinates?`,
          answer: `(${x + dx}, ${y + dy})`,
          figure: { kind: "cartesian", extent: 8, points: [{ label: "A", x, y }] },
          explanation: `Moving right adds to x and left subtracts; moving up adds to y and down subtracts. New x = ${x} ${dx > 0 ? "+" : "-"} ${Math.abs(dx)} = ${x + dx}. New y = ${y} ${dy > 0 ? "+" : "-"} ${Math.abs(dy)} = ${y + dy}. So A moves to (${x + dx}, ${y + dy}).`,
        };
      }

      const horizontal = Math.random() < 0.5;
      const fixed = coordinate();
      const p = randInt(-6, 6);
      let q: number;
      do {
        q = randInt(-6, 6);
      } while (q === p);
      const a = horizontal ? { label: "A", x: p, y: fixed } : { label: "A", x: fixed, y: p };
      const b = horizontal ? { label: "B", x: q, y: fixed } : { label: "B", x: fixed, y: q };
      const distance = Math.abs(p - q);
      return {
        prompt: "How many units apart are points A and B?",
        answer: String(distance),
        figure: { kind: "cartesian", extent: 6, points: [a, b] },
        explanation: `Both points are on the same ${horizontal ? "horizontal" : "vertical"} line, so only the ${horizontal ? "x" : "y"}-coordinates differ. A is at ${horizontal ? "x" : "y"} = ${p} and B is at ${horizontal ? "x" : "y"} = ${q}. The distance is the difference between them: ${Math.max(p, q)} − ${Math.min(p, q) < 0 ? `(${Math.min(p, q)})` : Math.min(p, q)} = ${distance} units.`,
      };
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
        return {
          prompt: `${coefA}${variable} + ${coefB}${variable} = ?`,
          answer: `${coefA + coefB}${variable}`,
          explanation: `Both terms have the same variable (${variable}), so they are like terms. Add the coefficients: ${coefA} + ${coefB} = ${coefA + coefB}, giving ${coefA + coefB}${variable}.`,
        };
      }
      const [big, small] = coefA >= coefB ? [coefA, coefB] : [coefB, coefA];
      return {
        prompt: `${big}${variable} − ${small}${variable} = ?`,
        answer: `${big - small}${variable}`,
        explanation: `Both terms have the same variable (${variable}), so they are like terms. Subtract the coefficients: ${big} - ${small} = ${big - small}, giving ${big - small}${variable}.`,
      };
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
        const a = randInt(1, 20) * pick([1, -1]);
        return {
          prompt: `x ${a < 0 ? "−" : "+"} ${Math.abs(a)} = ${x + a}. Find x.`,
          answer: String(x),
          explanation: `To undo "${a < 0 ? "-" : "+"} ${Math.abs(a)}", ${a < 0 ? `add ${-a}` : `subtract ${a}`} on both sides: x = ${x + a} ${a < 0 ? "+" : "-"} ${Math.abs(a)} = ${x}.`,
        };
      }
      const m = pick([2, 3, 4, 5, -2, -3]);
      return {
        prompt: `${m}x = ${m * x}. Find x.`,
        answer: String(x),
        explanation: `${m}x means ${m} × x. Divide both sides by ${m}: x = ${m * x} ÷ ${m} = ${x}.`,
      };
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
      return {
        prompt: `Simplify the ratio ${a}:${b}`,
        answer: `${a / g}:${b / g}`,
        explanation: `Find the highest common factor of ${a} and ${b}: it is ${g}. Divide both parts by ${g}: ${a} ÷ ${g} = ${a / g} and ${b} ÷ ${g} = ${b / g}, so the ratio is ${a / g}:${b / g}.`,
      };
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
        explanation: `${pct}% of ${base} = ${pct}/100 × ${base} = ${change}. ${direction === "increase" ? `Add it on: ${base} + ${change} = ${result}` : `Take it off: ${base} - ${change} = ${result}`}.`,
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
        explanation: `The angles in a triangle add up to 180°. ${a}° + ${b}° = ${a + b}°, so the third angle is 180° - ${a + b}° = ${c}°.`,
        figure: { kind: "triangleAngles", a, b },
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
        explanation: `Angles on a straight line add up to 180°. The other angle = 180° - ${a}° = ${180 - a}°.`,
        figure: { kind: "angleOnLine", known: a },
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
        explanation: `Probability = favourable outcomes / total outcomes = ${favourable}/${total}.${simplifyFraction(favourable, total) !== `${favourable}/${total}` ? ` Simplify: ${favourable}/${total} = ${simplifyFraction(favourable, total)}.` : ""}`,
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
      const rhs = a * x + b;
      const step1 =
        b === 0
          ? `${a}x = ${rhs}.`
          : `${b > 0 ? "Subtract" : "Add"} ${Math.abs(b)} ${b > 0 ? "from" : "to"} both sides: ${a}x = ${rhs} ${b > 0 ? "-" : "+"} ${Math.abs(b)} = ${a * x}.`;
      return {
        prompt: `${a}x${bTerm} = ${rhs}. Find x.`,
        answer: String(x),
        explanation: `${step1} Then divide both sides by ${a}: x = ${a * x} ÷ ${a} = ${x}.`,
      };
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
      const term = (coef: number, variable: string) =>
        coef === 1 ? variable : coef === -1 ? `-${variable}` : `${coef}${variable}`;
      return {
        prompt: `Solve: ${term(a1, "x")} + ${term(b1, "y")} = ${c1}  and  ${term(a2, "x")} + ${term(b2, "y")} = ${c2}`,
        answer: `x = ${x}, y = ${y}`,
        explanation: `${
          a1 === a2
            ? `The x terms already match, so subtract the equations to remove x: (${b1} - ${b2})y = ${c1} - ${c2}, so ${term(b1 - b2, "y")} = ${c1 - c2}.`
            : `Eliminate x by making the x terms match: ${a2 !== 1 ? `multiply the first equation by ${a2}` : ""}${a2 !== 1 && a1 !== 1 ? " and " : ""}${a1 !== 1 ? `multiply the second by ${a1}` : ""}. This gives ${term(a1 * a2, "x")} + ${term(a2 * b1, "y")} = ${a2 * c1} and ${term(a1 * a2, "x")} + ${term(a1 * b2, "y")} = ${a1 * c2}. Subtract: ${term(a2 * b1 - a1 * b2, "y")} = ${a2 * c1 - a1 * c2}.`
        } So y = ${y}. Substitute y = ${y} into the first equation: ${term(a1, "x")} = ${c1} - ${b1 * y} = ${c1 - b1 * y}, so x = ${x}.`,
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
      const m = -p;
      const n = -q;
      return {
        prompt: `Solve for x: ${expr}`,
        answer: `x = ${p} or x = ${q}`,
        explanation: `Find two numbers that multiply to ${c} and add to ${b}: ${m} and ${n}. So the equation factorises as (x ${m < 0 ? "-" : "+"} ${Math.abs(m)})(x ${n < 0 ? "-" : "+"} ${Math.abs(n)}) = 0. Set each bracket to 0: x = ${p} or x = ${q}.`,
      };
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
          explanation: `Use Pythagoras: c² = a² + b². c² = ${A}² + ${B}² = ${A * A} + ${B * B} = ${A * A + B * B}, so c = √${A * A + B * B} = ${C} cm.`,
          figure: { kind: "rightTriangle", legA: A, legB: B, hyp: C, unit: "cm", unknown: "hyp" },
        };
      }
      return {
        prompt: `A right triangle has a hypotenuse of ${C} cm and one leg of ${A} cm. Find the other leg.`,
        answer: `${B} cm`,
        explanation: `Use Pythagoras: a² = c² - b². a² = ${C}² - ${A}² = ${C * C} - ${A * A} = ${C * C - A * A}, so a = √${C * C - A * A} = ${B} cm.`,
        figure: { kind: "rightTriangle", legA: A, legB: B, hyp: C, unit: "cm", unknown: "legB" },
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
        explanation: `${useSin ? "sin" : "cos"}(${angle}°) = ${useSin ? "opposite" : "adjacent"} / hypotenuse. So the side = ${hyp} × ${useSin ? "sin" : "cos"}(${angle}°) = ${hyp} × ${value.toFixed(4)} = ${side} cm.`,
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
        return {
          prompt: `${base}^${e1} × ${base}^${e2} = ${base}^?`,
          answer: String(e1 + e2),
          explanation: `When multiplying powers with the same base, add the exponents: ${e1} + ${e2} = ${e1 + e2}.`,
        };
      }
      return {
        prompt: `${base}^${e1} ÷ ${base}^${e2} = ${base}^?`,
        answer: String(e1 - e2),
        explanation: `When dividing powers with the same base, subtract the exponents: ${e1} - ${e2} = ${e1 - e2}.`,
      };
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
      const rise = y2 - y1;
      const run = x2 - x1;
      const simple = simplifyFraction(rise, run);
      return {
        prompt: `Find the gradient of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`,
        answer: simple,
        explanation: `Gradient = rise / run = (y2 - y1) / (x2 - x1) = (${y2} - (${y1})) / (${x2} - (${x1})) = ${rise}/${run}${simple !== `${rise}/${run}` ? ` = ${simple}` : ""}.`,
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
        explanation: `Power rule: multiply by the power, then reduce the power by 1. d/dx(${a}x^${n}) = ${a} × ${n} × x^${newPower} = ${newCoef}${powerText}.`,
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
          explanation: `Log law: log(x) + log(y) = log(xy). So log${base}(${x}) + log${base}(${y}) = log${base}(${x} × ${y}) = log${base}(${x * y}).`,
        };
      }
      return {
        prompt: `Write as a single logarithm: log${base}(${x * y}) − log${base}(${y})`,
        answer: `log${base}(${x})`,
        explanation: `Log law: log(x) - log(y) = log(x/y). So log${base}(${x * y}) - log${base}(${y}) = log${base}(${x * y} ÷ ${y}) = log${base}(${x}).`,
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
        explanation: `Compound interest: A = P × (1 + r)^n. Here r = ${rate}% = ${rate / 100}, so A = ${principal} × ${(1 + rate / 100).toFixed(2)}^${years} = $${amount.toFixed(2)}.`,
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
        explanation: `nth term = first term + (n - 1) × d = ${a1} + (${n} - 1) × ${d} = ${a1} + ${(n - 1) * d} = ${a1 + (n - 1) * d}.`,
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
        explanation: `nth term = first term × r^(n - 1) = ${a1} × ${r}^${n - 1} = ${a1} × ${Math.pow(r, n - 1)} = ${a1 * Math.pow(r, n - 1)}.`,
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
      return {
        prompt: `${func}(${entry.angle}) = ?`,
        answer: entry[func],
        explanation: `Exact values come from the special triangles. At ${entry.angle}: sin = ${entry.sin}, cos = ${entry.cos}, tan = ${entry.tan}. So ${func}(${entry.angle}) = ${entry[func]}.`,
      };
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
      return {
        prompt: `For ${expr}, calculate the discriminant (b² − 4ac).`,
        answer: String(discriminant),
        explanation: `Here a = ${a}, b = ${b}, c = ${c}. Discriminant = b² - 4ac = (${b})² - 4 × ${a} × (${c}) = ${b * b} - (${4 * a * c}) = ${discriminant}.`,
      };
    },
  };
}

// ---------- Advanced extension topics (Grade 11-12 "Advanced" only) ----------

function quadraticFormula(): Topic {
  return {
    id: "quadratic-formula",
    label: "The quadratic formula",
    generate: () => {
      const a = randInt(1, 3);
      let b = randInt(-9, 9);
      if (b === 0) b = 4;
      const c = -randInt(1, 9);
      const disc = b * b - 4 * a * c;
      const sqrtDisc = Math.sqrt(disc);
      const x1 = (-b + sqrtDisc) / (2 * a);
      const x2 = (-b - sqrtDisc) / (2 * a);
      const expr = `${a === 1 ? "" : a}x²${formatSigned(b, "x")} − ${Math.abs(c)} = 0`;
      return {
        prompt: `Use the quadratic formula to solve (round to 2 decimal places): ${expr}`,
        answer: `x = ${x1.toFixed(2)} or x = ${x2.toFixed(2)}`,
        explanation: `Use x = (-b ± √(b² - 4ac)) / 2a with a = ${a}, b = ${b}, c = ${c}. The discriminant is ${b}² - 4 × ${a} × (${c}) = ${disc}. So x = (${-b} ± √${disc}) / ${2 * a}, giving x = ${x1.toFixed(2)} or x = ${x2.toFixed(2)}.`,
      };
    },
  };
}

function integrationPowerRule(): Topic {
  return {
    id: "integration-power-rule",
    label: "Integration (power rule)",
    generate: () => {
      const a = randInt(2, 9);
      const n = randInt(1, 5);
      const newPower = n + 1;
      const coef = simplifyFraction(a, newPower);
      const coefDisplay = coef.includes("/") ? `(${coef})` : coef;
      const powerText = newPower === 1 ? "x" : `x^${newPower}`;
      return {
        prompt: `Find ∫ ${a}x^${n} dx`,
        answer: `${coefDisplay}${powerText} + C`,
        explanation: `Power rule for integration: add 1 to the power and divide by the new power. ∫ ${a}x^${n} dx = ${a}x^${newPower} / ${newPower} + C = ${coefDisplay}${powerText} + C.`,
      };
    },
  };
}

function chainRuleSimple(): Topic {
  return {
    id: "chain-rule-simple",
    label: "The chain rule",
    generate: () => {
      const a = randInt(2, 5);
      const b = randInt(1, 9);
      const n = randInt(2, 4);
      const newCoef = a * n;
      const powerText = n - 1 === 1 ? `(${a}x + ${b})` : `(${a}x + ${b})^${n - 1}`;
      return {
        prompt: `Differentiate using the chain rule: y = (${a}x + ${b})^${n}`,
        answer: `dy/dx = ${newCoef}${powerText}`,
        explanation: `Chain rule: bring down the power, multiply by the derivative of the inside (${a}), and reduce the power by 1. dy/dx = ${n} × ${a} × (${a}x + ${b})${n - 1 === 1 ? "" : `^${n - 1}`} = ${newCoef}${powerText}.`,
      };
    },
  };
}

// ---------- Cambridge International extras (Grade 9+) ----------

function standardForm(): Topic {
  return {
    id: "standard-form",
    label: "Standard form",
    generate: () => {
      const mantissa = randInt(10, 99) / 10;
      const exponent = randInt(2, 8);
      const value = Math.round(mantissa * Math.pow(10, exponent));
      const toStandard = Math.random() < 0.5;
      if (toStandard) {
        return {
          prompt: `Write ${value.toLocaleString()} in standard form.`,
          answer: `${mantissa} × 10^${exponent}`,
          explanation: `Standard form has one non-zero digit before the decimal point. Move the point ${exponent} places: ${value.toLocaleString()} = ${mantissa} × 10^${exponent}.`,
        };
      }
      return {
        prompt: `Write ${mantissa} × 10^${exponent} as an ordinary number.`,
        answer: value.toLocaleString(),
        explanation: `× 10^${exponent} means move the decimal point ${exponent} places to the right: ${mantissa} × 10^${exponent} = ${value.toLocaleString()}.`,
      };
    },
  };
}

function bearings(): Topic {
  return {
    id: "bearings",
    label: "Bearings",
    generate: () => {
      const bearing = randInt(1, 359);
      const back = (bearing + 180) % 360;
      return {
        prompt: `The bearing of point B from point A is ${String(bearing).padStart(3, "0")}°. Find the bearing of A from B.`,
        answer: `${String(back).padStart(3, "0")}°`,
        explanation: `A back bearing differs by 180°. ${bearing < 180 ? `${bearing}° + 180° = ${back}°` : `${bearing}° - 180° = ${back}°`}, written as a three-figure bearing: ${String(back).padStart(3, "0")}°.`,
      };
    },
  };
}

function setsVenn(): Topic {
  return {
    id: "sets-venn",
    label: "Sets and Venn diagrams",
    generate: () => {
      const onlyA = randInt(4, 12);
      const onlyB = randInt(4, 12);
      const both = randInt(2, 8);
      const neither = randInt(1, 6);
      const total = onlyA + onlyB + both + neither;
      const askWhich = pick(["total", "either", "neither"] as const);
      if (askWhich === "total") {
        return {
          prompt: `In a class, ${onlyA} students study only French, ${onlyB} study only Spanish, ${both} study both, and ${neither} study neither. How many students are there in total?`,
          answer: String(total),
          explanation: `Add every group: ${onlyA} + ${onlyB} + ${both} + ${neither} = ${total}.`,
        };
      }
      if (askWhich === "either") {
        return {
          prompt: `In a class of ${total} students, ${onlyA} study only French, ${onlyB} study only Spanish, and ${both} study both. How many students study at least one of the two languages?`,
          answer: String(onlyA + onlyB + both),
          explanation: `Add French only, Spanish only and both: ${onlyA} + ${onlyB} + ${both} = ${onlyA + onlyB + both}.`,
        };
      }
      return {
        prompt: `In a class of ${total} students, ${onlyA + both} study French and ${onlyB + both} study Spanish, and ${both} study both. How many students study neither language?`,
        answer: String(neither),
        explanation: `Students studying at least one language = French + Spanish - both = ${onlyA + both} + ${onlyB + both} - ${both} = ${onlyA + onlyB + both}. Neither = ${total} - ${onlyA + onlyB + both} = ${neither}.`,
      };
    },
  };
}

function cambridgeExtras(grade: number): Topic[] {
  return grade >= 9 ? [standardForm(), bearings(), setsVenn()] : [];
}

function baseMathsTopics(grade: number): Topic[] {
  return [...coreMathsTopics(grade), ...moreMathsTopics(grade), mathsWordProblems(grade)];
}

function coreMathsTopics(grade: number): Topic[] {
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
      ...(grade === 6 ? [cartesianPlane()] : []),
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

/** "Advanced" pulls in a taste of the next grade band's topics; the top band gets genuinely new extension topics. */
function advancedExtras(grade: number): Topic[] {
  if (grade <= 2) return [multiplicationTables(2, 5), perimeterRectangle(10)];
  if (grade <= 4) return [percentageOf(), orderOfOperations()];
  if (grade <= 6) return [simplifyLikeTerms(), ratioSimplify()];
  if (grade <= 8) return [solveTwoStep(), pythagoras()];
  if (grade <= 10) return [derivativePowerRule(), logLaws()];
  return [quadraticFormula(), integrationPowerRule(), chainRuleSimple()];
}

export function getMathsTopics(
  grade: number,
  syllabus: Syllabus = "vic",
  difficulty: Difficulty = "standard",
): Topic[] {
  const base = baseMathsTopics(grade);
  const advanced = difficulty === "advanced" ? advancedExtras(grade) : [];
  const cambridge = syllabus === "cambridge" ? cambridgeExtras(grade) : [];
  return [...base, ...advanced, ...cambridge];
}

export type { Question };
