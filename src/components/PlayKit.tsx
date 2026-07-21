import { useEffect, useRef } from "react"
import {
  prefersReducedMotion,
  randomToast,
  spawnBurst,
  spawnToast,
} from "@/lib/play"

/**
 * Site-wide whimsy: button bursts, card tilt, logo multi-click, data-play hooks.
 * Mount once in Layout. No-op when prefers-reduced-motion.
 */
export default function PlayKit() {
  const logoClicks = useRef(0)
  const logoTimer = useRef(0)

  useEffect(() => {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("play-off")
      return
    }
    document.documentElement.classList.add("play-on")

    // ── Primary buttons: click = spark burst ───────────
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      if (!t) return

      const btn = t.closest(".btn, [data-play='burst']") as HTMLElement | null
      if (btn && !btn.hasAttribute("disabled")) {
        const r = btn.getBoundingClientRect()
        spawnBurst({
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          count: 16,
          spread: 90,
        })
      }

      // Logo easter egg
      const logo = t.closest("#site-logo")
      if (logo) {
        logoClicks.current += 1
        logo.classList.remove("play-logo-spin")
        // force reflow
        void (logo as HTMLElement).offsetWidth
        logo.classList.add("play-logo-spin")
        window.clearTimeout(logoTimer.current)
        logoTimer.current = window.setTimeout(() => {
          logoClicks.current = 0
        }, 2000)
        if (logoClicks.current >= 5) {
          logoClicks.current = 0
          const r = logo.getBoundingClientRect()
          spawnBurst({
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            count: 40,
            spread: 140,
          })
          spawnToast("logo party unlocked!", r.left + r.width / 2, r.bottom + 12)
          document.documentElement.classList.add("play-party")
          window.setTimeout(() => document.documentElement.classList.remove("play-party"), 4000)
        } else if (logoClicks.current >= 2) {
          spawnToast(randomToast(), e.clientX, e.clientY - 24)
        }
      }

      // Generic pokeables
      const poke = t.closest("[data-play='poke']") as HTMLElement | null
      if (poke) {
        poke.classList.remove("play-poke")
        void poke.offsetWidth
        poke.classList.add("play-poke")
        spawnBurst({ x: e.clientX, y: e.clientY, count: 10, spread: 60 })
        const msg = poke.dataset.playMsg || randomToast()
        spawnToast(msg, e.clientX, e.clientY - 28)
      }
    }

    // ── Card tilt (3D follow) ──────────────────────────
    let activeCard: HTMLElement | null = null
    const onMove = (e: PointerEvent) => {
      if (activeCard) {
        const r = activeCard.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        activeCard.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`)
        activeCard.style.setProperty("--tilt-y", `${(px * 10).toFixed(2)}deg`)
        activeCard.style.setProperty("--glare-x", `${(px + 0.5) * 100}%`)
        activeCard.style.setProperty("--glare-y", `${(py + 0.5) * 100}%`)
      }
    }
    const onCardEnter = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest(
        ".card-surface, [data-play-tilt]"
      ) as HTMLElement | null
      if (!card) return
      activeCard = card
      card.classList.add("play-tilting")
    }
    const onCardLeave = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest(
        ".card-surface, [data-play-tilt]"
      ) as HTMLElement | null
      if (!card) return
      card.classList.remove("play-tilting")
      card.style.removeProperty("--tilt-x")
      card.style.removeProperty("--tilt-y")
      if (activeCard === card) activeCard = null
    }

    // ── Magnetic pull on primary CTAs (desktop) ────────
    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>(".btn--lg, [data-play='magnet']")
    )
    const magnetHandlers: Array<() => void> = []
    magnets.forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        const dist = Math.hypot(dx, dy)
        if (dist > 100) {
          el.style.removeProperty("--mx")
          el.style.removeProperty("--my")
          return
        }
        el.style.setProperty("--mx", `${(dx * 0.18).toFixed(1)}px`)
        el.style.setProperty("--my", `${(dy * 0.18).toFixed(1)}px`)
      }
      const leave = () => {
        el.style.removeProperty("--mx")
        el.style.removeProperty("--my")
      }
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerleave", leave)
      magnetHandlers.push(() => {
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerleave", leave)
      })
    })

    // ── Mood chips: temporary accent swap ──────────────
    const onMood = (e: Event) => {
      const t = (e.target as HTMLElement).closest("[data-mood]") as HTMLElement | null
      if (!t?.dataset.mood) return
      const root = document.documentElement
      root.dataset.mood = t.dataset.mood
      spawnToast(`mood: ${t.dataset.mood}`, e instanceof MouseEvent ? e.clientX : undefined)
      spawnBurst({
        x: e instanceof MouseEvent ? e.clientX : window.innerWidth / 2,
        y: e instanceof MouseEvent ? e.clientY : 120,
        count: 18,
      })
      // Persist a bit then clear — playful not permanent
      window.setTimeout(() => {
        if (root.dataset.mood === t.dataset.mood) delete root.dataset.mood
      }, 12000)
    }

    document.addEventListener("click", onClick)
    document.addEventListener("pointermove", onMove, { passive: true })
    document.addEventListener("pointerenter", onCardEnter, true)
    document.addEventListener("pointerleave", onCardLeave, true)
    document.addEventListener("click", onMood)

    return () => {
      document.removeEventListener("click", onClick)
      document.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerenter", onCardEnter, true)
      document.removeEventListener("pointerleave", onCardLeave, true)
      document.removeEventListener("click", onMood)
      magnetHandlers.forEach((fn) => fn())
      window.clearTimeout(logoTimer.current)
      document.documentElement.classList.remove("play-on", "play-party")
    }
  }, [])

  return <div id="play-layer" className="play-layer" aria-hidden="true" />
}
