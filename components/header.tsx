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
