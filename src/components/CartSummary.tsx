import { useEffect, useState } from "react"
import { useCart } from "@/lib/CartContext"
import {
  formatPrice,
  updateCartItem as apiUpdate,
  removeFromCart as apiRemove,
} from "@/lib/medusa"
import StripeCheckoutButton from "./StripeCheckoutButton"
import ErrorBoundary from "./ErrorBoundary"
import Icon from "./Icon"

const FREE_SHIP_THRESHOLD_CENTS = 7500

export default function CartSummary() {
  const { cart, loading, error, refreshCart } = useCart()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    refreshCart()
  }, [])

  async function handleQty(lineItemId: string, qty: number) {
    if (!cart) return
    setErr(null)
    try {
      if (qty < 1) {
        await apiRemove(cart.id, lineItemId)
      } else {
        await apiUpdate(cart.id, lineItemId, qty)
      }
      await refreshCart()
    } catch (e: any) {
      setErr(e.message)
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-floof-dark/5">
        <div className="w-8 h-8 border-2 border-floof-pink border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-floof-dark/60">Loading cart…</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-floof-dark/5">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-floof-sand text-floof-dark mb-4">
          <Icon name="cart" size={28} className="w-7 h-7" />
        </span>
        <h2 className="text-xl font-bold text-floof-dark">Your cart is empty</h2>
        <p className="mt-2 text-sm text-floof-dark/50">Find something loud for the weekend.</p>
        <a
          href="/store"
          className="mt-6 inline-flex rounded-full bg-floof-pink px-8 py-3 text-sm font-semibold text-white hover:bg-floof-coral"
        >
          Browse products
        </a>
      </div>
    )
  }

  const subtotal = cart.subtotal ?? cart.items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD_CENTS - subtotal)
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIP_THRESHOLD_CENTS) * 100))

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {err && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600 flex gap-2 items-start">
            <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{err}</span>
          </div>
        )}
        {error && (
          <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-600 flex gap-2 items-start">
            <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-2xl bg-floof-mint/30 px-5 py-4 ring-1 ring-floof-mint/40">
          {remaining > 0 ? (
            <p className="text-sm text-floof-dark/80">
              You&apos;re <strong className="text-floof-dark">{formatPrice(remaining, cart.currency_code)}</strong>{" "}
              away from <strong className="text-floof-dark">free shipping</strong>
            </p>
          ) : (
            <p className="text-sm font-medium text-floof-dark inline-flex items-center gap-2">
              <Icon name="check" className="w-4 h-4 text-floof-pink" />
              You&apos;ve unlocked free US shipping
            </p>
          )}
          <div className="mt-2 h-2 rounded-full bg-white/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-floof-pink transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-floof-dark/5">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-4 border-b border-floof-dark/5 last:border-0"
            >
              <div className="w-16 h-16 rounded-xl bg-floof-sand flex items-center justify-center shrink-0 overflow-hidden text-floof-dark/40">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    width={64}
                    height={64}
                  />
                ) : (
                  <Icon name="shirt" className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-floof-dark truncate">{item.title}</p>
                <p className="text-sm text-floof-dark/50 truncate">
                  {item.variant?.options?.map((o) => o.value).join(" / ")}
                </p>
                <button
                  type="button"
                  onClick={() => handleQty(item.id, 0)}
                  className="mt-1 text-xs text-floof-dark/40 hover:text-red-500 underline"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink"
                  aria-label={`Decrease quantity of ${item.title}`}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink"
                  aria-label={`Increase quantity of ${item.title}`}
                >
                  +
                </button>
              </div>
              <p className="font-semibold w-20 text-right shrink-0">
                {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-floof-dark/5">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal, cart.currency_code)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>
                {remaining === 0
                  ? "Free"
                  : cart.shipping_total
                    ? formatPrice(cart.shipping_total, cart.currency_code)
                    : "Calculated at checkout"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>
                {cart.tax_total
                  ? formatPrice(cart.tax_total, cart.currency_code)
                  : "At checkout"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t border-floof-dark/10">
              <span>Total</span>
              <span>{formatPrice(cart.total || cart.subtotal, cart.currency_code)}</span>
            </div>
          </div>
          <StripeCheckoutButton />
          <p className="mt-3 text-center text-[11px] text-floof-dark/35">
            By checking out you agree to our{" "}
            <a href="/terms" className="underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </ErrorBoundary>
  )
}
