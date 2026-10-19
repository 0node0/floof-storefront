import type { FloridaFloofAnimalSlug } from "@/lib/floridaFloofs"
import { floridaFloofStaticArtByAnimal } from "@/lib/floridaFloofStickerArt"
import { loadImageDataUrl } from "./images"
import { prepareOgProductArt } from "./prepareArt"

/** Iconic trio for collection OG when Medusa has no products yet (matches Dogs 3-up grid). */
export const FLORIDA_FLOOF_OG_ANIMALS: FloridaFloofAnimalSlug[] = [
  "manatee",
  "roseate-spoonbill",
  "florida-panther",
]

export async function floridaFloofStaticCollectionThumbs(): Promise<string[]> {
  const thumbs: string[] = []
  for (const animal of FLORIDA_FLOOF_OG_ANIMALS) {
    const url = floridaFloofStaticArtByAnimal(animal)
    const prepared = await prepareOgProductArt(url, { forceTrim: true })
    const dataUrl = prepared?.dataUrl ?? (await loadImageDataUrl(url))
    if (dataUrl) thumbs.push(dataUrl)
  }
  return thumbs
}
