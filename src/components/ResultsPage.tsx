import { useMemo, useState } from "react";
import { getSubject, getTopics } from "../curriculum";
import { WEAK_THRESHOLD } from "../history";
import { decodeResult, type ResultPayload } from "../resultCode";

interface Row {
  payload: ResultPayload;
  weak: { label: string; correct: number; total: number }[];
}

function toRow(payload: ResultPayload): Row {
  const labels = new Map(getTopics(payload.subject, payload.grade, payload.syllabus, payload.difficulty).map((t) => [t.id, t.label]));
  const weak = payload.topics
    .filter(([, correct, total]) => correct / total < WEAK_THRESHOLD)
    .sort((a, b) => a[1] / a[2] - b[1] / b[2])
    .map(([id, correct, total]) => ({ label: labels.get(id) ?? id, correct, total }));
  return { payload, weak };
}

/** Quotes a CSV cell, and defuses text a spreadsheet would run as a formula (a name like =HYPERLINK(...)). */
const csvCell = (value: string | number) => {
  const text = String(value);
  const safe = /^[=+\-@\t\r]/.test(text) && typeof value === "string" ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

function testTitle(p: ResultPayload): string {
  return `Grade ${p.grade} ${getSubject(p.subject).label} · ${p.difficulty === "standard" ? "Standard" : "Advanced"}${p.seed ? ` · test ${p.seed}` : ""}`;
}

export function ResultsPage({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState("");

  const { rows, problems } = useMemo(() => {
    const rows: Row[] = [];
    const problems: string[] = [];
    const seen = new Set<string>();
    for (const token of text.split(/\s+/).filter((t) => t.startsWith("LA1-"))) {
      if (seen.has(token)) continue;
      seen.add(token);
      const result = decodeResult(token);
      if (result.ok) rows.push(toRow(result.payload));
      else problems.push(`${token.slice(0, 18)}…: ${result.error}`);
    }
    return { rows, problems };
  }, [text]);

  const groups = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const row of rows) {
      const key = testTitle(row.payload);
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return Array.from(map.entries());
  }, [rows]);

  function downloadCsv() {
    const header = ["Name", "Subject", "Grade", "Difficulty", "Test", "Correct", "Total", "Percent", "Weak topics"];
    const lines = rows.map(({ payload: p, weak }) =>
      [
        p.name,
        getSubject(p.subject).label,
        p.grade,
        p.difficulty,
        p.seed,
        p.correct,
        p.total,
        Math.round((p.correct / p.total) * 100),
        weak.map((w) => w.label).join("; "),
      ]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header.map(csvCell).join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "learn-aid-results.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="preview" aria-label="Class results">
      <div className="preview-toolbar">
        <h2>Class results</h2>
        <div className="preview-actions">
          {rows.length > 0 && <button onClick={downloadCsv}>Download CSV</button>}
          <button className="primary-button" onClick={onBack}>
            Back to practice
          </button>
        </div>
      </div>

      <label className="field">
        <span>Paste result codes from your students (any spacing or one per line)</span>
        <textarea
          className="results-input"
          rows={5}
          value={text}
          placeholder="LA1-…"
          spellCheck={false}
          onChange={(e) => setText(e.target.value)}
        />
      </label>
      <p className="share-note">
        Codes can be edited by whoever holds them, so treat these results as practice information, not as marks.
      </p>

      {problems.length > 0 && (
        <div className="notice" role="status">
          {problems.length} code{problems.length === 1 ? "" : "s"} could not be read:
          <ul>
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {groups.map(([title, groupRows]) => {
        const average = groupRows.reduce((sum, r) => sum + r.payload.correct / r.payload.total, 0) / groupRows.length;
        const counts = new Map<string, number>();
        for (const r of groupRows) for (const w of r.weak) counts.set(w.label, (counts.get(w.label) ?? 0) + 1);
        const common = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
        return (
          <div key={title} className="results-group">
            <h3>{title}</h3>
            <p className="share-note">
              {groupRows.length} student{groupRows.length === 1 ? "" : "s"} · class average {Math.round(average * 100)}%
              {common.length > 0 && ` · most common weak topics: ${common.map(([l, n]) => `${l} (${n})`).join(", ")}`}
            </p>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Needs work on</th>
                </tr>
              </thead>
              <tbody>
                {groupRows.map(({ payload, weak }, i) => (
                  <tr key={i}>
                    <td>{payload.name || "(no name)"}</td>
                    <td>
                      {payload.correct} / {payload.total} ({Math.round((payload.correct / payload.total) * 100)}%)
                    </td>
                    <td>{weak.length > 0 ? weak.map((w) => `${w.label} (${w.correct}/${w.total})`).join(", ") : "None"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {rows.length === 0 && problems.length === 0 && <div className="empty-state">Pasted results will appear here.</div>}
    </section>
  );
}
