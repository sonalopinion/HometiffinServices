"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getOrders } from "../../lib/api";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getOrders()
      .then(setOrders)
      .catch((err) => setError(err.message));
  }, [user]);

  if (authLoading) {
    return <main className="min-h-screen p-10 text-center">Loading...</main>;
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-orange-50 p-10 text-center">
        <p className="text-xl font-semibold">Please log in to see your orders.</p>
        <Link
          href="/login?next=/orders"
          className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Go to Login
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-orange-50">
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-3xl font-bold text-orange-900">📦 My Orders</h1>

        {error && <p className="mt-6 text-red-600">{error}</p>}
        {!orders && !error && <p className="mt-6 text-gray-500">Loading orders...</p>}

        {orders && orders.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold">No orders yet</p>
            <Link
              href="/Menu"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Menu
            </Link>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {orders?.map((order) => (
            <article key={order.id} className="rounded-xl bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-800">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                    STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 divide-y text-sm">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4 py-2">
                    <span>
                      {item.name} × {item.quantity}
                      {item.details && (
                        <span className="block text-xs text-gray-500">{item.details}</span>
                      )}
                    </span>
                    <span className="font-medium">₹{item.unitPrice * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t pt-3 font-bold">
                <span>Total</span>
                <span className="text-orange-700">₹{order.total}</span>
              </div>
              <p className="mt-2 text-xs text-gray-500">Deliver to: {order.delivery_address}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
