"use client";

// Privacy-safe product analytics, prepared but disabled until configured.
// Set NEXT_PUBLIC_ANALYTICS_ENABLED=true and wire `send` to your provider
// (Vercel Analytics, Plausible, etc.). No question text or personal data is
// ever tracked — only event names and coarse labels.

export type AnalyticsEvent =
  | { name: "suggested_question_selected"; label?: string }
  | { name: "question_submitted" }
  | { name: "jd_mode_opened" }
  | { name: "project_viewed"; label?: string }
  | { name: "contact_cta_selected" }
  | { name: "cv_download_selected" };

const enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

export function track(event: AnalyticsEvent): void {
  if (!enabled) return;
  try {
    // Replace with your analytics provider call, e.g.:
    // window.va?.("event", { name: event.name, label: event.label });
    if (process.env.NODE_ENV === "development") {
      console.debug("[analytics]", event.name, "label" in event ? event.label : "");
    }
  } catch {
    // Analytics must never break the product.
  }
}
