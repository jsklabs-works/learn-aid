import { useEffect, useRef, useState } from "react";
import { FEEDBACK_TYPES, buildIssueUrl, type FeedbackContext, type FeedbackType } from "../feedback";

interface FeedbackDialogProps {
  context: FeedbackContext;
  initialType: FeedbackType;
  onClose: () => void;
}

export function FeedbackDialog({ context, initialType, onClose }: FeedbackDialogProps) {
  const [type, setType] = useState<FeedbackType>(initialType);
  const [message, setMessage] = useState("");
  const [includeContext, setIncludeContext] = useState(true);
  const [error, setError] = useState("");
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 5) {
      setError("Tell us a little more about what happened.");
      return;
    }
    window.open(buildIssueUrl({ type, message, includeContext, context }), "_blank", "noopener,noreferrer");
    onClose();
  }

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" role="dialog" aria-modal="true" aria-label="Send feedback" onSubmit={submit}>
        <h3>Send feedback</h3>

        {context.question && (
          <blockquote className="dialog-question">
            <strong>
              Question {context.question.number} of {context.question.total}
            </strong>
            <br />
            {context.question.prompt}
          </blockquote>
        )}

        <label className="field">
          <span>What is this about?</span>
          <select value={type} onChange={(e) => setType(e.target.value as FeedbackType)}>
            {FEEDBACK_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>What happened?</span>
          <textarea
            ref={messageRef}
            rows={5}
            value={message}
            placeholder={
              type === "question"
                ? "For example: the correct answer should be 12, not 14"
                : type === "grade"
                  ? "For example: this is too hard for Grade 4"
                  : "Describe it in a sentence or two"
            }
            onChange={(e) => {
              setMessage(e.target.value);
              setError("");
            }}
          />
        </label>

        <label className="share-option">
          <input type="checkbox" checked={includeContext} onChange={(e) => setIncludeContext(e.target.checked)} />
          <span>
            Include the subject, grade and settings
            {context.question ? ", and this question" : ""}
          </span>
        </label>

        {error && (
          <p className="dialog-error" role="alert">
            {error}
          </p>
        )}

        <p className="share-note">
          This opens a new issue on GitHub with your feedback filled in, and you send it from there. You need a free
          GitHub account, and issues are public, so please leave out personal details.
        </p>

        <div className="dialog-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary-button">
            Continue on GitHub
          </button>
        </div>
      </form>
    </div>
  );
}
