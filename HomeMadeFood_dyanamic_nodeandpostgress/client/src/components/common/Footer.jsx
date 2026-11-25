import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              🍱 HomeMade Food
            </h2>

            <p className="text-sm leading-6">
              Fresh, healthy, and delicious homemade food delivered directly to
              your doorstep. We prepare every meal with love and quality
              ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>

            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-400">
                  Home
                </Link>
              </li>

              <li>
                <Link href="/products" className="hover:text-orange-400">
                  Products
                </Link>
              </li>

              <li>
                <Link href="/Menu" className="hover:text-orange-400">
                  Snacks
                </Link>
              </li>

              <li>
                <Link href="/TiffinService" className="hover:text-orange-400">
                  Tiffin Service
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-orange-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Categories
            </h3>

            <ul className="space-y-2">
              <li>🍪 Snacks</li>
              <li>🍱 Tiffin</li>
              <li>🍛 Lunch</li>
              <li>🍰 Sweets</li>
              <li>🥒 Pickles</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h3>

            <p>📍 Mumbai, Maharashtra</p>

            <p className="mt-2">
              📞 +91 98765 43210
            </p>

            <p className="mt-2">
              📧 info@homemadefood.com
            </p>

            <div className="flex gap-4 mt-5 text-2xl">
              <a href="#">📘</a>
              <a href="#">📷</a>
              <a href="#">▶️</a>
              <a href="#">💬</a>
            </div>
          </div>

        </div>

        <hr className="my-8 border-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">

          <p>
            © 2026 HomeMade Food. All Rights Reserved.
          </p>

          <div className="flex gap-5 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-orange-400">
              Privacy Policy
            </Link>

            <Link href="/terms" className="hover:text-orange-400">
              Terms & Conditions
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}