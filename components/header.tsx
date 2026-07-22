"use client";

import { Download } from "lucide-react";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

export function Header({ hasCv }: { hasCv: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3.5">
        <a href="#ask" className="flex items-baseline gap-1.5 font-display text-lg text-fg">
          Ask
          <span className="italic text-accent">Itay</span>
          <span aria-hidden className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
        </a>
        <nav aria-label="Primary" className="flex items-center gap-1 text-sm">
          <a
            href="#work"
            className="hidden rounded-full px-3 py-1.5 text-mute transition-colors hover:text-fg sm:block"
          >
            Work
          </a>
          <a
            href="#profile"
            className="hidden rounded-full px-3 py-1.5 text-mute transition-colors hover:text-fg sm:block"
          >
            Profile
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Itay on LinkedIn"
            className="rounded-full p-2 text-mute transition-colors hover:text-fg"
          >
            {/* LinkedIn brand mark (lucide dropped brand icons) */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4v-7a1 1 0 0 0-2 0v7H9v-9h4v1.1A3.5 3.5 0 0 1 19 16.5V21M7 21H3V9h4v12M5 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" />
            </svg>
          </a>
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Itay on GitHub"
            className="rounded-full p-2 text-mute transition-colors hover:text-fg"
          >
            {/* GitHub brand mark */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
          <a
            href={hasCv ? siteConfig.cvPath : siteConfig.linkedin}
            {...(hasCv ? { download: "itay-haephrati-cv.pdf" } : { target: "_blank", rel: "noopener noreferrer" })}
            onClick={() => track({ name: "cv_download_selected" })}
            className="hidden items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-mute transition-colors hover:border-line-strong hover:text-fg sm:inline-flex"
          >
            <Download size={13} aria-hidden />
            {hasCv ? "Download CV" : "CV on LinkedIn"}
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            onClick={() => track({ name: "contact_cta_selected" })}
            className="ml-1 rounded-full bg-fg px-4 py-1.5 text-xs font-semibold text-bg transition-opacity hover:opacity-85"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
