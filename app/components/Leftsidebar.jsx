"use client";

import { Shirt, ListOrdered, Menu, X, Star } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { name: "Produits", icon: <Shirt />, path: "/dashboard/products" },
  { name: "Commandes", icon: <ListOrdered />, path: "/dashboard/orders" },
  { name: "Avis", icon: <Star />, path: "/dashboard/avis" },
];

const LeftSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (path) => {
    router.push(path);
    setIsOpen(false); // close mobile menu
  };

  return (
    <div className="lg:h-screen w-full lg:w-72 bg-white border-r border-zinc-600 z-50 sticky top-0">
      <div className="flex flex-col items-center py-6 relative">
        {/* Logo */}
        <button onClick={() => navigate("/")}>
          <Image
            src="/modaserenalogo1.png"
            alt="ModaSerena Logo"
            width={140}
            height={140}
            className="hover:scale-105 cursor-pointer transition-transform duration-300"
          />
        </button>

        {/* Hamburger for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-pink-500 absolute top-4 right-4 z-20"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation */}
        <ul
          className={`flex flex-col gap-4 mt-10 w-full px-4 lg:px-6 transition-all duration-300 ${
            isOpen ? "block" : "hidden lg:block"
          }`}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                  transition-all duration-300
                  hover:bg-pink-100 hover:text-zinc-800
                  ${
                    isActive
                      ? "bg-zinc-800 text-white font-semibold shadow-lg"
                      : "text-gray-700"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-lg">{item.name}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
