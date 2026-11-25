import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import SafeImage from "./SafeImage";

// Product card for the /products and category pages (data comes from the database).
export default function PCard({ data }) {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">
      <div className="relative h-56">
        <SafeImage
          src={data.image}
          alt={data.name}
          fallback={data.emoji || "🍽️"}
          className="object-cover"
        />

        {data.tag && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {data.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <h2 className="text-xl font-bold">{data.name}</h2>

        <p className="text-gray-500 text-sm mt-1">{data.category}</p>

        <p className="text-gray-600 mt-3 line-clamp-2 min-h-12">{data.description}</p>

        <div className="flex justify-between mt-4">
          <span className="text-orange-500 text-2xl font-bold">₹{data.price}</span>
          {data.weight && <span className="text-gray-500 text-sm self-end">{data.weight}</span>}
        </div>

        <div className="flex gap-3 mt-5">
          <Link
            href={`/products/${data.id}`}
            className="flex-1 text-center border border-orange-500 text-orange-600 py-2 rounded-lg hover:bg-orange-50"
          >
            Details
          </Link>

          <AddToCartButton
            product={data}
            className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
          />
        </div>
      </div>
    </div>
  );
}
