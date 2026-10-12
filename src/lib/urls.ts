const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

/** Query string with only UTM params, e.g. `?utm_source=ig` or empty. */
export function utmQueryFromSearchParams(params: URLSearchParams): string {
  const pairs: string[] = []
  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }
  return pairs.length ? `?${pairs.join("&")}` : ""
}

/** Append preserved UTM params to an internal path (merges with existing query). */
export function withUtm(href: string, utmQuery: string): string {
  if (!utmQuery) return href
  const utmPart = utmQuery.startsWith("?") ? utmQuery.slice(1) : utmQuery
  if (!utmPart) return href

  const hashIdx = href.indexOf("#")
  const pathAndQuery = hashIdx === -1 ? href : href.slice(0, hashIdx)
  const hash = hashIdx === -1 ? "" : href.slice(hashIdx)

  if (pathAndQuery.includes("?")) {
    return `${pathAndQuery}&${utmPart}${hash}`
  }
  return `${pathAndQuery}?${utmPart}${hash}`
}
