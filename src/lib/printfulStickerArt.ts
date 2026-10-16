const PRINTFUL_VARIANT_CACHE = new Map<number, string | null>()

interface PrintfulSyncVariantFile {
  type?: string
  preview_url?: string
  thumbnail_url?: string
  url?: string
}

export function getPrintfulApiToken(): string {
  const env = globalThis as { process?: { env?: Record<string, string> } }
  const fromProcess = env.process?.env?.PRINTFUL_API_TOKEN
  return (
    fromProcess ||
    (import.meta.env.PRINTFUL_API_TOKEN as string | undefined) ||
    ""
  )
}

/**
 * Print-file preview from Printful sync variant (sticker-only), not Medusa lifestyle mockups.
 */
export async function printfulSyncVariantStickerPreview(
  syncVariantId: number,
  token: string
): Promise<string | null> {
  if (!token) return null
  if (PRINTFUL_VARIANT_CACHE.has(syncVariantId)) {
    return PRINTFUL_VARIANT_CACHE.get(syncVariantId) ?? null
  }

  const res = await fetch(
    `https://api.printful.com/store/variants/${syncVariantId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  )

  if (!res.ok) {
    PRINTFUL_VARIANT_CACHE.set(syncVariantId, null)
    return null
  }

  const body = (await res.json()) as {
    result?: { files?: PrintfulSyncVariantFile[] }
  }
  const files = body.result?.files ?? []
  const defaultFile = files.find((f) => f.type === "default")
  const url =
    defaultFile?.preview_url?.trim() ||
    defaultFile?.thumbnail_url?.trim() ||
    defaultFile?.url?.trim() ||
    null

  PRINTFUL_VARIANT_CACHE.set(syncVariantId, url)
  return url
}
