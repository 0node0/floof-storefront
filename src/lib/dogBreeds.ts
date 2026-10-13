import type { FloofProduct } from "./product"

export const DOG_BREED_CHIPS = [
  "All breeds",
  "Labrador",
  "Pit Bull",
  "Husky",
  "Beagle",
  "Aussie",
  "Dachshund",
  "Greyhound",
  "Shih Tzu",
] as const

export type DogBreedChip = (typeof DOG_BREED_CHIPS)[number]

const SLUG_BREED: Record<string, DogBreedChip> = {
  "floof-will-work-for-ball-labrador-mug": "Labrador",
  "floof-will-work-for-ball-sticker": "Labrador",
  "floof-professional-snuggler-mug": "Pit Bull",
  "floof-professional-snuggler-sticker": "Pit Bull",
  "floof-has-opinions-loudly-mug": "Husky",
  "floof-has-opinions-loudly-sticker": "Husky",
  "floof-nose-first-questions-never-mug": "Beagle",
  "floof-nose-first-questions-never-sticker": "Beagle",
  "floof-i-will-herd-your-kids-mug": "Aussie",
  "floof-i-will-herd-your-kids-sticker": "Aussie",
  "floof-one-dog-long-mug": "Dachshund",
  "floof-one-dog-long-sticker": "Dachshund",
  "floof-45-mph-couch-potato-mug": "Greyhound",
  "floof-45-mph-couch-potato-sticker": "Greyhound",
  "floof-shh-tzu-mug": "Shih Tzu",
  "floof-shh-tzu-sticker": "Shih Tzu",
}

const NAME_HINTS: Array<{ match: RegExp; breed: DogBreedChip }> = [
  { match: /labrador|work for ball/i, breed: "Labrador" },
  { match: /snuggler|pittie|pit bull/i, breed: "Pit Bull" },
  { match: /husky|opinions.*loudly/i, breed: "Husky" },
  { match: /beagle|nose first/i, breed: "Beagle" },
  { match: /herd your kids|aussie|merle/i, breed: "Aussie" },
  { match: /one dog long|dachshund|wiener/i, breed: "Dachshund" },
  { match: /greyhound|couch potato|45 mph/i, breed: "Greyhound" },
  { match: /shh-tzu|shih tzu/i, breed: "Shih Tzu" },
]

export function breedForProduct(product: FloofProduct): DogBreedChip | null {
  const fromSlug = SLUG_BREED[product.slug]
  if (fromSlug) return fromSlug
  for (const { match, breed } of NAME_HINTS) {
    if (match.test(product.name) || match.test(product.slug)) return breed
  }
  return null
}

export function filterByBreed(
  products: FloofProduct[],
  breedParam: string
): FloofProduct[] {
  if (!breedParam || breedParam === "all") return products
  const label = decodeURIComponent(breedParam)
  const chip = DOG_BREED_CHIPS.find(
    (b) => b.toLowerCase() === label.toLowerCase()
  )
  if (!chip || chip === "All breeds") return products
  return products.filter((p) => breedForProduct(p) === chip)
}

export function breedChipSlug(chip: DogBreedChip): string {
  if (chip === "All breeds") return "all"
  return encodeURIComponent(chip)
}
