const testimonials = [
  {
    quote:
      "Extensive knowledge as a Frontend Developer and Product Designer. His work ethic and drive to push projects from inception to completion are second to none. A true joy to work with.",
    name: "Nadav Bloch",
    role: "VP Operations",
  },
  {
    quote:
      "I've worked with many website design & development professionals over the years, and Itay Haephrati is amongst the best. I highly recommend him.",
    name: "Adam Banning",
    role: "Sales & Marketing",
  },
];

export function TestimonialsSection() {
  return (
    <section aria-label="Client testimonials" className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-faint">
          Client stories
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="relative rounded-2xl border border-line bg-panel p-8"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute left-6 top-2 font-display text-6xl italic text-accent/25"
              >
                &ldquo;
              </span>
              <blockquote className="relative pt-6 font-display text-lg leading-relaxed text-fg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 text-xs">
                <span className="font-semibold uppercase tracking-[0.14em] text-mute">
                  {t.name}
                </span>
                <span className="ml-2 uppercase tracking-[0.14em] text-faint">{t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
