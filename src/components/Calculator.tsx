import { useMemo, useRef, useState } from "react";
import { evaluate, formatNumber } from "../calc";

interface CalculatorProps {
  onClose: () => void;
}

interface Key {
  label: string;
  insert?: string;
  aria?: string;
  kind?: "fn" | "op" | "eq" | "num";
}

const OPERATOR_INSERTS = new Set(["+", "−", "×", "÷", "^", "^2", "!", "%", "^(-1)"]);

const KEYS: Key[][] = [
  [
    { label: "(", insert: "(", kind: "fn" },
    { label: ")", insert: ")", kind: "fn" },
    { label: "π", insert: "π", kind: "fn", aria: "pi" },
    { label: "e", insert: "e", kind: "fn", aria: "Euler's number" },
    { label: "EXP", insert: "E", kind: "fn", aria: "times ten to the power" },
  ],
  [
    { label: "sin", insert: "sin(", kind: "fn" },
    { label: "cos", insert: "cos(", kind: "fn" },
    { label: "tan", insert: "tan(", kind: "fn" },
    { label: "ln", insert: "ln(", kind: "fn" },
    { label: "log", insert: "log(", kind: "fn", aria: "log base 10" },
  ],
  [
    { label: "sin⁻¹", insert: "asin(", kind: "fn", aria: "inverse sine" },
    { label: "cos⁻¹", insert: "acos(", kind: "fn", aria: "inverse cosine" },
    { label: "tan⁻¹", insert: "atan(", kind: "fn", aria: "inverse tangent" },
    { label: "√", insert: "sqrt(", kind: "fn", aria: "square root" },
    { label: "|x|", insert: "abs(", kind: "fn", aria: "absolute value" },
  ],
  [
    { label: "x²", insert: "^2", kind: "fn", aria: "squared" },
    { label: "xʸ", insert: "^", kind: "fn", aria: "to the power of" },
    { label: "1/x", insert: "^(-1)", kind: "fn", aria: "reciprocal" },
    { label: "n!", insert: "!", kind: "fn", aria: "factorial" },
    { label: "%", insert: "%", kind: "fn", aria: "percent" },
  ],
  [
    { label: "7", insert: "7", kind: "num" },
    { label: "8", insert: "8", kind: "num" },
    { label: "9", insert: "9", kind: "num" },
    { label: "÷", insert: "÷", kind: "op", aria: "divide" },
    { label: "Ans", insert: "ans", kind: "fn", aria: "previous answer" },
  ],
  [
    { label: "4", insert: "4", kind: "num" },
    { label: "5", insert: "5", kind: "num" },
    { label: "6", insert: "6", kind: "num" },
    { label: "×", insert: "×", kind: "op", aria: "multiply" },
    { label: "⌫", aria: "Backspace", kind: "fn" },
  ],
  [
    { label: "1", insert: "1", kind: "num" },
    { label: "2", insert: "2", kind: "num" },
    { label: "3", insert: "3", kind: "num" },
    { label: "−", insert: "−", kind: "op", aria: "minus" },
    { label: "C", aria: "Clear", kind: "fn" },
  ],
  [
    { label: "0", insert: "0", kind: "num" },
    { label: ".", insert: ".", kind: "num", aria: "decimal point" },
    { label: "±", insert: "−", kind: "num", aria: "negative sign" },
    { label: "+", insert: "+", kind: "op", aria: "plus" },
    { label: "=", aria: "Equals", kind: "eq" },
  ],
];

export function Calculator({ onClose }: CalculatorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [expression, setExpression] = useState("");
  const [degrees, setDegrees] = useState(true);
  const [ans, setAns] = useState(0);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const result = useMemo(() => evaluate(expression, { degrees, ans }), [expression, degrees, ans]);
  const preview = result.ok ? formatNumber(result.value) : "";

  function setWithCaret(next: string, caret: number) {
    setExpression(next);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(caret, caret);
    });
  }

  function insert(text: string) {
    const input = inputRef.current;
    if (justEvaluated) {
      setJustEvaluated(false);
      const start = OPERATOR_INSERTS.has(text) ? `ans${text}` : text;
      setWithCaret(start, start.length);
      return;
    }
    const from = input?.selectionStart ?? expression.length;
    const to = input?.selectionEnd ?? expression.length;
    setWithCaret(expression.slice(0, from) + text + expression.slice(to), from + text.length);
  }

  function backspace() {
    setJustEvaluated(false);
    const input = inputRef.current;
    const from = input?.selectionStart ?? expression.length;
    const to = input?.selectionEnd ?? expression.length;
    if (from !== to) return setWithCaret(expression.slice(0, from) + expression.slice(to), from);
    if (from === 0) return;
    setWithCaret(expression.slice(0, from - 1) + expression.slice(to), from - 1);
  }

  function equals() {
    if (result.ok) {
      setAns(result.value);
      setJustEvaluated(true);
    }
  }

  function press(key: Key) {
    if (key.label === "⌫") backspace();
    else if (key.label === "C") {
      setExpression("");
      setJustEvaluated(false);
    } else if (key.label === "=") equals();
    else if (key.insert) insert(key.insert);
  }

  return (
    <div className="calc" role="dialog" aria-label="Calculator">
      <div className="calc-header">
        <strong>Calculator</strong>
        <div className="calc-header-actions">
          <button
            className="calc-mode"
            onClick={() => setDegrees((d) => !d)}
            aria-label={`Angle mode: ${degrees ? "degrees" : "radians"}. Click to switch.`}
          >
            {degrees ? "DEG" : "RAD"}
          </button>
          <button className="calc-close" onClick={onClose} aria-label="Close calculator">
            ✕
          </button>
        </div>
      </div>

      <div className="calc-display">
        <input
          ref={inputRef}
          className="calc-input"
          value={expression}
          inputMode="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="Type or tap, e.g. 2(3+4)^2"
          aria-label="Expression"
          onChange={(e) => {
            setJustEvaluated(false);
            setExpression(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              equals();
            } else if (e.key === "Escape") onClose();
          }}
        />
        <div className={result.ok ? "calc-result" : "calc-result calc-error"} aria-live="polite">
          {result.ok ? `= ${preview}` : expression.trim() ? result.error : " "}
        </div>
      </div>

      <div className="calc-keys">
        {KEYS.flat().map((key) => (
          <button
            key={key.label}
            className={`calc-key ${key.kind ?? "num"}`}
            aria-label={key.aria ?? key.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => press(key)}
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
}
