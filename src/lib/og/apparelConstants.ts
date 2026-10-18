/** Max share of 800×800 canvas for trimmed apparel art (above = lifestyle mockup). */
export const APPAREL_OG_MAX_COVERAGE = 0.2

export const APPAREL_OG_CANVAS_PIXELS = 800 * 800

export function apparelOgCoverage(
  width: number,
  height: number
): number {
  return (width * height) / APPAREL_OG_CANVAS_PIXELS
}

export function isAcceptableApparelOgArt(
  width: number,
  height: number
): boolean {
  return apparelOgCoverage(width, height) <= APPAREL_OG_MAX_COVERAGE
}
