-- HomeMade Food: full setup (tables + all data). Run once in pgAdmin Query Tool or:
--   psql -U postgres -d homemade_food -f db/setup.sql
-- Safe to re-run: tables use IF NOT EXISTS and data rows are upserted by id/slug.

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

-- ===================== DATA =====================
INSERT INTO public.categories (id, slug, name, image, description) VALUES (1, 'snacks', 'Snacks', '/categories/snacks.jpeg', 'Fresh homemade snacks.') ON CONFLICT DO NOTHING;
INSERT INTO public.categories (id, slug, name, image, description) VALUES (2, 'tiffin', 'Tiffin', '/categories/tiffin.jpeg', 'Healthy breakfast and tiffin.') ON CONFLICT DO NOTHING;
INSERT INTO public.categories (id, slug, name, image, description) VALUES (3, 'sweets', 'Sweets', '/categories/sweets.jpeg', 'Traditional homemade sweets.') ON CONFLICT DO NOTHING;
INSERT INTO public.categories (id, slug, name, image, description) VALUES (4, 'pickles', 'Pickles', '/categories/pickles.jpeg', 'Delicious homemade pickles.') ON CONFLICT DO NOTHING;
INSERT INTO public.categories (id, slug, name, image, description) VALUES (5, 'meals', 'Meals', '/categories/meals.jpeg', 'Fresh lunch and dinner.') ON CONFLICT DO NOTHING;
INSERT INTO public.categories (id, slug, name, image, description) VALUES (6, 'drinks', 'Drinks', '/categories/drinks.jpeg', 'Healthy homemade drinks.') ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (1, 'Poha Chivda', 'Chivda & Farsan', 120.00, '250 g', 'Crunchy poha with peanuts, curry leaves and homemade spices.', '/images/poha-chivda.jpg', '🥣', 'Bestseller', false, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (2, 'Murmura Chivda', 'Chivda & Farsan', 90.00, '250 g', 'Light puffed rice snack with spices and roasted peanuts.', '/images/murmura-chivda.jpg', '🍘', 'Popular', false, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (3, 'Cornflakes Chivda', 'Chivda & Farsan', 130.00, '250 g', 'Crispy cornflakes tossed with nuts and Indian spices.', '/images/cornflakes-chivda.jpg', '🌽', 'Homemade', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (4, 'Besan Ladoo', 'Sweets & Ladoo', 180.00, '250 g', 'Traditional besan ladoos prepared with ghee and cardamom.', '/images/besan-ladoo.jpg', '🟡', 'Diwali Special', false, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (5, 'Rava Ladoo', 'Sweets & Ladoo', 160.00, '250 g', 'Homemade semolina ladoos with coconut and cardamom.', '/images/rava-ladoo.jpg', '🍡', 'Traditional', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (6, 'Dry Fruit Ladoo', 'Sweets & Ladoo', 260.00, '250 g', 'Dates, almonds, cashews and mixed nuts in every bite.', '/images/dry-fruit-ladoo.jpg', '🥜', 'No Added Sugar', true, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (7, 'Til Gul Ladoo', 'Sweets & Ladoo', 150.00, '250 g', 'Sesame seeds and jaggery in a traditional sweet.', '/images/til-gul-ladoo.jpg', '⚪', 'Traditional', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (8, 'Garlic Sev', 'Chivda & Farsan', 110.00, '250 g', 'Crispy gram flour sev with a bold homemade garlic flavour.', '/images/garlic-sev.jpg', '🍜', 'Spicy', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (9, 'Homemade Chakli', 'Chivda & Farsan', 140.00, '250 g', 'Traditional spiral-shaped crunchy rice flour snack.', '/images/chakli.jpg', '🥨', 'Diwali Special', false, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (10, 'Shankarpali', 'Chivda & Farsan', 130.00, '250 g', 'Golden, bite-sized traditional sweet tea-time snack.', '/images/shankarpali.jpg', '🍪', 'Festive Favourite', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (11, 'Roasted Makhana', 'Healthy Snacks', 150.00, '100 g', 'Roasted fox nuts seasoned with your favourite spices.', '/images/makhana.jpg', '🌰', 'Roasted', true, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (12, 'Roasted Chana', 'Healthy Snacks', 80.00, '200 g', 'Roasted chickpeas for a crunchy, protein-containing snack.', '/images/roasted-chana.jpg', '🫘', 'Protein Source', true, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (13, 'Jaggery Peanut Bites', 'Healthy Snacks', 100.00, '200 g', 'Roasted peanuts bound with traditional jaggery.', '/images/peanut-bites.jpg', '🥜', 'Jaggery Sweetened', true, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (14, 'Multigrain Chakli', 'Healthy Snacks', 160.00, '200 g', 'Crunchy multigrain snack made with a blend of flours.', '/images/multigrain-chakli.jpg', '🌾', 'Multigrain', true, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (15, 'Dry Fruit Mix', 'Healthy Snacks', 220.00, '200 g', 'A mix of almonds, cashews, raisins and other nuts.', '/images/dry-fruit-mix.jpg', '🥜', 'Nut Mix', true, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (16, 'Bhakarwadi', 'Chivda & Farsan', 160.00, '250 g', 'Spicy, tangy and crunchy traditional Maharashtrian snack.', '/images/bhakarwadi.jpg', '🥮', 'Maharashtrian', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (17, 'Sabudana Chivda', 'Chivda & Farsan', 150.00, '250 g', 'Crunchy sabudana snack with peanuts and mild spices.', '/images/sabudana-chivda.jpg', '🍘', 'Tea-Time Snack', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (18, 'Diwali Faral Combo', 'Gift Boxes', 499.00, '750 g', 'A festive assortment of chivda, chakli, shankarpali and sev.', '/images/faral-combo.jpg', '🎁', 'Festive Combo', false, true, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (19, 'Homemade Samosa', 'Daily Specials', 80.00, NULL, NULL, '/images/products/samosa.jpg', '🍽️', 'Best Seller', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 250, true) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (20, 'Veg Sandwich', 'Daily Specials', 120.00, NULL, NULL, '/images/products/sandwich.jpg', '🍽️', 'Best Seller', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'snacks', 180, true) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (21, 'Poha', 'Daily Specials', 60.00, NULL, NULL, '/images/products/poha.jpg', '🍽️', 'Best Seller', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'meals', 300, true) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (22, 'Idli', 'Daily Specials', 90.00, NULL, NULL, '/images/products/idli.jpg', '🍽️', 'Best Seller', false, false, true, '2026-11-24 11:01:48.186823+00', 'snack', 'meals', 220, true) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (31, 'Regular Veg Tiffin', 'Tiffin Service', 100.00, '1 Meal', '4 chapatis, seasonal sabzi, dal and rice.', NULL, '🍱', 'Daily Favourite', true, true, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (32, 'Mini Veg Tiffin', 'Tiffin Service', 70.00, '1 Meal', '3 chapatis, seasonal sabzi and dal.', NULL, '🥗', 'Budget Friendly', true, false, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (33, 'Special Veg Thali', 'Tiffin Service', 150.00, '1 Meal', 'Chapatis, two sabzis, dal, rice, salad and sweet.', NULL, '🍛', 'Special', true, true, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (34, 'Dal Rice Tiffin', 'Tiffin Service', 80.00, '1 Meal', 'Comforting dal, steamed rice and homemade pickle.', NULL, '🍚', 'Comfort Food', true, false, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (35, 'Chapati Sabzi Tiffin', 'Tiffin Service', 90.00, '1 Meal', 'Fresh chapatis with seasonal homemade sabzi.', NULL, '🫓', 'Homemade', true, false, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (36, 'Premium Tiffin', 'Tiffin Service', 180.00, '1 Meal', 'Chapatis, paneer sabzi, dal, rice, salad and sweet.', NULL, '🍲', 'Premium', false, true, true, '2026-11-24 11:01:48.186823+00', 'tiffin', 'tiffin', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (41, 'Gulab Jamun', 'Sweets', 40.00, NULL, 'Soft, syrup-filled traditional Indian sweet.', NULL, '🍮', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (42, 'Kaju Katli', 'Sweets', 60.00, NULL, 'Delicious cashew sweet for a special treat.', NULL, '🍬', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'sweets', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (43, 'Homemade Mango Pickle', 'Pickles', 30.00, NULL, 'Traditional tangy and spicy mango pickle.', NULL, '🥒', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'pickles', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (44, 'Lemon Pickle', 'Pickles', 25.00, NULL, 'Homemade lemon pickle with authentic flavours.', NULL, '🍋', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'pickles', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (45, 'Fresh Lime Juice', 'Drinks', 35.00, NULL, 'Refreshing lime drink to accompany your meal.', NULL, '🍋', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'drinks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.products (id, name, category, price, weight, description, image, emoji, tag, healthy, featured, active, created_at, kind, category_slug, sales, is_best_seller) VALUES (46, 'Masala Chaas', 'Drinks', 25.00, NULL, 'Cooling buttermilk with a hint of Indian spices.', NULL, '🥤', NULL, false, false, true, '2026-11-24 11:01:48.186823+00', 'extra', 'drinks', 0, false) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (1, 'size', 'Mini', 'Mini', 'Small appetite', 40.00, 1, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (2, 'size', 'Regular', 'Regular', 'Everyday meal', 60.00, 2, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (3, 'size', 'Premium', 'Premium', 'Extra-special meal', 90.00, 3, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (4, 'chapati', '2', '2 chapatis', NULL, 16.00, 1, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (5, 'chapati', '4', '4 chapatis', NULL, 32.00, 2, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (6, 'chapati', '6', '6 chapatis', NULL, 48.00, 3, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (7, 'sabzi', '1', '1 serving', NULL, 15.00, 1, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (8, 'sabzi', '2', '2 servings', NULL, 30.00, 2, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (9, 'extra', 'dal', 'Dal', NULL, 20.00, 1, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (10, 'extra', 'rice', 'Rice', NULL, 20.00, 2, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (11, 'extra', 'salad', 'Salad', NULL, 10.00, 3, true) ON CONFLICT DO NOTHING;
INSERT INTO public.tiffin_options (id, kind, code, label, description, price, sort_order, active) VALUES (12, 'extra', 'sweet', 'Sweet', NULL, 20.00, 4, true) ON CONFLICT DO NOTHING;
SELECT pg_catalog.setval('public.categories_id_seq', 6, true);
SELECT pg_catalog.setval('public.products_id_seq', 46, true);
SELECT pg_catalog.setval('public.tiffin_options_id_seq', 12, true);
SELECT setval(pg_get_serial_sequence('products','id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('categories','id'), (SELECT MAX(id) FROM categories));
SELECT setval(pg_get_serial_sequence('tiffin_options','id'), (SELECT MAX(id) FROM tiffin_options));
