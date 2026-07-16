export const PUBLIC_MEDUSA_URL =
  import.meta.env.PUBLIC_MEDUSA_URL || "http://localhost:9000"
export const PUBLIC_MEDUSA_PK = import.meta.env.PUBLIC_MEDUSA_PK || ""

export interface MedusaVariantOption {
  id: string
  value: string
  option?: { id: string; title: string }
}
export interface MedusaVariantPrice {
  id?: string
  amount: number
  currency_code: string
}
export interface MedusaVariant {
  id: string
  title: string
  sku: string
  options: MedusaVariantOption[]
  prices: MedusaVariantPrice[]
}
export interface MedusaProductImage {
  id: string
  url: string
}
export interface MedusaProduct {
  id: string
  handle: string
  title: string
  description: string
  images?: MedusaProductImage[]
  variants?: MedusaVariant[]
  metadata?: Record<string, any>
}
export interface MedusaLineItem {
  id: string
  title: string
  quantity: number
  unit_price: number
  variant?: MedusaVariant & { product?: MedusaProduct }
  thumbnail?: string
}
export interface MedusaShippingOption {
  id: string
  name: string
  amount: number
  data?: Record<string, any>
}
export interface MedusaAddress {
  first_name?: string
  last_name?: string
  address_1?: string
  city?: string
  province?: string
  postal_code?: string
  country_code?: string
  phone?: string
}
export interface MedusaCart {
  id: string
  email?: string
  currency_code: string
  items: MedusaLineItem[]
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  payment_collection?: { id: string; status: string }
  metadata?: Record<string, any>
}

import { formatPrice } from "./formatPrice"
export { formatPrice }

const CART_KEY = "floof_cart_token"

export function getCartToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(CART_KEY)
}

export function setCartToken(id: string): void {
  if (typeof window !== "undefined") localStorage.setItem(CART_KEY, id)
}

export function clearCart(): void {
  if (typeof window !== "undefined") localStorage.removeItem(CART_KEY)
}

async function medusaFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  }

  // Medusa 2 Store API requires a publishable API key
  if (PUBLIC_MEDUSA_PK) {
    headers["x-publishable-api-key"] = PUBLIC_MEDUSA_PK
  }

  const cartToken = getCartToken()
  if (cartToken) headers["x-cart-id"] = cartToken

  const res = await fetch(`${PUBLIC_MEDUSA_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`Medusa ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

/** Medusa wraps most store responses as { cart: ... } */
function unwrapCart(payload: any): MedusaCart {
  if (payload?.cart?.id) return payload.cart as MedusaCart
  if (payload?.id) return payload as MedusaCart
  throw new Error("Unexpected cart response shape from Medusa")
}

export async function createCart(): Promise<MedusaCart> {
  const payload = await medusaFetch<any>("/store/carts", {
    method: "POST",
    body: "{}",
  })
  const cart = unwrapCart(payload)
  setCartToken(cart.id)
  return cart
}

export async function getCart(id: string): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(`/store/carts/${id}`)
  return { cart: unwrapCart(payload) }
}

export async function addToCart(
  cartId: string,
  variantId: string,
  qty = 1
): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: JSON.stringify({ variant_id: variantId, quantity: qty }),
  })
  return { cart: unwrapCart(payload) }
}

export async function updateCartItem(
  cartId: string,
  itemId: string,
  qty: number
): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(
    `/store/carts/${cartId}/line-items/${itemId}`,
    {
      method: "POST",
      body: JSON.stringify({ quantity: qty }),
    }
  )
  return { cart: unwrapCart(payload) }
}

export async function removeFromCart(
  cartId: string,
  itemId: string
): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(
    `/store/carts/${cartId}/line-items/${itemId}`,
    { method: "DELETE" }
  )
  return { cart: unwrapCart(payload) }
}

export async function updateCartAddress(
  cartId: string,
  a: MedusaAddress & { email?: string }
): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(`/store/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({
      shipping_address: a,
      billing_address: a,
      email: a.email,
    }),
  })
  return { cart: unwrapCart(payload) }
}

export async function listShippingOptions(
  cartId: string
): Promise<{ shipping_options: MedusaShippingOption[] }> {
  return medusaFetch(`/store/shipping-options?cart_id=${cartId}`)
}

export async function addShippingMethod(
  cartId: string,
  optionId: string
): Promise<{ cart: MedusaCart }> {
  const payload = await medusaFetch<any>(`/store/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({ option_id: optionId }),
  })
  return { cart: unwrapCart(payload) }
}

export async function listProducts(): Promise<{
  products: MedusaProduct[]
  count: number
}> {
  return medusaFetch(
    "/store/products?fields=id,handle,title,description,*images,*variants,*variants.prices,*variants.options,*variants.options.option"
  )
}

export async function getProduct(
  handle: string
): Promise<{ product: MedusaProduct }> {
  const r = await medusaFetch<{ products: MedusaProduct[] }>(
    `/store/products?handle=${encodeURIComponent(handle)}&fields=id,handle,title,description,*images,*variants,*variants.prices,*variants.options,*variants.options.option`
  )
  return { product: r.products?.[0] }
}
