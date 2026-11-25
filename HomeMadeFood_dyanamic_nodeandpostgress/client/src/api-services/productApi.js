import { getProducts as fetchProducts } from "@/lib/api";

// Server-side helper used by /product-server.
export const getProducts = () => fetchProducts({ kind: "snack" });
