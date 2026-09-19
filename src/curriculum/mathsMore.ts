import type { Question, Topic } from "../types";
import { gcd, pick, randInt, shuffle, simplifyFraction } from "./utils";

function choices(prompt: string, answer: string, wrong: string[], explanation: string): Question {
  const distractors = Array.from(new Set(wrong)).filter((w) => w !== answer).slice(0, 3);
  return { prompt, answer, options: shuffle([answer, ...distractors]), explanation };
}

const signed = (n: number) => `${n < 0 ? "−" : "+"} ${Math.abs(n)}`;
const num = (n: number) => String(+n.toFixed(2));
const factorsOf = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((f) => n % f === 0);

// ---------- Grades 1-2 ----------

function compareNumbers(max: number): Topic {
  return {
    id: "compare-numbers",
    label: "Comparing numbers",
    generate: () => {
      let a = randInt(1, max);
      let b = randInt(1, max);
      while (b === a) b = randInt(1, max);
      const greater = Math.random() < 0.5;
      const answer = greater ? Math.max(a, b) : Math.min(a, b);
      const tensA = Math.floor(a / 10);
      const tensB = Math.floor(b / 10);
      const how =
        tensA !== tensB
          ? `Compare the tens first: ${a} has ${tensA} ten${tensA === 1 ? "" : "s"} and ${b} has ${tensB} ten${tensB === 1 ? "" : "s"}.`
          : `The tens are the same, so compare the ones: ${a % 10} and ${b % 10}.`;
      return {
        prompt: `Which number is ${greater ? "greater" : "smaller"}: ${a} or ${b}?`,
        answer: String(answer),
        options: [String(a), String(b)],
        explanation: `${how} So ${answer} is the ${greater ? "greater" : "smaller"} number.`,
      };
    },
  };
}

function placeValueSmall(max: number): Topic {
  return {
    id: "place-value-small",
    label: "Tens and ones",
    generate: () => {
      let n = randInt(10, max);
      while (Math.floor(n / 10) === n % 10 || n % 10 === 0) n = randInt(10, max);
      const tens = Math.floor(n / 10);
      const ones = n % 10;
      const askTens = Math.random() < 0.5;
      const digit = askTens ? tens : ones;
      return {
        prompt: `In the number ${n}, what is the value of the digit ${digit}?`,
        answer: String(askTens ? tens * 10 : ones),
        explanation: `${n} is ${tens} ten${tens === 1 ? "" : "s"} and ${ones} one${ones === 1 ? "" : "s"}. The digit ${digit} is in the ${askTens ? `tens place, so it is worth ${tens} × 10 = ${tens * 10}` : `ones place, so it is worth ${ones}`}.`,
      };
    },
  };
}

function doubleAndHalf(max: number): Topic {
  return {
    id: "double-half",
    label: "Doubling and halving",
    generate: () => {
      if (Math.random() < 0.5) {
        const n = randInt(1, max);
        return {
          prompt: `Double ${n}.`,
          answer: String(n * 2),
          explanation: `Doubling means adding a number to itself: ${n} + ${n} = ${n * 2}.`,
        };
      }
      const half = randInt(1, max);
      return {
        prompt: `What is half of ${half * 2}?`,
        answer: String(half),
        explanation: `Half means sharing into 2 equal groups: ${half * 2} ÷ 2 = ${half}. Check: ${half} + ${half} = ${half * 2}.`,
      };
    },
  };
}

function missingNumber(max: number): Topic {
  return {
    id: "missing-number",
    label: "Missing numbers",
    generate: () => {
      const total = randInt(5, max);
      const part = randInt(1, total - 1);
      const answer = total - part;
      if (Math.random() < 0.5) {
        return {
          prompt: `${part} + ? = ${total}`,
          answer: String(answer),
          explanation: `Ask: what do I add to ${part} to make ${total}? Take ${part} away from ${total}: ${total} - ${part} = ${answer}. Check: ${part} + ${answer} = ${total}.`,
        };
      }
      return {
        prompt: `${total} − ? = ${part}`,
        answer: String(answer),
        explanation: `Ask: what is taken from ${total} to leave ${part}? ${total} - ${part} = ${answer}. Check: ${total} - ${answer} = ${part}.`,
      };
    },
  };
}

