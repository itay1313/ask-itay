"use client";

import { ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { track } from "@/lib/analytics";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const askAbout = () => {
    track({ name: "suggested_question_selected", label: `project:${project.slug}` });
    window.dispatchEvent(
      new CustomEvent("ask-itay:question", {
        detail: `Tell me about the ${project.title} project — what was Itay's role, and what does it prove about his abilities?`,
      }),
    );
    document.getElementById("ask")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <article className="group flex flex-col rounded-2xl border border-line bg-panel p-6 transition-colors hover:border-line-strong">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-xl text-fg">{project.title}</h3>
        <span className="text-[11px] tabular-nums text-faint">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-mute">{project.summary}</p>
      <dl className="mt-4 space-y-1.5 text-xs">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 uppercase tracking-[0.14em] text-faint">Role</dt>
          <dd className="text-mute">{project.role}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 uppercase tracking-[0.14em] text-faint">Tech</dt>
          <dd className="text-mute">{project.technologies.join(", ")}</dd>
        </div>
      </dl>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.disciplines.map((d) => (
          <span
            key={d}
            className="rounded-full border border-line px-2.5 py-0.5 text-[10px] uppercase tracking-[0.12em] text-faint"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <button
          type="button"
          onClick={askAbout}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-opacity hover:opacity-80"
        >
          <MessageCircleQuestion size={14} aria-hidden />
          Ask about this project
        </button>
        <a
          href={project.source}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track({ name: "project_viewed", label: project.slug })}
          aria-label={`${project.title} case study on itaycode.com`}
          className="inline-flex items-center gap-1 text-xs text-faint transition-colors hover:text-fg"
        >
          Case study
          <ArrowUpRight size={12} aria-hidden />
        </a>
      </div>
    </article>
  );
}
