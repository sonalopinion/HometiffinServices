import Link from "next/link";
import SafeImage from "../common/SafeImage";

export default function CategoryCard({ data }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl duration-300">
      <div className="relative h-60">
        <SafeImage src={data.image} alt={data.name} className="object-cover" />
      </div>

      <div className="p-5">
        <h2 className="text-2xl font-bold">{data.name}</h2>

        <p className="text-gray-600 mt-3">{data.description}</p>

        {typeof data.productCount === "number" && (
          <p className="text-sm text-gray-500 mt-2">{data.productCount} items</p>
        )}

        <Link
          href={`/Categories/${data.slug}`}
          className="inline-block mt-5 bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
