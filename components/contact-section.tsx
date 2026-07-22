"use client";

import { ArrowUpRight, Download } from "lucide-react";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

export function ContactSection({ hasCv }: { hasCv: boolean }) {
  return (
    <section id="contact" aria-label="Contact" className="scroll-mt-20 border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint">Contact</p>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight text-fg sm:text-5xl">
          Convinced? Or still have <span className="italic text-accent">questions?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-mute">
          Either way — reach out. Itay is available for Design Engineer, Senior Frontend, and
          Design System roles, remote or hybrid.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${siteConfig.email}`}
            onClick={() => track({ name: "contact_cta_selected" })}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
          >
            Let&rsquo;s talk
          </a>
          <a
            href={hasCv ? siteConfig.cvPath : siteConfig.linkedin}
            {...(hasCv
              ? { download: "itay-haephrati-cv.pdf" }
              : { target: "_blank", rel: "noopener noreferrer" })}
            onClick={() => track({ name: "cv_download_selected" })}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-2.5 text-sm font-medium text-fg transition-colors hover:border-accent/50"
          >
            <Download size={15} aria-hidden />
            Download CV
          </a>
        </div>
        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-faint">
          <li>
            <a
              href={siteConfig.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-mute"
            >
              itaycode.com <ArrowUpRight size={11} aria-hidden />
            </a>
          </li>
          <li>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-mute"
            >
              LinkedIn <ArrowUpRight size={11} aria-hidden />
            </a>
          </li>
          <li>
            <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-mute">
              {siteConfig.email}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
