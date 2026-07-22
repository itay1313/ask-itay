"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CornerDownLeft, FileText, RotateCcw, X } from "lucide-react";
import { track } from "@/lib/analytics";
import type { AnswerMeta } from "@/lib/protocol";
import { STREAM_DELIMITER } from "@/lib/protocol";
import { promptShortcuts, siteConfig, suggestedQuestions } from "@/lib/site-config";
import { Markdown } from "@/components/markdown";
import type { Project } from "@/lib/projects";

type Phase = "idle" | "streaming" | "done" | "error";

interface AskExperienceProps {
  projects: Project[];
}

export function AskExperience({ projects }: AskExperienceProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [jdMode, setJdMode] = useState(false);
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [meta, setMeta] = useState<AnswerMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  const ask = useCallback(
    async (q: string, mode: "question" | "jd") => {
      const trimmed = q.trim();
      if (trimmed.length < 3 || phase === "streaming") return;
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setQuestion(trimmed);
      setAnswer("");
      setMeta(null);
      setError(null);
      setPhase("streaming");
      track({ name: "question_submitted" });
      requestAnimationFrame(() =>
        workspaceRef.current?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        }),
      );

      try {
        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed, mode }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error ?? `Request failed (${res.status})`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let metaParsed = false;
        let text = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          if (!metaParsed) {
            const idx = buffer.indexOf(STREAM_DELIMITER);
            if (idx === -1) continue;
            setMeta(JSON.parse(buffer.slice(0, idx)) as AnswerMeta);
            metaParsed = true;
            text = buffer.slice(idx + STREAM_DELIMITER.length);
          } else {
            text = buffer.slice(buffer.indexOf(STREAM_DELIMITER) + STREAM_DELIMITER.length);
          }
          setAnswer(text);
        }
        setPhase("done");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError((err as Error).message || "Something went wrong. Please try again.");
        setPhase("error");
      }
    },
    [phase, reducedMotion],
  );

  // Project cards elsewhere on the page inject questions via this event.
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      setJdMode(false);
      setInput(q);
      void ask(q, "question");
    };
    window.addEventListener("ask-itay:question", handler);
    return () => window.removeEventListener("ask-itay:question", handler);
  }, [ask]);

  const submit = () => void ask(input, jdMode ? "jd" : "question");

  const reset = () => {
    abortRef.current?.abort();
    setPhase("idle");
    setAnswer("");
    setMeta(null);
    setError(null);
    setInput("");
    setJdMode(false);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const relatedCards = meta ? projects.filter((p) => meta.projects.includes(p.slug)) : [];

  return (
    <section id="ask" aria-label="Ask about Itay" className="relative">
      {/* ------------------------------------------------ hero prompt */}
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 pb-10 text-center sm:pt-28">
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-medium uppercase tracking-[0.28em] text-faint"
        >
          Itay Haephrati / Design + Code + AI
        </motion.p>
        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mt-6 font-display text-5xl leading-[1.04] tracking-tight text-fg sm:text-7xl"
        >
          Don&rsquo;t read my CV.
          <br />
          <span className="italic text-accent">Ask it.</span>
        </motion.h1>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-6 max-w-xl text-balance text-base leading-relaxed text-mute"
        >
          Ask about my experience, projects, technical skills, leadership — or paste a job
          description to see how I fit.
        </motion.p>

        {/* prompt */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-10 w-full"
        >
          <div
            className={`group relative rounded-2xl border bg-panel transition-all duration-300 ${
              jdMode ? "border-accent/40" : "border-line-strong"
            } focus-within:border-accent/60 focus-within:shadow-[0_0_60px_-18px_rgba(226,177,94,0.35)]`}
          >
            <label htmlFor="ask-input" className="sr-only">
              {jdMode ? "Paste a job description" : "Ask anything about Itay"}
            </label>
            <textarea
              id="ask-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !jdMode) {
                  e.preventDefault();
                  submit();
                }
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && jdMode) {
                  e.preventDefault();
                  submit();
                }
              }}
              rows={jdMode ? 9 : 2}
              maxLength={jdMode ? 8000 : 2000}
              placeholder={
                jdMode
                  ? "Paste the complete job description here…"
                  : "Ask anything about Itay..."
              }
              className="w-full resize-none rounded-2xl bg-transparent px-5 pt-4 pb-14 text-left text-base text-fg placeholder:text-faint focus:outline-none sm:text-lg"
            />
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  const next = !jdMode;
                  setJdMode(next);
                  if (next) track({ name: "jd_mode_opened" });
                  requestAnimationFrame(() => inputRef.current?.focus());
                }}
                aria-pressed={jdMode}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  jdMode
                    ? "border-accent/50 bg-accent/10 text-accent"
                    : "border-line text-mute hover:border-line-strong hover:text-fg"
                }`}
              >
                {jdMode ? <X size={13} aria-hidden /> : <FileText size={13} aria-hidden />}
                {jdMode ? "Exit job description mode" : "Paste a job description"}
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={input.trim().length < 3 || phase === "streaming" || offline}
                aria-label="Submit question"
                className="inline-flex items-center gap-2 rounded-full bg-fg px-4 py-1.5 text-xs font-semibold text-bg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-35"
              >
                {phase === "streaming" ? "Thinking…" : jdMode ? "Evaluate fit" : "Ask"}
                <CornerDownLeft size={13} aria-hidden />
              </button>
            </div>
          </div>
          {offline && (
            <p role="status" className="mt-3 text-xs text-accent">
              You appear to be offline. Reconnect to ask a question.
            </p>
          )}
          {jdMode && (
            <p className="mt-3 text-xs text-faint">
              The full description is analyzed against Itay&rsquo;s verified experience.
              Press {"⌘"}/Ctrl + Enter to submit.
            </p>
          )}
        </motion.div>

        {/* suggested chips */}
        {!jdMode && (
          <motion.ul
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.34 }}
            className="mt-6 flex flex-wrap justify-center gap-2"
            aria-label="Suggested questions"
          >
            {suggestedQuestions.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => {
                    track({ name: "suggested_question_selected", label: q });
                    setInput(q);
                    void ask(q, "question");
                  }}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs text-mute transition-all hover:-translate-y-px hover:border-accent/40 hover:text-fg"
                >
                  {q}
                </button>
              </li>
            ))}
          </motion.ul>
        )}

        {/* shortcuts */}
        <nav aria-label="Topic shortcuts" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {promptShortcuts.map((s) => (
              <li key={s.label}>
                <button
                  type="button"
                  onClick={() => {
                    setJdMode(false);
                    setInput(s.question);
                    void ask(s.question, "question");
                  }}
                  className="text-[11px] font-medium uppercase tracking-[0.18em] text-faint transition-colors hover:text-accent"
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* ------------------------------------------------ answer workspace */}
      <div ref={workspaceRef} className="scroll-mt-24">
        <AnimatePresence>
          {phase !== "idle" && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-3xl px-6 pb-20"
            >
              <div className="rounded-2xl border border-line bg-panel/70 backdrop-blur-sm">
                {/* question header */}
                <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-faint">
                      {meta?.mode === "jd" || jdMode ? "Role fit analysis" : "You asked"}
                    </p>
                    <p className="mt-1 line-clamp-3 text-sm font-medium text-fg">{question}</p>
                  </div>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <RotateCcw size={12} aria-hidden />
                    New question
                  </button>
                </div>

                {/* answer body */}
                <div className="px-6 py-6" aria-live="polite">
                  {phase === "error" ? (
                    <div>
                      <p className="text-sm text-mute">{error}</p>
                      <button
                        type="button"
                        onClick={() => void ask(question, meta?.mode ?? "question")}
                        className="mt-4 rounded-full border border-accent/40 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/10"
                      >
                        Try again
                      </button>
                    </div>
                  ) : answer.length === 0 ? (
                    <div className="space-y-3" aria-label="Generating answer">
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-line" />
                      <div className="h-3.5 w-full animate-pulse rounded bg-line" />
                      <div className="h-3.5 w-2/3 animate-pulse rounded bg-line" />
                    </div>
                  ) : (
                    <div className={phase === "streaming" ? "stream-cursor" : undefined}>
                      <Markdown text={answer} />
                    </div>
                  )}
                </div>

                {/* evidence: related projects */}
                {phase === "done" && relatedCards.length > 0 && (
                  <div className="border-t border-line px-6 py-5">
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-faint">
                      Supporting projects
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {relatedCards.map((p, i) => (
                        <motion.a
                          key={p.slug}
                          href={p.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.07 }}
                          onClick={() => track({ name: "project_viewed", label: p.slug })}
                          className="group rounded-xl border border-line bg-panel-2 p-4 transition-colors hover:border-accent/40"
                        >
                          <p className="flex items-center justify-between text-sm font-semibold text-fg">
                            {p.title}
                            <ArrowUpRight
                              size={14}
                              aria-hidden
                              className="text-faint transition-colors group-hover:text-accent"
                            />
                          </p>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mute">
                            {p.summary}
                          </p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-faint">
                            {p.disciplines.slice(0, 3).join(" · ")}
                          </p>
                        </motion.a>
                      ))}
                    </div>
                  </div>
                )}

                {/* sources + follow-ups + contact */}
                {phase === "done" && meta && (
                  <div className="border-t border-line px-6 py-5">
                    {meta.sources.length > 0 && (
                      <p className="text-xs text-faint">
                        Sources:{" "}
                        {meta.sources.map((s, i) => (
                          <span key={s.url}>
                            {i > 0 && " · "}
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-2 hover:text-mute"
                            >
                              {s.title}
                            </a>
                          </span>
                        ))}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {meta.followUps.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => {
                            setJdMode(false);
                            setInput(q);
                            void ask(q, "question");
                          }}
                          className="rounded-full border border-line px-3 py-1.5 text-xs text-mute transition-colors hover:border-accent/40 hover:text-fg"
                        >
                          {q}
                        </button>
                      ))}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        onClick={() => track({ name: "contact_cta_selected" })}
                        className="ml-auto rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-bg transition-opacity hover:opacity-85"
                      >
                        Let&rsquo;s talk
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
