import { siteConfig } from "@/lib/site-config";

export function SignalBar() {
  return (
    <div aria-label="Professional signals" className="border-y border-line">
      <ul className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-4">
        {siteConfig.signals.map((s, i) => (
          <li
            key={s}
            className="flex items-center gap-8 text-[11px] font-medium uppercase tracking-[0.22em] text-faint"
          >
            {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-line-strong" />}
            <span className={i === 0 ? "text-accent" : undefined}>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
