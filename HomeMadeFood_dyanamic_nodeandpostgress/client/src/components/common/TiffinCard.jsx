
"use client";

import SafeImage from "./SafeImage";

export default function TiffinCard({ product, onAddToCart }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative h-56 w-full overflow-hidden bg-orange-50">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallback={product.emoji || "🍱"}
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
          {product.category || "Homemade"}
        </span>

        <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
          ● Freshly Made
        </span>
      </div>

      {/* Product Details */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-orange-600">
            {product.name}
          </h3>

          <span className="shrink-0 rounded-md bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
            ★ 4.8
          </span>
        </div>

        <p className="mt-2 min-h-10 text-sm leading-6 text-gray-500">
          {product.description ||
            "Delicious homemade food prepared with fresh ingredients."}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <p className="mt-1 text-2xl font-extrabold text-orange-600">
              ₹{product.price}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
          >
            <span className="text-xl leading-none">+</span>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