function oddOrEven(max: number): Topic {
  return {
    id: "odd-even",
    label: "Odd and even numbers",
    generate: () => {
      const n = randInt(1, max);
      const even = n % 2 === 0;
      return {
        prompt: `Is ${n} odd or even?`,
        answer: even ? "even" : "odd",
        options: ["odd", "even"],
        explanation: `Look at the last digit, ${n % 10}. Numbers ending in 0, 2, 4, 6 or 8 are even and numbers ending in 1, 3, 5, 7 or 9 are odd, so ${n} is ${even ? "even" : "odd"}.`,
      };
    },
  };
}

// ---------- Grades 3-4 ----------

function placeValueLarge(): Topic {
  const names = ["ones", "tens", "hundreds", "thousands"];
  return {
    id: "place-value-large",
    label: "Place value to thousands",
    generate: () => {
      const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      if (digits[0] === 0) [digits[0], digits[1]] = [digits[1], digits[0]];
      const n = Number(digits.join(""));
      const positions = [0, 1, 2, 3].filter((p) => digits[3 - p] !== 0);
      const p = pick(positions);
      const d = digits[3 - p];
      const value = d * 10 ** p;
      return {
        prompt: `In the number ${n}, what is the value of the digit ${d}?`,
        answer: String(value),
        explanation: `The digit ${d} is in the ${names[p]} place, so its value is ${d} × ${10 ** p} = ${value}.`,
      };
    },
  };
}

function rounding(): Topic {
  return {
    id: "rounding",
    label: "Rounding numbers",
    generate: () => {
      const place = pick([10, 100]);
      const n = randInt(11, 9999);
      const answer = Math.round(n / place) * place;
      const digit = place === 10 ? n % 10 : Math.floor((n % 100) / 10);
      return {
        prompt: `Round ${n} to the nearest ${place}.`,
        answer: String(answer),
        explanation: `Look at the digit to the right of the ${place === 10 ? "tens" : "hundreds"} place. It is ${digit}. ${digit >= 5 ? "It is 5 or more, so round up" : "It is less than 5, so round down"}, giving ${answer}.`,
      };
    },
  };
}

function equivalentFractions(): Topic {
  return {
    id: "equivalent-fractions",
    label: "Equivalent fractions",
    generate: () => {
      const b = pick([2, 3, 4, 5, 6]);
      const a = randInt(1, b - 1);
      const k = randInt(2, 5);
      return {
        prompt: `${a}/${b} = ?/${b * k}`,
        answer: String(a * k),
        explanation: `The bottom number was multiplied by ${k} (${b} × ${k} = ${b * k}), so multiply the top number by ${k} as well: ${a} × ${k} = ${a * k}. So ${a}/${b} = ${a * k}/${b * k}.`,
      };
    },
  };
}

function unitConversion(): Topic {
  const pairs: [string, string, number][] = [
    ["m", "cm", 100],
    ["cm", "mm", 10],
    ["kg", "g", 1000],
    ["L", "mL", 1000],
    ["km", "m", 1000],
  ];
  return {
    id: "unit-conversion",
    label: "Converting units",
    generate: () => {
      const [big, small, factor] = pick(pairs);
      if (Math.random() < 0.5) {
        const v = pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 0.5, 1.5, 2.5]);
        return {
          prompt: `Convert ${v} ${big} to ${small}.`,
          answer: `${v * factor} ${small}`,
          explanation: `1 ${big} = ${factor} ${small}. Going to the smaller unit, multiply: ${v} × ${factor} = ${v * factor} ${small}.`,
        };
      }
      const k = randInt(1, 15);
      return {
        prompt: `Convert ${k * factor} ${small} to ${big}.`,
        answer: `${k} ${big}`,
        explanation: `1 ${big} = ${factor} ${small}. Going to the bigger unit, divide: ${k * factor} ÷ ${factor} = ${k} ${big}.`,
      };
    },
  };
}

