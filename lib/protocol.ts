// Shared between the /api/ask route and the client answer workspace.
// Wire protocol: one JSON metadata line, this delimiter, then streamed markdown.
export const STREAM_DELIMITER = "\n<<<ANSWER>>>\n";

export interface AnswerMeta {
  mode: "question" | "jd";
  sources: { url: string; title: string }[];
  projects: string[];
  followUps: string[];
}
