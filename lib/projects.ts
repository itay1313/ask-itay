import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  role: string;
  disciplines: string[];
  technologies: string[];
  duration: string;
  location: string;
  source: string;
  liveUrl: string;
}

export function loadProjects(): Project[] {
  const dir = path.join(process.cwd(), "content", "projects");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      return {
        slug: String(data.slug ?? path.basename(f, ".md")),
        title: String(data.title ?? ""),
        summary: String(data.summary ?? ""),
        role: String(data.role ?? ""),
        disciplines: Array.isArray(data.disciplines) ? data.disciplines.map(String) : [],
        technologies: Array.isArray(data.technologies) ? data.technologies.map(String) : [],
        duration: String(data.duration ?? ""),
        location: String(data.location ?? ""),
        source: String(data.source ?? ""),
        liveUrl: String(data.liveUrl ?? ""),
      } satisfies Project;
    });
}
