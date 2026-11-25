"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useCart } from "../../context/CartContext";
import { getProducts, getTiffinOptions } from "../../lib/api";
import "./page.css";
import TiffinCard from "../../components/common/TiffinCard";

export default function TiffinServicePage() {
  const { addToCart, cartCount } = useCart();

  // Everything below comes from the database.
  const [options, setOptions] = useState(null); // { sizes, chapatis, sabzi, extras }
  const [tiffinProducts, setTiffinProducts] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [loadError, setLoadError] = useState(false);

  const [search, setSearch] = useState("");
  const [size, setSize] = useState("");
  const [chapatis, setChapatis] = useState("");
  const [sabzi, setSabzi] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    Promise.all([
      getTiffinOptions(),
      getProducts({ kind: "tiffin" }),
      getProducts({ kind: "extra" }),
    ])
      .then(([opts, tiffins, extras]) => {
        setOptions(opts);
        setTiffinProducts(tiffins);
        setExtraItems(extras);

        // Sensible defaults: Regular, 4 chapatis, 1 sabzi, dal + rice.
        setSize(opts.sizes.find((s) => s.code === "Regular")?.code || opts.sizes[0]?.code || "");
        setChapatis(opts.chapatis.find((c) => c.code === "4")?.code || opts.chapatis[0]?.code || "");
        setSabzi(opts.sabzi[0]?.code || "");
        setSelectedExtras(
          opts.extras.filter((e) => ["dal", "rice"].includes(e.code)).map((e) => e.code)
        );
      })
      .catch(() => setLoadError(true));
  }, []);

  const sizeOpt = options?.sizes.find((o) => o.code === size);
  const chapatiOpt = options?.chapatis.find((o) => o.code === chapatis);
  const sabziOpt = options?.sabzi.find((o) => o.code === sabzi);
  const extraOpts = (options?.extras || []).filter((o) => selectedExtras.includes(o.code));

  const customizedPrice =
    (sizeOpt?.price || 0) +
    (chapatiOpt?.price || 0) +
    (sabziOpt?.price || 0) +
    extraOpts.reduce((total, o) => total + o.price, 0);

  const customDescription = [
    `${chapatis} chapatis`,
    `${sabzi} sabzi serving(s)`,
    ...extraOpts.map((o) => o.label),
  ].join(", ");

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tiffinProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query)
    );
  }, [search, tiffinProducts]);

  function toggleExtra(code, checked) {
    setSelectedExtras((prev) =>
      checked ? [...prev, code] : prev.filter((c) => c !== code)
    );
    setAddedMessage("");
  }

  function handleAddCustomizedMeal() {
    // Identical configurations share a cart line. The server re-prices the
    // meal from the same database options when the order is placed.
    const custom = {
      size,
      chapatis: Number(chapatis),
      sabzi: Number(sabzi),
      extras: [...selectedExtras].sort(),
    };

    addToCart({
      id: `custom-tiffin-${[size, chapatis, sabzi, ...custom.extras].join("-")}`,
      name: `${sizeOpt?.label} Customized Tiffin`,
      category: "Tiffin Service",
      price: customizedPrice,
      weight: customDescription,
      description: customDescription,
      emoji: "🍱",
      tag: "Customized",
      custom,
    });
    setAddedMessage("Customized tiffin added to your cart!");
  }

  return (
    <main className="tiffin-page">
      <section className="tiffin-hero">
        <p className="tiffin-eyebrow">FRESH • HOMEMADE • DELICIOUS</p>

        <h1>Homemade Tiffin Service</h1>

        <p>
          Freshly prepared meals for your everyday lunch and dinner.
          Choose a ready-made tiffin or customize your own meal.
        </p>

        <a href="#customize-meal" className="tiffin-hero-button">
          Customize Your Meal
        </a>
      </section>

      {loadError && (
        <p className="tiffin-empty" role="alert">
          Could not reach the backend. Start it (npm run dev in the backend folder), check
          NEXT_PUBLIC_API_URL in .env.local, then refresh.
        </p>
      )}

      {options && tiffinProducts.length === 0 && (
        <p className="tiffin-empty" role="alert">
          The database has no tiffin data yet. In the backend folder run npm run db:seed, then refresh.
        </p>
      )}

      {/* CUSTOMIZE YOUR MEAL */}
      {options && (
        <section className="custom-meal-section" id="customize-meal">
          <div className="custom-meal-heading">
            <span className="custom-meal-icon">👩‍🍳</span>

            <div>
              <h2>Customize Your Meal</h2>
              <p>Build your own tiffin by choosing your favourite homemade food options.</p>
            </div>
          </div>

          <div className="custom-meal-layout">
            <div className="custom-meal-options">
              <div className="meal-option-group">
                <h3>1. Select meal size</h3>

                <div className="meal-size-options">
                  {options.sizes.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      className={`meal-size-card ${size === option.code ? "selected" : ""}`}
                      onClick={() => {
                        setSize(option.code);
                        setAddedMessage("");
                      }}
                      aria-pressed={size === option.code}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.description}</span>
                      <b>Base ₹{option.price}</b>
                    </button>
                  ))}
                </div>
              </div>

              <div className="meal-option-group">
                <h3>2. Choose chapatis</h3>

                <div className="meal-choice-row">
                  {options.chapatis.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      className={`meal-choice-button ${chapatis === option.code ? "selected" : ""}`}
                      onClick={() => {
                        setChapatis(option.code);
                        setAddedMessage("");
                      }}
                      aria-pressed={chapatis === option.code}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="meal-option-group">
                <h3>3. Choose sabzi quantity</h3>

                <div className="meal-choice-row">
                  {options.sabzi.map((option) => (
                    <button
                      type="button"
                      key={option.code}
                      className={`meal-choice-button ${sabzi === option.code ? "selected" : ""}`}
                      onClick={() => {
                        setSabzi(option.code);
                        setAddedMessage("");
                      }}
                      aria-pressed={sabzi === option.code}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="meal-option-group">
                <h3>4. Select extras</h3>

                <div className="meal-extras">
                  {options.extras.map((option) => (
                    <label key={option.code}>
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(option.code)}
                        onChange={(event) => toggleExtra(option.code, event.target.checked)}
                      />
                      <span>{option.label}</span>
                      <b>+₹{option.price}</b>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE PRICE SUMMARY */}
            <aside className="custom-meal-summary">
              <div className="custom-meal-illustration">🍱</div>

              <h3>Your Customized Tiffin</h3>

              <p className="custom-meal-size">{sizeOpt?.label} Meal</p>

              <ul>
                <li>
                  <span>Chapatis</span>
                  <strong>{chapatis}</strong>
                </li>

                <li>
                  <span>Sabzi servings</span>
                  <strong>{sabzi}</strong>
                </li>

                {extraOpts.map((o) => (
                  <li key={o.code}>
                    <span>{o.label}</span>
                    <strong>Included</strong>
                  </li>
                ))}
              </ul>

              <div className="custom-meal-total">
                <span>Total price</span>
                <strong>₹{customizedPrice}</strong>
              </div>

              <button
                type="button"
                className="custom-meal-add-button"
                onClick={handleAddCustomizedMeal}
              >
                Add Customized Tiffin
              </button>

              {addedMessage && (
                <p className="custom-meal-success" role="status">
                  ✓ {addedMessage}
                </p>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* READY-MADE TIFFIN VARIETIES */}
      <section className="tiffin-content" id="tiffin-menu">
        <div className="tiffin-heading">
          <div>
            <h2>Our Tiffin Varieties</h2>
            <p>Prefer a ready-made meal? Choose from our tiffin menu.</p>
          </div>

          <input
            type="search"
            placeholder="Search tiffin..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search tiffin varieties"
          />
        </div>

        {filteredProducts.length > 0 ? (
          <div className="tiffin-grid">
            {filteredProducts.map((product) => (
              <TiffinCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="tiffin-empty">
            <span>🍱</span>
            <h3>
              {loadError ? "Tiffin menu unavailable" : options ? "No tiffin found" : "Loading tiffin menu..."}
            </h3>
            {options && tiffinProducts.length > 0 && <p>Try searching for another tiffin variety.</p>}
          </div>
        )}

        {cartCount > 0 && (
          <Link href="/Cart" className="tiffin-cart-link">
            View Cart ({cartCount} items)
          </Link>
        )}
      </section>

      {/* EXTRA ITEMS SECTION */}
      {extraItems.length > 0 && (
        <section className="tiffin-extras-section" id="extra-items">
          <div className="tiffin-extras-heading">
            <span className="tiffin-extras-eyebrow">MAKE IT EXTRA SPECIAL</span>
            <h2>Complete Your Meal 🍽️</h2>
            <p>Add your favourite sweets, pickles and refreshing drinks to your order.</p>
          </div>

          <div className="tiffin-extras-grid">
            {extraItems.map((item) => (
              <article className="extra-item-card" key={item.id}>
                <div className="extra-item-emoji">{item.emoji}</div>

                <div className="extra-item-info">
                  <span className="extra-item-category">{item.category}</span>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>

                  <div className="extra-item-footer">
                    <strong>₹{item.price}</strong>

                    <button type="button" onClick={() => addToCart(item)}>
                      <span>+</span> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="tiffin-extras-note">
            ✨ Add something extra to make your homemade meal even better!
          </p>
        </section>
      )}
    </main>
  );
}
