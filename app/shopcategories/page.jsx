"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

const categoryData = [
  { name: "All Categories", slug: "all", img: "/allcat.png" },
  { name: "Robe", slug: "robe", img: "/dress.png" },
  {
    name: "Sweatshirt à capuche",
    slug: "sweatshirt à capuche",
    img: "/hoodie.png",
  },
  { name: "Jupe", slug: "jupe", img: "/skirt.png" },
  { name: "Chemise", slug: "chemise", img: "/chemise.png" },
  { name: "Pull", slug: "pull", img: "/tshirt.png" },
  { name: "Pantalon", slug: "pantalon", img: "/trousers.png" },
  { name: "Top", slug: "top", img: "/top.png" },
  { name: "Maillots de bain", slug: "maillots de bain", img: "/swimsuit.png" },
];

const ShopCategoriesPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div>
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 mb-15 w-[80%] mx-auto mt-15 md:mt-30 py-10">
        {categoryData.map((cat, idx) => (
          <Link
            key={cat.slug}
            href={cat.slug === "all" ? "/shop" : `/shop?category=${cat.slug}`}
            className="group h-full relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-white border border-black/5 cursor-pointer"
            onMouseEnter={() => setHoveredCard(idx)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="relative w-full aspect-square overflow-hidden bg-pink-50/30">
              <Image
                src={cat.img}
                alt={cat.name}
                fill
                className={`object-cover transition-transform duration-700 ${
                  hoveredCard === idx ? "scale-105" : ""
                }`}
              />
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <h2 className="text-sm md:text-base font-bold text-black line-clamp-2 transition-colors mb-3">
                {cat.name}
              </h2>

              <div className="flex gap-3 mt-auto">
                <button className="w-full cursor-pointer px-4 py-3.5 border border-zinc-300 text-black hover:border-pink-300 hover:text-white hover:bg-pink-300 text-xs md:text-sm font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 flex-1">
                  Voir les produits
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default ShopCategoriesPage;
