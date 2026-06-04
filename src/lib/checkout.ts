const MEDUSA_URL = import.meta.env.PUBLIC_MEDUSA_URL || "http://localhost:9000"

export interface CheckoutSession {
  session_id: string
  url: string
}

export async function createCheckoutSession(
  cartId: string,
  returnUrl: string
): Promise<CheckoutSession> {
  const res = await fetch(`${MEDUSA_URL}/store/checkout/create-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart_id: cartId, return_url: returnUrl }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Checkout session failed: ${res.status}: ${body}`)
  }
  return res.json() as Promise<CheckoutSession>
}