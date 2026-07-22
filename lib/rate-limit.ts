import "server-only";

// Simple in-memory sliding-window rate limiter. Good enough for a single
// serverless instance / low-traffic portfolio; swap for Upstash or similar
// if traffic grows.
const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 20;

const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const timestamps = (hits.get(key) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfterSeconds };
  }

  timestamps.push(now);
  hits.set(key, timestamps);

  // Opportunistic cleanup so the map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => t <= windowStart)) hits.delete(k);
    }
  }
  return { ok: true, retryAfterSeconds: 0 };
}
