import { useEffect, useRef, useState } from "react"
import { useCart } from "@/lib/CartContext"
import { onCartImpact, onCartPulse } from "@/lib/cart-events"

export default function CartBadge() {
  const { itemCount: cartCount, loading } = useCart()
  const [mounted, setMounted] = useState(false)
  const [displayCount, setDisplayCount] = useState(0)
  const [bump, setBump] = useState<"soft" | "mega" | null>(null)
  const [badgePop, setBadgePop] = useState(false)
  const [ring, setRing] = useState(false)
  const prevRef = useRef(0)
  const seeded = useRef(false)
  const pendingCount = useRef<number | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => setMounted(true), [])

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

    const playBump = (mode: "soft" | "mega", count: number) => {
      clearTimers()
      setDisplayCount(count)
      prevRef.current = count
      setBump(null)
      setBadgePop(false)
      setRing(false)
      requestAnimationFrame(() => {
        setBump(mode)
        setBadgePop(true)
        if (mode === "mega") setRing(true)
      })
      timers.current.push(
        window.setTimeout(() => setBump(null), mode === "mega" ? 1100 : 700),
        window.setTimeout(() => setBadgePop(false), mode === "mega" ? 1200 : 900),
        window.setTimeout(() => setRing(false), 900)
      )
    }

    // Optimistic count immediately; save mega dance for fly impact
    const unsubPulse = onCartPulse((detail) => {
      const next = Math.max(0, detail.itemCount)
      if (detail.celebrate) {
        pendingCount.current = next
        // Soft preview: show number early so user sees the update coming
        setDisplayCount(next)
        return
      }
      // Quiet sync (qty change / rollback)
      if (!detail.pending) {
        setDisplayCount(next)
        prevRef.current = next
      }
    })

    // When flying item lands — LOUD badge moment
    const unsubImpact = onCartImpact((detail) => {
      const next = detail.itemCount ?? pendingCount.current ?? prevRef.current
      pendingCount.current = null
      playBump("mega", next)
    })

    return () => {
      unsubPulse()
      unsubImpact()
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
        bump === "mega" ? "cart-badge--mega" : bump === "soft" ? "cart-badge--bump" : ""
      } ${ring ? "cart-badge--ring" : ""}`}
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
          key={`${label}-${badgePop}-${bump || "x"}`}
          className={`cart-badge__count absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-floof-pink text-accent-ink text-[11px] font-bold flex items-center justify-center tabular-nums shadow-sm ${
            badgePop ? (bump === "mega" ? "cart-badge__count--mega" : "cart-badge__count--pop") : ""
          }`}
        >
          {label}
        </span>
      )}
    </a>
  )
}
