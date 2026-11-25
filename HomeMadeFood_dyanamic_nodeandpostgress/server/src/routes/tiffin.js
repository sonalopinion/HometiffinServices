import { Router } from "express";
import { query } from "../db.js";
import { wrap } from "../middleware/validate.js";

const router = Router();

// Options for the "Customize Your Meal" builder.
router.get("/options", wrap(async (_req, res) => {
  const { rows } = await query(
    "SELECT kind,code,label,description,price FROM tiffin_options WHERE active ORDER BY kind, sort_order, id"
  );
  const group = (k) => rows.filter((r) => r.kind === k).map(({ kind, ...r }) => r);
  res.json({ sizes: group("size"), chapatis: group("chapati"), sabzi: group("sabzi"), extras: group("extra") });
}));

export default router;
