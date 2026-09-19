import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { FigureSvg } from "./components/FigureSvg";
import { SharePanel } from "./components/SharePanel";
import { GRADES, SUBJECTS, getSubject, getTopics } from "./curriculum";
import { generateUniqueQuestions } from "./generate";
import { diagnoseAnswer, isCorrectAnswer } from "./grading";
import { generateWorksheetPdf } from "./pdf";
import { SHARE_VERSION, buildShareUrl, newSeed, parseShareHash, withSeed, type ShareSpec } from "./share";
import type { Difficulty, Question, Subject, Syllabus } from "./types";
import { useTheme, type Theme } from "./useTheme";

const OPTION_LETTERS = ["A", "B", "C", "D"];
const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 50;

type Mode = "worksheet" | "test";

const initialShare = parseShareHash(window.location.hash);

/** Builds the questions for a spec. The same spec always gives the same questions, on any device. */
function generateFor(spec: ShareSpec): Question[] {
  const all = getTopics(spec.subject, spec.grade, spec.syllabus, spec.difficulty);
  const pool = spec.topicIds ? all.filter((t) => spec.topicIds?.includes(t.id)) : all;
  return withSeed(spec.seed, () => generateUniqueQuestions(pool, spec.count));
}

function App() {
  const [theme, setTheme] = useTheme();
  const [subject, setSubject] = useState<Subject>(initialShare?.subject ?? "maths");
  const [grade, setGrade] = useState(initialShare?.grade ?? 3);
  const [syllabus, setSyllabus] = useState<Syllabus>(initialShare?.syllabus ?? "vic");
  const [difficulty, setDifficulty] = useState<Difficulty>(initialShare?.difficulty ?? "standard");
  const [mode, setMode] = useState<Mode>(initialShare ? "test" : "worksheet");
  const [count, setCount] = useState(initialShare?.count ?? 10);
  const [selectedTopicIds, setSelectedTopicIds] = useState<Set<string>>(() =>
    initialShare
      ? new Set(
          initialShare.topicIds ??
            getTopics(initialShare.subject, initialShare.grade, initialShare.syllabus, initialShare.difficulty).map((t) => t.id),
        )
      : new Set(),
  );
  const [questions, setQuestions] = useState<Question[] | null>(() => (initialShare ? generateFor(initialShare) : null));
  const [showAnswers, setShowAnswers] = useState(false);
  const [testAnswers, setTestAnswers] = useState<string[]>(() =>
    initialShare ? new Array(initialShare.count).fill("") : [],
  );
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [requestedCount, setRequestedCount] = useState(initialShare?.count ?? 0);
  const [shared, setShared] = useState<ShareSpec | null>(initialShare);
  const sharedRef = useRef<ShareSpec | null>(initialShare);
  const [lastSpec, setLastSpec] = useState<ShareSpec | null>(null);
  const [sharePanelOpen, setSharePanelOpen] = useState(false);
  const [revealOnShare, setRevealOnShare] = useState(true);

  const { label: subjectLabel, minGrade } = getSubject(subject);
  const explanationLabel = subject === "general" ? "Did you know?" : "How to get it";

  const topics = useMemo(
    () => getTopics(subject, grade, syllabus, difficulty),
    [subject, grade, syllabus, difficulty],
  );

  function handleSubjectChange(next: Subject) {
    setSubject(next);
    const nextMin = getSubject(next).minGrade;
    if (grade < nextMin) setGrade(nextMin);
  }

  // Whenever the subject/grade/syllabus/difficulty changes, select all of that set's topics by default.
  useEffect(() => {
    if (sharedRef.current) return;
    setSelectedTopicIds(new Set(topics.map((t) => t.id)));
    setQuestions(null);
    setLastSpec(null);
  }, [topics]);

  const loadShared = useCallback((spec: ShareSpec) => {
    const generated = generateFor(spec);
    sharedRef.current = spec;
    setShared(spec);
    setSubject(spec.subject);
    setGrade(spec.grade);
    setSyllabus(spec.syllabus);
    setDifficulty(spec.difficulty);
    setCount(spec.count);
    setMode("test");
    setSelectedTopicIds(
      new Set(spec.topicIds ?? getTopics(spec.subject, spec.grade, spec.syllabus, spec.difficulty).map((t) => t.id)),
    );
    setQuestions(generated);
    setRequestedCount(spec.count);
    setShowAnswers(false);
    setTestAnswers(new Array(generated.length).fill(""));
    setTestSubmitted(false);
    setSharePanelOpen(false);
  }, []);

  // A share link pasted into an already-open tab only changes the hash.
  useEffect(() => {
    function onHashChange() {
      const spec = parseShareHash(window.location.hash);
      if (spec) loadShared(spec);
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [loadShared]);

  function exitShared() {
    sharedRef.current = null;
    setShared(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setSelectedTopicIds(new Set(topics.map((t) => t.id)));
    setQuestions(null);
    setTestAnswers([]);
    setTestSubmitted(false);
  }

  function retakeShared() {
    setTestAnswers(new Array(questions?.length ?? 0).fill(""));
    setTestSubmitted(false);
    window.scrollTo({ top: 0 });
  }

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
    const chosen = activeTopics.length > 0 ? activeTopics : topics;
    const spec: ShareSpec = {
      subject,
      grade,
      syllabus,
      difficulty,
      count,
      topicIds: chosen.length < topics.length ? chosen.map((t) => t.id) : null,
      seed: newSeed(),
      reveal: true,
      version: SHARE_VERSION,
    };
    const generated = generateFor(spec);
    setLastSpec(spec);
    setQuestions(generated);
    setRequestedCount(count);
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

  const showFeedback = !shared || shared.reveal;

  const score = useMemo(() => {
    if (!questions || !testSubmitted) return null;
    const correct = questions.filter((q, i) => isCorrectAnswer(testAnswers[i] ?? "", q.answer)).length;
    return { correct, total: questions.length };
  }, [questions, testAnswers, testSubmitted]);

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-top">
          <h1>Learn Aid</h1>
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
          Fresh practice worksheets and self-marking online tests for Grades 1–12, made for students, parents and teachers.
        </p>
      </header>

      <main className={shared ? "layout single" : "layout"}>
        {!shared && (
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
                {GRADES.filter((g) => g >= minGrade).map((g) => (
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
        )}

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
                  <button onClick={() => setSharePanelOpen((o) => !o)}>Share as online test</button>
                  <button className="primary-button" onClick={handleDownload}>
                    Download PDF (with answer key)
                  </button>
                </div>
              </div>

              {sharePanelOpen && lastSpec && (
                <SharePanel
                  link={buildShareUrl({ ...lastSpec, reveal: revealOnShare })}
                  reveal={revealOnShare}
                  onRevealChange={setRevealOnShare}
                />
              )}

              {questions.length < requestedCount && (
                <div className="notice" role="status">
                  Only {questions.length} different questions are available for these settings, so that is all you
                  are getting (nothing is repeated). Tick more topics or pick another grade to get {requestedCount}.
                </div>
              )}

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
                    {showAnswers && q.explanation && (
                      <div className="question-explanation">
                        <strong>{explanationLabel}</strong>
                        {q.explanation}
                      </div>
                    )}
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
                  {!shared && !testSubmitted && (
                    <button onClick={() => setSharePanelOpen((o) => !o)}>Share this test</button>
                  )}
                  {!testSubmitted ? (
                    <button className="primary-button" onClick={() => setTestSubmitted(true)}>
                      Submit test
                    </button>
                  ) : shared ? (
                    <>
                      {shared.reveal && <button onClick={retakeShared}>Retake this test</button>}
                      <button className="primary-button" onClick={exitShared}>
                        Take your own practice test
                      </button>
                    </>
                  ) : (
                    <button className="primary-button" onClick={handleGenerate}>
                      Try a new test
                    </button>
                  )}
                </div>
              </div>

              {shared && (
                <div className="shared-banner" role="status">
                  Shared test · {questions.length} question{questions.length === 1 ? "" : "s"}
                  {shared.version !== SHARE_VERSION &&
                    ". This link was made with a different version of Learn Aid, so the questions may not match the original."}
                </div>
              )}

              {!shared && !testSubmitted && sharePanelOpen && lastSpec && (
                <SharePanel
                  link={buildShareUrl({ ...lastSpec, reveal: revealOnShare })}
                  reveal={revealOnShare}
                  onRevealChange={setRevealOnShare}
                />
              )}

              {questions.length < requestedCount && (
                <div className="notice" role="status">
                  Only {questions.length} different questions are available for these settings, so that is all you
                  are getting (nothing is repeated). Tick more topics or pick another grade to get {requestedCount}.
                </div>
              )}

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
                      {testSubmitted && !showFeedback && (
                        <div className="question-answer">{correct ? "Correct" : "Incorrect"}</div>
                      )}
                      {testSubmitted && showFeedback && (
                        <div className="question-answer">
                          {correct ? "Correct" : `Correct answer: ${q.answer}`}
                          {!correct && userAnswer && <> — you answered: {userAnswer}</>}
                          {!correct && diagnoseAnswer(userAnswer, q.answer) && <> {diagnoseAnswer(userAnswer, q.answer)}</>}
                        </div>
                      )}
                      {testSubmitted && showFeedback && !correct && q.explanation && (
                        <div className="question-explanation">
                          <strong>{explanationLabel}</strong>
                          {q.explanation}
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
        <p>© 2026 jsklabs-works. All rights reserved. For personal and classroom use.</p>
      </footer>
    </div>
  );
}

export default App;
