import AddToCartButton from "./AddToCartButton";
import SafeImage from "./SafeImage";

// Used by "Latest Products" on the home page.
export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <div className="relative h-56 w-full">
        <SafeImage
          src={product.image}
          alt={product.name}
          fallback={product.emoji || "🍽️"}
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>

        <p className="text-gray-600 mt-2 line-clamp-2 min-h-12">
          {product.description || product.category}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span className="text-orange-500 font-bold text-xl">₹{product.price}</span>

          <AddToCartButton
            product={product}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
          />
        </div>
      </div>
    </div>
  );
}
