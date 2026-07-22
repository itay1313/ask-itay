import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-faint sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Designed &amp; built as an AI-first
          portfolio.
        </p>
        <p>
          Answers are generated from verified content on{" "}
          <a
            href={siteConfig.portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-mute"
          >
            itaycode.com
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