function elapsedTime(): Topic {
  const fmt = (total: number) => `${Math.floor(total / 60) % 12 || 12}:${String(total % 60).padStart(2, "0")}`;
  return {
    id: "elapsed-time",
    label: "Elapsed time",
    generate: () => {
      const start = randInt(1, 11) * 60 + pick([0, 15, 30, 45]);
      const d = pick([15, 30, 45, 60, 75, 90, 105, 120]);
      const hours = Math.floor(d / 60);
      const mins = d % 60;
      return {
        prompt: `A film starts at ${fmt(start)} and ends at ${fmt(start + d)}. How many minutes long is the film?`,
        answer: `${d} minutes`,
        explanation: `Count on from ${fmt(start)} to ${fmt(start + d)}: ${[hours ? `${hours} hour${hours > 1 ? "s" : ""} (${hours * 60} minutes)` : "", mins ? `${mins} minutes` : ""].filter(Boolean).join(" and ")}. In total that is ${d} minutes.`,
      };
    },
  };
}

// ---------- Grades 5-6 ----------

function hcfAndLcm(): Topic {
  const pool = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24];
  return {
    id: "hcf-lcm",
    label: "Factors and multiples (HCF and LCM)",
    generate: () => {
      const [a, b] = shuffle(pool).slice(0, 2);
      const g = gcd(a, b);
      if (Math.random() < 0.5) {
        return {
          prompt: `What is the highest common factor (HCF) of ${a} and ${b}?`,
          answer: String(g),
          explanation: `Factors of ${a}: ${factorsOf(a).join(", ")}. Factors of ${b}: ${factorsOf(b).join(", ")}. The largest number in both lists is ${g}.`,
        };
      }
      const l = (a * b) / g;
      const multiples = (n: number) => Array.from({ length: l / n }, (_, i) => n * (i + 1)).join(", ");
      return {
        prompt: `What is the lowest common multiple (LCM) of ${a} and ${b}?`,
        answer: String(l),
        explanation: `Multiples of ${a}: ${multiples(a)}. Multiples of ${b}: ${multiples(b)}. The first number in both lists is ${l}.`,
      };
    },
  };
}

function primeNumbers(): Topic {
  const isPrime = (n: number) => n > 1 && factorsOf(n).length === 2;
  return {
    id: "prime-numbers",
    label: "Prime numbers",
    generate: () => {
      const primes = Array.from({ length: 48 }, (_, i) => i + 2).filter(isPrime);
      const composites = Array.from({ length: 48 }, (_, i) => i + 2).filter((n) => !isPrime(n));
      const prime = pick(primes);
      const others = shuffle(composites).slice(0, 3);
      const smallestFactor = (n: number) => factorsOf(n)[1];
      const why = others.map((c) => `${c} = ${smallestFactor(c)} × ${c / smallestFactor(c)}`).join(", ");
      const sorted = [prime, ...others].sort((x, y) => x - y);
      return {
        prompt: `Which of these numbers is prime: ${sorted.join(", ")}?`,
        answer: String(prime),
        options: shuffle(sorted).map(String),
        explanation: `A prime number has exactly two factors: 1 and itself. ${prime} is prime. The others are not: ${why}.`,
      };
    },
  };
}

function meanMedianMode(max: number): Topic {
  return {
    id: "mean-median-mode",
    label: "Mean, median and mode",
    generate: () => {
      const kind = pick(["mean", "median", "mode"] as const);
      if (kind === "mean") {
        let values: number[];
        do {
          const mean = randInt(3, max - 3);
          values = Array.from({ length: 4 }, () => randInt(1, max));
          values.push(mean * 5 - values.reduce((s, v) => s + v, 0));
        } while (values[4] < 1 || values[4] > max);
        const sum = values.reduce((s, v) => s + v, 0);
        return {
          prompt: `Find the mean of these numbers: ${values.join(", ")}.`,
          answer: String(sum / 5),
          explanation: `Mean = total ÷ how many numbers. The total is ${values.join(" + ")} = ${sum}. There are 5 numbers, so ${sum} ÷ 5 = ${sum / 5}.`,
        };
      }
      if (kind === "median") {
        const values = Array.from({ length: 5 }, () => randInt(1, max));
        const sorted = [...values].sort((a, b) => a - b);
        return {
          prompt: `Find the median of these numbers: ${values.join(", ")}.`,
          answer: String(sorted[2]),
          explanation: `Put the numbers in order: ${sorted.join(", ")}. The median is the middle number, which is ${sorted[2]}.`,
        };
      }
      const modeValue = randInt(1, max);
      const rest = shuffle(Array.from({ length: max }, (_, i) => i + 1).filter((v) => v !== modeValue)).slice(0, 4);
      const values = shuffle([modeValue, modeValue, modeValue, ...rest]);
      return {
        prompt: `Find the mode of these numbers: ${values.join(", ")}.`,
        answer: String(modeValue),
        explanation: `The mode is the number that appears most often. ${modeValue} appears 3 times and every other number appears once, so the mode is ${modeValue}.`,
      };
    },
  };
}

