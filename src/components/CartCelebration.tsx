import { useEffect, useState } from "react"
import { onCartPulse } from "@/lib/cart-events"

type Particle = { id: number; left: string; delay: string; duration: string; size: string; hue: string }

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: `${6 + Math.random() * 88}%`,
    delay: `${Math.random() * 0.25}s`,
    duration: `${0.9 + Math.random() * 0.7}s`,
    size: `${6 + Math.random() * 8}px`,
    hue: ["38", "55", "85", "210", "25"][i % 5],
  }))
}

export default function CartCelebration() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const [particles, setParticles] = useState<Particle[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onMq = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onMq)

    let hideTimer = 0
    const unsub = onCartPulse((detail) => {
      if (!detail.celebrate) return
      window.clearTimeout(hideTimer)
      setName(detail.productName)
      setQty(detail.addedQty ?? 1)
      if (!mq.matches) setParticles(makeParticles(28))
      setOpen(true)
      hideTimer = window.setTimeout(() => setOpen(false), mq.matches ? 1400 : 2200)
    })

    return () => {
      unsub()
      mq.removeEventListener("change", onMq)
      window.clearTimeout(hideTimer)
    }
  }, [])

  if (!open) return null

  return (
    <div
      className="cart-celeb"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="cart-celeb__backdrop" onClick={() => setOpen(false)} />

      {!reduceMotion &&
        particles.map((p) => (
          <span
            key={p.id}
            className="cart-celeb__particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              width: p.size,
              height: p.size,
              background: `oklch(70% 0.14 ${p.hue})`,
            }}
          />
        ))}

      <div className="cart-celeb__card">
        <div className="cart-celeb__burst" aria-hidden="true">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" opacity="0.2" />
            <path
              d="M18 29l7 7 13-15"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="cart-celeb__eyebrow">In the bag</p>
        <p className="cart-celeb__title">
          {qty > 1 ? `${qty}× added!` : "Added!"}
        </p>
        {name && <p className="cart-celeb__name">{name}</p>}
        <p className="cart-celeb__hint">Watch the cart up top — you&rsquo;re stacking vibes.</p>
        <div className="cart-celeb__actions">
          <a href="/checkout" className="btn btn--sm">
            View cart
          </a>
          <button type="button" className="btn btn--soft btn--sm" onClick={() => setOpen(false)}>
            Keep shopping
          </button>
        </div>
      </div>
    </div>
  )
}
