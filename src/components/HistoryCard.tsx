import { getSubject, getTopics } from "../curriculum";
import { weakTopics, type HistorySet } from "../history";

interface HistoryCardProps {
  sets: HistorySet[];
  onPractice: (set: HistorySet, topicIds: string[]) => void;
  onClear: () => void;
}

export function HistoryCard({ sets, onPractice, onClear }: HistoryCardProps) {
  if (sets.length === 0) return null;
  return (
    <div className="history-card">
      <h3>Pick up where you left off</h3>
      <div className="history-list">
        {sets.slice(0, 4).map((set) => {
          const labels = new Map(getTopics(set.subject, set.grade, set.syllabus, set.difficulty).map((t) => [t.id, t.label]));
          const weak = weakTopics(set.topics).filter((t) => labels.has(t.id));
          const answered = Object.values(set.topics).reduce((sum, [, total]) => sum + total, 0);
          return (
            <div key={`${set.subject}|${set.grade}|${set.syllabus}|${set.difficulty}`} className="history-row">
              <div>
                <strong>
                  Grade {set.grade} {getSubject(set.subject).label}
                </strong>
                <span className="history-meta">
                  {" "}
                  · {set.difficulty === "standard" ? "Standard" : "Advanced"} · {answered} answered
                </span>
                <div className="history-weak">
                  {weak.length > 0
                    ? `Weakest: ${weak
                        .slice(0, 2)
                        .map((t) => `${labels.get(t.id)} (${Math.round((t.correct / t.total) * 100)}%)`)
                        .join(", ")}`
                    : answered < 10
                      ? "Not enough answers yet to spot weak topics."
                      : "No weak topics so far. Nice work."}
                </div>
              </div>
              {weak.length > 0 && (
                <button
                  onClick={() =>
                    onPractice(
                      set,
                      weak.slice(0, 4).map((t) => t.id),
                    )
                  }
                >
                  Practise
                </button>
              )}
            </div>
          );
        })}
      </div>
      <p className="share-note">
        Scores are saved in this browser only.{" "}
        <button className="report-link" onClick={onClear}>
          Clear my history
        </button>
      </p>
    </div>
  );
}
