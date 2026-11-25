
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("homemade-cart-v2");

      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      localStorage.removeItem("homemade-cart-v2");
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("homemade-cart-v2", JSON.stringify(cart));
    }
  }, [cart, loaded]);

  function addToCart(product) {
    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(productId) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  }

  function updateQuantity(productId, quantity) {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }

  function removeMany(ids) {
    const set = new Set(ids.map(String));
    setCart((previousCart) => previousCart.filter((item) => !set.has(String(item.id))));
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        removeMany,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
