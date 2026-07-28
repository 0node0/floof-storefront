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
      <div className="border-[3px] border-accent bg-paper p-6">
        <p className="text-sm text-accent flex gap-2 items-start">
          <Icon name="alert" className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{err || cartError}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            setErr(null)
            clearError()
          }}
          className="mt-2 text-sm text-ink-2 underline"
        >
          Dismiss
        </button>
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-ink pb-4">
        <p className="font-display text-3xl text-accent tabular-nums">{formatPrice(price, cur)}</p>
        <p className="text-xs text-muted uppercase tracking-wider">USD · tax at checkout</p>
      </div>

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-ink-2 mb-2 uppercase tracking-wide">
            Color: <span className="text-ink font-semibold">{selColor}</span>
          </p>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Color">
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
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-[3px] border-ink max-w-full ${
                    selected
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink-2 hover:bg-secondary hover:text-paper"
                  }`}
                >
                  <span
                    className="w-4 h-4 border border-ink/40 shrink-0"
                    style={{ background: swatch }}
                  />
                  <span className="truncate">{c}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-ink-2 uppercase tracking-wide">
              Size: <span className="text-ink font-semibold">{selSize || "—"}</span>
            </p>
            <SizeGuide category={product.category} />
          </div>
          <div className="flex flex-wrap gap-2" role="listbox" aria-label="Size">
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
                  className={`min-w-12 h-12 px-3 text-sm font-medium transition-colors border-[3px] border-ink ${
                    !avail
                      ? "bg-paper-2 text-muted line-through cursor-not-allowed"
                      : selected
                        ? "bg-ink text-paper"
                        : "bg-paper text-ink-2 hover:bg-accent hover:text-accent-ink"
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
        <p className="text-sm font-medium text-ink-2 mb-2 uppercase tracking-wide">Quantity</p>
        <div className="inline-flex items-center border-[3px] border-ink">
          <button
            type="button"
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-accent hover:text-accent-ink border-r-[3px] border-ink"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 text-center font-semibold text-lg" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty(Math.min(10, qty + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-accent hover:text-accent-ink border-l-[3px] border-ink"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-3 sticky bottom-0 sm:static bg-paper/95 sm:bg-transparent py-3 sm:py-0 -mx-2 px-2 sm:mx-0 sm:px-0 backdrop-blur sm:backdrop-blur-none border-t-[3px] sm:border-0 border-ink">
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
          <a href="/checkout" className="btn btn--outline w-full">
            View cart & checkout
          </a>
        )}
      </div>

      {itemCount > 0 && !added && (
        <p className="text-center text-sm text-ink-2 inline-flex items-center justify-center gap-1.5 w-full normal-case tracking-normal font-normal">
          <Icon name="cart" className="w-4 h-4" />
          {itemCount} item{itemCount !== 1 ? "s" : ""} in cart ·{" "}
          <a href="/checkout" className="text-accent underline">
            Checkout
          </a>
        </p>
      )}

      <ul className="text-xs text-muted space-y-2 pt-2 normal-case tracking-normal font-normal">
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
          <span>Ships from US print partners (typically 2–7 business days to print)</span>
        </li>
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
          <span>Secure Stripe checkout · Free shipping over $75</span>
        </li>
        <li className="flex gap-2 items-start">
          <Icon name="check" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-accent" />
          <span>
            <a href="/shipping-returns" className="underline hover:text-accent">
              30-day returns
            </a>{" "}
            on unworn items
          </span>
        </li>
      </ul>
    </div>
  )
}
