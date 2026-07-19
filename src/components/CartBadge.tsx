import { useEffect, useState } from "react"
import { useCart } from "@/lib/CartContext"

export default function CartBadge() {
  const { itemCount, loading } = useCart()
  const [m, setM] = useState(false)
  useEffect(() => setM(true), [])
  return (
    <a href="/checkout" className="relative flex items-center gap-2 text-floof-dark/70 hover:text-floof-pink transition-colors" aria-label={`Cart with ${itemCount} items`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
      {m && !loading && itemCount > 0 && (
        <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-floof-pink text-accent-ink text-[11px] font-bold flex items-center justify-center">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </a>
  )
}