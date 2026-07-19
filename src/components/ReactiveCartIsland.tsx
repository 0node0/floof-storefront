import { useState, useEffect, useMemo, useRef } from "react"
import { useCart } from "@/lib/CartContext"
import { formatPrice, type MedusaVariant } from "@/lib/medusa"
import type { FloofProduct } from "@/lib/product"
import { colorMap } from "@/lib/product"
import SizeGuide from "./SizeGuide"
import Icon from "./Icon"

interface Props {
  product: FloofProduct
  variants: MedusaVariant[]
}

function opt(v: MedusaVariant, title: string) {
  return v.options?.find((o) => o.option?.title?.toLowerCase() === title.toLowerCase())?.value
}

export default function ReactiveCartIsland({ product, variants = [] }: Props) {
  const { addItem, itemCount, error: cartError, clearError } = useCart()
  const [selectedVariant, setV] = useState<MedusaVariant | null>(variants[0] || null)
  const [qty, setQty] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const addBtnRef = useRef<HTMLButtonElement>(null)

  const colors = useMemo(
    () =>
      [...new Set(variants.map((v) => opt(v, "Color")).filter(Boolean))] as string[],
    [variants]
  )
  const sizes = useMemo(() => {
    const raw = [...new Set(variants.map((v) => opt(v, "Size")).filter(Boolean))] as string[]
    const order = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"]
    return raw.sort(
      (a, b) =>
        (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) -
        (order.indexOf(b) === -1 ? 99 : order.indexOf(b))
    )
  }, [variants])

  const [selColor, setSelColor] = useState(colors[0] || "")
  const [selSize, setSelSize] = useState(sizes[0] || "")

  const availableSizes = useMemo(() => {
    if (!selColor) return new Set(sizes)
    return new Set(
      variants
        .filter((v) => opt(v, "Color") === selColor)
        .map((v) => opt(v, "Size"))
        .filter(Boolean) as string[]
    )
  }, [variants, selColor, sizes])

  useEffect(() => {
    if (!colors.length && !sizes.length) {
      setV(variants[0] || null)
      return
    }
    const match = variants.find((v) => {
      const vc = opt(v, "Color")
      const vs = opt(v, "Size")
      return (!selColor || vc === selColor) && (!selSize || vs === selSize)
    })
    setV(match || null)
  }, [selColor, selSize, variants, colors.length, sizes.length])

  useEffect(() => {
    if (selSize && !availableSizes.has(selSize)) {
      const next = sizes.find((s) => availableSizes.has(s))
      if (next) setSelSize(next)
    }
  }, [availableSizes, selSize, sizes])

  async function handleAdd() {
    if (!selectedVariant) return
    setAdding(true)
    setErr(null)
    clearError()

    // Prefer product photo as fly origin; fall back to button center
    const sourceEl =
      document.querySelector<HTMLElement>("[data-product-fly-source]") || addBtnRef.current
    const rect = sourceEl?.getBoundingClientRect()
    const flyFrom = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined

    try {
      await addItem(selectedVariant.id, qty, {
        productName: product.name,
        productImage: product.image || undefined,
        flyFrom,
        celebrate: true,
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 5200)
    } catch (e: any) {
      setErr(e.message || "Failed to add")
    } finally {
      setAdding(false)
    }
  }

  const price = selectedVariant?.prices?.[0]?.amount ?? Math.round(product.price * 100)
  const cur = selectedVariant?.prices?.[0]?.currency_code || "usd"
  const unavailable = !selectedVariant

  if (err || cartError) {
    return (
      <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600 flex gap-2 items-start">
          <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{err || cartError}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setErr(null)
            clearError()
          }}
          className="mt-2 text-sm text-red-500 underline"
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-3xl font-semibold text-floof-dark tabular-nums">{formatPrice(price, cur)}</p>
        <p className="text-xs text-floof-dark/40">USD · tax at checkout</p>
      </div>

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-floof-dark/70 mb-2">
            Color: <span className="text-floof-dark font-semibold">{selColor}</span>
          </p>
          <div className="flex gap-2 flex-wrap" role="listbox" aria-label="Color">
            {colors.map((c) => {
              const swatch = colorMap[c] || "#888"
              const selected = selColor === c
              return (
                <button
                  key={c}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  title={c}
                  onClick={() => setSelColor(c)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                    selected
                      ? "border-floof-dark bg-floof-dark text-white"
                      : "border-floof-dark/10 bg-white text-floof-dark/70 hover:border-floof-pink"
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                    style={{ background: swatch }}
                  />
                  {c}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-floof-dark/70">
              Size: <span className="text-floof-dark font-semibold">{selSize || "—"}</span>
            </p>
            <SizeGuide category={product.category} />
          </div>
          <div className="flex gap-2 flex-wrap" role="listbox" aria-label="Size">
            {sizes.map((s) => {
              const avail = availableSizes.has(s)
              const selected = selSize === s
              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={!avail}
                  onClick={() => avail && setSelSize(s)}
                  className={`min-w-12 h-12 px-3 rounded-xl text-sm font-medium transition-all ${
                    !avail
                      ? "bg-floof-sand/50 text-floof-dark/25 line-through cursor-not-allowed"
                      : selected
                        ? "bg-floof-dark text-white"
                        : "bg-floof-cream text-floof-dark/70 hover:bg-floof-sand"
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-floof-dark/70 mb-2">Quantity</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-xl border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center font-semibold text-lg" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(Math.min(10, qty + 1))}
            className="w-10 h-10 rounded-xl border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-3 sticky bottom-0 sm:static bg-floof-cream/95 sm:bg-transparent py-3 sm:py-0 -mx-2 px-2 sm:mx-0 sm:px-0 backdrop-blur sm:backdrop-blur-none border-t sm:border-0 border-floof-dark/5">
        <button
          ref={addBtnRef}
          type="button"
          onClick={handleAdd}
          disabled={adding || unavailable}
          className="btn btn--lg w-full"
        >
          {adding ? (
            "Adding…"
          ) : added ? (
            <>
              <Icon name="check" className="w-5 h-5" />
              Added to cart
            </>
          ) : unavailable ? (
            "Select options"
          ) : (
            `Add to cart — ${formatPrice(price * qty, cur)}`
          )}
        </button>
        {added && (
          <a
            href="/checkout"
            className="btn btn--outline w-full"
          >
            View cart & checkout
          </a>
        )}
      </div>

      {itemCount > 0 && !added && (
        <p className="text-center text-sm text-floof-dark/50 inline-flex items-center justify-center gap-1.5 w-full">
          <Icon name="cart" className="w-4 h-4" />
          {itemCount} item{itemCount !== 1 ? "s" : ""} in cart ·{" "}
          <a href="/checkout" className="text-floof-pink underline">
            Checkout
          </a>
        </p>
      )}

      <ul className="text-xs text-floof-dark/45 space-y-2 pt-2">
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-floof-pink" />
          <span>Ships from US print partners (typically 2–7 business days to print)</span>
        </li>
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-floof-pink" />
          <span>Secure Stripe checkout · Free shipping over $75</span>
        </li>
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-floof-pink" />
          <span>
            <a href="/shipping-returns" className="underline hover:text-floof-pink">
              30-day returns
            </a>{" "}
            on unworn items
          </span>
        </li>
      </ul>
    </div>
  )
}
