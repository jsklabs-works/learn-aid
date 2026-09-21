import { useMemo, useState } from "react";
import { getSubject } from "../curriculum";
import { SHARE_VERSION, decodeWorksheetKey, generateFor, type ShareSpec } from "../share";

interface CheckWorksheetProps {
  onMark: (spec: ShareSpec) => void;
  onBack: () => void;
}

export function CheckWorksheet({ onMark, onBack }: CheckWorksheetProps) {
  const [text, setText] = useState("");
  const [spec, setSpec] = useState<ShareSpec | null>(null);
  const [error, setError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const questions = useMemo(() => (spec && showAnswers ? generateFor(spec) : []), [spec, showAnswers]);

  function check() {
    const result = decodeWorksheetKey(text);
    setShowAnswers(false);
    if (result.ok) {
      setSpec(result.spec);
      setError("");
    } else {
      setSpec(null);
      setError(result.error);
    }
  }

  return (
    <section className="preview" aria-label="Check a worksheet">
      <div className="preview-toolbar">
        <h2>Check a worksheet</h2>
        <div className="preview-actions">
          <button className="primary-button" onClick={onBack}>
            Back to practice
          </button>
        </div>
      </div>

      <label className="field">
        <span>Worksheet key (printed at the bottom of the PDF)</span>
        <div className="share-link-row">
          <input
            className="share-link-input"
            value={text}
            placeholder="lw2.maths.5.v.s.10.…"
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          <button onClick={check}>Check key</button>
        </div>
      </label>
      {error && (
        <p className="dialog-error" role="alert">
          {error}
        </p>
      )}
      {!spec && !error && (
        <p className="share-note">
          Download the questions-only PDF, and the key is printed on every page. Enter it here to see the answers, or
          to type in your answers and get them marked.
        </p>
      )}

      {spec && (
        <div className="results-group">
          <h3>
            Grade {spec.grade} {getSubject(spec.subject).label} ·{" "}
            {spec.difficulty === "standard" ? "Standard" : "Advanced"} · {spec.count} questions
          </h3>
          {spec.version !== SHARE_VERSION && (
            <p className="notice">
              This worksheet was made with a different version of Learn Aid, so the questions may not match the printed
              ones.
            </p>
          )}
          <div className="preview-actions">
            <button className="primary-button" onClick={() => onMark(spec)}>
              Mark my answers online
            </button>
            <button onClick={() => setShowAnswers((s) => !s)}>{showAnswers ? "Hide the answer key" : "Show the answer key"}</button>
          </div>

          {showAnswers && (
            <ol className="question-list" style={{ marginTop: 16 }}>
              {questions.map((q, i) => (
                <li key={i} className="question">
                  <div className="question-prompt">{q.prompt}</div>
                  {q.options && (
                    <div className="question-options">
                      {q.options.map((opt, oi) => (
                        <span key={oi} className="option">
                          {"ABCD"[oi]}) {opt}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="question-answer">Answer: {q.answer}</div>
                  {q.explanation && (
                    <div className="question-explanation">
                      <strong>{spec.subject === "general" ? "Did you know?" : "How to get it"}</strong>
                      {q.explanation}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
