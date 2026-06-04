import { useState, useEffect } from "react"
import { useCart } from "@/lib/CartContext"
import { formatPrice, type MedusaVariant } from "@/lib/medusa"
import type { FloofProduct } from "@/components/ProductCard.astro"

interface Props { product: FloofProduct; variants: MedusaVariant[] }

export default function ReactiveCartIsland({ product, variants = [] }: Props) {
  const { addItem, itemCount, error: cartError, clearError } = useCart()
  const [selectedVariant, setV] = useState<MedusaVariant | null>(variants[0] || null)
  const [qty, setQty] = useState(1); const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false); const [err, setErr] = useState<string | null>(null)

  const colors = [...new Set(variants.map(v => v.options?.find(o => o.option?.title?.toLowerCase() === "color")?.value).filter(Boolean))] as string[]
  const sizes = [...new Set(variants.map(v => v.options?.find(o => o.option?.title?.toLowerCase() === "size")?.value).filter(Boolean))] as string[]
  const [selColor, setSelColor] = useState(colors[0] || ""); const [selSize, setSelSize] = useState(sizes[0] || "")

  useEffect(() => {
    if (!colors.length && !sizes.length) { setV(variants[0] || null); return }
    const match = variants.find(v => { const vc = v.options?.find(o => o.option?.title?.toLowerCase() === "color")?.value; const vs = v.options?.find(o => o.option?.title?.toLowerCase() === "size")?.value; return (!selColor || vc === selColor) && (!selSize || vs === selSize) })
    if (match) setV(match)
  }, [selColor, selSize, variants])

  async function handleAdd() {
    if (!selectedVariant) return; setAdding(true); setErr(null); clearError()
    try { await addItem(selectedVariant.id, qty); setAdded(true); setTimeout(() => setAdded(false), 2000) }
    catch (e: any) { setErr(e.message || "Failed to add") } finally { setAdding(false) }
  }

  const price = selectedVariant?.prices?.[0]?.amount ?? Math.round(product.price * 100)
  const cur = selectedVariant?.prices?.[0]?.currency_code || "usd"

  if (err || cartError) return <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6"><p className="text-sm text-red-600">⚠️ {err || cartError}</p><button onClick={() => { setErr(null); clearError() }} className="mt-2 text-sm text-red-500 underline">Dismiss</button></div>

  return <div className="mt-8 space-y-6">
    <p className="text-3xl font-bold text-floof-dark">{formatPrice(price, cur)}</p>
    {colors.length > 0 && <div><p className="text-sm font-medium text-floof-dark/70 mb-2">Color: <span className="text-floof-dark">{selColor}</span></p><div className="flex gap-2 flex-wrap">{colors.map(c => <button key={c} onClick={() => setSelColor(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selColor === c ? "bg-floof-dark text-white" : "bg-floof-cream text-floof-dark/70 hover:bg-floof-sand"}`}>{c}</button>)}</div></div>}
    {sizes.length > 0 && <div><p className="text-sm font-medium text-floof-dark/70 mb-2">Size: <span className="text-floof-dark">{selSize}</span></p><div className="flex gap-2 flex-wrap">{sizes.map(s => <button key={s} onClick={() => setSelSize(s)} className={`w-12 h-12 rounded-xl text-sm font-medium transition-all ${selSize === s ? "bg-floof-dark text-white" : "bg-floof-cream text-floof-dark/70 hover:bg-floof-sand"}`}>{s}</button>)}</div></div>}
    <div><p className="text-sm font-medium text-floof-dark/70 mb-2">Quantity</p><div className="flex items-center gap-3"><button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink">−</button><span className="w-10 text-center font-semibold text-lg">{qty}</span><button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl border border-floof-dark/10 flex items-center justify-center hover:border-floof-pink">+</button></div></div>
    <button onClick={handleAdd} disabled={adding || !selectedVariant} className="w-full rounded-full bg-floof-pink py-4 text-base font-semibold text-white hover:bg-floof-coral transition-colors disabled:opacity-50">{adding ? "Adding…" : added ? "✓ Added!" : `Add to Cart — ${formatPrice(price * qty, cur)}`}</button>
    {itemCount > 0 && <p className="text-center text-sm text-floof-dark/50">🛒 {itemCount} item{itemCount !== 1 ? "s" : ""} in cart</p>}
  </div>
}