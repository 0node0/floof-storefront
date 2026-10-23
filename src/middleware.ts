import { defineMiddleware } from "astro:middleware"

/** Substrings matched case-insensitively against User-Agent. */
const BOT_UA_PATTERN =
  /twitterbot|facebookexternalhit|pinterest|slackbot|discordbot|bot|crawler|spider|preview/i

const FLOOF_SRC_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 30

function isBotUserAgent(userAgent: string): boolean {
  return BOT_UA_PATTERN.test(userAgent)
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next()
  try {
    const src = context.url.searchParams.get("src")?.trim()
    if (!src) return response

    const hit = {
      src,
      path: context.url.pathname,
      referrer: context.request.headers.get("referer") ?? "",
      timestamp: new Date().toISOString(),
      is_bot: isBotUserAgent(context.request.headers.get("user-agent") ?? ""),
    }
    console.log(`src_hit ${JSON.stringify(hit)}`)

    const cookieValue = `floof_src=${encodeURIComponent(src)}; Max-Age=${FLOOF_SRC_COOKIE_MAX_AGE_SEC}; Path=/; SameSite=Lax`
    const headers = new Headers(response.headers)
    headers.append("Set-Cookie", cookieValue)

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  } catch {
    return response
  }
})
