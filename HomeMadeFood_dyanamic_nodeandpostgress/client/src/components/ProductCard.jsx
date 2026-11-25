
"use client";

import { useState } from "react";

export default function ProductCard({ product, onAddToCart }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="product-card">
      <div className="product-image">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <span className="product-emoji">{product.emoji}</span>
        )}

        {product.tag && (
          <span className="product-tag">{product.tag}</span>
        )}
      </div>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <h3>{product.name}</h3>

        <p className="product-description">
          {product.description}
        </p>

        {product.healthy && (
          <span className="healthy-label">
            ✓ Better-for-you option
          </span>
        )}

        <div className="product-bottom">
          <div>
            <p className="product-price">
              ₹{product.price}
            </p>
            <p className="product-weight">{product.weight}</p>
          </div>

          <button
            className="add-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            + Add
          </button>
        </div>
      </div>
    </article>
  );
}
