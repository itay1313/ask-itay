// Single editable source of truth for contact and site values.
export const siteConfig = {
  name: "Itay Haephrati",
  siteName: "Ask Itay",
  tagline: "Don't read my CV. Ask it.",
  description:
    "An AI-powered professional interview. Ask about Itay Haephrati's experience, projects, design systems, frontend work, AI, and leadership — or paste a job description to see how he fits.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ask-itay.vercel.app",
  portfolio: "https://itaycode.com/",
  linkedin: "https://www.linkedin.com/in/itayhaephrati/",
  github: "https://github.com/itay1313",
  x: "https://x.com/itaycode",
  codepen: "https://codepen.io/itayko",
  email: "Itaycode@gmail.com",
  // Served from /public. Drop a PDF in content/cv and run `npm run sync-profile`
  // to copy it here; until then the header falls back to LinkedIn.
  cvPath: "/cv.pdf",
  signals: ["13+ years", "Design", "Frontend", "Systems", "AI", "Leadership"],
} as const;

export const suggestedQuestions = [
  "Would Itay fit a Design Engineer role?",
  "Show me proof of his frontend experience",
  "What has he built with AI?",
  "Can he lead a design system?",
  "Which project best represents his work?",
  "What makes him different from a regular frontend developer?",
  "Summarize his experience in 30 seconds",
  "Why should we interview him?",
] as const;

export const promptShortcuts = [
  { label: "Experience", question: "Walk me through Itay's professional experience." },
  { label: "Projects", question: "Which projects has Itay shipped, and what did he do on each?" },
  { label: "Stack", question: "What is Itay's technical stack?" },
  { label: "Leadership", question: "What leadership and mentoring experience does Itay have?" },
  { label: "Design systems", question: "What is Itay's design systems experience?" },
  { label: "AI work", question: "What has Itay built with AI and automation?" },
  { label: "Role fit", question: "What roles is Itay the strongest fit for?" },
] as const;
