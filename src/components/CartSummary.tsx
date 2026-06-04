import { useEffect, useState } from "react"
import { useCart } from "@/lib/CartContext"
import { formatPrice, getCart, updateCartItem as apiUpdate, removeFromCart as apiRemove, getCartToken, clearCart as apiClear } from "@/lib/medusa"
import StripeCheckoutButton from "./StripeCheckoutButton"
import ErrorBoundary from "./ErrorBoundary"

export default function CartSummary() {
  const { cart, loading, error, refreshCart } = useCart()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => { refreshCart() }, [])

  async function handleQty(lineItemId: string, qty: number) {
    if (!cart) return; setErr(null)
    try {
      if (qty < 1) { const r = await apiRemove(cart.id, lineItemId); await refreshCart() }
      else { const r = await apiUpdate(cart.id, lineItemId, qty); await refreshCart() }
    } catch (e: any) { setErr(e.message) }
  }

  if (loading) return <div className="rounded-3xl bg-white p-10 text-center shadow-sm"><div className="w-8 h-8 border-2 border-floof-pink border-t-transparent rounded-full animate-spin mx-auto" /><p className="mt-4 text-floof-dark/60">Loading cart…</p></div>

  if (!cart || cart.items.length === 0) return (
    <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
      <p className="text-4xl mb-4">🛒</p>
      <h2 className="text-xl font-bold text-floof-dark">Your cart is empty</h2>
      <a href="/store" className="mt-4 inline-block text-floof-pink underline">Browse products</a>
    </div>
  )

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {err && <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600">⚠️ {err}</div>}
        {error && <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600">⚠️ {error}</div>}

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          {cart.items.map(item => (
            <div key={item.id} className="flex items-center gap-4 py-4 border-b border-floof-dark/5 last:border-0">
              <div className="w-16 h-16 rounded-xl bg-floof-sand flex items-center justify-center shrink-0">
                {item.thumbnail ? <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" width={64} height={64} /> : <span className="text-xl">👕</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-floof-dark truncate">{item.title}</p>
                <p className="text-sm text-floof-dark/50 truncate">{item.variant?.options?.map(o => o.value).join(" / ")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink">−</button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button onClick={() => handleQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink">+</button>
              </div>
              <p className="font-semibold w-20 text-right shrink-0">{formatPrice(item.unit_price * item.quantity, cart.currency_code)}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(cart.subtotal, cart.currency_code)}</span></div>
            <div className="flex justify-between text-sm"><span>Shipping</span><span>{formatPrice(cart.shipping_total, cart.currency_code)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax</span><span>{formatPrice(cart.tax_total, cart.currency_code)}</span></div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-floof-dark/10"><span>Total</span><span>{formatPrice(cart.total, cart.currency_code)}</span></div>
          </div>
          <StripeCheckoutButton />
        </div>
      </div>
    </ErrorBoundary>
  )
}