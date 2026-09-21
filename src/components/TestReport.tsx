import { useRef, useState } from "react";
import { WEAK_THRESHOLD } from "../history";

export interface TopicResult {
  id: string;
  label: string;
  correct: number;
  total: number;
}

interface TestReportProps {
  name: string;
  onNameChange: (name: string) => void;
  code: string;
  topics: TopicResult[];
  onPractice: (topicIds: string[]) => void;
}

export function TestReport({ name, onNameChange, code, topics, onPractice }: TestReportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");

  const sorted = [...topics].sort((a, b) => a.correct / a.total - b.correct / b.total);
  const weak = sorted.filter((t) => t.correct / t.total < WEAK_THRESHOLD);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      inputRef.current?.select();
      setStatus("manual");
    }
  }

  return (
    <section className="test-report" aria-label="Your result">
      <h3>Topics to practise</h3>
      <div className="topic-bars">
        {sorted.map((t) => {
          const pct = Math.round((t.correct / t.total) * 100);
          const level = t.correct / t.total < WEAK_THRESHOLD ? "weak" : "strong";
          return (
            <div key={t.id} className="topic-bar-row">
              <span className="topic-bar-label">{t.label}</span>
              <div className="topic-bar" aria-hidden="true">
                <i className={level} style={{ width: `${pct}%` }} />
              </div>
              <span className="topic-bar-score">
                {t.correct} of {t.total}
              </span>
            </div>
          );
        })}
      </div>
      {weak.length > 0 ? (
        <button className="primary-button" onClick={() => onPractice(weak.map((t) => t.id))}>
          Practise {weak.length === 1 ? "this topic" : `these ${weak.length} topics`}
        </button>
      ) : (
        <p className="share-note">No weak topics in this test. Nice work.</p>
      )}

      <h3 className="report-heading">Send your result</h3>
      <label className="field">
        <span>Your name (optional)</span>
        <input
          type="text"
          maxLength={40}
          value={name}
          placeholder="Only what your teacher asks for"
          onChange={(e) => onNameChange(e.target.value)}
        />
      </label>
      <div className="share-link-row">
        <input ref={inputRef} className="share-link-input" readOnly value={code} aria-label="Result code" onFocus={(e) => e.currentTarget.select()} />
        <button onClick={copy}>{status === "copied" ? "Copied" : "Copy code"}</button>
      </div>
      {status === "manual" && <p className="share-note">Press Ctrl+C (or Cmd+C) to copy the code.</p>}
      <p className="share-note">
        Send this code to your teacher or parent. It holds your score and weak topics, and anyone can edit a code, so
        it suits practice rather than graded work.
      </p>
    </section>
  );
}
