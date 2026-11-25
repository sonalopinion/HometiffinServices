"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { placeOrder } from "../../lib/api";

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    removeMany,
    clearCart,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [checkingOut, setCheckingOut] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  function startCheckout() {
    if (!user) {
      router.push("/login?next=/Cart");
      return;
    }
    setAddress((a) => a || user.address || "");
    setPhone((p) => p || user.phone || "");
    setCheckingOut(true);
    setError("");
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");
    setPlacing(true);

    try {
      const order = await placeOrder(cart, {
        deliveryAddress: address.trim(),
        phone: phone.trim(),
        notes: notes.trim() || undefined,
      });
      clearCart();
      setPlacedOrder(order);
      setCheckingOut(false);
    } catch (err) {
      if (err.status === 401) {
        router.push("/login?next=/Cart");
        return;
      }
      if (err.data?.unavailable?.length) {
        // Items that no longer exist (e.g. removed from the menu) are dropped from the cart.
        removeMany(err.data.unavailable);
        setError("Some items are no longer available and were removed from your cart. Please review and try again.");
      } else {
        const first = Object.values(err.fieldErrors || {})[0];
        setError(first || err.message);
      }
    } finally {
      setPlacing(false);
    }
  }

  if (placedOrder) {
    return (
      <main className="min-h-screen bg-orange-50">
        <section className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="rounded-xl bg-white p-10 shadow-sm">
            <p className="text-5xl">🎉</p>
            <h1 className="mt-4 text-2xl font-bold text-orange-900">Order placed!</h1>
            <p className="mt-2 text-gray-600">
              Your order <b>#{placedOrder.id}</b> for <b>₹{placedOrder.total}</b> has been received.
            </p>
            <Link
              href="/orders"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              View My Orders
            </Link>
            <Link href="/Menu" className="mt-4 block text-sm font-medium text-orange-700 hover:underline">
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-orange-900">
          🛒 Your Shopping Cart
        </h1>

        <p className="mt-2 mb-8 text-gray-600">
          Review your homemade snacks and sweets.
        </p>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold">
              Your cart is empty
            </p>

            <p className="mt-2 text-gray-500">
              Add some delicious homemade products to get started.
            </p>

            <Link
              href="/Menu"
              className="inline-block mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-4xl">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        item.emoji || "🍱"
                      )}
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-800">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.weight}
                      </p>

                      <p className="mt-1 font-semibold text-orange-700">
                        ₹{item.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-9 w-9 rounded-md border border-orange-300 hover:bg-orange-100"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        −
                      </button>

                      <span className="min-w-5 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-9 w-9 rounded-md border border-orange-300 hover:bg-orange-100"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        +
                      </button>
                    </div>

                    <p className="min-w-20 text-right font-bold">
                      ₹{item.price * item.quantity}
                    </p>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="mt-5 flex justify-between text-gray-600">
                <span>Total items</span>
                <span>{cartCount}</span>
              </div>

              <div className="mt-3 flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-700">
                    ₹{cartTotal}
                  </span>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Final amount is confirmed by the server. Delivery charges, if applicable, are not included.
                </p>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              {checkingOut ? (
                <form onSubmit={handlePlaceOrder} className="mt-6 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Delivery address
                    <textarea
                      required
                      minLength={10}
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Mobile number
                    <input
                      required
                      pattern="[6-9][0-9]{9}"
                      title="10-digit Indian mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </label>

                  <label className="block text-sm font-medium text-gray-700">
                    Notes (optional)
                    <input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={500}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={placing}
                    className="w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                  >
                    {placing ? "Placing order..." : `Place Order · ₹${cartTotal}`}
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={startCheckout}
                  className="mt-6 w-full rounded-lg bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600"
                >
                  {user ? "Proceed to Checkout" : "Login to Checkout"}
                </button>
              )}

              <Link
                href="/Menu"
                className="mt-4 block text-center text-sm font-medium text-orange-700 hover:underline"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
