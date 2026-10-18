import sharp from "sharp"

const WHITE_CHANNEL = 238

function isContentPixel(
  r: number,
  g: number,
  b: number,
  a: number
): boolean {
  if (a < 20) return false
  return r < WHITE_CHANNEL || g < WHITE_CHANNEL || b < WHITE_CHANNEL
}

/** Crop to non-transparent, non–near-white pixels (sticker art vs matte padding). */
/** Make sticker sheet white matte transparent so art sits on the OG theme background. */
export async function knockOutNearWhiteMatte(
  input: Buffer,
  threshold = 242
): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  for (let i = 0; i < width * height; i++) {
    const o = i * channels
    const r = data[o]
    const g = data[o + 1]
    const b = data[o + 2]
    if (r >= threshold && g >= threshold && b >= threshold) {
      data[o + 3] = 0
    }
  }

  return sharp(data, { raw: { width, height, channels } }).png().toBuffer()
}

/** Shrink opaque alpha inward to soften jagged die-cut halos (1–2px erosion). */
export async function erodeAlphaEdge(
  input: Buffer,
  radius = 2
): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  const alpha = new Uint8Array(width * height)
  for (let i = 0; i < width * height; i++) {
    alpha[i] = data[i * channels + 3]
  }

  const eroded = new Uint8Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minA = 255
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx
          const ny = y + dy
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            minA = 0
            continue
          }
          minA = Math.min(minA, alpha[ny * width + nx])
        }
      }
      eroded[y * width + x] = minA
    }
  }

  for (let i = 0; i < width * height; i++) {
    data[i * channels + 3] = eroded[i]
  }

  return sharp(data, { raw: { width, height, channels } })
    .png()
    .toBuffer()
}

export async function trimAlphaBounds(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const a = data[i + 3]
      if (a < 20) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (maxX < minX || maxY < minY) return input

  const cropW = maxX - minX + 1
  const cropH = maxY - minY + 1
  if (cropW === width && cropH === height) return input

  return sharp(input)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toBuffer()
}

export async function trimContentPadding(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { width, height, channels } = info
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (!isContentPixel(r, g, b, a)) continue
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
  }

  if (maxX < minX || maxY < minY) {
    return input
  }

  const cropW = maxX - minX + 1
  const cropH = maxY - minY + 1
  if (cropW === width && cropH === height) {
    return input
  }

  return sharp(input)
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .png()
    .toBuffer()
}
