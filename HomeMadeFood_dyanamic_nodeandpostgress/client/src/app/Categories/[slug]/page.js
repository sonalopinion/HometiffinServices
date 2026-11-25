import { notFound } from "next/navigation";
import { getCategory, getProducts } from "@/lib/api";
import PCard from "@/components/common/PCard";
import SafeImage from "@/components/common/SafeImage";

export default async function CategoryDetails({ params }) {
  const { slug } = await params;

  let category;
  try {
    category = await getCategory(slug);
  } catch (err) {
    if (err.status === 404) notFound();
    throw err;
  }

  const products = await getProducts({ categorySlug: slug });
  const totalSold = products.reduce((sum, p) => sum + (p.sales || 0), 0);

  return (
    <section className="min-h-screen bg-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-[450px]">
            <SafeImage src={category.image} alt={category.name} className="object-cover" />
          </div>

          <div className="p-10">
            <h1 className="text-5xl font-bold text-orange-600">{category.name}</h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">{category.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-orange-100 rounded-xl p-5 text-center">
                <h2 className="text-3xl font-bold text-orange-600">{category.productCount}</h2>
                <p>Items</p>
              </div>

              <div className="bg-orange-100 rounded-xl p-5 text-center">
                <h2 className="text-3xl font-bold text-orange-600">100%</h2>
                <p>Fresh</p>
              </div>

              <div className="bg-orange-100 rounded-xl p-5 text-center">
                <h2 className="text-3xl font-bold text-orange-600">{totalSold}</h2>
                <p>Sold</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">
          {category.name} items
        </h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No items in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <PCard key={p.id} data={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
