
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getProducts, getProductLabels } from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import "./page.css";

export default function MenuPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense fallback={<main className="store"><p className="empty-state">Loading...</p></main>}>
      <Menu />
    </Suspense>
  );
}

function Menu() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState(urlSearch);
  const [products, setProducts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const { cartCount, cartTotal, addToCart } = useCart();

  // Products and category chips come from the database.
  useEffect(() => {
    Promise.all([getProducts({ kind: "snack" }), getProductLabels("snack")])
      .then(([items, cats]) => {
        setProducts(items);
        setLabels(cats);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  // Header search box navigates here with ?search=...
  useEffect(() => {
    setSearch(urlSearch);
    if (urlSearch) setCategory("All"); // a header search should look across all categories
  }, [urlSearch]);

  const categories = ["All", ...labels];

  const filteredProducts = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSearch =
        product.name.toLowerCase().includes(searchText) ||
        (product.description || "").toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  return (
    <main className="store">
      <section className="hero">
        <p className="eyebrow">MADE WITH LOVE</p>

        <h1>Homemade Goodness, Delivered Fresh</h1>

        <p>
          Traditional snacks, delicious ladoos and festive
          faral prepared with care.
        </p>
      </section>

      <section className="catalog">
        <div className="catalog-heading">
          <div>
            <h2>Our Homemade Collection</h2>
            <p>Find your favourite snacks and sweets.</p>
          </div>

          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="category-filters">
          {categories.map((item) => (
            <button
              type="button"
              key={item}
              className={
                category === item
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {status === "loading" && <p className="empty-state">Loading products...</p>}

        {status === "error" && (
          <p className="empty-state" role="alert">
            Could not reach the backend. Start it (<code>npm run dev</code> in the backend folder)
            and make sure <code>NEXT_PUBLIC_API_URL</code> in <code>.env.local</code> is correct,
            then refresh.
          </p>
        )}

        {status === "ready" && products.length === 0 && (
          <p className="empty-state" role="alert">
            The database has no products yet. In the backend folder run{" "}
            <code>npm run db:seed</code>, then refresh.
          </p>
        )}

        {status === "ready" && products.length > 0 && filteredProducts.length === 0 && (
          <p className="empty-state">
            No products found. Try another search.
          </p>
        )}
      </section>

      {cartCount > 0 && (
        <aside className="cart-bar">
          <span>
            {cartCount} item(s) · Total ₹{cartTotal}
          </span>

          <Link href="/Cart" className="cart-bar-button">
            View Cart
          </Link>
        </aside>
      )}

      <footer className="store-footer">
        Freshly prepared · Homemade with care
      </footer>
    </main>
  );
}
