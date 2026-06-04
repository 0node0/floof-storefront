import { useState, useEffect, useCallback } from "react"
import { getCart, getCartToken, createCart, addToCart as apiAdd, updateCartItem as apiUpdate, removeFromCart as apiRemove, clearCart as apiClear, type MedusaCart } from "./medusa"

interface UseCartResult {
  cart: MedusaCart | null; itemCount: number; loading: boolean; error: string | null
  addItem: (vid: string, qty?: number) => Promise<void>
  updateItem: (li: string, qty: number) => Promise<void>
  removeItem: (li: string) => Promise<void>
  refreshCart: () => Promise<void>
  clearError: () => void
}

export function useCart(): UseCartResult {
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [itemCount, setItemCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sync = useCallback(async (c: MedusaCart | null) => { setCart(c); setItemCount(c?.items?.reduce((s, i) => s + i.quantity, 0) || 0) }, [])

  useEffect(() => {
    const token = getCartToken()
    if (token) { setLoading(true); getCart(token).then(r => sync(r.cart)).catch(() => apiClear()).finally(() => setLoading(false)) }
  }, [])

  const addItem = useCallback(async (vid: string, qty = 1) => {
    setError(null); try {
      let cartId = getCartToken(); if (!cartId) { const nc = await createCart(); cartId = nc.id }
      const r = await apiAdd(cartId, vid, qty); await sync(r.cart)
    } catch (e: any) { setError(e.message); throw e }
  }, [])

  const updateItem = useCallback(async (li: string, qty: number) => {
    if (!cart) return; setError(null); try {
      const r = qty < 1 ? await apiRemove(cart.id, li) : await apiUpdate(cart.id, li, qty); await sync(r.cart)
    } catch (e: any) { setError(e.message) }
  }, [cart])

  const removeItem = useCallback(async (li: string) => { if (!cart) return; setError(null); try { const r = await apiRemove(cart.id, li); await sync(r.cart) } catch (e: any) { setError(e.message) } }, [cart])

  const refreshCart = useCallback(async () => {
    const token = getCartToken(); if (!token) { await sync(null); return }
    setLoading(true); setError(null); try { const r = await getCart(token); await sync(r.cart) } catch (e: any) { setError(e.message); apiClear(); await sync(null) } finally { setLoading(false) }
  }, [])

  return { cart, itemCount, loading, error, addItem, updateItem, removeItem, refreshCart, clearError: () => setError(null) }
}