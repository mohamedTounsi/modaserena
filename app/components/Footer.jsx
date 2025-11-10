"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-white py-16 px-6 md:px-12 lg:px-20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="w-fit">
              <Image
                src="/modaserenalogo1.png"
                alt="Moda Serena"
                width={120}
                height={120}
                className="object-contain"
                priority
              />
            </Link>
            <div className="flex gap-5">
              <a
                href="https://www.instagram.com/moda_sere_na/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-pink-300 hover:bg-pink-300 hover:text-white transition-all duration-300"
              >
                <FaInstagram className="text-lg" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61550523984251"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-pink-300 hover:bg-pink-300 hover:text-white transition-all duration-300"
              >
                <FaFacebook className="text-lg" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-pink-300 hover:bg-pink-300 hover:text-white transition-all duration-300"
              >
                <FaTiktok className="text-lg" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-pink-300 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-400 hover:text-pink-300 transition-colors duration-300"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-pink-300 transition-colors duration-300"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-5">
              Products
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-400 hover:text-pink-300 transition-colors duration-300"
                >
                  Latest Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-400 hover:text-pink-300 transition-colors duration-300"
                >
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Subscribe for exclusive drops and early access.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="px-4 py-3 text-sm bg-neutral-800 text-white placeholder-gray-500 rounded-sm focus:outline-none focus:ring-1 focus:ring-pink-300 transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="px-4 py-3 text-sm font-medium bg-pink-400 text-white rounded-sm hover:bg-pink-600 transition-colors duration-300"
              >
                {subscribed ? "Thank you!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Moda Serena. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            <a
              href="https://portfoliomt-kohl.vercel.app/"
              className="text-pink-300 hover:text-pink-400 transition-colors duration-300"
            >
              MT
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