function fractionOfAmount(): Topic {
  return {
    id: "fraction-of-amount",
    label: "Fractions of an amount",
    generate: () => {
      const d = pick([2, 3, 4, 5, 6, 8, 10]);
      const n = randInt(1, d - 1);
      const k = randInt(2, 12);
      const amount = d * k;
      return {
        prompt: `What is ${n}/${d} of ${amount}?`,
        answer: String(n * k),
        explanation: `Divide by the denominator: ${amount} ÷ ${d} = ${k}. Then multiply by the numerator: ${k} × ${n} = ${n * k}.`,
      };
    },
  };
}

function volumeCuboid(): Topic {
  return {
    id: "volume-cuboid",
    label: "Volume of a cuboid",
    generate: () => {
      const l = randInt(2, 12);
      const w = randInt(2, 12);
      const h = randInt(2, 12);
      return {
        prompt: `Find the volume of a cuboid that is ${l} cm long, ${w} cm wide and ${h} cm high.`,
        answer: `${l * w * h} cm³`,
        explanation: `Volume = length × width × height = ${l} × ${w} × ${h} = ${l * w} × ${h} = ${l * w * h} cm³.`,
      };
    },
  };
}

// ---------- Grades 7-8 ----------

function expandBrackets(): Topic {
  return {
    id: "expand-brackets",
    label: "Expanding brackets",
    generate: () => {
      const k = randInt(2, 9);
      const b = randInt(1, 9);
      const plus = Math.random() < 0.5;
      const sign = plus ? "+" : "−";
      const answer = `${k}x ${sign} ${k * b}`;
      return choices(
        `Expand ${k}(x ${sign} ${b}).`,
        answer,
        [`${k}x ${sign} ${b}`, `${k}x ${plus ? "−" : "+"} ${k * b}`, `x ${sign} ${k * b}`, `${k + 1}x ${sign} ${k * b}`],
        `Multiply every term inside the bracket by ${k}: ${k} × x = ${k}x and ${k} × ${b} = ${k * b}. Keep the ${sign} sign, giving ${answer}.`,
      );
    },
  };
}

function circleMeasures(): Topic {
  return {
    id: "circle-measures",
    label: "Circles: area and circumference",
    generate: () => {
      const r = randInt(2, 12);
      if (Math.random() < 0.5) {
        const area = num((314 * r * r) / 100);
        return {
          prompt: `Use π = 3.14. Find the area of a circle with radius ${r} cm.`,
          answer: `${area} cm²`,
          explanation: `Area = π × r² = 3.14 × ${r}² = 3.14 × ${r * r} = ${area} cm².`,
        };
      }
      const c = num((628 * r) / 100);
      return {
        prompt: `Use π = 3.14. Find the circumference of a circle with radius ${r} cm.`,
        answer: `${c} cm`,
        explanation: `Circumference = 2 × π × r = 2 × 3.14 × ${r} = 6.28 × ${r} = ${c} cm.`,
      };
    },
  };
}

function equationsBothSides(): Topic {
  return {
    id: "equations-both-sides",
    label: "Equations with x on both sides",
    generate: () => {
      const c = randInt(1, 5);
      const a = c + randInt(1, 5);
      const diff = a - c;
      let x = 0;
      let b = 0;
      let d = 0;
      while (x === 0 || b === 0 || d === 0) {
        x = randInt(-6, 10);
        b = randInt(-9, 9);
        d = diff * x + b;
      }
      return {
        prompt: `Solve for x: ${a}x ${signed(b)} = ${c}x ${signed(d)}`,
        answer: String(x),
        explanation: `Subtract ${c}x from both sides: ${diff === 1 ? "" : diff}x ${signed(b)} = ${d}. Then ${b > 0 ? `subtract ${b}` : `add ${-b}`} on both sides: ${diff === 1 ? "" : diff}x = ${d - b}.${diff === 1 ? "" : ` Divide by ${diff}: x = ${d - b} ÷ ${diff} = ${x}.`} So x = ${x}.`,
      };
    },
  };
}

