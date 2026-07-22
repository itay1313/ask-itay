/**
 * npm run sync-profile
 *
 * Crawls the allowed pages on itaycode.com, extracts meaningful professional
 * text, and writes normalized markdown files to content/generated/ (one per
 * page, with source URL + title preserved in frontmatter). Curated files in
 * content/ are never touched. If a PDF exists in content/cv, its text is
 * extracted to content/generated/cv.md and the file is copied to public/cv.pdf.
 */
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const GENERATED_DIR = path.join(CONTENT_DIR, "generated");
const CV_DIR = path.join(CONTENT_DIR, "cv");
const SOURCES_PATH = path.join(CONTENT_DIR, "sources.json");

interface SourceEntry {
  url: string;
  title: string;
  type: string;
}

function slugify(url: string): string {
  const u = new URL(url);
  const p = u.pathname.replace(/\/+$/, "").replace(/^\/+/, "").replace(/\//g, "-");
  return `itaycode-${p || "home"}`;
}

function normalizeText($: cheerio.CheerioAPI): string {
  // Remove navigation, scripts, and repeated chrome before extracting text.
  $("script, style, noscript, nav, header, footer, iframe, svg, form").remove();
  const blocks: string[] = [];
  const seen = new Set<string>();
  $("h1, h2, h3, h4, p, li, blockquote, figcaption, dt, dd").each((_, el) => {
    const tag = el.tagName?.toLowerCase() ?? "p";
    let text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length < 3) return;
    const key = text.toLowerCase();
    if (seen.has(key)) return; // drop nav/footer duplication
    seen.add(key);
    if (/^(cookie|accept|menu|skip to)/i.test(text)) return;
    if (tag.startsWith("h")) text = `## ${text}`;
    else if (tag === "li") text = `- ${text}`;
    blocks.push(text);
  });
  return blocks.join("\n\n");
}

async function crawlPage(entry: SourceEntry): Promise<boolean> {
  try {
    const res = await fetch(entry.url, {
      headers: { "User-Agent": "ask-itay-sync/1.0 (+https://itaycode.com)" },
    });
    if (!res.ok) {
      console.warn(`  ! ${entry.url} -> HTTP ${res.status}, skipped`);
      return false;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const pageTitle = $("title").text().trim() || entry.title;
    const body = normalizeText($);
    if (body.length < 100) {
      console.warn(`  ! ${entry.url} -> too little text (JS-rendered page?), skipped`);
      return false;
    }
    const frontmatter = [
      "---",
      `title: ${JSON.stringify(pageTitle)}`,
      `source: ${entry.url}`,
      `sourceTitle: ${JSON.stringify(pageTitle)}`,
      `tags: [generated, ${entry.type}]`,
      `syncedAt: ${new Date().toISOString()}`,
      "---",
      "",
    ].join("\n");
    fs.writeFileSync(path.join(GENERATED_DIR, `${slugify(entry.url)}.md`), frontmatter + body + "\n");
    console.log(`  ✓ ${entry.url}`);
    return true;
  } catch (err) {
    console.warn(`  ! ${entry.url} -> ${(err as Error).message}, skipped`);
    return false;
  }
}

async function syncCv(): Promise<void> {
  if (!fs.existsSync(CV_DIR)) return;
  const pdf = fs.readdirSync(CV_DIR).find((f) => f.toLowerCase().endsWith(".pdf"));
  if (!pdf) {
    console.log("No PDF in content/cv — skipping CV sync.");
    return;
  }
  const pdfPath = path.join(CV_DIR, pdf);
  fs.copyFileSync(pdfPath, path.join(ROOT, "public", "cv.pdf"));
  console.log(`  ✓ copied ${pdf} -> public/cv.pdf`);
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(pdfPath)) });
    const result = await parser.getText();
    const text = result.text.replace(/\r/g, "").replace(/\n{3,}/g, "\n\n").trim();
    if (text.length > 100) {
      const md = [
        "---",
        `title: CV`,
        `source: https://www.linkedin.com/in/itayhaephrati/`,
        `sourceTitle: Itay Haephrati — CV (PDF)`,
        "tags: [generated, cv, experience, skills]",
        `syncedAt: ${new Date().toISOString()}`,
        "---",
        "",
        "## CV — extracted text",
        "",
        text,
        "",
      ].join("\n");
      fs.writeFileSync(path.join(GENERATED_DIR, "cv.md"), md);
      console.log("  ✓ extracted CV text -> content/generated/cv.md");
    }
  } catch (err) {
    console.warn(`  ! CV text extraction failed: ${(err as Error).message}`);
    console.warn("    (install pdf-parse: npm i -D pdf-parse)");
  }
}

async function main() {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
  const sourcesFile = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8")) as {
    sources: SourceEntry[];
    lastSynced: string | null;
  };
  const crawlable = sourcesFile.sources.filter((s) => s.url.startsWith("https://itaycode.com"));
  console.log(`Syncing ${crawlable.length} pages from itaycode.com...`);
  let ok = 0;
  for (const entry of crawlable) {
    if (await crawlPage(entry)) ok++;
    await new Promise((r) => setTimeout(r, 400)); // be polite
  }
  await syncCv();
  sourcesFile.lastSynced = new Date().toISOString();
  fs.writeFileSync(SOURCES_PATH, JSON.stringify(sourcesFile, null, 2) + "\n");
  console.log(`Done. ${ok}/${crawlable.length} pages synced. Curated content untouched.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
