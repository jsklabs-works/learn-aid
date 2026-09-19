import { useRef, useState } from "react";

interface SharePanelProps {
  link: string;
  reveal: boolean;
  onRevealChange: (reveal: boolean) => void;
}

export function SharePanel({ link, reveal, onRevealChange }: SharePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      inputRef.current?.select();
      setStatus("manual");
    }
  }

  return (
    <div className="share-panel" role="region" aria-label="Share this test">
      <h3>Share this test</h3>
      <div className="share-link-row">
        <input
          ref={inputRef}
          className="share-link-input"
          readOnly
          value={link}
          aria-label="Test link"
          onFocus={(e) => e.currentTarget.select()}
        />
        <button onClick={copy}>{status === "copied" ? "Copied" : "Copy link"}</button>
      </div>
      {status === "manual" && <p className="share-note">Press Ctrl+C (or Cmd+C) to copy the link.</p>}
      <label className="share-option">
        <input type="checkbox" checked={reveal} onChange={(e) => onRevealChange(e.target.checked)} />
        <span>Show correct answers and explanations after submitting</span>
      </label>
      <p className="share-note">
        Everyone who opens this link gets the same questions in the same order, as an online test. Nothing is stored
        on a server.
      </p>
    </div>
  );
}
