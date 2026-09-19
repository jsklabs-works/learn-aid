import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { FigureSvg } from "./components/FigureSvg";
import { GRADES, SUBJECTS, getSubject, getTopics } from "./curriculum";
import { isCorrectAnswer } from "./grading";
import { generateWorksheetPdf } from "./pdf";
import type { Difficulty, Question, Subject, Syllabus } from "./types";
import { useTheme, type Theme } from "./useTheme";

const OPTION_LETTERS = ["A", "B", "C", "D"];
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 50;

type Mode = "worksheet" | "test";

function App() {
  const [theme, setTheme] = useTheme();
  const [subject, setSubject] = useState<Subject>("maths");
  const [grade, setGrade] = useState(3);
  const [syllabus, setSyllabus] = useState<Syllabus>("vic");
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [mode, setMode] = useState<Mode>("worksheet");
  const [count, setCount] = useState(10);
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(new Set());
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [testAnswers, setTestAnswers] = useState<string[]>([]);
  const [testSubmitted, setTestSubmitted] = useState(false);

  const subjectLabel = getSubject(subject).label;

  const topics = useMemo(
    () => getTopics(subject, grade, syllabus, difficulty),
    [subject, grade, syllabus, difficulty],
  );

  function handleSubjectChange(next: Subject) {
    setSubject(next);
    const { minGrade } = getSubject(next);
    if (grade < minGrade) setGrade(minGrade);
  }

  // Whenever the subject/grade/syllabus/difficulty changes, select all of that set's topics by default.
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
    setTestAnswers(new Array(generated.length).fill(""));
    setTestSubmitted(false);
  }

  function handleDownload() {
    if (!questions) return;
    generateWorksheetPdf({
      subject,
      subjectLabel,
      grade,
      topicLabels: (activeTopics.length > 0 ? activeTopics : topics).map((t) => t.label),
      questions,
    });
  }

  const score = useMemo(() => {
    if (!questions || !testSubmitted) return null;
    const correct = questions.filter((q, i) => isCorrectAnswer(testAnswers[i] ?? "", q.answer)).length;
    return { correct, total: questions.length };
  }, [questions, testAnswers, testSubmitted]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-top">
          <h1>Worksheet Generator</h1>
          <div className="theme-toggle" role="radiogroup" aria-label="Theme">
            {(["light", "system", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={theme === t}
                className={theme === t ? "theme-option active" : "theme-option"}
                onClick={() => setTheme(t)}
              >
                {t === "light" ? "Light" : t === "dark" ? "Dark" : "Auto"}
              </button>
            ))}
          </div>
        </div>
        <p className="subtitle">
          Random practice worksheets and online tests for Grades 1–12 — for students, parents and teachers.
        </p>
      </header>

      <main className="layout">
        <section className="panel" aria-label="Settings">
          <div className="mode-toggle" role="tablist" aria-label="Mode">
            <button
              role="tab"
              aria-selected={mode === "worksheet"}
              className={mode === "worksheet" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("worksheet")}
            >
              Worksheet (PDF)
            </button>
            <button
              role="tab"
              aria-selected={mode === "test"}
              className={mode === "test" ? "mode-tab active" : "mode-tab"}
              onClick={() => setMode("test")}
            >
              Online test
            </button>
          </div>

          <div className="field-row">
            <label className="field">
              <span>Syllabus</span>
              <select value={syllabus} onChange={(e) => setSyllabus(e.target.value as Syllabus)}>
                <option value="vic">Victorian Curriculum</option>
                <option value="cambridge">Cambridge International</option>
              </select>
            </label>

            <label className="field">
              <span>Subject</span>
              <select value={subject} onChange={(e) => handleSubjectChange(e.target.value as Subject)}>
                <optgroup label="Core">
                  {SUBJECTS.filter((s) => s.group === "core").map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Grade 9+ electives">
                  {SUBJECTS.filter((s) => s.group === "elective").map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </optgroup>
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
              <span>Difficulty</span>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
                <option value="standard">Standard</option>
                <option value="advanced">Advanced</option>
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
            {mode === "worksheet" ? "Generate worksheet" : "Start test"}
          </button>
        </section>

        <section className="preview" aria-label="Preview">
          {!questions && (
            <div className="empty-state">
              <p>Choose your settings, then generate to see a preview here.</p>
            </div>
          )}

          {questions && mode === "worksheet" && (
            <>
              <div className="preview-toolbar">
                <h2>
                  Grade {grade} {subjectLabel} Worksheet
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
                    {q.figure && (
                      <div className="question-figure">
                        <FigureSvg figure={q.figure} />
                      </div>
                    )}
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

          {questions && mode === "test" && (
            <>
              <div className="preview-toolbar">
                <h2>
                  Grade {grade} {subjectLabel} Test
                </h2>
                <div className="preview-actions">
                  {!testSubmitted ? (
                    <button className="primary-button" onClick={() => setTestSubmitted(true)}>
                      Submit test
                    </button>
                  ) : (
                    <button className="primary-button" onClick={handleGenerate}>
                      Try a new test
                    </button>
                  )}
                </div>
              </div>

              {score && (
                <div className="score-banner">
                  You scored <strong>{score.correct}</strong> / {score.total} (
                  {Math.round((score.correct / score.total) * 100)}%)
                </div>
              )}

              <ol className="question-list">
                {questions.map((q, i) => {
                  const userAnswer = testAnswers[i] ?? "";
                  const correct = testSubmitted ? isCorrectAnswer(userAnswer, q.answer) : null;
                  return (
                    <li key={i} className={`question${testSubmitted ? (correct ? " correct" : " incorrect") : ""}`}>
                      <div className="question-prompt">{q.prompt}</div>
                      {q.figure && (
                        <div className="question-figure">
                          <FigureSvg figure={q.figure} />
                        </div>
                      )}
                      {q.options ? (
                        <div className="test-options">
                          {q.options.map((opt, oi) => (
                            <label key={oi} className="test-option">
                              <input
                                type="radio"
                                name={`q-${i}`}
                                value={opt}
                                disabled={testSubmitted}
                                checked={userAnswer === opt}
                                onChange={() =>
                                  setTestAnswers((prev) => {
                                    const next = [...prev];
                                    next[i] = opt;
                                    return next;
                                  })
                                }
                              />
                              <span>
                                {OPTION_LETTERS[oi]}) {opt}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="test-answer-input"
                          value={userAnswer}
                          disabled={testSubmitted}
                          placeholder="Your answer"
                          onChange={(e) =>
                            setTestAnswers((prev) => {
                              const next = [...prev];
                              next[i] = e.target.value;
                              return next;
                            })
                          }
                        />
                      )}
                      {testSubmitted && (
                        <div className="question-answer">
                          {correct ? "Correct" : `Correct answer: ${q.answer}`}
                          {!correct && userAnswer && <> — you answered: {userAnswer}</>}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <p>Runs entirely in your browser — no data leaves your device, and no account is needed.</p>
      </footer>
    </div>
  );
}

export default App;
