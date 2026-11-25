import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { validate, wrap } from "../middleware/validate.js";

const router = Router();

const limiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10,
  message: { error: "Too many messages. Try again later." } });

const schema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(100),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(5, "Message is too short.").max(2000),
});

router.post("/", limiter, validate(schema), wrap(async (req, res) => {
  const { name, email, phone, message } = req.body;
  await query(
    "INSERT INTO contact_messages (name,email,phone,message) VALUES ($1,$2,$3,$4)",
    [name, email, phone ?? null, message]
  );
  res.status(201).json({ ok: true });
}));

export default router;
