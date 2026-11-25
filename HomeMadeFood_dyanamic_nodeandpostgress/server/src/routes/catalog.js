import { Router } from "express";
import { query } from "../db.js";
import { wrap } from "../middleware/validate.js";

export const productsRouter = Router();
export const categoriesRouter = Router();

/*
 GET /api/products
   ?kind=snack|tiffin|extra   ?category=<label>   ?categorySlug=snacks
   ?featured=true  ?healthy=true  ?bestSeller=true  ?search=text
   ?sort=latest|sales|price   ?limit=4
*/
productsRouter.get("/", wrap(async (req, res) => {
  const { kind, category, categorySlug, featured, healthy, bestSeller, search, sort, limit } = req.query;
  const where = ["active = true"];
  const params = [];
  const add = (sql, val) => { params.push(val); where.push(sql.replace("?", `$${params.length}`)); };

  if (typeof kind === "string" && kind) add("kind = ?", kind);
  if (typeof category === "string" && category) add("category = ?", category);
  if (typeof categorySlug === "string" && categorySlug) add("category_slug = ?", categorySlug);
  if (featured === "true") where.push("featured = true");
  if (healthy === "true") where.push("healthy = true");
  if (bestSeller === "true") where.push("is_best_seller = true");
  if (typeof search === "string" && search.trim()) {
    params.push(`%${search.trim()}%`);
    where.push(`(name ILIKE $${params.length} OR description ILIKE $${params.length})`);
  }

  const orderBy = { latest: "created_at DESC, id DESC", sales: "sales DESC, id", price: "price, id" }[sort] || "id";
  const lim = Math.min(Math.max(parseInt(limit, 10) || 0, 0), 100);
  const { rows } = await query(
    `SELECT * FROM products WHERE ${where.join(" AND ")} ORDER BY ${orderBy} ${lim ? `LIMIT ${lim}` : ""}`,
    params
  );
  res.json({ products: rows.map(shape) });
}));

// Distinct category labels for the filter chips: GET /api/products/labels?kind=snack
productsRouter.get("/labels", wrap(async (req, res) => {
  const kind = typeof req.query.kind === "string" ? req.query.kind : "snack";
  const { rows } = await query(
    "SELECT category FROM products WHERE active=true AND kind=$1 GROUP BY category ORDER BY MIN(id)", [kind]
  );
  res.json({ labels: rows.map((r) => r.category) });
}));

productsRouter.get("/:id", wrap(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid product id." });
  const { rows } = await query("SELECT * FROM products WHERE id=$1 AND active=true", [id]);
  if (!rows[0]) return res.status(404).json({ error: "Product not found." });
  res.json({ product: shape(rows[0]) });
}));

// camelCase for the fields the old frontend data used (isBestSeller, categorySlug).
function shape(p) {
  const { is_best_seller, category_slug, created_at, ...rest } = p;
  return { ...rest, isBestSeller: is_best_seller, categorySlug: category_slug, createdAt: created_at };
}

categoriesRouter.get("/", wrap(async (_req, res) => {
  const { rows } = await query(
    `SELECT c.*, COUNT(p.id)::int AS "productCount"
     FROM categories c LEFT JOIN products p ON p.category_slug=c.slug AND p.active
     GROUP BY c.id ORDER BY c.id`
  );
  res.json({ categories: rows });
}));

categoriesRouter.get("/:slug", wrap(async (req, res) => {
  const { rows } = await query(
    `SELECT c.*, COUNT(p.id)::int AS "productCount"
     FROM categories c LEFT JOIN products p ON p.category_slug=c.slug AND p.active
     WHERE c.slug=$1 GROUP BY c.id`, [req.params.slug]
  );
  if (!rows[0]) return res.status(404).json({ error: "Category not found." });
  res.json({ category: rows[0] });
}));
