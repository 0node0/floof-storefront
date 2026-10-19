import { floridaFloofStickerStaticArtUrl } from "./floridaFloofStickerArt"
import { flowerCrownStickerStaticArtUrl } from "./flowerCrownStickerArt"
import { readsStickerStaticArtUrl } from "./readsStickerArt"

/** Git-hosted sticker print art (Reads, flower-crown dogs, Florida Floofs). */
export function stickerStaticArtUrl(handle: string): string | undefined {
  return (
    readsStickerStaticArtUrl(handle) ??
    flowerCrownStickerStaticArtUrl(handle) ??
    floridaFloofStickerStaticArtUrl(handle)
  )
}
