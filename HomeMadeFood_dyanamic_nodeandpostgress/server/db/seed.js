import { pool } from "../src/db.js";
import { products } from "../seed/products.js";
import categories from "../seed/categories.src.js";
import { dailySpecials } from "../seed/dailyspecials.src.js";
import { tiffinPlans, tiffinOptions, extras } from "../seed/tiffin.js";

let client;
try {
  client = await pool.connect();
} catch (e) {
  console.error("Cannot connect to PostgreSQL:", e.message);
  console.error("Check DATABASE_URL in .env, that PostgreSQL is running, and that the database exists.");
  process.exit(1);
}
try {
  await client.query("BEGIN");

  for (const c of categories) {
    await client.query(
      `INSERT INTO categories (slug, name, image, description)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (slug) DO UPDATE
       SET name=EXCLUDED.name, image=EXCLUDED.image, description=EXCLUDED.description`,
      [c.slug, c.name, c.image, c.description]
    );
  }

  const slugFor = { "Chivda & Farsan": "snacks", "Sweets & Ladoo": "sweets", "Healthy Snacks": "snacks", "Gift Boxes": "snacks" };

  // Normalise every source into one shape. Ids are explicit so re-seeding is idempotent:
  //   1-18 snacks (same ids as the old static data), 19-22 daily specials, 31-36 tiffin plans, 41-46 extras.
  const rows = [
    ...products.map((p) => ({ ...p, kind: "snack", slug: slugFor[p.category] || "snacks", sales: 0, best: false })),
    ...dailySpecials.map((p, i) => ({
      id: 19 + i, name: p.name, category: "Daily Specials", price: p.price, weight: null,
      description: null, image: p.image, emoji: "🍽️", tag: p.isBestSeller ? "Best Seller" : null,
      healthy: false, featured: false, kind: "snack",
      slug: ["Poha", "Idli"].includes(p.name) ? "meals" : "snacks", sales: p.sales, best: p.isBestSeller,
    })),
    ...tiffinPlans.map((p, i) => ({ ...p, id: 31 + i, kind: "tiffin", slug: "tiffin", image: null, sales: 0, best: false })),
    ...extras.map((p, i) => ({ ...p, id: 41 + i, kind: "extra", image: null, tag: null, weight: null,
      healthy: false, featured: false, sales: 0, best: false })),
  ];

  for (const p of rows) {
    await client.query(
      `INSERT INTO products (id,name,category,price,weight,description,image,emoji,tag,healthy,featured,kind,category_slug,sales,is_best_seller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, category=EXCLUDED.category, price=EXCLUDED.price, weight=EXCLUDED.weight,
         description=EXCLUDED.description, image=EXCLUDED.image, emoji=EXCLUDED.emoji, tag=EXCLUDED.tag,
         healthy=EXCLUDED.healthy, featured=EXCLUDED.featured, kind=EXCLUDED.kind,
         category_slug=EXCLUDED.category_slug, is_best_seller=EXCLUDED.is_best_seller`,
      [p.id, p.name, p.category, p.price, p.weight ?? null, p.description ?? null, p.image ?? null,
       p.emoji ?? null, p.tag ?? null, !!p.healthy, !!p.featured, p.kind, p.slug, p.sales, p.best]
    );
  }
  await client.query(
    "SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products))"
  );

  for (const o of tiffinOptions) {
    await client.query(
      `INSERT INTO tiffin_options (kind,code,label,description,price,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (kind,code) DO UPDATE SET label=EXCLUDED.label, description=EXCLUDED.description,
         price=EXCLUDED.price, sort_order=EXCLUDED.sort_order`,
      [o.kind, o.code, o.label, o.description ?? null, o.price, o.sort]
    );
  }

  await client.query("COMMIT");
  console.log(`Seeded ${categories.length} categories, ${rows.length} products, ${tiffinOptions.length} tiffin options.`);
} catch (e) {
  await client.query("ROLLBACK");
  if (e.code === "42P01") console.error("Tables are missing. Run  npm run db:init  first.");
  throw e;
} finally {
  client.release();
  await pool.end();
}
