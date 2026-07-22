const roles = [
  {
    role: "Senior Design Engineer / Creative Developer",
    org: "Com-mando (own studio)",
    period: "2019 — present",
  },
  {
    role: "Senior Design Engineer",
    org: "Image Systems Motion Analysis · Sweden",
    period: "2022 — 2025",
  },
  {
    role: "Software Engineer & Design System Lead",
    org: "LivePerson · New York",
    period: "2020 — 2023",
  },
  {
    role: "Lecturer & Instructor",
    org: "Netcraft Academy · Israel",
    period: "2022 — 2024",
  },
  {
    role: "Web Developer, Designer & Design System Architect",
    org: "Gravyty · Israel",
    period: "2016 — 2020",
  },
];

export function ProfileSection() {
  return (
    <section id="profile" aria-label="Profile" className="scroll-mt-20">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">Profile</p>
          <h2 className="mt-4 font-display text-3xl leading-tight text-fg sm:text-4xl">
            One person, both sides of <span className="italic text-accent">the handoff.</span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-mute">
            Itay is a frontend developer, creative developer, and UI engineer with 13+ years of
            experience. He defines foundations and components in Figma, then builds them in React,
            Next.js, TypeScript, and CSS — and has taught that exact workflow professionally. Design
            systems, accessibility, motion, and AI-driven automation are core to how he works.
          </p>
        </div>
        <ol className="space-y-0 border-l border-line">
          {roles.map((r) => (
            <li key={r.role} className="relative py-4 pl-6">
              <span
                aria-hidden
                className="absolute -left-[3px] top-[1.45rem] h-1.5 w-1.5 rounded-full bg-accent"
              />
              <p className="text-sm font-semibold text-fg">{r.role}</p>
              <p className="mt-0.5 text-xs text-mute">{r.org}</p>
              <p className="mt-0.5 text-[11px] tabular-nums uppercase tracking-[0.14em] text-faint">
                {r.period}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
