/** Southwest Florida native animals in the Florida Floofs collection. */
export const FLORIDA_FLOOF_ANIMALS = [
  { slug: "alligator", label: "American Alligator" },
  { slug: "bottlenose-dolphin", label: "Bottlenose Dolphin" },
  { slug: "brown-pelican", label: "Brown Pelican" },
  { slug: "burrowing-owl", label: "Burrowing Owl" },
  { slug: "florida-panther", label: "Florida Panther" },
  { slug: "gopher-tortoise", label: "Gopher Tortoise" },
  { slug: "loggerhead", label: "Loggerhead Sea Turtle" },
  { slug: "manatee", label: "Manatee" },
  { slug: "river-otter", label: "River Otter" },
  { slug: "roseate-spoonbill", label: "Roseate Spoonbill" },
  { slug: "sandhill-crane", label: "Sandhill Crane" },
  { slug: "snowy-egret", label: "Snowy Egret" },
] as const

export type FloridaFloofAnimalSlug = (typeof FLORIDA_FLOOF_ANIMALS)[number]["slug"]

export const FLORIDA_FLOOFS_COLLECTION_HANDLE = "florida-floofs"

export function floridaFloofStickerHandle(animal: FloridaFloofAnimalSlug): string {
  return `florida-floof-${animal}-sticker`
}

const ANIMAL_FROM_SLUG_RE =
  /^florida-floof-([a-z0-9-]+)-(sticker|tee|mug)$/

export function animalSlugFromProductHandle(
  handle: string
): FloridaFloofAnimalSlug | null {
  const match = handle.match(ANIMAL_FROM_SLUG_RE)
  if (!match) return null
  const slug = match[1]
  return FLORIDA_FLOOF_ANIMALS.some((a) => a.slug === slug)
    ? (slug as FloridaFloofAnimalSlug)
    : null
}

export function isFloridaFloofProductSlug(handle: string): boolean {
  return handle.startsWith("florida-floof-")
}

export function animalLabelForProduct(handle: string): string | null {
  const animal = animalSlugFromProductHandle(handle)
  if (!animal) return null
  return FLORIDA_FLOOF_ANIMALS.find((a) => a.slug === animal)?.label ?? null
}
