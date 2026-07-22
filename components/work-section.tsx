import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

export function WorkSection({ projects }: { projects: Project[] }) {
  return (
    <section id="work" aria-label="Selected work" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">
              Selected work
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-fg sm:text-4xl">
              Evidence, not <span className="italic text-accent">adjectives.</span>
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-xs leading-relaxed text-faint sm:block">
            Every card links to the original case study. Or ask the AI what each project proves.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
