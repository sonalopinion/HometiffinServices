import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { query } from "./db.js";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";
import tiffinRouter from "./routes/tiffin.js";
import contactRouter from "./routes/contact.js";
import { productsRouter, categoriesRouter } from "./routes/catalog.js";

export const app = express();

app.use(helmet());
// In development accept any localhost / 127.0.0.1 port (Next.js may start on 3001 if 3000 is busy).
const devLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
app.use(cors({
  origin: (origin, cb) =>
    cb(null, !origin || config.corsOrigins.includes(origin) ||
      (process.env.NODE_ENV !== "production" && devLocal.test(origin))),
}));
app.use(express.json({ limit: "50kb" }));

// Open http://localhost:5000/api/health to see whether the DB is connected AND has data.
app.get("/api/health", async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT (SELECT COUNT(*) FROM products)::int AS products,
              (SELECT COUNT(*) FROM categories)::int AS categories,
              (SELECT COUNT(*) FROM tiffin_options)::int AS "tiffinOptions"`
    );
    const counts = rows[0];
    const seeded = counts.products > 0 && counts.tiffinOptions > 0;
    res.json({ ok: true, db: "connected", ...counts, seeded,
      hint: seeded ? undefined : "Tables are empty. Run: npm run db:seed (or run db/setup.sql)." });
  } catch (e) {
    res.status(503).json({ ok: false, db: "error", error: e.message,
      hint: e.code === "42P01"
        ? "Tables are missing. Run: npm run db:init and npm run db:seed (or run db/setup.sql)."
        : "Cannot use the database. Check DATABASE_URL in .env and that PostgreSQL is running." });
  }
});
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/tiffin", tiffinRouter);
app.use("/api/contact", contactRouter);

app.use((_req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body." });
  }
  console.error(err);
  res.status(500).json({ error: "Something went wrong." });
});
