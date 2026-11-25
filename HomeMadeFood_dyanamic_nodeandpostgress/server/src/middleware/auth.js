import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function signToken(user) {
  return jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Authentication required." });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = Number(payload.sub);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
