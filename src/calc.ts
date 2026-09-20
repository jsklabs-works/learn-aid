/** A small, safe expression evaluator for the on-screen calculator (no eval). */

export type CalcResult = { ok: true; value: number } | { ok: false; error: string };

type Token =
  | { kind: "num"; value: number }
  | { kind: "id"; name: string }
  | { kind: "op"; op: "+" | "-" | "*" | "/" | "^" | "!" | "%" | "(" | ")" };

const FUNCTIONS = ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "ln", "log", "abs"];
const CONSTANTS = ["pi", "e", "ans"];
const NUMBER = /^(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?/;

class CalcError extends Error {}

function tokenize(input: string): Token[] {
  const text = input
    .replace(/−|–/g, "-")
    .replace(/×|·/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, " pi ")
    .replace(/√/g, " sqrt ");
  const tokens: Token[] = [];
  let i = 0;
  while (i < text.length) {
    const rest = text.slice(i);
    if (/^\s/.test(rest)) {
      i++;
      continue;
    }
    const num = rest.match(NUMBER);
    if (num) {
      tokens.push({ kind: "num", value: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    const word = rest.match(/^[a-zA-Z]+/);
    if (word) {
      const name = word[0].toLowerCase();
      if (!FUNCTIONS.includes(name) && !CONSTANTS.includes(name)) throw new CalcError(`Unknown "${word[0]}"`);
      tokens.push({ kind: "id", name });
      i += word[0].length;
      continue;
    }
    if ("+-*/^!%()".includes(rest[0])) {
      tokens.push({ kind: "op", op: rest[0] as "+" });
      i++;
      continue;
    }
    throw new CalcError(`Unexpected "${rest[0]}"`);
  }
  return tokens;
}

function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0 || n > 170) throw new CalcError("Factorial needs a whole number from 0 to 170");
  let result = 1;
  for (let k = 2; k <= n; k++) result *= k;
  return result;
}

/** Trig results that are only floating-point noise around zero are reported as exactly zero. */
const tidyTrig = (x: number) => (Math.abs(x) < 1e-14 ? 0 : x);

export function evaluate(input: string, options: { degrees: boolean; ans: number }): CalcResult {
  try {
    if (!input.trim()) return { ok: false, error: "" };
    const tokens = tokenize(input);
    let pos = 0;
    const toRad = (x: number) => (options.degrees ? (x * Math.PI) / 180 : x);
    const fromRad = (x: number) => (options.degrees ? (x * 180) / Math.PI : x);

    const peek = () => tokens[pos];
    const isOp = (t: Token | undefined, op: string) => t?.kind === "op" && t.op === op;

    function callFunction(name: string, x: number): number {
      switch (name) {
        case "sin":
          return tidyTrig(Math.sin(toRad(x)));
        case "cos":
          return tidyTrig(Math.cos(toRad(x)));
        case "tan": {
          if (Math.abs(Math.cos(toRad(x))) < 1e-14) throw new CalcError("tan is undefined here");
          return tidyTrig(Math.tan(toRad(x)));
        }
        case "asin":
          if (x < -1 || x > 1) throw new CalcError("asin needs a value from -1 to 1");
          return fromRad(Math.asin(x));
        case "acos":
          if (x < -1 || x > 1) throw new CalcError("acos needs a value from -1 to 1");
          return fromRad(Math.acos(x));
        case "atan":
          return fromRad(Math.atan(x));
        case "sqrt":
          if (x < 0) throw new CalcError("Square root of a negative number");
          return Math.sqrt(x);
        case "ln":
          if (x <= 0) throw new CalcError("ln needs a positive number");
          return Math.log(x);
        case "log":
          if (x <= 0) throw new CalcError("log needs a positive number");
          return Math.log10(x);
        default:
          return Math.abs(x);
      }
    }

    function primary(): number {
      const t = tokens[pos++];
      if (!t) throw new CalcError("Unfinished expression");
      if (t.kind === "num") return t.value;
      if (t.kind === "id") {
        if (t.name === "pi") return Math.PI;
        if (t.name === "e") return Math.E;
        if (t.name === "ans") return options.ans;
        const following = peek();
        if (following?.kind === "num") {
          pos++;
          return callFunction(t.name, following.value);
        }
        if (!isOp(following, "(")) throw new CalcError(`${t.name} needs brackets, like ${t.name}(30)`);
        pos++;
        const arg = expression();
        if (!isOp(tokens[pos++], ")")) throw new CalcError("Missing )");
        return callFunction(t.name, arg);
      }
      if (t.op === "(") {
        const value = expression();
        if (!isOp(tokens[pos++], ")")) throw new CalcError("Missing )");
        return value;
      }
      throw new CalcError(`Unexpected ${t.op}`);
    }

    function postfix(): number {
      let value = primary();
      for (;;) {
        if (isOp(peek(), "!")) {
          pos++;
          value = factorial(value);
        } else if (isOp(peek(), "%")) {
          pos++;
          value /= 100;
        } else return value;
      }
    }

    function power(): number {
      const base = postfix();
      if (isOp(peek(), "^")) {
        pos++;
        return Math.pow(base, unary());
      }
      return base;
    }

    function unary(): number {
      if (isOp(peek(), "-")) {
        pos++;
        return -unary();
      }
      if (isOp(peek(), "+")) {
        pos++;
        return unary();
      }
      return power();
    }

    function term(): number {
      let value = unary();
      for (;;) {
        const next = peek();
        if (isOp(next, "*")) {
          pos++;
          value *= unary();
        } else if (isOp(next, "/")) {
          pos++;
          const divisor = unary();
          if (divisor === 0) throw new CalcError("Cannot divide by zero");
          value /= divisor;
        } else if (next && (isOp(next, "(") || next.kind === "id")) {
          value *= unary();
        } else return value;
      }
    }

    function expression(): number {
      let value = term();
      for (;;) {
        if (isOp(peek(), "+")) {
          pos++;
          value += term();
        } else if (isOp(peek(), "-")) {
          pos++;
          value -= term();
        } else return value;
      }
    }

    const value = expression();
    if (pos < tokens.length) {
      const extra = tokens[pos];
      throw new CalcError(extra.kind === "op" && extra.op === ")" ? "Extra )" : "Unexpected input");
    }
    if (!Number.isFinite(value)) return { ok: false, error: "Result is too large" };
    return { ok: true, value };
  } catch (e) {
    return { ok: false, error: e instanceof CalcError ? e.message : "Check the expression" };
  }
}

/** Formats to 12 significant digits, using scientific notation for very large or small values. */
export function formatNumber(x: number): string {
  const r = Number(x.toPrecision(12));
  if (r !== 0 && (Math.abs(r) >= 1e12 || Math.abs(r) < 1e-6)) {
    return r.toExponential().replace("e+", "E").replace("e", "E");
  }
  return String(r);
}
