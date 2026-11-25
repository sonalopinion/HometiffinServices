import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-7xl font-bold text-orange-500">404</h1>
      <p className="text-2xl mt-3">Page Not Found</p>

      <Link
        href="/"
        className="mt-6 bg-orange-500 text-white px-5 py-2 rounded-lg"
      >
        Go Home
      </Link>
    </div>
  );
}