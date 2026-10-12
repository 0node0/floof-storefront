import { defineMiddleware } from "astro:middleware"
import { utmQueryFromSearchParams } from "@/lib/urls"

export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.utmQuery = utmQueryFromSearchParams(context.url.searchParams)
  return next()
})
