import { useMemo, useState } from "react";
import { GRADES, getSubject } from "../curriculum";
import { FORMULAS, formulasFor, groupByTopic, prettify, subjectsWithFormulas } from "../formulas";
import { generateFormulaPdf } from "../pdf";
import type { Subject } from "../types";

const firstGradeFor = (subject: Subject) =>
  Math.min(...FORMULAS.filter((f) => f.subject === subject).map((f) => f.minGrade));

interface FormulaSheetProps {
  initialSubject: Subject;
  initialGrade: number;
  onBack: () => void;
}

export function FormulaSheet({ initialSubject, initialGrade, onBack }: FormulaSheetProps) {
  const available = subjectsWithFormulas();
  const [subject, setSubject] = useState<Subject>(available.includes(initialSubject) ? initialSubject : "maths");
  const [grade, setGrade] = useState(() => Math.max(initialGrade, firstGradeFor(subject)));
  const [query, setQuery] = useState("");

  const subjectLabel = getSubject(subject).label;
  const minGrade = firstGradeFor(subject);
  const entries = useMemo(() => formulasFor(subject, grade, query), [subject, grade, query]);
  const groups = useMemo(() => groupByTopic(entries), [entries]);

  function changeSubject(next: Subject) {
    setSubject(next);
    setGrade((g) => Math.max(g, firstGradeFor(next)));
  }

  return (
    <section className="preview formula-sheet" aria-label="Formula sheet">
      <div className="preview-toolbar">
        <h2>
          Grade {grade} {subjectLabel} formulas
        </h2>
        <div className="preview-actions">
          <button
            onClick={() => generateFormulaPdf({ subject, subjectLabel, grade, groups: groupByTopic(formulasFor(subject, grade)) })}
          >
            Download PDF
          </button>
          <button className="primary-button" onClick={onBack}>
            Back to practice
          </button>
        </div>
      </div>

      <div className="formula-filters">
        <label className="field">
          <span>Subject</span>
          <select value={subject} onChange={(e) => changeSubject(e.target.value as Subject)}>
            {available.map((id) => (
              <option key={id} value={id}>
                {getSubject(id).label}
              </option>
            ))}
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
        <label className="field formula-search">
          <span>Search</span>
          <input
            type="search"
            value={query}
            placeholder="For example: area, interest, ratio"
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <p className="formula-hint">
        Showing everything up to Grade {grade}. These are for revision and are locked while an online test is in progress.
      </p>

      {groups.length === 0 && <div className="empty-state">No formulas match "{query}".</div>}

      {groups.map((group) => (
        <div key={group.topic} className="formula-group">
          <h3>{group.topic}</h3>
          <div className="formula-grid">
            {group.entries.map((entry) => (
              <article key={entry.name} className="formula-card">
                <h4>{entry.name}</h4>
                <div className="formula-text">{prettify(entry.formula)}</div>
                {entry.note && <p className="formula-note">{prettify(entry.note)}</p>}
                {entry.example && (
                  <p className="formula-example">
                    <strong>Example:</strong> {prettify(entry.example)}
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
