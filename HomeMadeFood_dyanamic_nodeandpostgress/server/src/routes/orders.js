import { Router } from "express";
import { z } from "zod";
import { pool, query } from "../db.js";
import { requireAuth } from "../middleware/auth.js";
import { validate, wrap } from "../middleware/validate.js";

const router = Router();
router.use(requireAuth);

const orderSchema = z.object({
  items: z.array(z.union([
    z.object({
      productId: z.number().int().positive(),
      quantity: z.number().int().min(1).max(50),
    }),
    // Customized tiffin: server prices it from tiffin_options.
    z.object({
      custom: z.object({
        size: z.string().max(40),
        chapatis: z.number().int(),
        sabzi: z.number().int(),
        extras: z.array(z.string().max(40)).max(10).default([]),
      }),
      quantity: z.number().int().min(1).max(50),
    }),
  ])).min(1, "Cart is empty.").max(100),
  // Optional overrides; default to the profile values.
  deliveryAddress: z.string().trim().min(10).max(500).optional(),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/).optional(),
  notes: z.string().trim().max(500).optional(),
});

// Prices are ALWAYS read from the database, never from the client.
router.post("/", validate(orderSchema), wrap(async (req, res) => {
  const { items, notes } = req.body;

  // Merge duplicate product lines.
  const qty = new Map();
  const customs = [];
  for (const i of items) {
    if ("custom" in i) customs.push(i);
    else qty.set(i.productId, (qty.get(i.productId) || 0) + i.quantity);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: userRows } = await client.query("SELECT address, phone FROM users WHERE id=$1", [req.userId]);
    if (!userRows[0]) { await client.query("ROLLBACK"); return res.status(401).json({ error: "Account no longer exists." }); }
    const address = req.body.deliveryAddress ?? userRows[0].address;
    const phone = req.body.phone ?? userRows[0].phone;

    const ids = [...qty.keys()];
    const { rows: products } = ids.length
      ? await client.query("SELECT id,name,price FROM products WHERE id = ANY($1) AND active = true", [ids])
      : { rows: [] };
    // Postgres returns rows in arbitrary order; keep the order the customer added them in.
    products.sort((x, y) => ids.indexOf(x.id) - ids.indexOf(y.id));

    if (products.length !== ids.length) {
      const found = new Set(products.map((p) => p.id));
      await client.query("ROLLBACK");
      return res.status(400).json({
        error: "Some items are no longer available.",
        unavailable: ids.filter((id) => !found.has(id)),
      });
    }

    // Price customized tiffins from the DB option table.
    const customLines = [];
    if (customs.length) {
      const { rows: opts } = await client.query("SELECT kind,code,label,price FROM tiffin_options WHERE active");
      const find = (kind, code) => opts.find((o) => o.kind === kind && o.code === String(code));
      for (const c of customs) {
        const { size, chapatis, sabzi, extras } = c.custom;
        const sz = find("size", size), ch = find("chapati", chapatis), sb = find("sabzi", sabzi);
        const ex = [...new Set(extras)].map((code) => find("extra", code));
        if (!sz || !ch || !sb || ex.some((e) => !e)) {
          await client.query("ROLLBACK");
          return res.status(400).json({ error: "Invalid customized tiffin selection." });
        }
        customLines.push({
          name: `${sz.label} Customized Tiffin`,
          details: [`${chapatis} chapatis`, `${sabzi} sabzi serving(s)`, ...ex.map((e) => e.label)].join(", "),
          unitPrice: sz.price + ch.price + sb.price + ex.reduce((t, e) => t + e.price, 0),
          quantity: c.quantity,
        });
      }
    }

    const total =
      products.reduce((sum, p) => sum + p.price * qty.get(p.id), 0) +
      customLines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id,total,delivery_address,phone,notes)
       VALUES ($1,$2,$3,$4,$5) RETURNING id,total,status,delivery_address,phone,notes,created_at`,
      [req.userId, total, address, phone, notes ?? null]
    );
    for (const p of products) {
      await client.query(
        `INSERT INTO order_items (order_id,product_id,name,unit_price,quantity)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, p.id, p.name, p.price, qty.get(p.id)]
      );
      await client.query("UPDATE products SET sales = sales + $2 WHERE id=$1", [p.id, qty.get(p.id)]);
    }
    for (const l of customLines) {
      await client.query(
        `INSERT INTO order_items (order_id,product_id,name,unit_price,quantity,details)
         VALUES ($1,NULL,$2,$3,$4,$5)`,
        [order.id, l.name, l.unitPrice, l.quantity, l.details]
      );
    }
    await client.query("COMMIT");

    res.status(201).json({
      order: {
        ...order,
        items: [
          ...products.map((p) => ({ productId: p.id, name: p.name, unitPrice: p.price, quantity: qty.get(p.id) })),
          ...customLines.map((l) => ({ productId: null, name: l.name, details: l.details, unitPrice: l.unitPrice, quantity: l.quantity })),
        ],
      },
    });
  } catch (e) {
    await client.query("ROLLBACK").catch(() => {});
    throw e;
  } finally {
    client.release();
  }
}));

router.get("/", wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT o.id,o.total,o.status,o.delivery_address,o.phone,o.notes,o.created_at,
            COALESCE(json_agg(json_build_object(
              'productId',i.product_id,'name',i.name,'details',i.details,'unitPrice',i.unit_price,'quantity',i.quantity
            ) ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
     FROM orders o LEFT JOIN order_items i ON i.order_id=o.id
     WHERE o.user_id=$1 GROUP BY o.id ORDER BY o.created_at DESC`,
    [req.userId]
  );
  res.json({ orders: rows });
}));

router.get("/:id", wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid order id." });
  const { rows } = await query(
    `SELECT o.id,o.total,o.status,o.delivery_address,o.phone,o.notes,o.created_at,
            COALESCE(json_agg(json_build_object(
              'productId',i.product_id,'name',i.name,'details',i.details,'unitPrice',i.unit_price,'quantity',i.quantity
            ) ORDER BY i.id) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
     FROM orders o LEFT JOIN order_items i ON i.order_id=o.id
     WHERE o.id=$1 AND o.user_id=$2 GROUP BY o.id`,
    [id, req.userId]
  );
  if (!rows[0]) return res.status(404).json({ error: "Order not found." });
  res.json({ order: rows[0] });
}));

export default router;
