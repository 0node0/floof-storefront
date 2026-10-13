import { useState } from "react"

export default function DeskMuteCoffee() {
  const [coffee, setCoffee] = useState(false)

  return (
    <button
      type="button"
      className={`collection-desk-mute ${coffee ? "is-coffee" : ""}`}
      onClick={() => setCoffee((v) => !v)}
      aria-pressed={coffee}
      aria-label={coffee ? "Switch to muted microphone" : "Switch to coffee break"}
    >
      <span className="collection-desk-mute__icons" aria-hidden="true">
        <img
          className="collection-desk-mute__icon-off"
          src="/collections/desk/mute-icon.svg"
          alt=""
          width={28}
          height={28}
        />
        <img
          className="collection-desk-mute__icon-on"
          src="/collections/desk/coffee-cup.svg"
          alt=""
          width={28}
          height={28}
        />
      </span>
      <span className="collection-desk-mute__text">
        <span className="collection-desk-mute__t1">You are on mute</span>
        <span className="collection-desk-mute__t2">Still on mute, still drinking coffee</span>
      </span>
    </button>
  )
}
