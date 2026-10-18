import { flowerCrownStickerStaticArtUrl } from "./flowerCrownStickerArt"
import { readsStickerStaticArtUrl } from "./readsStickerArt"

/** Git-hosted sticker print art (Reads shelf + flower-crown dogs). */
export function stickerStaticArtUrl(handle: string): string | undefined {
  return (
    readsStickerStaticArtUrl(handle) ??
    flowerCrownStickerStaticArtUrl(handle)
  )
}
