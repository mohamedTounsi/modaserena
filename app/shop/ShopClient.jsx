"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import CustomDropdown from "../components/CustomDropdown";

const ShopClient = ({ products }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    const parsePrice = (p) => {
      const num = parseFloat(
        String(p)
          .replace(/[^\d.,]/g, "")
          .replace(",", ".")
      );
      return isNaN(num) ? 0 : num;
    };

    switch (sortOption) {
      case "name-asc":
        return [...safeProducts].sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return [...safeProducts].sort((a, b) => b.title.localeCompare(a.title));
      case "price-asc":
        return [...safeProducts].sort(
          (a, b) => parsePrice(a.price) - parsePrice(b.price)
        );
      case "price-desc":
        return [...safeProducts].sort(
          (a, b) => parsePrice(b.price) - parsePrice(a.price)
        );
      case "date-asc":
        return [...safeProducts].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      case "date-desc":
        return [...safeProducts].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      default:
        return safeProducts;
    }
  }, [products, sortOption]);

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 pt-12 mx-auto sm:w-[90%] md:w-[95%] lg:w-[80%]">
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-4xl md:text-5xl font-light mb-4 text-neutral-900">
          Miro Fashion Collection
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-15">
        {sortedProducts.map((product, index) => {
          const colors = Array.isArray(product.colors)
            ? product.colors
            : String(product.colors || "")
                .split(",")
                .map((c) => c.trim());

          // Check sold out
          const soldOut = (() => {
            // Categories using XS–XXL
            const xsToXxlCategories = ["tshirt", "hoodie", "dress", "skirt"];

            if (xsToXxlCategories.includes(product.category)) {
              return (
                +product.xsmallQuantity === 0 &&
                +product.smallQuantity === 0 &&
                +product.mediumQuantity === 0 &&
                +product.largeQuantity === 0 &&
                +product.xlargeQuantity === 0 &&
                +product.xxlargeQuantity === 0
              );
            } else {
              // Sneakers / trousers / EUR sizes
              return Object.values(product.eurQuantities || {}).every(
                (q) => +q === 0
              );
            }
          })();

          return (
            <Link key={product._id} href={`/shop/${product._id}`}>
              <div
                className="group relative rounded-xs overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer flex flex-col"
                onMouseEnter={() => setHoveredProduct(index)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Images */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={product.frontImg}
                    alt={product.title}
                    fill
                    className={`object-cover transition-opacity duration-700 ${
                      hoveredProduct === index ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <Image
                    src={product.backImg}
                    alt={`${product.title} back`}
                    fill
                    className={`object-cover transition-opacity duration-700 ${
                      hoveredProduct === index ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {soldOut && (
                    <p className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 rounded-2xl text-xs md:text-sm font-light">
                      Sold Out
                    </p>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-sm md:text-base font-bold mb-1 text-gray-800 line-clamp-2">
                    {product.title}
                  </h2>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-sm md:text-base font-semibold text-gray-700">
                      {product.price} TND
                    </p>
                    <ShoppingCart size={16} className="text-gray-600" />
                  </div>
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
