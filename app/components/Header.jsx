"use client";

import { Menu, Search, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { cart } = useCart();
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredProducts = useMemo(() => {
    return products?.filter((p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shopcategories" },
    { name: "Contact", path: "#" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${
          isScrolled ? "py-1 md:py-2" : "py-3 md:py-4"
        }`}
      >
        <div className="flex md:w-[90%] mx-auto justify-between items-center px-4 lg:px-16">
          <Menu
            className="cursor-pointer text-zinc-800 md:hidden"
            onClick={() => setIsOpen(true)}
          />
          <Link href="/" prefetch>
            <div
              className={`transition-all duration-300 ${
                isScrolled
                  ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
                  : "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20"
              }`}
            >
              <Image
                src="/modaserenalogo1.png"
                alt="Logo"
                width={112}
                height={112}
                priority
              />
            </div>
          </Link>

          <ul
            className={`hidden md:flex text-black gap-6 transition-all duration-300 ${
              isScrolled ? "text-sm" : "text-base"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`hover:text-gray-400 transition ${
                    pathname === item.path
                      ? "underline underline-offset-4 font-semibold"
                      : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center text-black gap-4">
            <Search
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="cursor-pointer"
            />
            <Link href="/cart" prefetch>
              <div className="relative">
                <ShoppingCart className="cursor-pointer" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {totalQuantity}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Dropdown */}
      <div
        className={`fixed top-0 left-0 w-full z-40 bg-white shadow-md transition-transform duration-300 ${
          isSearchOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center px-4 py-6">
          <div className="flex items-center gap-3 w-full max-w-3xl bg-gray-100 rounded-xl px-5 py-3 shadow-sm">
            <Search className="text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <X
              className="cursor-pointer text-gray-600 hover:text-black transition"
              onClick={() => setIsSearchOpen(false)}
            />
          </div>

          {searchQuery && (
            <div className="bg-white mt-4 rounded-xl shadow-lg w-full max-w-3xl max-h-[300px] overflow-y-auto">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Link
                    key={product._id}
                    href={`/shop/${product._id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-100 transition"
                  >
                    <img
                      src={product.frontImg}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span className="text-sm text-gray-800 font-medium">
                      {product.title}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No results found
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search backdrop */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30"
          onClick={() => setIsSearchOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-white text-zinc-900 z-50 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-6">
          <X
            className="cursor-pointer text-zinc-900"
            size={32}
            onClick={() => setIsOpen(false)}
          />
          <Image
            src="/modaserenalogo1.png"
            alt="Logo"
            width={80}
            height={80}
            priority
          />
        </div>
        <ul className="flex flex-col items-center mt-20 text-2xl">
          {navItems.map((item) => (
            <li
              key={item.path}
              className={`w-full py-2 pl-6 ${
                pathname === item.path ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <Link
                href={item.path}
                onClick={() => setIsOpen(false)}
                className="block"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Header;
