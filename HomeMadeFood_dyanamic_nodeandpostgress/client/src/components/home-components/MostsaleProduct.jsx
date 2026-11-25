import DyanamicCard from "../common/DyanamicCard";
import { getProducts } from "@/lib/api";

export default async function MostsaleProduct() {
  let products = [];
  try {
    products = await getProducts({ bestSeller: "true", sort: "sales", limit: 4 });
  } catch {
    // API unreachable: render the section empty instead of crashing the page.
  }

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-orange-50">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-4xl font-bold text-center">🔥 Most Selling Products</h2>

        <p className="text-center text-gray-500 mt-2 mb-10">
          Our customers&apos; favorite homemade dishes
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <DyanamicCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
