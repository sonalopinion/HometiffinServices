import Link from "next/link";

export default function BannerSection() {
  return (
    <section className='bg-[url("https://tse3.mm.bing.net/th/id/OIP.CoZhtxlNF1v1f8xeSdhTSgHaHY?r=0&rs=1&pid=ImgDetMain&o=7&rm=3")] bg-cover bg-center h-screen w-full'>
      <div className="bg-black/50 w-full h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6">
          <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            🍽️ Fresh • Healthy • Homemade
          </span>

          <h1 className="text-5xl md:text-6xl font-bold text-white mt-6 leading-tight">
            Taste the Love of
            <br />
            <span className="text-orange-400">Homemade Food</span>
          </h1>

          <p className="text-gray-200 text-lg mt-6 max-w-xl leading-8">
            Freshly prepared snacks, healthy tiffins, homemade sweets, pickles,
            and delicious meals delivered straight to your doorstep.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/Menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              Order Now
            </Link>

            <Link
              href="/TiffinService"
              className="border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3 rounded-lg font-semibold transition"
            >
              Tiffin Service
            </Link>
          </div>

          <div className="flex flex-wrap gap-8 mt-10 text-white">
            <div>
              <h2 className="text-3xl font-bold text-orange-400">500+</h2>
              <p>Happy Customers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-orange-400">50+</h2>
              <p>Food Items</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-orange-400">100%</h2>
              <p>Fresh Ingredients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{
  /*

        <section className="bg-gradient-to-r from-orange-100 to-yellow-50">


      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">

        <div className="grid lg:grid-cols-2 gap-10 items-center">

         
          <div>

            <span className="inline-block bg-orange-200 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
              🍽️ 100% Homemade & Fresh
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-800 mt-6 leading-tight">
              Delicious
              <span className="text-orange-500"> Homemade </span>
              Food Delivered To Your Door
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-8">
              Enjoy fresh homemade snacks, healthy tiffins, sweets, pickles,
              and daily meals prepared with love and delivered to your home.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">

              <Link
                href="/products"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Order Now
              </Link>

              <Link
                href="/about"
                className="border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Learn More
              </Link>

            </div>

            <div className="flex flex-wrap gap-8 mt-10">

              <div>
                <h2 className="text-3xl font-bold text-orange-500">500+</h2>
                <p className="text-gray-600">Happy Customers</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-500">50+</h2>
                <p className="text-gray-600">Food Items</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-orange-500">100%</h2>
                <p className="text-gray-600">Fresh Ingredients</p>
              </div>

            </div>

          </div>

         
          <div className="flex justify-center">
            <img
              src="/images/banner-food.png"
              alt="Homemade Food"
              className="w-full max-w-lg rounded-2xl shadow-xl"
            />
          </div>

        </div>

      </div> 
      </section>
      */
}
