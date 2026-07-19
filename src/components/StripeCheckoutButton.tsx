import { useState } from "react"
import { createCheckoutSession } from "@/lib/checkout"
import { getCartToken } from "@/lib/medusa"
import Icon from "./Icon"

export default function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleCheckout() {
    const cartId = getCartToken()
    if (!cartId) {
      setErr("Cart is empty")
      return
    }
    setLoading(true)
    setErr(null)
    try {
      const session = await createCheckoutSession(
        cartId,
        window.location.origin + "/order/" + cartId
      )
      window.location.href = session.url
    } catch (e: any) {
      setErr(e.message || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {err && (
        <p className="text-sm text-red-600 flex gap-2 items-start">
          <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{err}</span>
        </p>
      )}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="btn btn--lg w-full"
      >
        <Icon name="lock" className="w-4 h-4" />
        {loading ? "Opening Stripe Checkout…" : "Pay with Stripe"}
      </button>
      <p className="text-xs text-floof-dark/40 text-center">
        Secure checkout powered by Stripe. Your payment info is never stored on our servers.
      </p>
    </div>
  )
}