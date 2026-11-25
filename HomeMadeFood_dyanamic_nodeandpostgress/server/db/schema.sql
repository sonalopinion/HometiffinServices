CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  phone         VARCHAR(10)  NOT NULL,
  address       TEXT         NOT NULL,
  password_hash TEXT         NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_uniq ON users (lower(email));

CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(80) UNIQUE NOT NULL,
  name        VARCHAR(120) NOT NULL,
  image       TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  category    VARCHAR(120) NOT NULL,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  weight      VARCHAR(40),
  description TEXT,
  image       TEXT,
  emoji       VARCHAR(16),
  tag         VARCHAR(60),
  healthy     BOOLEAN NOT NULL DEFAULT false,
  featured    BOOLEAN NOT NULL DEFAULT false,
  active      BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);

CREATE TABLE IF NOT EXISTS orders (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  total            NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','preparing','delivered','cancelled')),
  delivery_address TEXT NOT NULL,
  phone            VARCHAR(10) NOT NULL,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  name       VARCHAR(200) NOT NULL,         -- snapshot at purchase time
  unit_price NUMERIC(10,2) NOT NULL,        -- snapshot at purchase time
  quantity   INTEGER NOT NULL CHECK (quantity > 0)
);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items (order_id);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---- v2 additions (safe to re-run) ----
ALTER TABLE products ADD COLUMN IF NOT EXISTS kind VARCHAR(20) NOT NULL DEFAULT 'snack';   -- snack | tiffin | extra
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_slug VARCHAR(80) REFERENCES categories(slug);
ALTER TABLE products ADD COLUMN IF NOT EXISTS sales INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS products_kind_idx ON products (kind);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS details TEXT;

-- Options for the "Customize Your Meal" builder. Price of an option is its full contribution
-- (size = base price, chapati '4' = price for 4 chapatis, extra = add-on price).
CREATE TABLE IF NOT EXISTS tiffin_options (
  id          SERIAL PRIMARY KEY,
  kind        VARCHAR(20) NOT NULL CHECK (kind IN ('size','chapati','sabzi','extra')),
  code        VARCHAR(40) NOT NULL,
  label       VARCHAR(80) NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (kind, code)
);
