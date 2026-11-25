import pg from "pg";
import { config } from "./config.js";

// NUMERIC comes back as string by default; return numbers instead.
pg.types.setTypeParser(1700, (v) => (v === null ? null : parseFloat(v)));

export const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: config.databaseSsl ? { rejectUnauthorized: false } : false,
});

export const query = (text, params) => pool.query(text, params);
