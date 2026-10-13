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
      <span className="collection-desk-mute__icon" aria-hidden="true">
        {coffee ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M6 8h12v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
            <path d="M18 10h2a2 2 0 0 1 0 4h-2" />
            <path d="M7 3c1 2 2 3 4 3s3-1 4-3" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75">
            <path d="M12 3a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z" />
            <path d="M8 14v1a4 4 0 0 0 8 0v-1" />
            <path d="M12 19v3" />
            <path d="M4 4l16 16" />
          </svg>
        )}
      </span>
      <span className="collection-desk-mute__label">
        {coffee ? "Coffee mode" : "Muted"}
      </span>
    </button>
  )
}
