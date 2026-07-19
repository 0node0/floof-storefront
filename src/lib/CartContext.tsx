import { useState, useEffect, useCallback, useRef } from "react"
import {
  getCart,
  getCartToken,
  createCart,
  addToCart as apiAdd,
  updateCartItem as apiUpdate,
  removeFromCart as apiRemove,
  clearCart as apiClear,
  type MedusaCart,
} from "./medusa"
import { emitCartPulse } from "./cart-events"

export type AddItemMeta = {
  productName?: string
  celebrate?: boolean
}

interface UseCartResult {
  cart: MedusaCart | null
  itemCount: number
  loading: boolean
  error: string | null
  addItem: (vid: string, qty?: number, meta?: AddItemMeta) => Promise<void>
  updateItem: (li: string, qty: number) => Promise<void>
  removeItem: (li: string) => Promise<void>
  refreshCart: () => Promise<void>
  clearError: () => void
}

function countItems(c: MedusaCart | null) {
  return c?.items?.reduce((s, i) => s + i.quantity, 0) || 0
}

export function useCart(): UseCartResult {
  const [cart, setCart] = useState<MedusaCart | null>(null)
  const [itemCount, setItemCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const countRef = useRef(0)

  const sync = useCallback(
    async (
      c: MedusaCart | null,
      pulse?: { celebrate?: boolean; addedQty?: number; productName?: string }
    ) => {
      const n = countItems(c)
      countRef.current = n
      setCart(c)
      setItemCount(n)
      emitCartPulse({
        itemCount: n,
        celebrate: pulse?.celebrate,
        addedQty: pulse?.addedQty,
        productName: pulse?.productName,
        pending: false,
      })
    },
    []
  )

  useEffect(() => {
    const token = getCartToken()
    if (token) {
      setLoading(true)
      getCart(token)
        .then((r) => sync(r.cart))
        .catch(() => apiClear())
        .finally(() => setLoading(false))
    }
  }, [sync])

  const addItem = useCallback(
    async (vid: string, qty = 1, meta?: AddItemMeta) => {
      setError(null)
      const celebrate = meta?.celebrate !== false
      const optimistic = countRef.current + qty
      countRef.current = optimistic
      setItemCount(optimistic)
      // Fire celebration + badge dance immediately (before network)
      emitCartPulse({
        itemCount: optimistic,
        addedQty: qty,
        celebrate,
        productName: meta?.productName,
        pending: true,
      })

      try {
        let cartId = getCartToken()
        if (!cartId) {
          const nc = await createCart()
          cartId = nc.id
        }
        const r = await apiAdd(cartId, vid, qty)
        // Confirm real total without re-firing celebration
        await sync(r.cart)
      } catch (e: any) {
        setError(e.message)
        const token = getCartToken()
        if (token) {
          try {
            const r = await getCart(token)
            await sync(r.cart)
          } catch {
            const rolled = Math.max(0, countRef.current - qty)
            countRef.current = rolled
            setItemCount(rolled)
            emitCartPulse({ itemCount: rolled, pending: false })
          }
        } else {
          const rolled = Math.max(0, countRef.current - qty)
          countRef.current = rolled
          setItemCount(rolled)
          emitCartPulse({ itemCount: rolled, pending: false })
        }
        throw e
      }
    },
    [sync]
  )

  const updateItem = useCallback(
    async (li: string, qty: number) => {
      if (!cart) return
      setError(null)
      try {
        const r = qty < 1 ? await apiRemove(cart.id, li) : await apiUpdate(cart.id, li, qty)
        await sync(r.cart)
      } catch (e: any) {
        setError(e.message)
      }
    },
    [cart, sync]
  )

  const removeItem = useCallback(
    async (li: string) => {
      if (!cart) return
      setError(null)
      try {
        const r = await apiRemove(cart.id, li)
        await sync(r.cart)
      } catch (e: any) {
        setError(e.message)
      }
    },
    [cart, sync]
  )

  const refreshCart = useCallback(async () => {
    const token = getCartToken()
    if (!token) {
      await sync(null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const r = await getCart(token)
      await sync(r.cart)
    } catch (e: any) {
      setError(e.message)
      apiClear()
      await sync(null)
    } finally {
      setLoading(false)
    }
  }, [sync])

  return {
    cart,
    itemCount,
    loading,
    error,
    addItem,
    updateItem,
    removeItem,
    refreshCart,
    clearError: () => setError(null),
  }
}
