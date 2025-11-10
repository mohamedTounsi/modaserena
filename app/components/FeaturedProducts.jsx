"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const FeaturedProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [wishlist, setWishlist] = useState({});

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

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div className="relative bg-gradient-to-b from-white via-white to-pink-50/20 pt-10 pb-32 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 overflow-hidden">
      <div className="mx-auto sm:w-[90%] md:w-[95%] lg:w-[80%] relative z-10">
        {/* Header Section */}
        <div className="mb-24 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-black mb-6 leading-tight tracking-tight">
            Produits{" "}
            <span className="font-semibold text-pink-300">en Vedette</span>
          </h1>
          <p className="text-black/60 text-lg max-w-3xl mx-auto font-light leading-relaxed">
            Découvrez notre sélection curatée des essentiels premium conçus pour
            le style et la qualité
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-20">
          {products.map((product, idx) => {
            // Correct sold-out check: all quantities must be 0
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

            return (
              <div
                key={product._id}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group h-full"
              >
                <div className="relative h-full cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-white border border-black/5">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                  {/* Image Container */}
                  <div className="relative h-100 md:h-120 w-full aspect-square overflow-hidden bg-pink-50/30">
                    <Image
                      src={product.frontImg}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <Image
                      src={product.backImg}
                      alt={`${product.title} back`}
                      fill
                      className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    />

                    {/* Sold Out Badge */}
                    {soldOut && (
                      <div className="absolute top-3 left-3 right-3 z-30 flex justify-center">
                        <p className="bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold">
                          Rupture de Stock
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-sm md:text-base font-bold text-black line-clamp-2 group-hover:text-pink-600 transition-colors mb-3">
                      {product.title}
                    </h2>

                    <div className="mb-6">
                      <p className="text-2xl font-bold text-black">
                        {product.price}{" "}
                        <span className="text-sm font-semibold text-black/60">
                          TND
                        </span>
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-auto">
                      <Link href={`/shop/${product._id}`} className="flex-1">
                        <button className="w-full cursor-pointer px-4 py-3.5 border border-zinc-400 text-black hover:font-medium hover:bg-pink-100 text-xs md:text-sm font-normal rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-1">
                          Acheter Maintenant
                        </button>
                      </Link>
                      <button
                        className="p-3.5 border border-zinc-400 text-black rounded-xl transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center group/cart active:scale-95"
                        onClick={() => toggleWishlist(product._id)}
                      >
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
          <Link href="/shop">
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
