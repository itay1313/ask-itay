import React from "react";

// Minimal markdown renderer for the constrained answer format the system
// prompt enforces: paragraphs, **bold**, *italic*, `code`, [links](url),
// bullet lists, and bold pseudo-headings. No raw HTML is ever rendered.

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Order matters: links first, then bold, italic, code.
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${i++}`;
    if (match[1] && match[2]) {
      nodes.push(
        <a
          key={key}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-80"
        >
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={key} className="font-semibold text-fg">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      nodes.push(<em key={key}>{match[4]}</em>);
    } else if (match[5]) {
      nodes.push(
        <code key={key} className="rounded bg-panel-2 px-1.5 py-0.5 text-[0.85em] text-accent">
          {match[5]}
        </code>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter((l) => l.trim().length > 0);
        if (lines.length === 0) return null;
        const isList = lines.every((l) => /^\s*[-*•]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} className="space-y-2 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-3 leading-relaxed text-mute">
                  <span aria-hidden className="mt-[0.65em] h-px w-3 shrink-0 bg-accent" />
                  <span>{renderInline(line.replace(/^\s*[-*•]\s+/, ""), `${bi}-${li}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        // Strip markdown heading markers the model might still emit.
        const clean = lines.map((l) => l.replace(/^#{1,4}\s+/, "")).join(" ");
        return (
          <p key={bi} className="leading-relaxed text-mute">
            {renderInline(clean, `p-${bi}`)}
          </p>
        );
      })}
    </div>
  );
}
