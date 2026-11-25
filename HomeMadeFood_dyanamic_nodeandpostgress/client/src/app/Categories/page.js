import CategoryCard from "@/components/category/CategoryCard";
import { getCategories } from "@/lib/api";

export default async function Categories() {
  let categories = [];
  let failed = false;
  try {
    categories = await getCategories();
  } catch {
    failed = true;
  }

  return (
    <section className="bg-orange-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-orange-600">Food Categories</h1>

          <p className="text-gray-600 mt-3 text-lg">
            Explore our delicious homemade food categories.
          </p>
        </div>

        {failed && (
          <p className="text-center text-red-600">
            Could not load categories. Please make sure the server is running.
          </p>
        )}

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((item) => (
            <CategoryCard key={item.id} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
