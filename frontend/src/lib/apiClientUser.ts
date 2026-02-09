import { fetchWithAuth, API_ENDPOINT } from "./apiClient";
// const API_ENDPOINT = import.meta.env.VITE_API_URL + "/api/stripe/";

interface User {
  id: string;
  privy_id: string;
  stripe_customer_id: string;
  wallet: string;
  tokens: number;
  tier: string;
  sub_expiry: unknown;
  created_at: unknown;
  updated_at: unknown;
}

export async function Login(privyID: string, wallet: string): Promise<User> {
  const res = await fetchWithAuth(`${API_ENDPOINT}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ privy_id: privyID, wallet }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch users: ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

export async function PurchaseProduct(
  price_id: string,
  mode: string = "payment",
  quantity: number = 1,
  extra: number = 0,
): Promise<Response> {
  const res = await fetchWithAuth(`${API_ENDPOINT}/api/shop/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price_id, mode, quantity, extra }),
  });

  if (!res.ok) {
    throw new Error(`Failed to purchase product: ${res.statusText}`);
  }
  const data = await res.json();
  window.location.href = data.url;

  return res;
}
