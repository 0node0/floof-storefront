import { readOgBuildIdFromRuntime } from "./buildId"

/** Keep in sync with render.ts PNG cache key segments. Bump when OG output changes. */
export const OG_RENDER_REVISION = {
  product: "v11",
<<<<<<< HEAD
  collection: "v7",
=======
  collection: "v6",
>>>>>>> origin/main
  home: "v2",
  links: "links",
  store: "store",
  default: "default",
} as const

function viteBuildId(): string | undefined {
  const fromPublic = import.meta.env.PUBLIC_OG_BUILD_ID
  if (fromPublic && String(fromPublic).trim().length > 0) {
    const cleaned = String(fromPublic).replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)
    if (cleaned.length > 0 && cleaned !== "dev") return cleaned
  }
  return undefined
}

/** Deploy / build identity for social meta cache busting. */
export function ogBuildHash(): string {
  return readOgBuildIdFromRuntime() ?? viteBuildId() ?? "dev"
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
