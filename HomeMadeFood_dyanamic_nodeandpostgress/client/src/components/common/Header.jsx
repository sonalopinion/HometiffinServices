"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  const closeMenu = () => setMenuOpen(false);

  function handleSearch(event) {
    event.preventDefault();
    const q = search.trim();
    router.push(q ? `/Menu?search=${encodeURIComponent(q)}` : "/Menu");
    closeMenu();
  }

  function handleLogout() {
    logout();
    closeMenu();
    router.push("/");
  }

  return (
    <header className="bg-orange-500 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            🍱 HomeMade Food
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-white hover:text-yellow-200">Home</Link>
            <Link href="/Menu" className="text-white hover:text-yellow-200">Snacks</Link>
            <Link href="/TiffinService" className="text-white hover:text-yellow-200">Tiffin Service</Link>
            <Link href="/Categories" className="text-white hover:text-yellow-200">Categories</Link>
            <Link href="/about" className="text-white hover:text-yellow-200">About</Link>
            <Link href="/contact" className="text-white hover:text-yellow-200">Contact</Link>
            {user && (
              <>
                <Link href="/orders" className="text-white hover:text-yellow-200">My Orders</Link>
                <Link href="/Profile" className="text-white hover:text-yellow-200">Profile</Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                placeholder="Search snacks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search snacks"
                className="w-52 px-4 py-2 pl-10 rounded-lg border border-orange-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <span className="absolute left-3 top-2.5 text-gray-500">🔍</span>
            </form>

            {/* Cart */}
            <Link
              href="/Cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative text-2xl hover:scale-110 transition"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-white text-orange-600 text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white text-orange-600 px-5 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
                title={user.email}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="bg-white text-orange-600 px-5 py-2 rounded-lg font-semibold hover:bg-orange-100 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            className="lg:hidden text-white text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden bg-orange-400 rounded-lg mb-4 p-4 space-y-4">
            <form onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search snacks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search snacks"
                className="w-full px-4 py-2 rounded-lg text-gray-700"
              />
            </form>

            <Link href="/" onClick={closeMenu} className="block text-white">Home</Link>
            <Link href="/Menu" onClick={closeMenu} className="block text-white">Snacks</Link>
            <Link href="/TiffinService" onClick={closeMenu} className="block text-white">Tiffin Service</Link>
            <Link href="/Categories" onClick={closeMenu} className="block text-white">Categories</Link>
            <Link href="/about" onClick={closeMenu} className="block text-white">About</Link>
            <Link href="/contact" onClick={closeMenu} className="block text-white">Contact</Link>

            {user && (
              <>
                <Link href="/orders" onClick={closeMenu} className="block text-white">My Orders</Link>
                <Link href="/Profile" onClick={closeMenu} className="block text-white">Profile</Link>
              </>
            )}

            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full bg-white text-orange-600 py-2 rounded-lg font-semibold text-center"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="block w-full bg-white text-orange-600 py-2 rounded-lg font-semibold text-center"
              >
                Login
              </Link>
            )}

            <Link href="/Cart" onClick={closeMenu} className="block text-white">
              🛒 Cart ({cartCount})
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
