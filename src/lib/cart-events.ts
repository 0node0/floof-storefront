/** Cross-island cart signals (Astro islands don't share React context). */

export type CartPulseDetail = {
  /** Authoritative or optimistic total quantity in cart */
  itemCount: number
  /** How many units just added (for animation intensity) */
  addedQty?: number
  /** Fire celebration overlay + cart icon dance */
  celebrate?: boolean
  /** Optional label for the overlay */
  productName?: string
  /** true while API is in flight with optimistic count */
  pending?: boolean
}

const EVENT = "floof:cart-pulse"

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
