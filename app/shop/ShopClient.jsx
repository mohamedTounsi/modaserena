"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

const ShopClient = ({ products }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const sortProducts = () => {
      const safeProducts = Array.isArray(products) ? products : [];

      const parsePrice = (p) => {
        const num = parseFloat(
          String(p)
            .replace(/[^\d.,]/g, "")
            .replace(",", ".")
        );
        return isNaN(num) ? 0 : num;
      };

      let sorted = [...safeProducts];

      switch (sortOption) {
        case "name-asc":
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "name-desc":
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "price-asc":
          sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
          break;
        case "price-desc":
          sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
          break;
        case "date-asc":
          sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "date-desc":
          sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          break;
      }

      setSortedProducts(sorted);
    };

    sortProducts();
  }, [products, sortOption]);

  return (
    <div className="min-h-screen mt-5 md:mt-15 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-12 mx-auto sm:w-[90%] md:w-[95%] lg:w-[90%]">
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-4 text-neutral-900">
          Moda Serena <span className="text-pink-300">SHOP</span>
        </h1>
      </div>

      {/* Sort options */}
      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between text-center space-y-2 sm:space-y-0 sm:space-x-4 px-2">
        <div className="flex items-center">
          <p className="mr-2 text-zinc-800">Sort by:</p>
          <CustomDropdown
            options={[
              { label: "Name (A-Z)", value: "name-asc" },
              { label: "Name (Z-A)", value: "name-desc" },
              { label: "Price (Low to High)", value: "price-asc" },
              { label: "Price (High to Low)", value: "price-desc" },
              { label: "Date (Old to New)", value: "date-asc" },
              { label: "Date (New to Old)", value: "date-desc" },
            ]}
            selectedOption={sortOption}
            onSelect={setSortOption}
          />
        </div>
        <p className="text-gray-600">{`${sortedProducts.length} products`}</p>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-15">
        {sortedProducts.map((product, idx) => {
          // Check if sold out (all sizes 0)
          const sizes = [
            "xsQuantity",
            "sQuantity",
            "mQuantity",
            "lQuantity",
            "xlQuantity",
            "xxlQuantity",
            "xxxlQuantity",
          ];
          const soldOut = sizes.every((size) => +product[size] === 0);
          console.log(
            `Product: ${product.title}, soldOut: ${soldOut}`,
            product
          );

          return (
            <Link key={product._id} href={`/shop/${product._id}`}>
              <div
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group h-full relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-white border border-black/5 cursor-pointer"
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                <div className="relative h-120 w-full aspect-square overflow-hidden bg-pink-50/30">
                  <Image
                    src={product.frontImg}
                    alt={product.title}
                    fill
                    className={`object-cover transition-transform duration-700 ${
                      hoveredCard === idx ? "scale-105" : ""
                    }`}
                  />
                  <Image
                    src={product.backImg}
                    alt={`${product.title} back`}
                    fill
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
                  />

                  {soldOut && (
                    <div className="absolute top-3 right-3 z-20">
                      <p className="bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap">
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
                    <p className="text-2xl font-bold text-black">
                      {product.price}{" "}
                      <span className="text-sm font-semibold text-black/60">
                        TND
                      </span>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 mt-auto">
                    <button className="w-full cursor-pointer px-4 py-3.5 border border-zinc-400 text-black hover:font-medium hover:bg-pink-100 text-xs md:text-sm font-normal rounded-md transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-1">
                      Acheter Maintenant
                    </button>
                    <button className="p-3.5 border border-zinc-400 text-black rounded-md transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center group/cart active:scale-95">
                      <ShoppingCart
                        size={18}
                        className="group-hover/cart:scale-110 group-hover/cart:-rotate-12 transition-all duration-300"
                      />
                    </button>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-200/40 to-transparent mt-3" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ShopClient;
