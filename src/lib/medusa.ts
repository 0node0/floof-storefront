export const PUBLIC_MEDUSA_URL = import.meta.env.PUBLIC_MEDUSA_URL || "http://localhost:9000"

export interface MedusaVariantOption { id: string; value: string; option?: { id: string; title: string } }
export interface MedusaVariantPrice { id?: string; amount: number; currency_code: string }
export interface MedusaVariant { id: string; title: string; sku: string; options: MedusaVariantOption[]; prices: MedusaVariantPrice[] }
export interface MedusaProductImage { id: string; url: string }
export interface MedusaProduct { id: string; handle: string; title: string; description: string; images?: MedusaProductImage[]; variants?: MedusaVariant[]; metadata?: Record<string, any> }
export interface MedusaLineItem { id: string; title: string; quantity: number; unit_price: number; variant?: MedusaVariant & { product?: MedusaProduct }; thumbnail?: string }
export interface MedusaShippingOption { id: string; name: string; amount: number; data?: Record<string, any> }
export interface MedusaAddress { first_name?: string; last_name?: string; address_1?: string; city?: string; province?: string; postal_code?: string; country_code?: string; phone?: string }
export interface MedusaCart { id: string; email?: string; currency_code: string; items: MedusaLineItem[]; subtotal: number; shipping_total: number; tax_total: number; total: number; payment_collection?: { id: string; status: string }; metadata?: Record<string, any> }

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
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(options.headers as Record<string, string> || {}) }
  const cartToken = getCartToken()
  if (cartToken) headers["x-cart-id"] = cartToken
  const res = await fetch(`${PUBLIC_MEDUSA_URL}${path}`, { ...options, headers })
  if (!res.ok) throw new Error(`Medusa ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

export async function createCart(): Promise<MedusaCart> { const c = await medusaFetch<MedusaCart>("/store/carts", { method: "POST", body: "{}" }); setCartToken(c.id); return c }
export async function getCart(id: string): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${id}`) }
export async function addToCart(cartId: string, variantId: string, qty = 1): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${cartId}/line-items`, { method: "POST", body: JSON.stringify({ variant_id: variantId, quantity: qty }) }) }
export async function updateCartItem(cartId: string, itemId: string, qty: number): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${cartId}/line-items/${itemId}`, { method: "POST", body: JSON.stringify({ quantity: qty }) }) }
export async function removeFromCart(cartId: string, itemId: string): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${cartId}/line-items/${itemId}`, { method: "DELETE" }) }
export async function updateCartAddress(cartId: string, a: MedusaAddress & { email?: string }): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${cartId}`, { method: "POST", body: JSON.stringify({ shipping_address: a, billing_address: a, email: a.email }) }) }
export async function getShippingRates(cartId: string): Promise<{ rates: MedusaShippingOption[] }> { return medusaFetch(`/store/shipping/printful-rates?cart_id=${cartId}`, { method: "POST" }) }
export async function addShippingMethod(cartId: string, optionId: string): Promise<{ cart: MedusaCart }> { return medusaFetch(`/store/carts/${cartId}/shipping-methods`, { method: "POST", body: JSON.stringify({ option_id: optionId }) }) }
export async function createPaymentCollection(cartId: string): Promise<{ payment_collection: { id: string } }> { return medusaFetch("/store/payment-collections", { method: "POST", body: JSON.stringify({ cart_id: cartId }) }) }
export async function initiatePaymentSession(pcId: string): Promise<any> { return medusaFetch(`/store/payment-collections/${pcId}/payment-sessions`, { method: "POST", body: JSON.stringify({ provider_id: "stripe" }) }) }
export async function completeCart(cartId: string): Promise<{ order: { id: string; display_id: number } }> { return medusaFetch(`/store/carts/${cartId}/complete`, { method: "POST" }) }
export async function listProducts(): Promise<{ products: MedusaProduct[]; count: number }> { return medusaFetch("/store/products?fields=id,handle,title,description,*images,*variants,*variants.prices,*variants.options") }
export async function getProduct(handle: string): Promise<{ product: MedusaProduct }> { const r = await medusaFetch<{ products: MedusaProduct[] }>(`/store/products?handle=${handle}&fields=id,handle,title,description,*images,*variants,*variants.prices,*variants.options`); return { product: r.products?.[0] } }