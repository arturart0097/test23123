import { fetchWithAuth } from "./apiClient";

const API_ENDPOINT = import.meta.env.VITE_API_URL + "/api/stripe/";

export async function createCheckout(
  price_id: string,
  quantity: number
): Promise<void> {
  const res = await fetchWithAuth(`${API_ENDPOINT}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ price_id, quantity }),
  });

  if (!res.ok) {
    throw new Error(`Enhance prompt failed: ${res.statusText}`);
  }

  const data = await res.json();
  window.location.href = data.url;
  return;
}
