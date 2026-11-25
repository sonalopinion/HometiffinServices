// Copy to: src/lib/api.js   (and add NEXT_PUBLIC_API_URL=http://localhost:5000 to the Next.js .env.local)
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken() {
  try { return localStorage.getItem("homeMadeToken"); } catch { return null; }
}
export function setToken(t) {
  try { t ? localStorage.setItem("homeMadeToken", t) : localStorage.removeItem("homeMadeToken"); } catch {}
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = auth && typeof window !== "undefined" ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}/api${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    err.fieldErrors = data.errors || {};   // { email: "…", password: "…" }
    throw err;
  }
  return data;
}

export const register = async (form) => {
  const { token, user } = await api("/auth/register", { method: "POST", body: form, auth: false });
  setToken(token); return user;
};
export const login = async (email, password) => {
  const { token, user } = await api("/auth/login", { method: "POST", body: { email, password }, auth: false });
  setToken(token); return user;
};
export const logout = () => setToken(null);
export const getMe = () => api("/auth/me").then((r) => r.user);
export const getProducts = (qs = "") => api(`/products${qs}`, { auth: false }).then((r) => r.products);
export const getProduct = (id) => api(`/products/${id}`, { auth: false }).then((r) => r.product);
export const getCategories = () => api("/categories", { auth: false }).then((r) => r.categories);
export const placeOrder = (cart, extra = {}) =>
  api("/orders", { method: "POST", body: { items: cart.map((i) => ({ productId: i.id, quantity: i.quantity })), ...extra } })
    .then((r) => r.order);
export const getOrders = () => api("/orders").then((r) => r.orders);
export const sendContact = (form) => api("/contact", { method: "POST", body: form, auth: false });
