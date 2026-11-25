"use client";

import { useEffect, useState } from "react";
import PCard from "@/components/common/PCard";
import { getProducts } from "@/lib/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getProducts({ kind: "snack" })
      .then((items) => {
        setProducts(items);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div>
      <h1 className="text-3xl text-center py-10">Products</h1>

      <div className="max-w-[1320px] mx-auto px-4">
        {status === "loading" && <p className="text-center text-gray-500">Loading products...</p>}
        {status === "error" && (
          <p className="text-center text-red-600">Could not load products. Is the server running?</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((obj) => (
            <PCard key={obj.id} data={obj} />
          ))}
        </div>
      </div>
    </div>
  );
}
