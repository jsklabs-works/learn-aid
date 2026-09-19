import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { GRADES, getTopics } from "./curriculum";
import { generateWorksheetPdf } from "./pdf";
import type { Question, Subject } from "./types";

const OPTION_LETTERS = ["A", "B", "C", "D"];
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 40;

function App() {
  const [subject, setSubject] = useState<Subject>("maths");
  const [grade, setGrade] = useState(3);
  const [count, setCount] = useState(10);
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);

  const topics = useMemo(() => getTopics(subject, grade), [subject, grade]);

  // Whenever the subject/grade changes, select all of that grade's topics by default.
  useEffect(() => {
    setSelectedTopicIds(new Set(topics.map((t) => t.id)));
    setQuestions(null);
  }, [topics]);

  const activeTopics = topics.filter((t) => selectedTopicIds.has(t.id));

  function toggleTopic(id: string) {
    setSelectedTopicIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleGenerate() {
    const pool = activeTopics.length > 0 ? activeTopics : topics;
    const generated: Question[] = Array.from({ length: count }, () => {
      const topic = pool[Math.floor(Math.random() * pool.length)];
      return topic.generate();
    });
    setQuestions(generated);
    setShowAnswers(false);
  }

  function handleDownload() {
    if (!questions) return;
    generateWorksheetPdf({
      subject,
      grade,
      topicLabels: (activeTopics.length > 0 ? activeTopics : topics).map((t) => t.label),
      questions,
    });
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Worksheet Generator</h1>
        <p className="subtitle">
          Random practice worksheets for Grades 1–12, aligned to the Victorian Curriculum — for students, parents and
          teachers.
        </p>
      </header>

      <main className="layout">
        <section className="panel" aria-label="Worksheet settings">
          <div className="field-row">
            <label className="field">
              <span>Subject</span>
              <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
                <option value="maths">Maths</option>
                <option value="english">English</option>
              </select>
            </label>

            <label className="field">
              <span>Grade</span>
              <select value={grade} onChange={(e) => setGrade(Number(e.target.value))}>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Number of questions</span>
              <input
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={count}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setCount(Number.isNaN(v) ? MIN_QUESTIONS : Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, v)));
                }}
              />
            </label>
          </div>

          <fieldset className="topics">
            <legend>Topics</legend>
            <div className="topic-grid">
              {topics.map((topic) => (
                <label key={topic.id} className="topic-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTopicIds.has(topic.id)}
                    onChange={() => toggleTopic(topic.id)}
                  />
                  <span>{topic.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="primary-button" onClick={handleGenerate}>
            Generate worksheet
          </button>
        </section>

        <section className="preview" aria-label="Worksheet preview">
          {!questions && (
            <div className="empty-state">
              <p>Choose a subject, grade and topics, then generate a worksheet to see a preview here.</p>
            </div>
          )}

          {questions && (
            <>
              <div className="preview-toolbar">
                <h2>
                  Grade {grade} {subject === "maths" ? "Maths" : "English"} Worksheet
                </h2>
                <div className="preview-actions">
                  <button onClick={() => setShowAnswers((s) => !s)}>
                    {showAnswers ? "Hide answers" : "Show answers"}
                  </button>
                  <button onClick={handleGenerate}>Regenerate</button>
                  <button className="primary-button" onClick={handleDownload}>
                    Download PDF (with answer key)
                  </button>
                </div>
              </div>

              <ol className="question-list">
                {questions.map((q, i) => (
                  <li key={i} className="question">
                    <div className="question-prompt">{q.prompt}</div>
                    {q.options && (
                      <div className="question-options">
                        {q.options.map((opt, oi) => (
                          <span key={oi} className="option">
                            {OPTION_LETTERS[oi]}) {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    {showAnswers && <div className="question-answer">Answer: {q.answer}</div>}
                  </li>
                ))}
              </ol>
            </>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <p>Runs entirely in your browser — no data leaves your device.</p>
      </footer>
    </div>
  );
}

export default App;
