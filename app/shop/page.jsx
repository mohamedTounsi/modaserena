// app/shop/page.jsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopClient from "./ShopClient";

// Fetch products with optional category
async function getProducts(category) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const url =
    category && category !== "all"
      ? `${baseUrl}/api/products?category=${category}`
      : `${baseUrl}/api/products`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Server Component
const Shop = async ({ searchParams }) => {
  const category = searchParams?.category || "all"; // ✅ server component can use this
  const products = await getProducts(category);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <div className="w-[90%] mx-auto py-10">
        {category !== "all" && (
          <h2 className="text-xl text-zinc-900 font-semibold mb-6">
            Showing category:{" "}
            <span className="text-pink-400/80">{category}</span>
          </h2>
        )}
        {/* Client component */}
        <ShopClient products={products} />
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
