"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-10 px-6 md:px-20 xl:px-40">
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-10">
        {/* Logo and Social Links */}
        <div className="flex flex-col items-start gap-4">
          <Link href="/">
            <Image
              src="/mirologo3.png"
              alt="logo"
              width={100}
              height={100}
              className=""
              priority
            />
          </Link>

          <div className="flex gap-4 mt-2">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-xl hover:text-gray-400 transition" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-xl hover:text-gray-400 transition" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="text-xl hover:text-gray-400 transition" />
            </a>
          </div>
        </div>

        {/* Navigation and Products */}
        <div className="flex gap-10 md:gap-20 text-sm">
          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <Link href="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <Link href="/shop" className="text-gray-300 hover:text-white">
              Shop
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-white">
              About
            </Link>
          </div>

          <div className="flex flex-col items-start gap-2">
            <h3 className="text-lg font-semibold">Products</h3>
            <Link href="/" className="text-gray-300 hover:text-white">
              Latest Collection
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-3 max-w-xs w-full">
          <h3 className="text-lg font-semibold">Stay in the loop</h3>
          <p className="text-sm text-gray-300">
            Get the latest drops, exclusive capsules, and more.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 text-sm text-black bg-white rounded-md focus:outline-none w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-white text-black rounded-md hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-gray-500 text-center">
        &copy; {new Date().getFullYear()} MiroFashion. All rights reserved.
        <p>
          Powered by{" "}
          <a href="https://portfoliomt-kohl.vercel.app/" className="underline">
            MT
          </a>{" "}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
