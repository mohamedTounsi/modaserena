"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

const FeaturedProducts = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = (product) => {
    const image = product.images?.[0]?.imageUrl || product.images?.[0] || "";
    const price = product.priceAfterSolde
      ? product.priceAfterSolde
      : product.price;
    const productToBuy = {
      _id: product._id,
      title: product.title,
      image,
      price,
      size: "M", // default, can be selected later in checkout
      quantity: 1,
      category: product.category,
      color: product.images?.[0]?.color || "#000",
    };
    sessionStorage.setItem(
      "checkoutSingleProduct",
      JSON.stringify(productToBuy)
    );
    router.push("/checkout");
  };

  const handleAddToCart = (product) => {
    const image = product.images?.[0]?.imageUrl || product.images?.[0] || "";
    const price = product.priceAfterSolde
      ? product.priceAfterSolde
      : product.price;

    addToCart({
      _id: product._id,
      title: product.title,
      image,
      price,
      size: "M", // default
      quantity: 1,
      category: product.category,
      color: product.images?.[0]?.color || "#000",
    });
    toast.success("Ajouté au panier!");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative bg-gradient-to-b from-white via-white to-pink-50/20 pt-10 pb-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 overflow-hidden">
      <div className="mx-auto sm:w-[90%] md:w-[95%] lg:w-[80%] relative z-10">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-black mb-6 leading-tight tracking-tight">
            Découvrez{" "}
            <span className="font-semibold text-pink-300">nos créations</span>
          </h1>
          <p className="text-black/60 text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Des pièces uniques signées Moda Serena, alliant élégance et confort
            au quotidien.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {products.map((product) => {
            const qtyFields = [
              "xsQuantity",
              "sQuantity",
              "mQuantity",
              "lQuantity",
              "xlQuantity",
              "xxlQuantity",
              "xxxlQuantity",
            ];
            const soldOut = qtyFields.every(
              (field) => +(product[field] || 0) === 0
            );
            const price = product.priceAfterSolde
              ? product.priceAfterSolde
              : product.price;
            const mainImage =
              product.images?.[0]?.imageUrl ||
              product.images?.[0] ||
              "/placeholder.png";

            return (
              <div key={product._id} className="group h-full">
                <div className="relative h-full cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-white border border-black/5">
                  {/* Image */}
                  <div className="relative h-100 md:h-120 w-full aspect-square overflow-hidden bg-pink-50/30">
                    <Image
                      src={mainImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700"
                    />

                    {/* Color Circles */}
                    <div className="absolute top-3 right-3 flex gap-1 z-20">
                      {product.images?.map((img, idx) => (
                        <span
                          key={idx}
                          className="w-4 h-4 rounded-full border border-white shadow-md"
                          style={{ backgroundColor: img.color || "#000" }}
                        />
                      ))}
                    </div>

                    {/* Sold Out Badge */}
                    {soldOut && (
                      <div className="absolute top-3 left-3 z-30">
                        <p className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-bold">
                          Rupture de Stock
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-sm md:text-base font-bold text-black line-clamp-2 group-hover:text-pink-600 transition-colors mb-3">
                      {product.title}
                    </h2>

                    <div className="mb-6">
                      {product.priceAfterSolde &&
                      parseFloat(product.priceAfterSolde) > 0 ? (
                        <>
                          <p className="text-sm text-gray-500 line-through">
                            {product.price} TND
                          </p>
                          <p className="text-2xl font-bold text-black">
                            {product.priceAfterSolde}{" "}
                            <span className="text-sm font-semibold text-black/60">
                              TND
                            </span>
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-black">
                          {product.price}{" "}
                          <span className="text-sm font-semibold text-black/60">
                            TND
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Link href={`/shop/${product._id}`} className="flex-1">
                        <button className="w-full cursor-pointer px-4 py-3.5 border border-zinc-400 text-black hover:font-medium hover:bg-pink-100 text-xs md:text-sm font-normal rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-1">
                          Acheter Maintenant
                        </button>
                      </Link>
                      <button className="p-3.5 border border-zinc-400 text-black rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center group/cart active:scale-95">
                        <ShoppingCart
                          size={18}
                          className="group-hover/cart:scale-110 group-hover/cart:-rotate-12 transition-all duration-300"
                        />
                      </button>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-200/40 to-transparent mt-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-12">
          <Link href="/shopcategories">
            <button className="group relative cursor-pointer px-10 md:px-16 py-4 bg-gradient-to-r from-black to-black/90 hover:from-black/90 hover:to-black text-white rounded-xl font-bold text-base transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3 border border-pink-300/40 overflow-hidden active:scale-95">
              <span className="relative z-10">Voir Toute la Collection</span>
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-300 to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