function substitution(): Topic {
  return {
    id: "substitution",
    label: "Substituting into expressions",
    generate: () => {
      const a = randInt(1, 4);
      const b = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      const c = pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]);
      const x = pick([-3, -2, -1, 1, 2, 3, 4, 5]);
      const value = a * x * x + b * x + c;
      const xs = x < 0 ? `(${x})` : String(x);
      const bTerm = `${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x`;
      return {
        prompt: `Evaluate ${a === 1 ? "" : a}x² ${bTerm} ${signed(c)} when x = ${x}.`,
        answer: String(value),
        explanation: `Replace x with ${xs}: ${a === 1 ? "" : `${a} × `}${xs}² ${b < 0 ? "-" : "+"} ${Math.abs(b)} × ${xs} ${c < 0 ? "-" : "+"} ${Math.abs(c)}. Square first: ${xs}² = ${x * x}. So ${a * x * x} ${b * x < 0 ? "-" : "+"} ${Math.abs(b * x)} ${c < 0 ? "-" : "+"} ${Math.abs(c)} = ${value}.`,
      };
    },
  };
}

function simpleInterest(): Topic {
  return {
    id: "simple-interest",
    label: "Simple interest",
    generate: () => {
      const p = pick([500, 800, 1000, 1500, 2000, 2500, 4000]);
      const r = randInt(2, 8);
      const t = randInt(1, 5);
      const interest = (p * r * t) / 100;
      return {
        prompt: `Find the simple interest on $${p} invested at ${r}% per year for ${t} year${t > 1 ? "s" : ""}.`,
        answer: `$${interest}`,
        explanation: `Simple interest = P × R × T ÷ 100 = ${p} × ${r} × ${t} ÷ 100 = ${p * r * t} ÷ 100 = $${interest}.`,
      };
    },
  };
}

function polygonAngles(): Topic {
  const polygons: [string, number][] = [
    ["pentagon", 5],
    ["hexagon", 6],
    ["octagon", 8],
    ["nonagon", 9],
    ["decagon", 10],
    ["dodecagon", 12],
  ];
  return {
    id: "polygon-angles",
    label: "Angles in polygons",
    generate: () => {
      const [name, n] = pick(polygons);
      const sum = (n - 2) * 180;
      if (Math.random() < 0.5) {
        return {
          prompt: `What is the sum of the interior angles of a ${name}?`,
          answer: `${sum}°`,
          explanation: `A ${name} has ${n} sides and can be split into ${n} - 2 = ${n - 2} triangles. Each triangle has angles adding to 180°, so ${n - 2} × 180° = ${sum}°.`,
        };
      }
      return {
        prompt: `What is the size of each interior angle of a regular ${name}?`,
        answer: `${sum / n}°`,
        explanation: `The angles of a ${name} add up to (${n} - 2) × 180° = ${sum}°. A regular ${name} has ${n} equal angles, so each is ${sum}° ÷ ${n} = ${sum / n}°.`,
      };
    },
  };
}

// ---------- Grades 9-10 ----------

