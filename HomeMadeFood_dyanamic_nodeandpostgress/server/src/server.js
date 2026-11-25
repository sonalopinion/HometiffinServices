import { app } from "./app.js";
import { config } from "./config.js";
import { pool } from "./db.js";

const server = app.listen(config.port, () =>
  console.log(`API listening on http://localhost:${config.port}`)
);

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => server.close(() => pool.end().then(() => process.exit(0))));
}
