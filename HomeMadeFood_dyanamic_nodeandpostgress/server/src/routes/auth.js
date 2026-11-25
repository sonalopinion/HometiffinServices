import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { signToken, requireAuth } from "../middleware/auth.js";
import { validate, wrap } from "../middleware/validate.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
});

// Same rules as the frontend register form.
const registerSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must contain at least 3 characters.")
    .max(100).regex(/^[a-zA-Z\s.'-]+$/, "Enter a valid name using letters only."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
  address: z.string().trim().min(10, "Address must contain at least 10 characters.").max(500),
  password: z.string().min(8, "Password must contain at least 8 characters.").max(72)
    .regex(/[A-Z]/, "Include at least one uppercase letter.")
    .regex(/[a-z]/, "Include at least one lowercase letter.")
    .regex(/\d/, "Include at least one number.")
    .regex(/[^A-Za-z0-9]/, "Include at least one special character."),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required.").max(72),
});

const publicUser = (u) => ({
  id: u.id,
  fullName: u.full_name,
  email: u.email,
  phone: u.phone,
  address: u.address,
});

// bcrypt compare against this when the email is unknown, so timing doesn't leak which emails exist.
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

router.post("/register", authLimiter, validate(registerSchema), wrap(async (req, res) => {
  const { fullName, email, phone, address, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  try {
    const { rows } = await query(
      `INSERT INTO users (full_name,email,phone,address,password_hash)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [fullName, email, phone, address, hash]
    );
    res.status(201).json({ token: signToken(rows[0]), user: publicUser(rows[0]) });
  } catch (e) {
    if (e.code === "23505") {
      return res.status(409).json({
        error: "Validation failed.",
        errors: { email: "An account with this email already exists." },
      });
    }
    throw e;
  }
}));

router.post("/login", authLimiter, validate(loginSchema), wrap(async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query("SELECT * FROM users WHERE lower(email)=$1", [email]);
  const user = rows[0];
  const ok = await bcrypt.compare(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !ok) {
    return res.status(401).json({ error: "Invalid email or password." });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
}));

router.get("/me", requireAuth, wrap(async (req, res) => {
  const { rows } = await query("SELECT * FROM users WHERE id=$1", [req.userId]);
  if (!rows[0]) return res.status(401).json({ error: "Account no longer exists." });
  res.json({ user: publicUser(rows[0]) });
}));

export default router;
