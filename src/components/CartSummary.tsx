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
      <div className="border-[3px] border-ink bg-paper-2 p-10 text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent animate-spin mx-auto" />
        <p className="mt-4 text-ink-2">Loading cart…</p>
      </div>
    )
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="border-[3px] border-ink bg-paper-2 p-10 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-accent text-accent-ink mb-4">
          <Icon name="cart" size={28} className="w-7 h-7" />
        </span>
        <h2 className="font-display text-xl text-ink">Your cart is empty</h2>
        <p className="mt-2 text-sm text-ink-2 normal-case tracking-normal font-normal">
          Find something with a line that lands.
        </p>
        <a href="/store" className="btn mt-6">
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
      <div className="space-y-0">
        {err && (
          <div className="border-[3px] border-accent bg-paper p-4 text-sm text-accent flex gap-2 items-start mb-4">
            <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{err}</span>
          </div>
        )}
        {error && (
          <div className="border-[3px] border-accent bg-paper p-4 text-sm text-accent flex gap-2 items-start mb-4">
            <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="border-[3px] border-ink bg-paper-2 px-5 py-4 mb-0">
          {remaining > 0 ? (
            <p className="text-sm text-ink-2 normal-case tracking-normal font-normal">
              You&apos;re{" "}
              <strong className="text-ink">{formatPrice(remaining, cart.currency_code)}</strong>{" "}
              away from <strong className="text-ink">free shipping</strong>
            </p>
          ) : (
            <p className="text-sm font-medium text-ink inline-flex items-center gap-2 uppercase tracking-wide">
              <Icon name="check" className="w-4 h-4 text-accent" />
              Free US shipping unlocked
            </p>
          )}
          <div className="mt-2 h-2 border border-ink bg-paper overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="border-[3px] border-t-0 border-ink bg-paper">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 border-b-[3px] border-ink last:border-0"
            >
              <div className="w-16 h-16 border-[2px] border-ink bg-cream flex items-center justify-center shrink-0 overflow-hidden text-paper">
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
                <p className="font-semibold text-ink truncate uppercase tracking-wide text-sm">
                  {item.title}
                </p>
                <p className="text-sm text-ink-2 truncate normal-case tracking-normal font-normal">
                  {item.variant?.options?.map((o) => o.value).join(" / ")}
                </p>
                <button
                  type="button"
                  onClick={() => handleQty(item.id, 0)}
                  className="mt-1 text-xs text-muted hover:text-accent underline uppercase tracking-wider"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-0 border-[2px] border-ink">
                <button
                  type="button"
                  onClick={() => handleQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-accent hover:text-accent-ink border-r-[2px] border-ink"
                  aria-label={`Decrease quantity of ${item.title}`}
                >
                  −
                </button>
                <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-accent hover:text-accent-ink border-l-[2px] border-ink"
                  aria-label={`Increase quantity of ${item.title}`}
                >
                  +
                </button>
              </div>
              <p className="font-semibold w-20 text-right shrink-0 text-accent tabular-nums">
                {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-[3px] border-t-0 border-ink bg-paper-2 p-6">
          <div className="space-y-2 mb-4 text-sm normal-case tracking-normal font-normal">
            <div className="flex justify-between text-ink-2">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(cart.subtotal, cart.currency_code)}</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Shipping</span>
              <span className="text-ink">
                {remaining === 0
                  ? "Free"
                  : cart.shipping_total
                    ? formatPrice(cart.shipping_total, cart.currency_code)
                    : "At checkout"}
              </span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Tax</span>
              <span className="text-ink">
                {cart.tax_total
                  ? formatPrice(cart.tax_total, cart.currency_code)
                  : "At checkout"}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t-[3px] border-ink text-ink uppercase tracking-wide">
              <span>Total</span>
              <span className="text-accent tabular-nums">
                {formatPrice(cart.total || cart.subtotal, cart.currency_code)}
              </span>
            </div>
          </div>
          <StripeCheckoutButton />
          <p className="mt-3 text-center text-[11px] text-muted normal-case tracking-normal font-normal">
            By checking out you agree to our{" "}
            <a href="/terms" className="underline text-secondary hover:text-accent">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="underline text-secondary hover:text-accent">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </ErrorBoundary>
  )
}
