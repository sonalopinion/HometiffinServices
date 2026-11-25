import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../src/app.js";
import { pool } from "../src/db.js";

let server, base;
const email = `t${Date.now()}@example.com`;
const user = {
  fullName: "Test User", email, phone: "9876543210",
  address: "12 Main Street, Mumbai, MH 400001", password: "Passw0rd!x",
};
let token;
const api = (path, { method = "GET", body, auth } = {}) =>
  fetch(base + path, {
    method,
    headers: { "Content-Type": "application/json", ...(auth ? { Authorization: `Bearer ${auth}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });

before(async () => {
  await new Promise((r) => (server = app.listen(0, r)));
  base = `http://localhost:${server.address().port}`;
});
after(async () => {
  await pool.query("DELETE FROM orders WHERE user_id IN (SELECT id FROM users WHERE email=$1)", [email]);
  await pool.query("DELETE FROM users WHERE email=$1", [email]);
  server.close(); await pool.end();
});

test("products & categories", async () => {
  const all = await (await api("/api/products")).json();
  assert.equal(all.products.length, 34);
  assert.equal((await (await api("/api/products?kind=snack")).json()).products.length, 22);
  assert.equal((await (await api("/api/products?kind=tiffin")).json()).products.length, 6);
  assert.equal((await (await api("/api/products?kind=extra")).json()).products.length, 6);
  const best = (await (await api("/api/products?bestSeller=true&sort=sales&limit=3")).json()).products;
  assert.equal(best.length, 3); assert.ok(best[0].sales >= best[1].sales && best[0].isBestSeller);
  assert.equal((await (await api("/api/products?categorySlug=pickles")).json()).products.length, 2);
  const labels = (await (await api("/api/products/labels?kind=snack")).json()).labels;
  assert.deepEqual(labels.slice(0, 2), ["Chivda & Farsan", "Sweets & Ladoo"]);
  assert.ok((await (await api("/api/categories/pickles")).json()).category.productCount === 2);
  assert.equal(typeof all.products[0].price, "number");
  const f = await (await api("/api/products?featured=true")).json();
  assert.ok(f.products.length > 0 && f.products.every((p) => p.featured));
  const one = await api("/api/products/1");
  assert.equal((await one.json()).product.name, "Poha Chivda");
  assert.equal((await api("/api/products/9999")).status, 404);
  assert.equal((await api("/api/products/abc")).status, 400);
  assert.equal((await (await api("/api/categories")).json()).categories.length, 6);
  assert.equal((await api("/api/categories/snacks")).status, 200);
});

test("register validation, duplicate, login, me", async () => {
  const bad = await api("/api/auth/register", { method: "POST", body: { ...user, password: "weak" } });
  assert.equal(bad.status, 400);
  assert.ok((await bad.json()).errors.password);

  const ok = await api("/api/auth/register", { method: "POST", body: user });
  assert.equal(ok.status, 201);
  const j = await ok.json();
  assert.ok(j.token); assert.equal(j.user.password_hash, undefined);

  const dup = await api("/api/auth/register", { method: "POST", body: { ...user, email: email.toUpperCase() } });
  assert.equal(dup.status, 409);

  assert.equal((await api("/api/auth/login", { method: "POST", body: { email, password: "Wrong1234!" } })).status, 401);
  const login = await api("/api/auth/login", { method: "POST", body: { email, password: user.password } });
  assert.equal(login.status, 200);
  token = (await login.json()).token;

  const me = await api("/api/auth/me", { auth: token });
  assert.equal((await me.json()).user.email, email);
  assert.equal((await api("/api/auth/me")).status, 401);
  assert.equal((await api("/api/auth/me", { auth: "garbage" })).status, 401);
});

test("orders: server-side pricing, auth, ownership", async () => {
  assert.equal((await api("/api/orders", { method: "POST", body: { items: [{ productId: 1, quantity: 1 }] } })).status, 401);

  // client-supplied price must be ignored (zod strips unknown keys)
  const res = await api("/api/orders", { method: "POST", auth: token,
    body: { items: [{ productId: 1, quantity: 2, price: 1 }, { productId: 1, quantity: 1 }, { productId: 2, quantity: 1 }] } });
  assert.equal(res.status, 201);
  const { order } = await res.json();
  assert.equal(order.total, 120 * 3 + 90);
  assert.equal(order.items.length, 2);

  assert.equal((await api("/api/orders", { method: "POST", auth: token, body: { items: [{ productId: 9999, quantity: 1 }] } })).status, 400);
  assert.equal((await api("/api/orders", { method: "POST", auth: token, body: { items: [] } })).status, 400);

  const list = await (await api("/api/orders", { auth: token })).json();
  assert.equal(list.orders.length, 1); // (runs before the tiffin test)
  assert.equal(list.orders[0].items[0].name, "Poha Chivda");
  assert.equal((await api(`/api/orders/${order.id}`, { auth: token })).status, 200);

  // another user can't read it
  const other = await (await api("/api/auth/register", { method: "POST",
    body: { ...user, email: `o${email}` } })).json();
  assert.equal((await api(`/api/orders/${order.id}`, { auth: other.token })).status, 404);
  await pool.query("DELETE FROM users WHERE email=$1", [`o${email}`]);
});

test("tiffin options + custom tiffin priced on server", async () => {
  const o = await (await api("/api/tiffin/options")).json();
  assert.equal(o.sizes.length, 3); assert.equal(o.extras.length, 4);
  // Regular 60 + 4 chapatis 32 + 1 sabzi 15 + dal 20 + rice 20 = 147 (matches old frontend formula)
  const res = await api("/api/orders", { method: "POST", auth: token, body: { items: [
    { custom: { size: "Regular", chapatis: 4, sabzi: 1, extras: ["dal", "rice", "dal"] }, quantity: 2 },
    { productId: 31, quantity: 1 },
  ] } });
  assert.equal(res.status, 201);
  const { order } = await res.json();
  assert.equal(order.total, 147 * 2 + 100);
  const custom = order.items.find((i) => i.productId === null);
  assert.equal(custom.name, "Regular Customized Tiffin");
  assert.equal(custom.details, "4 chapatis, 1 sabzi serving(s), Dal, Rice");
  // tampering is rejected
  const bad = await api("/api/orders", { method: "POST", auth: token,
    body: { items: [{ custom: { size: "Huge", chapatis: 4, sabzi: 1, extras: [] }, quantity: 1 }] } });
  assert.equal(bad.status, 400);
  // history shows details
  const list = await (await api("/api/orders", { auth: token })).json();
  assert.ok(list.orders.some((x) => x.items.some((i) => i.details?.includes("Dal"))));
});

test("order increments sales", async () => {
  const before = (await (await api("/api/products/3")).json()).product.sales;
  await api("/api/orders", { method: "POST", auth: token, body: { items: [{ productId: 3, quantity: 2 }] } });
  assert.equal((await (await api("/api/products/3")).json()).product.sales, before + 2);
});

test("contact form", async () => {
  assert.equal((await api("/api/contact", { method: "POST", body: { name: "A", email: "x", message: "hi" } })).status, 400);
  const ok = await api("/api/contact", { method: "POST", body: { name: "Asha", email: "asha@example.com", message: "Do you deliver to Pune?" } });
  assert.equal(ok.status, 201);
  await pool.query("DELETE FROM contact_messages WHERE email='asha@example.com'");
});

test("bad JSON and unknown route", async () => {
  const r = await fetch(base + "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
  assert.equal(r.status, 400);
  assert.equal((await api("/api/nope")).status, 404);
});
