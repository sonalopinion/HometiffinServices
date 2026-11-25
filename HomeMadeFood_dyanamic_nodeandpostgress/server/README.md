# HomeMade Food – Node.js + PostgreSQL backend

Express API + PostgreSQL. Everything the site shows (snacks, tiffin plans, tiffin builder options,
extras, categories, best sellers) comes from the database.

## Run it (Windows)

```
copy .env.example .env          (then edit DATABASE_URL password and JWT_SECRET)
psql -U postgres -c "CREATE DATABASE homemade_food"
npm install
npm run db:init                 creates / upgrades the tables (safe to re-run)
npm run db:seed                 loads categories, products, tiffin options (safe to re-run)
npm run dev                     http://localhost:5000
```

**Two ways to insert all the data** (use either one):
- `npm run db:init` then `npm run db:seed`, or
- open `db/setup.sql` in pgAdmin (Query Tool → open file → Run), or `psql -U postgres -d homemade_food -f db/setup.sql`

It creates the tables and inserts 6 categories, 34 products (22 snacks, 6 tiffin plans, 6 extras) and the 12 tiffin builder options.

**Check it worked:** open http://localhost:5000/api/health — you should see `"seeded":true` and `"products":34`.

Already ran the first version? Just run `npm run db:init` and `npm run db:seed` again to upgrade.

## Troubleshooting: a page keeps saying "Loading" or shows an error

| What you see | Cause / fix |
|---|---|
| "Could not reach the backend" | Backend isn't running → `npm run dev` in the backend folder. Check `NEXT_PUBLIC_API_URL` in the frontend `.env.local`, then restart the frontend. |
| "The database has no products yet" | Data not inserted → `npm run db:seed` (or run `db/setup.sql`). |
| `/api/health` says `"db":"error"` | Wrong `DATABASE_URL` password/db name, PostgreSQL not running, or tables missing (`npm run db:init`). |
| Frontend on a different port | In development any `localhost` port is allowed. For production set `CORS_ORIGIN`. |

After changing `.env.local` always restart `npm run dev` in the frontend.

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | – | `{fullName,email,phone,address,password}` → `{token,user}` |
| POST | `/api/auth/login` | – | `{email,password}` → `{token,user}` |
| GET | `/api/auth/me` | Bearer | current user |
| GET | `/api/products` | – | `?kind=snack\|tiffin\|extra &category= &categorySlug= &featured=true &healthy=true &bestSeller=true &search= &sort=latest\|sales\|price &limit=` |
| GET | `/api/products/labels?kind=snack` | – | category chips for the Menu page |
| GET | `/api/products/:id` | – | |
| GET | `/api/categories`, `/api/categories/:slug` | – | include `productCount` |
| GET | `/api/tiffin/options` | – | sizes, chapatis, sabzi, extras with prices |
| POST | `/api/orders` | Bearer | items: `{productId,quantity}` or `{custom:{size,chapatis,sabzi,extras[]},quantity}`; **prices are always computed on the server** |
| GET | `/api/orders`, `/api/orders/:id` | Bearer | own orders |
| POST | `/api/contact` | – | `{name,email,phone?,message}` |

## Changing data

Use pgAdmin / SQL, e.g. `UPDATE products SET price=130 WHERE name='Poha Chivda';`
`UPDATE tiffin_options SET price=25 WHERE kind='extra' AND code='dal';`
(Don't edit prices in `seed/` and re-run seed unless you want to overwrite your DB changes.)
Set `products.active=false` to hide an item. Seed data lives in `seed/`.

## Tests

`npm test` runs integration tests against the DB in `.env` — use a development database
(tests create and delete their own users, but they do bump `sales` counters).

## Deploy notes

`NODE_ENV=production`, `JWT_SECRET` ≥ 32 chars, `DATABASE_SSL=true` for hosted Postgres,
`CORS_ORIGIN=https://your-site`. Order status starts as `pending`; there is no admin API yet.
