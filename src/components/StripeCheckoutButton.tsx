import { useState } from "react"
import { createCheckoutSession } from "@/lib/checkout"
import { getCartToken } from "@/lib/medusa"

export default function StripeCheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function handleCheckout() {
    const cartId = getCartToken()
    if (!cartId) { setErr("Cart is empty"); return }
    setLoading(true); setErr(null)
    try {
      const session = await createCheckoutSession(cartId, window.location.origin + "/order/" + cartId)
      window.location.href = session.url
    } catch (e: any) { setErr(e.message || "Checkout failed") } finally { setLoading(false) }
  }

  return (
    <div className="space-y-3">
      {err && <p className="text-sm text-red-600">⚠️ {err}</p>}
      <button onClick={handleCheckout} disabled={loading} className="w-full rounded-full bg-floof-pink py-4 text-base font-semibold text-white hover:bg-floof-coral transition-colors disabled:opacity-50">
        {loading ? "Opening Stripe Checkout…" : "Pay with Stripe"}
      </button>
      <p className="text-xs text-floof-dark/40 text-center">Secure checkout powered by Stripe. Your payment info is never stored on our servers.</p>
    </div>
  )
}