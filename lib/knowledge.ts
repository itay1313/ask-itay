import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface KnowledgeSection {
  id: string;
  title: string;
  heading: string;
  content: string;
  source: string;
  sourceTitle: string;
  tags: string[];
}

export interface RetrievedContext {
  sections: KnowledgeSection[];
  sources: { url: string; title: string }[];
}

const CONTENT_DIR = path.join(process.cwd(), "content");

let cache: KnowledgeSection[] | null = null;

function readMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(dir, f));
}

/** Split every curated + generated markdown file into `##`-delimited sections. */
export function loadKnowledge(): KnowledgeSection[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const files = [
    ...readMarkdownFiles(CONTENT_DIR),
    ...readMarkdownFiles(path.join(CONTENT_DIR, "projects")),
    ...readMarkdownFiles(path.join(CONTENT_DIR, "generated")),
  ];

  const sections: KnowledgeSection[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const source = typeof data.source === "string" ? data.source : "https://itaycode.com/";
    const sourceTitle =
      typeof data.sourceTitle === "string" ? data.sourceTitle : "itaycode.com";
    const tags: string[] = Array.isArray(data.tags) ? data.tags.map(String) : [];
    const title = typeof data.title === "string" ? data.title : path.basename(file, ".md");

    const parts = content.split(/^## /m).filter((p) => p.trim().length > 0);
    for (const part of parts) {
      const [firstLine, ...rest] = part.split("\n");
      const heading = firstLine.trim();
      const body = rest.join("\n").trim();
      if (!body) continue;
      sections.push({
        id: `${path.basename(file, ".md")}::${heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title,
        heading,
        content: body,
        source,
        sourceTitle,
        tags,
      });
    }
  }
  cache = sections;
  return sections;
}

const STOP_WORDS = new Set(
  "a an the and or but of in on for to with about is are was were be been has have had does do did what which who how why when where can could would should his her their this that these those you your we our i me my it its as at by from itay haephrati".split(
    " ",
  ),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Simple, reliable local retrieval: score each section by term overlap with
 * the question (tag hits weighted highest, heading hits next, body term
 * frequency last). Swappable later for vector search without UI changes.
 */
export function retrieveContext(question: string, maxSections = 8, maxChars = 14000): RetrievedContext {
  const sections = loadKnowledge();
  const terms = tokenize(question);

  const scored = sections.map((section) => {
    const bodyTokens = tokenize(`${section.heading} ${section.content}`);
    const bodySet = new Set(bodyTokens);
    let score = 0;
    for (const term of terms) {
      if (section.tags.some((tag) => tag.includes(term) || term.includes(tag))) score += 5;
      if (tokenize(section.heading).includes(term)) score += 3;
      if (bodySet.has(term)) score += 1;
    }
    return { section, score };
  });

  const picked = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSections)
    .map((s) => s.section);

  // Job descriptions / broad questions: fall back to a representative core set
  // so the model always has verified context to reason over.
  if (picked.length < 3) {
    const core = sections.filter((s) =>
      ["profile", "experience", "skills", "leadership", "ai-and-automation"].some((name) =>
        s.id.startsWith(name),
      ),
    );
    const seen = new Set(picked.map((s) => s.id));
    for (const s of core) {
      if (!seen.has(s.id)) picked.push(s);
      if (picked.length >= maxSections) break;
    }
  }

  // Cap total characters sent to the model.
  const final: KnowledgeSection[] = [];
  let total = 0;
  for (const s of picked) {
    if (total + s.content.length > maxChars) break;
    final.push(s);
    total += s.content.length;
  }

  const sources = new Map<string, string>();
  for (const s of final) sources.set(s.source, s.sourceTitle);

  return {
    sections: final,
    sources: [...sources.entries()].map(([url, title]) => ({ url, title })),
  };
}

export function buildContextBlock(context: RetrievedContext): string {
  return context.sections
    .map(
      (s) =>
        `<section title="${s.title} — ${s.heading}" source="${s.source}">\n${s.content}\n</section>`,
    )
    .join("\n\n");
}

/** Follow-up suggestions derived from which topic areas were NOT in the answer context. */
export function suggestFollowUps(context: RetrievedContext, mode: "question" | "jd"): string[] {
  if (mode === "jd") {
    return [
      "Which project best proves he fits this role?",
      "What would be good interview topics for him?",
      "Summarize his experience in 30 seconds",
    ];
  }
  const pool: { tag: string; question: string }[] = [
    { tag: "design-system", question: "Can he lead a design system?" },
    { tag: "ai", question: "What has he built with AI?" },
    { tag: "leadership", question: "What leadership experience does he have?" },
    { tag: "project", question: "Which project best represents his work?" },
    { tag: "frontend", question: "Show me proof of his frontend experience" },
    { tag: "experience", question: "Summarize his experience in 30 seconds" },
  ];
  const coveredTags = new Set(context.sections.flatMap((s) => s.tags));
  const uncovered = pool.filter((p) => ![...coveredTags].some((t) => t.includes(p.tag)));
  const picks = (uncovered.length >= 3 ? uncovered : pool).slice(0, 3);
  return picks.map((p) => p.question);
}

/** Related project cards, chosen by overlap between the question/context and project tags. */
export function relatedProjects(question: string, context: RetrievedContext): string[] {
  const terms = new Set(tokenize(question));
  const projectSections = loadKnowledge().filter((s) => s.tags.includes("project"));
  const slugs = new Map<string, number>();
  for (const s of projectSections) {
    const slug = s.id.split("::")[0];
    let score = 0;
    for (const term of terms) {
      if (s.tags.some((t) => t.includes(term))) score += 2;
      if (s.content.toLowerCase().includes(term)) score += 1;
    }
    // Boost projects that were directly retrieved into context.
    if (context.sections.some((cs) => cs.id.startsWith(slug))) score += 4;
    if (score > 0) slugs.set(slug, (slugs.get(slug) ?? 0) + score);
  }
  return [...slugs.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([slug]) => slug);
}
