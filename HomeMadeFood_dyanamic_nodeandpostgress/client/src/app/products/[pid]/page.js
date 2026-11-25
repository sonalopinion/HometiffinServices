import { notFound } from "next/navigation";
import { FaTruck, FaLeaf, FaCheckCircle } from "react-icons/fa";
import { getProduct } from "@/lib/api";
import AddToCartButton from "@/components/common/AddToCartButton";
import SafeImage from "@/components/common/SafeImage";

export default async function ProductDetails({ params }) {
  const { pid } = await params;

  let product;
  try {
    product = await getProduct(pid);
  } catch (err) {
    if (err.status === 404 || err.status === 400) notFound();
    throw err; // API down etc. -> Next.js error page
  }

  return (
    <section className="bg-orange-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-5">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Side */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-100">
              <SafeImage
                src={product.image}
                alt={product.name}
                fallback={product.emoji || "🍽️"}
                className="object-contain p-5 hover:scale-105 duration-300"
              />
            </div>

            {/* Right Side */}
            <div>
              {product.tag && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  {product.tag}
                </span>
              )}

              <h1 className="text-4xl font-bold mt-5">{product.name}</h1>

              <p className="text-gray-500 mt-2">Category : {product.category}</p>
              {product.weight && <p className="text-gray-500">Pack size : {product.weight}</p>}

              <div className="mt-5">
                <span className="text-5xl text-orange-500 font-bold">₹{product.price}</span>
              </div>

              <p className="mt-6 text-gray-600 leading-8">{product.description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-5 mt-8">
                <div className="flex items-center gap-2">
                  <FaLeaf className="text-green-600" />
                  Freshly Made
                </div>

                <div className="flex items-center gap-2">
                  <FaTruck className="text-orange-500" />
                  Fast Delivery
                </div>

                {product.healthy && (
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-blue-500" />
                    Better-for-you option
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-5 mt-10">
                <AddToCartButton
                  product={product}
                  icon
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg"
                />
              </div>

              {/* Delivery */}
              <div className="bg-orange-100 mt-10 rounded-xl p-5">
                <h2 className="font-bold text-lg">Delivery Information</h2>
                <p className="mt-2">🚚 Free Delivery on orders above ₹499</p>
                <p>⏱ Estimated Delivery : 2-4 Days</p>
                <p className="text-green-600 mt-2 font-semibold">✔ Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
