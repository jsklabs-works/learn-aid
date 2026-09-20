const REPO = "jsklabs-works/learn-aid";
const MAX_BODY_LENGTH = 6000;

export type FeedbackType = "question" | "grade" | "bug" | "idea";

export const FEEDBACK_TYPES: { id: FeedbackType; label: string; titlePrefix: string; labels: string[] }[] = [
  { id: "question", label: "A question or answer is wrong or unclear", titlePrefix: "Question problem", labels: ["feedback", "content"] },
  { id: "grade", label: "A question is at the wrong grade level", titlePrefix: "Wrong grade", labels: ["feedback", "wrong-grade"] },
  { id: "bug", label: "Something is broken", titlePrefix: "Bug", labels: ["feedback", "bug"] },
  { id: "idea", label: "An idea or request", titlePrefix: "Idea", labels: ["feedback", "enhancement"] },
];

export interface FeedbackQuestion {
  number: number;
  total: number;
  prompt: string;
  answer: string;
  options?: string[];
}

export interface FeedbackContext {
  subjectLabel: string;
  grade: number;
  syllabus: string;
  difficulty: string;
  mode: string;
  question?: FeedbackQuestion;
  /** A share link that rebuilds the same questions, when one exists. */
  reproLink?: string;
}

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

export function buildIssueUrl(input: {
  type: FeedbackType;
  message: string;
  includeContext: boolean;
  context: FeedbackContext;
}): string {
  const kind = FEEDBACK_TYPES.find((t) => t.id === input.type) ?? FEEDBACK_TYPES[0];
  const { context } = input;
  const message = input.message.trim();

  const aboutContent = input.type === "question" || input.type === "grade";
  const where = input.includeContext && aboutContent ? `Grade ${context.grade} ${context.subjectLabel}` : "";
  const subject = context.question ? clip(context.question.prompt.replace(/\s+/g, " "), 60) : clip(message.replace(/\s+/g, " "), 60);
  const title = [`[${kind.titlePrefix}]`, where && `${where}:`, subject].filter(Boolean).join(" ");

  const lines = [`**Type:** ${kind.label}`, "", "**What happened**", message, ""];
  if (input.includeContext) {
    lines.push("**Details**");
    lines.push(`- Subject: ${context.subjectLabel}`);
    lines.push(`- Grade: ${context.grade}`);
    lines.push(`- Syllabus: ${context.syllabus}`);
    lines.push(`- Difficulty: ${context.difficulty}`);
    lines.push(`- Mode: ${context.mode}`);
    if (context.question) {
      const q = context.question;
      lines.push(`- Question ${q.number} of ${q.total}:`);
      lines.push("", `> ${clip(q.prompt.replace(/\n/g, " "), 500)}`, "");
      if (q.options) lines.push(`- Options: ${q.options.map((o, i) => `${"ABCD"[i]}) ${o}`).join("  ")}`);
      lines.push(`- Answer shown: ${clip(q.answer, 200)}`);
    }
    if (context.reproLink) lines.push(`- Same test: ${context.reproLink}`);
    if (input.type === "bug") lines.push(`- Browser: ${clip(navigator.userAgent, 200)}`);
  }
  lines.push("", "_Sent from the Learn Aid feedback form._");

  const params = new URLSearchParams({
    title: clip(title, 200),
    body: clip(lines.join("\n"), MAX_BODY_LENGTH),
    labels: kind.labels.join(","),
  });
  return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
