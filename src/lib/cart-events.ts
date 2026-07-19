/** Cross-island cart signals (Astro islands don't share React context). */

export type CartFlyFrom = {
  x: number
  y: number
}

export type CartPulseDetail = {
  /** Authoritative or optimistic total quantity in cart */
  itemCount: number
  /** How many units just added (for animation intensity) */
  addedQty?: number
  /** Fire celebration overlay + cart icon dance */
  celebrate?: boolean
  /** Optional label for the overlay */
  productName?: string
  /** Product image URL for fly-to-cart thumbnail */
  productImage?: string
  /** Screen coords (viewport) to start the fly path */
  flyFrom?: CartFlyFrom
  /** true while API is in flight with optimistic count */
  pending?: boolean
  /** Second pulse when flying item hits the cart */
  impact?: boolean
}

const EVENT = "floof:cart-pulse"
const IMPACT = "floof:cart-impact"

export function emitCartPulse(detail: CartPulseDetail) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent<CartPulseDetail>(EVENT, { detail }))
}

export function onCartPulse(handler: (detail: CartPulseDetail) => void) {
  if (typeof window === "undefined") return () => {}
  const fn = (e: Event) => {
    handler((e as CustomEvent<CartPulseDetail>).detail)
  }
  window.addEventListener(EVENT, fn)
  return () => window.removeEventListener(EVENT, fn)
}

/** Fired when the flying item lands on the cart icon */
export function emitCartImpact(detail: { itemCount: number }) {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(IMPACT, { detail }))
}

export function onCartImpact(handler: (detail: { itemCount: number }) => void) {
  if (typeof window === "undefined") return () => {}
  const fn = (e: Event) => {
    handler((e as CustomEvent<{ itemCount: number }>).detail)
  }
  window.addEventListener(IMPACT, fn)
  return () => window.removeEventListener(IMPACT, fn)
}