function expandDoubleBrackets(): Topic {
  const term = (n: number) => `${n < 0 ? "−" : "+"} ${Math.abs(n)}`;
  const quad = (b: number, c: number) => `x² ${b === 0 ? "" : `${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x `}${term(c)}`.replace("  ", " ");
  return {
    id: "expand-double-brackets",
    label: "Expanding double brackets",
    generate: () => {
      let a = randInt(-8, 8);
      let b = randInt(-8, 8);
      while (a === 0 || b === 0 || a + b === 0) {
        a = randInt(-8, 8);
        b = randInt(-8, 8);
      }
      const s = a + b;
      const p = a * b;
      const answer = quad(s, p);
      return choices(
        `Expand and simplify (x ${term(a)})(x ${term(b)}).`,
        answer,
        [quad(-s, p), quad(s, -p), quad(a - b, p), quad(s, a + b)],
        `Multiply each term in the first bracket by each term in the second: x × x = x², x × ${b} = ${b}x, ${a} × x = ${a}x and ${a} × ${b} = ${p}. Combine the x terms: ${a}x + ${b}x = ${s}x. The result is ${answer}.`,
      );
    },
  };
}

function cylinderVolume(): Topic {
  return {
    id: "cylinder-volume",
    label: "Volume of a cylinder",
    generate: () => {
      const r = randInt(2, 10);
      const h = randInt(2, 15);
      const v = num((314 * r * r * h) / 100);
      return {
        prompt: `Use π = 3.14. Find the volume of a cylinder with radius ${r} cm and height ${h} cm.`,
        answer: `${v} cm³`,
        explanation: `Volume = π × r² × h = 3.14 × ${r}² × ${h} = 3.14 × ${r * r} × ${h} = ${v} cm³.`,
      };
    },
  };
}

function reversePercentage(): Topic {
  return {
    id: "reverse-percentage",
    label: "Reverse percentages",
    generate: () => {
      const p = pick([10, 20, 25, 40]);
      const original = 20 * randInt(2, 40);
      const sale = (original * (100 - p)) / 100;
      return {
        prompt: `After a ${p}% discount, a jacket costs $${sale}. What was the original price?`,
        answer: `$${original}`,
        explanation: `The sale price is ${100 - p}% of the original, which is ${(100 - p) / 100} × original. So original = ${sale} ÷ ${(100 - p) / 100} = $${original}.`,
      };
    },
  };
}

function independentProbability(): Topic {
  return {
    id: "independent-probability",
    label: "Probability of two events",
    generate: () => {
      const red = randInt(1, 6);
      const blue = randInt(1, 6);
      const n = red + blue;
      const kind = pick(["rr", "bb", "rb"] as const);
      const [first, second, top] =
        kind === "rr" ? ["red", "red", red * red] : kind === "bb" ? ["blue", "blue", blue * blue] : ["red", "blue", red * blue];
      const fa = kind === "bb" ? blue : red;
      const fb = kind === "rr" ? red : blue;
      return {
        prompt: `A bag has ${red} red and ${blue} blue marbles. A marble is picked, replaced, and then another is picked. What is the probability of picking ${first} then ${second}? (as a simplified fraction)`,
        answer: simplifyFraction(top, n * n),
        explanation: `The marble is replaced, so the two picks are independent and the probabilities multiply. P(${first}) = ${fa}/${n} and P(${second}) = ${fb}/${n}. So ${fa}/${n} × ${fb}/${n} = ${top}/${n * n}${simplifyFraction(top, n * n) !== `${top}/${n * n}` ? `, which simplifies to ${simplifyFraction(top, n * n)}` : ""}.`,
      };
    },
  };
}

// ---------- Grades 11-12 ----------

function combinations(): Topic {
  return {
    id: "combinations",
    label: "Permutations and combinations",
    generate: () => {
      const n = randInt(5, 10);
      const r = randInt(2, 4);
      const perm = Array.from({ length: r }, (_, i) => n - i).reduce((p, v) => p * v, 1);
      const fact = Array.from({ length: r }, (_, i) => i + 1).reduce((p, v) => p * v, 1);
      const working = Array.from({ length: r }, (_, i) => n - i).join(" × ");
      if (Math.random() < 0.5) {
        return {
          prompt: `In how many ways can ${r} people be chosen from a group of ${n}, if the order of choosing does not matter?`,
          answer: String(perm / fact),
          explanation: `This is ${n}C${r}. Count ordered selections first: ${working} = ${perm}. Each group of ${r} can be ordered in ${r}! = ${fact} ways, so divide: ${perm} ÷ ${fact} = ${perm / fact}.`,
        };
      }
      return {
        prompt: `In how many ways can ${r} different prizes be given to ${r} different people chosen from a group of ${n}? (Each person gets one prize.)`,
        answer: String(perm),
        explanation: `The order matters because the prizes are different. The first prize has ${n} choices, the next ${n - 1}, and so on: ${working} = ${perm}. This is ${n}P${r}.`,
      };
    },
  };
}

function arithmeticSeriesSum(): Topic {
  return {
    id: "arithmetic-series-sum",
    label: "Sum of an arithmetic series",
    generate: () => {
      const a = randInt(1, 12);
      const d = randInt(1, 6);
      const n = randInt(6, 20);
      const last = a + (n - 1) * d;
      const sum = (n * (2 * a + (n - 1) * d)) / 2;
      return {
        prompt: `Find the sum of the first ${n} terms of the arithmetic series ${a} + ${a + d} + ${a + 2 * d} + ...`,
        answer: String(sum),
        explanation: `Here a = ${a} and d = ${d}. The formula is Sn = n/2 × (2a + (n − 1)d) = ${n}/2 × (${2 * a} + ${n - 1} × ${d}) = ${n}/2 × ${2 * a + (n - 1) * d} = ${sum}. (Check with first + last: ${n}/2 × (${a} + ${last}) = ${sum}.)`,
      };
    },
  };
}

function stationaryPoint(): Topic {
  return {
    id: "stationary-point",
    label: "Stationary points",
    generate: () => {
      const a = randInt(1, 3);
      const p = pick([-4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
      const b = -2 * a * p;
      const c = pick([-9, -7, -5, -3, -1, 1, 3, 5, 7, 9]);
      const bTerm = `${b < 0 ? "−" : "+"} ${Math.abs(b)}x`;
      return {
        prompt: `Find the x-coordinate of the stationary point of f(x) = ${a === 1 ? "" : a}x² ${bTerm} ${signed(c)}.`,
        answer: String(p),
        explanation: `At a stationary point the gradient is zero, so f′(x) = 0. f′(x) = ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)}. Set ${2 * a}x ${b < 0 ? "-" : "+"} ${Math.abs(b)} = 0, so ${2 * a}x = ${-b} and x = ${-b} ÷ ${2 * a} = ${p}.`,
      };
    },
  };
}

function vectorMagnitude(): Topic {
  const triples: [number, number, number][] = [
    [3, 4, 5],
    [5, 12, 13],
    [8, 15, 17],
    [6, 8, 10],
    [9, 12, 15],
    [7, 24, 25],
    [12, 16, 20],
    [20, 21, 29],
  ];
  return {
    id: "vector-magnitude",
    label: "Magnitude of a vector",
    generate: () => {
      const [x, y, m] = pick(triples);
      const a = x * pick([1, -1]);
      const b = y * pick([1, -1]);
      const [p, q] = Math.random() < 0.5 ? [a, b] : [b, a];
      return {
        prompt: `Find the magnitude of the vector ${p}i ${signed(q)}j.`,
        answer: String(m),
        explanation: `The magnitude is √(p² + q²) = √(${p}² + ${q}²) = √(${p * p} + ${q * q}) = √${p * p + q * q} = ${m}. The signs disappear because squaring makes every number positive.`,
      };
    },
  };
}

/** Extra Maths topics that widen each grade band beyond the original core set. */
export function moreMathsTopics(grade: number): Topic[] {
  if (grade <= 2) {
    const max = grade === 1 ? 20 : 99;
    return [compareNumbers(max), placeValueSmall(max), doubleAndHalf(grade === 1 ? 10 : 25), missingNumber(grade === 1 ? 20 : 50), oddOrEven(max)];
  }
  if (grade <= 4) return [placeValueLarge(), rounding(), equivalentFractions(), unitConversion(), elapsedTime()];
  if (grade <= 6) return [hcfAndLcm(), primeNumbers(), meanMedianMode(20), fractionOfAmount(), volumeCuboid()];
  if (grade <= 8) {
    return [expandBrackets(), circleMeasures(), equationsBothSides(), substitution(), simpleInterest(), polygonAngles(), meanMedianMode(30)];
  }
  if (grade <= 10) return [expandDoubleBrackets(), cylinderVolume(), reversePercentage(), independentProbability()];
  return [combinations(), arithmeticSeriesSum(), stationaryPoint(), vectorMagnitude()];
}
