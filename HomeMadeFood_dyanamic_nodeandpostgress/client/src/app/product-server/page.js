import { getProducts } from "@/api-services/productApi";
import ProductList from "../../components/productList/ProductList";

export default async function ProductServer() {
  let products = [];
  let failed = false;
  try {
    products = await getProducts();
  } catch {
    failed = true;
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Products
      </h1>

      {failed && (
        <p className="mb-6 text-red-600">Could not load products. Is the server running?</p>
      )}

      <ProductList products={products} />    

    </div>
  );
}