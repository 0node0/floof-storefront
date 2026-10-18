/** Keep in sync with render.ts PNG cache key segments. Bump when OG output changes. */
export const OG_RENDER_REVISION = {
  product: "v10",
  collection: "v6",
  home: "v2",
  links: "links",
  store: "store",
  default: "default",
} as const

function envBuildId(): string | undefined {
  const candidates = [
    import.meta.env.PUBLIC_OG_BUILD_ID,
    import.meta.env.PUBLIC_VERCEL_GIT_COMMIT_SHA,
    import.meta.env.VERCEL_GIT_COMMIT_SHA,
    import.meta.env.CF_PAGES_COMMIT_SHA,
    import.meta.env.RAILWAY_GIT_COMMIT_SHA,
  ]
  for (const value of candidates) {
    if (value && String(value).length > 0) {
      return String(value).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)
    }
  }
  return undefined
}

/** Deploy / build identity for social meta cache busting. */
export function ogBuildHash(): string {
  return envBuildId() ?? "dev"
}

export function ogVersionToken(...parts: Array<string | number | undefined>): string {
  return parts
    .filter((p) => p !== undefined && p !== "")
    .map((p) => String(p))
    .join("-")
}

export function contentRevisionStamp(iso?: string): string {
  if (!iso) return "0"
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return "0"
  return Math.floor(ms / 1000).toString(36)
}
