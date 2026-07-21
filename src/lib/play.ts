/** Whimsical interaction helpers (no audio, reduced-motion aware). */

export function prefersReducedMotion() {
  if (typeof window === "undefined") return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export type BurstOpts = {
  x: number
  y: number
  count?: number
  colors?: string[]
  spread?: number
}

const DEFAULT_COLORS = [
  "oklch(66% 0.21 25)",
  "oklch(88% 0.16 95)",
  "oklch(68% 0.13 210)",
  "oklch(78% 0.13 155)",
  "oklch(72% 0.18 45)",
]

/** Spawn short-lived confetti/spark dots at a viewport point */
export function spawnBurst({
  x,
  y,
  count = 14,
  colors = DEFAULT_COLORS,
  spread = 80,
}: BurstOpts) {
  if (prefersReducedMotion()) return
  const root = document.getElementById("play-layer")
  if (!root) return

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span")
    el.className = "play-spark"
    el.setAttribute("aria-hidden", "true")
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const dist = spread * (0.35 + Math.random() * 0.65)
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist - 20
    const size = 5 + Math.random() * 7
    const color = colors[i % colors.length]
    el.style.cssText = `
      left:${x}px;top:${y}px;width:${size}px;height:${size}px;
      background:${color};--dx:${dx}px;--dy:${dy}px;
      border-radius:${Math.random() > 0.5 ? "999px" : "2px"};
      animation-duration:${0.55 + Math.random() * 0.45}s;
    `
    root.appendChild(el)
    window.setTimeout(() => el.remove(), 1100)
  }
}

export function spawnToast(message: string, x?: number, y?: number) {
  if (prefersReducedMotion()) return
  const root = document.getElementById("play-layer")
  if (!root) return
  const el = document.createElement("div")
  el.className = "play-toast"
  el.textContent = message
  el.setAttribute("role", "status")
  const left = x ?? window.innerWidth / 2
  const top = y ?? window.innerHeight * 0.35
  el.style.left = `${left}px`
  el.style.top = `${top}px`
  root.appendChild(el)
  window.setTimeout(() => el.remove(), 1400)
}

const TOASTS = [
  "boop!",
  "nice!",
  "more sun!",
  "floofed!",
  "gulf vibes!",
  "that's the stuff",
  "chaos mode",
  "swfl energy",
  "keep poking",
]

export function randomToast() {
  return TOASTS[Math.floor(Math.random() * TOASTS.length)]
}
