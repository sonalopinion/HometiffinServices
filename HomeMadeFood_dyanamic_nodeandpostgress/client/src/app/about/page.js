import Image from "next/image";

export default function about() {
  return (
    <section className="py-16 bg-orange-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Image */}
          <div>
            <Image
              src="/aboutus.png"
              alt="About Us"
              width={600}
              height={500}
              className="rounded-2xl shadow-lg"
            />
          </div>

          {/* Right Content */}
          <div>

            <span className="text-orange-500 font-semibold uppercase">
              About Us
            </span>

            <h2 className="text-4xl font-bold text-gray-800 mt-3">
              Homemade Food Made with Love
            </h2>

            <p className="text-gray-600 mt-6 leading-8">
              We prepare fresh, healthy, and delicious homemade food using
              high-quality ingredients. Every meal is cooked with care,
              maintaining hygiene and authentic homemade taste.
            </p>

            <p className="text-gray-600 mt-4 leading-8">
              Whether you're looking for daily tiffin service, evening snacks,
              sweets, or special homemade dishes, we bring the comfort of
              home-cooked food directly to your doorstep.
            </p>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mt-8">

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-orange-500">100%</h3>
                <p className="text-gray-600">Fresh Ingredients</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-orange-500">500+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-orange-500">50+</h3>
                <p className="text-gray-600">Food Items</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-xl font-bold text-orange-500">Fast</h3>
                <p className="text-gray-600">Home Delivery</p>
              </div>

            </div>

            {/* Button */}
            <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition">
              Learn More
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}