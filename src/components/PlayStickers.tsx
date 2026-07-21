import { useCallback, useEffect, useRef, useState } from "react"
import { prefersReducedMotion, randomToast, spawnBurst, spawnToast } from "@/lib/play"

type Sticker = {
  id: string
  label: string
  glyph: string
  msg: string
  x: number
  y: number
  rot: number
  hue: string
}

const INITIAL: Sticker[] = [
  { id: "sun", label: "Sun", glyph: "☀", msg: "too bright!", x: 8, y: 12, rot: -8, hue: "95" },
  { id: "wave", label: "Wave", glyph: "≋", msg: "splash!", x: 88, y: 18, rot: 12, hue: "210" },
  { id: "palm", label: "Palm", glyph: "▲", msg: "shade mode", x: 92, y: 62, rot: 6, hue: "155" },
  { id: "shell", label: "Shell", glyph: "◎", msg: "beach find", x: 6, y: 68, rot: -14, hue: "25" },
  { id: "star", label: "Star", glyph: "✦", msg: "main character", x: 78, y: 78, rot: 20, hue: "45" },
]

/** Hero playground: pokeable / draggable stickers. */
export default function PlayStickers() {
  const [stickers, setStickers] = useState(INITIAL)
  const [off, setOff] = useState(false)
  const drag = useRef<{ id: string; ox: number; oy: number; dragged: boolean } | null>(null)

  useEffect(() => {
    setOff(prefersReducedMotion())
  }, [])

  const poke = useCallback((s: Sticker, clientX: number, clientY: number) => {
    if (prefersReducedMotion()) return
    spawnBurst({
      x: clientX,
      y: clientY,
      count: 14,
      colors: [`oklch(70% 0.16 ${s.hue})`, "oklch(88% 0.16 95)", "oklch(66% 0.21 25)"],
    })
    spawnToast(s.msg || randomToast(), clientX, clientY - 30)
    setStickers((prev) =>
      prev.map((st) =>
        st.id === s.id
          ? { ...st, rot: st.rot + (Math.random() > 0.5 ? 28 : -28) + Math.random() * 16 }
          : st
      )
    )
  }, [])

  if (off) return null

  return (
    <div className="play-stickers" aria-label="Playful stickers — click or drag">
      {stickers.map((s) => (
        <button
          key={s.id}
          type="button"
          className="play-sticker"
          aria-label={`${s.label} sticker — click or drag me`}
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            ["--sticker-hue" as string]: s.hue,
          }}
          onPointerDown={(e) => {
            if (e.button !== 0) return
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { id: s.id, ox: e.clientX, oy: e.clientY, dragged: false }
          }}
          onPointerMove={(e) => {
            if (!drag.current || drag.current.id !== s.id) return
            if (Math.hypot(e.clientX - drag.current.ox, e.clientY - drag.current.oy) > 6) {
              drag.current.dragged = true
            }
            const parent = e.currentTarget.parentElement?.getBoundingClientRect()
            if (!parent) return
            const x = ((e.clientX - parent.left) / parent.width) * 100
            const y = ((e.clientY - parent.top) / parent.height) * 100
            setStickers((prev) =>
              prev.map((st) =>
                st.id === s.id
                  ? {
                      ...st,
                      x: Math.min(96, Math.max(4, x)),
                      y: Math.min(92, Math.max(6, y)),
                    }
                  : st
              )
            )
          }}
          onPointerUp={(e) => {
            if (drag.current?.id === s.id && !drag.current.dragged) {
              poke(s, e.clientX, e.clientY)
            }
            drag.current = null
          }}
        >
          <span className="play-sticker__face" aria-hidden="true">
            {s.glyph}
          </span>
          <span className="play-sticker__label">{s.label}</span>
        </button>
      ))}
      <p className="play-stickers__hint">drag &amp; poke the floaties →</p>
    </div>
  )
}
