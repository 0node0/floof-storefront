import { useEffect, useRef, useState } from "react"
import { useCart } from "@/lib/CartContext"
import { onCartPulse } from "@/lib/cart-events"

export default function CartBadge() {
  const { itemCount: cartCount, loading } = useCart()
  const [mounted, setMounted] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [bump, setBump] = useState(false)
  const [badgePop, setBadgePop] = useState(false)
  const prevRef = useRef(0)
  const seeded = useRef(false)
  const timers = useRef<number[]>([])

  useEffect(() => setMounted(true), [])

  // One-time seed from this island's cart fetch only.
  // Cross-island adds update via cart-pulse events (not shared React state).
  useEffect(() => {
    if (loading || seeded.current) return
    seeded.current = true
    setDisplayCount(cartCount)
    prevRef.current = cartCount
  }, [cartCount, loading])

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }

    const unsub = onCartPulse((detail) => {
      const next = Math.max(0, detail.itemCount)
      const grew = next > prevRef.current || Boolean(detail.celebrate && (detail.addedQty ?? 0) > 0)

      setDisplayCount(next)
      prevRef.current = next

      if (grew || detail.celebrate) {
        clearTimers()
        setBump(false)
        setBadgePop(false)
        requestAnimationFrame(() => {
          setBump(true)
          setBadgePop(true)
        })
        timers.current.push(
          window.setTimeout(() => setBump(false), 700),
          window.setTimeout(() => setBadgePop(false), 900)
        )
      }
    })

    return () => {
      unsub()
      clearTimers()
    }
  }, [])

  const showBadge = mounted && displayCount > 0
  const label = displayCount > 99 ? "99+" : String(displayCount)

  return (
    <a
      href="/checkout"
      id="cart-badge"
      data-cart-count={displayCount}
      className={`cart-badge relative flex items-center justify-center w-10 h-10 rounded-full text-floof-dark/75 hover:text-floof-pink hover:bg-floof-sand/80 transition-colors ${
        bump ? "cart-badge--bump" : ""
      }`}
      aria-label={`Cart with ${displayCount} item${displayCount === 1 ? "" : "s"}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="cart-badge__icon"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {showBadge && (
        <span
          key={`${label}-${badgePop}`}
          className={`cart-badge__count absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-floof-pink text-accent-ink text-[11px] font-bold flex items-center justify-center tabular-nums shadow-sm ${
            badgePop ? "cart-badge__count--pop" : ""
          }`}
        >
          {label}
        </span>
      )}
    </a>
  )
}
