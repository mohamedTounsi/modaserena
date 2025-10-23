import Header from "../components/Header";
import Footer from "../components/Footer";
import ShopClient from "./ShopClient";

async function getProducts() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://your-deployed-site.vercel.app";

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

const Shop = async () => {
  const products = await getProducts();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <ShopClient products={products} />
      <Footer />
    </div>
  );
};

export default Shop;
