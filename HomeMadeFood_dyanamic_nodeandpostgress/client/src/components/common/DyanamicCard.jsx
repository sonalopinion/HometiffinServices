import AddToCartButton from "./AddToCartButton";
import SafeImage from "./SafeImage";

export default function DyanamicCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
      <div className="relative h-56">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallback={product.emoji || "🍽️"}
          className="object-cover"
        />

        {product.isBestSeller && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
            Best Seller
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold">{product.name}</h3>

        <p className="text-orange-600 text-lg font-semibold mt-2">₹{product.price}</p>

        <p className="text-gray-500 text-sm mt-2">Sold: {product.sales}+ Orders</p>

        <AddToCartButton
          product={product}
          className="mt-5 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
        />
      </div>
    </div>
  );
}
