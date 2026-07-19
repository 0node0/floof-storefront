import { useEffect, useRef, useState } from "react"
import { emitCartImpact, onCartPulse } from "@/lib/cart-events"

type Particle = {
  id: number
  left: string
  delay: string
  duration: string
  size: string
  hue: string
  shape: "dot" | "rect" | "ribbon" | "star"
  drift: string
  rotate: string
}

const HUES = ["38", "55", "85", "210", "25", "350", "150", "95"]

function makeParticles(n: number, wave = 0): Particle[] {
  const shapes: Particle["shape"][] = ["dot", "rect", "ribbon", "star"]
  return Array.from({ length: n }, (_, i) => ({
    id: wave * 1000 + i,
    left: `${2 + Math.random() * 96}%`,
    delay: `${wave * 0.35 + Math.random() * 0.55}s`,
    duration: `${2.4 + Math.random() * 2.2}s`,
    size: `${5 + Math.random() * 12}px`,
    hue: HUES[i % HUES.length],
    shape: shapes[i % shapes.length],
    drift: `${(Math.random() - 0.5) * 120}px`,
    rotate: `${360 + Math.random() * 720}deg`,
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
  const waveTimer = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
    const onMq = () => setReduceMotion(mq.matches)
    mq.addEventListener("change", onMq)

    let hideTimer = 0
    const unsub = onCartPulse((detail) => {
      if (!detail.celebrate) return
      window.clearTimeout(hideTimer)
      window.clearTimeout(waveTimer.current)

      countRef.current = detail.itemCount
      setName(detail.productName)
      setQty(detail.addedQty ?? 1)
      setFlyDone(false)

      if (!mq.matches) {
        // Wave 1: immediate blast
        setParticles(makeParticles(72, 0))
        // Wave 2: mid celebration refill
        waveTimer.current = window.setTimeout(() => {
          setParticles((prev) => [...prev, ...makeParticles(48, 1)])
        }, 700)
        // Wave 3: encore near the end
        window.setTimeout(() => {
          setParticles((prev) => [...prev, ...makeParticles(36, 2)])
        }, 1800)
      } else {
        setParticles([])
      }

      setOpen(true)

      // Flying item → cart
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

        // Animate on next frame after fly node mounts
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
          const midY = Math.min(start.y, endY) - Math.max(100, Math.abs(start.y - endY) * 0.35)

          el.style.left = "0px"
          el.style.top = "0px"

          const anim = el.animate(
            [
              {
                transform: `translate(${start.x - 36}px, ${start.y - 36}px) scale(1) rotate(-8deg)`,
                opacity: 1,
                offset: 0,
              },
              {
                transform: `translate(${midX - 28}px, ${midY - 28}px) scale(0.85) rotate(12deg)`,
                opacity: 1,
                offset: 0.55,
              },
              {
                transform: `translate(${endX - 14}px, ${endY - 14}px) scale(0.22) rotate(-4deg)`,
                opacity: 0.95,
                offset: 0.92,
              },
              {
                transform: `translate(${endX - 10}px, ${endY - 10}px) scale(0.08) rotate(0deg)`,
                opacity: 0,
                offset: 1,
              },
            ],
            {
              duration: 1100,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "forwards",
            }
          )

          anim.onfinish = () => {
            setFly(null)
            setFlyDone(true)
            emitCartImpact({ itemCount: countRef.current })
            // Cart-impact confetti burst near top-right
            setParticles((prev) => [
              ...prev,
              ...makeParticles(40, 3).map((p) => ({
                ...p,
                left: `${78 + Math.random() * 18}%`,
                delay: "0s",
                duration: `${1.6 + Math.random() * 1.2}s`,
              })),
            ])
          }
        })
      } else {
        emitCartImpact({ itemCount: countRef.current })
        setFlyDone(true)
      }

      // Long hold — loud mode
      hideTimer = window.setTimeout(() => setOpen(false), mq.matches ? 2200 : 5200)
    })

    return () => {
      unsub()
      mq.removeEventListener("change", onMq)
      window.clearTimeout(hideTimer)
      window.clearTimeout(waveTimer.current)
    }
  }, [])

  if (!open && !fly) return null

  return (
    <>
      {/* Flying thumbnail — above everything, even when card open */}
      {fly && !reduceMotion && (
        <div
          ref={flyRef}
          className="cart-fly"
          aria-hidden="true"
          style={{ position: "fixed", zIndex: 400, left: 0, top: 0, willChange: "transform" }}
        >
          <div className="cart-fly__chip">
            {fly.image ? (
              <img src={fly.image} alt="" width={72} height={72} />
            ) : (
              <span className="cart-fly__fallback">✦</span>
            )}
          </div>
          <span className="cart-fly__trail" />
        </div>
      )}

      {open && (
        <div className="cart-celeb cart-celeb--loud" role="status" aria-live="polite" aria-atomic="true">
          <div className="cart-celeb__backdrop" onClick={() => setOpen(false)} />

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
                  height: p.shape === "ribbon" ? `${parseFloat(p.size) * 2.2}px` : p.size,
                  background: `oklch(72% 0.16 ${p.hue})`,
                  ["--drift" as string]: p.drift,
                  ["--spin" as string]: p.rotate,
                } as React.CSSProperties}
              />
            ))}

          <div className={`cart-celeb__card ${flyDone ? "cart-celeb__card--landed" : ""}`}>
            <div className="cart-celeb__burst" aria-hidden="true">
              <svg width="72" height="72" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <path
                  d="M18 29l7 7 13-15"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="cart-celeb__eyebrow">Hell yeah</p>
            <p className="cart-celeb__title">
              {qty > 1 ? `${qty}× in the bag!` : "It's in the bag!"}
            </p>
            {name && <p className="cart-celeb__name">{name}</p>}
            <p className="cart-celeb__hint">
              {flyDone
                ? "Cart updated up top — keep stacking or check out."
                : "Watch it fly into your cart…"}
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
