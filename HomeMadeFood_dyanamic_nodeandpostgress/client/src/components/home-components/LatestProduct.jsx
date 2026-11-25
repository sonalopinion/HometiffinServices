import ProductCard from "../common/ProductCard";
import { getProducts } from "@/lib/api";

export default async function LatestProduct() {
  let products = [];
  try {
    products = await getProducts({ kind: "snack", sort: "latest", limit: 4 });
  } catch {
    // API unreachable: render the section empty instead of crashing the page.
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-lime-50 py-12">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Latest Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
