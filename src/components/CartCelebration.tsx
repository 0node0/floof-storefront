import { useEffect, useRef, useState } from "react"
import { emitCartImpact, onCartPulse } from "@/lib/cart-events"

type Particle = {
  id: number
  left: string
  delay: string
  duration: string
  size: string
  hue: string
  shape: "dot" | "rect"
  drift: string
  rotate: string
}

/** Soft coral / sand / gulf only — no rainbow party */
const HUES = ["32", "40", "85", "220"]

function makeParticles(n: number): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 0.25}s`,
    duration: `${1.8 + Math.random() * 1.2}s`,
    size: `${4 + Math.random() * 6}px`,
    hue: HUES[i % HUES.length],
    shape: i % 3 === 0 ? "rect" : "dot",
    drift: `${(Math.random() - 0.5) * 48}px`,
    rotate: `${180 + Math.random() * 200}deg`,
  }))
}

type FlyState = {
  image?: string
  label: string
  x: number
  y: number
}

export default function CartCelebration() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState<string | undefined>()
  const [qty, setQty] = useState(1)
  const [particles, setParticles] = useState<Particle[]>([])
  const [reduceMotion, setReduceMotion] = useState(false)
  const [fly, setFly] = useState<FlyState | null>(null)
  const [flyDone, setFlyDone] = useState(false)
  const flyRef = useRef<HTMLDivElement>(null)
  const countRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onMq = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onMq)

    const unsub = onCartPulse((detail) => {
      if (!detail.celebrate) return

      countRef.current = detail.itemCount
      setName(detail.productName)
      setQty(detail.addedQty ?? 1)
      setFlyDone(false)

      // One soft wave — not three mega blasts
      setParticles(mq.matches ? [] : makeParticles(22))
      setOpen(true)

      if (!mq.matches) {
        const badge = document.getElementById("cart-badge")
        const start = detail.flyFrom ?? {
          x: window.innerWidth / 2,
          y: window.innerHeight * 0.62,
        }
        setFly({
          image: detail.productImage,
          label: detail.productName || "Item",
          x: start.x,
          y: start.y,
        })

        requestAnimationFrame(() => {
          const el = flyRef.current
          if (!el) {
            emitCartImpact({ itemCount: countRef.current })
            setFlyDone(true)
            return
          }

          const endRect = badge?.getBoundingClientRect()
          const endX = endRect ? endRect.left + endRect.width / 2 : window.innerWidth - 48
          const endY = endRect ? endRect.top + endRect.height / 2 : 48
          const midX = start.x + (endX - start.x) * 0.45
          const midY = Math.min(start.y, endY) - Math.max(80, Math.abs(start.y - endY) * 0.3)

          el.style.left = "0px"
          el.style.top = "0px"

          const anim = el.animate(
            [
              {
                transform: `translate(${start.x - 32}px, ${start.y - 32}px) scale(1)`,
                opacity: 1,
                offset: 0,
              },
              {
                transform: `translate(${midX - 24}px, ${midY - 24}px) scale(0.88)`,
                opacity: 1,
                offset: 0.55,
              },
              {
                transform: `translate(${endX - 12}px, ${endY - 12}px) scale(0.2)`,
                opacity: 0.9,
                offset: 0.92,
              },
              {
                transform: `translate(${endX - 8}px, ${endY - 8}px) scale(0.08)`,
                opacity: 0,
                offset: 1,
              },
            ],
            {
              duration: 900,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            }
          )

          anim.onfinish = () => {
            setFly(null)
            setFlyDone(true)
            emitCartImpact({ itemCount: countRef.current })
          }
        })
      } else {
        emitCartImpact({ itemCount: countRef.current })
        setFlyDone(true)
      }
    })

    return () => {
      unsub()
      mq.removeEventListener("change", onMq)
    }
  }, [])

  if (!open && !fly) return null

  return (
    <>
      {fly && !reduceMotion && (
        <div
          ref={flyRef}
          className="cart-fly"
          aria-hidden="true"
          style={{ position: "fixed", zIndex: 400, left: 0, top: 0, willChange: "transform" }}
        >
          <div className="cart-fly__chip">
            {fly.image ? (
              <img src={fly.image} alt="" width={64} height={64} />
            ) : (
              <span className="cart-fly__fallback">✦</span>
            )}
          </div>
          <span className="cart-fly__trail" />
        </div>
      )}

      {open && (
        <div
          className="cart-celeb"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-celeb-title"
          aria-live="polite"
        >
          <div className="cart-celeb__backdrop" aria-hidden="true" />

          {!reduceMotion &&
            particles.map((p) => (
              <span
                key={p.id}
                className={`cart-celeb__particle cart-celeb__particle--${p.shape}`}
                style={{
                  left: p.left,
                  animationDelay: p.delay,
                  animationDuration: p.duration,
                  width: p.size,
                  height: p.size,
                  background: `oklch(62% 0.12 ${p.hue})`,
                  ["--drift" as string]: p.drift,
                  ["--spin" as string]: p.rotate,
                } as React.CSSProperties}
              />
            ))}

          <div className={`cart-celeb__card ${flyDone ? "cart-celeb__card--landed" : ""}`}>
            <div className="cart-celeb__burst" aria-hidden="true">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="1.75" opacity="0.2" />
                <path
                  d="M18 29l7 7 13-15"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="cart-celeb__eyebrow">Added</p>
            <p id="cart-celeb-title" className="cart-celeb__title">
              {qty > 1 ? `${qty}× in your cart` : "In your cart"}
            </p>
            {name && <p className="cart-celeb__name">{name}</p>}
            <p className="cart-celeb__hint">
              {flyDone
                ? "Checkout when you’re ready — or keep browsing."
                : "Heading to your cart…"}
            </p>
            <div className="cart-celeb__actions">
              <a href="/checkout" className="btn btn--lg">
                View cart
              </a>
              <button type="button" className="btn btn--soft btn--lg" onClick={() => setOpen(false)}>
                Keep shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
