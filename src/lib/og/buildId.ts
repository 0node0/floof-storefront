/** Sanitize deploy id for ?v= query tokens. */
export function sanitizeOgBuildId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)
}

/**
 * Resolve deploy SHA at request time (Railway injects RAILWAY_GIT_COMMIT_SHA in the container).
 * Falls back to Vite-injected PUBLIC_OG_BUILD_ID from astro build.
 */
export function readOgBuildIdFromRuntime(): string | undefined {
  if (typeof process === "undefined" || !process.env) return undefined

  const candidates = [
    process.env.PUBLIC_OG_BUILD_ID,
    process.env.RAILWAY_GIT_COMMIT_SHA,
    process.env.GIT_COMMIT_SHA,
    process.env.GITHUB_SHA,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.CF_PAGES_COMMIT_SHA,
  ]

  for (const value of candidates) {
    if (value && String(value).trim().length > 0) {
      return sanitizeOgBuildId(String(value))
    }
  }
  return undefined
}
