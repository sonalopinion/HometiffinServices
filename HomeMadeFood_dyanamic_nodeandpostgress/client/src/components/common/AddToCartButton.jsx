"use client";

import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

export default function AddToCartButton({ product, className = "", children, icon = false }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {icon && <FaShoppingCart />}
      {added ? "✓ Added" : children || "Add to Cart"}
    </button>
  );
}
