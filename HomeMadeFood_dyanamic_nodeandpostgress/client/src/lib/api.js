// Central API client. Set NEXT_PUBLIC_API_URL in .env.local (default http://localhost:5000).
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken() {
  try {
    return localStorage.getItem("homeMadeToken");
  } catch {
    return null; // server render / storage blocked
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem("homeMadeToken", token);
    else localStorage.removeItem("homeMadeToken");
  } catch {}
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10000), // never hang on "Loading..." forever
    });
  } catch {
    const err = new Error(
      `Cannot reach the backend at ${BASE}. Start it (npm run dev in the backend folder) and check ${BASE}/api/health opens.`
    );
    err.status = 0;
    err.fieldErrors = {};
    throw err;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    err.fieldErrors = data.errors || {}; // { email: "...", password: "..." }
    err.data = data; // e.g. { unavailable: [ids] }
    throw err;
  }
  return data;
}

/* ---------- auth ---------- */
export async function registerUser(form) {
  const { token, user } = await api("/auth/register", { method: "POST", body: form, auth: false });
  setToken(token);
  return user;
}
export async function loginUser(email, password) {
  const { token, user } = await api("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  setToken(token);
  return user;
}
export const logoutUser = () => setToken(null);
export const getMe = () => api("/auth/me").then((r) => r.user);

/* ---------- catalog ---------- */
// params: { kind, category, categorySlug, featured, healthy, bestSeller, search, sort, limit }
export function getProducts(params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return api(`/products${qs ? `?${qs}` : ""}`, { auth: false }).then((r) => r.products);
}
export const getProduct = (id) => api(`/products/${id}`, { auth: false }).then((r) => r.product);
export const getProductLabels = (kind = "snack") =>
  api(`/products/labels?kind=${kind}`, { auth: false }).then((r) => r.labels);
export const getCategories = () => api("/categories", { auth: false }).then((r) => r.categories);
export const getCategory = (slug) =>
  api(`/categories/${slug}`, { auth: false }).then((r) => r.category);
export const getTiffinOptions = () => api("/tiffin/options", { auth: false });

/* ---------- orders & contact ---------- */
// Cart lines -> API lines. Prices are NOT sent; the server prices everything.
export function placeOrder(cart, extra = {}) {
  const items = cart.map((i) =>
    i.custom
      ? { custom: i.custom, quantity: i.quantity }
      : { productId: Number(i.id), quantity: i.quantity }
  );
  return api("/orders", { method: "POST", body: { items, ...extra } }).then((r) => r.order);
}
export const getOrders = () => api("/orders").then((r) => r.orders);
export const sendContact = (form) => api("/contact", { method: "POST", body: form, auth: false });
