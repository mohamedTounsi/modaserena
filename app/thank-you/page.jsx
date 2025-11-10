"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle, Sparkles, Package, Heart } from "lucide-react";
import Image from "next/image";

const ThankYouPage = () => {
  useEffect(() => {
    // Optional: clear cart/session after order
    sessionStorage.removeItem("checkoutCart");
    sessionStorage.removeItem("checkoutSingleProduct");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-pink-100 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-50 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse delay-1000"></div>

      {/* Logo */}
      <div className="mb-8 relative z-10">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <Image
            src="/modaserenalogo1.png"
            alt="ModaSerena Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </div>
      </div>

      {/* Success Card */}
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-pink-100 p-8 relative z-10">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-pink-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-br from-pink-500 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="text-white w-10 h-10" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 text-pink-400 w-5 h-5 animate-bounce" />
        </div>

        {/* Content */}
        <h1 className="text-2xl md:text-3xl text-center font-bold text-gray-900 mb-2">
          Order Confirmed!
        </h1>

        <p className="text-gray-700 text-center text-sm mb-4 leading-relaxed">
          Thank you for your purchase. Your order has been successfully placed
          and is being processed.
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-600 mb-6 bg-gray-50 rounded-lg py-3 px-4">
          <Package className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-medium">
            We're preparing your package for shipment
          </span>
        </div>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span className="font-medium">Estimated Delivery</span>
            <span className="font-bold text-gray-900">3-5 Business Days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-900 transition-all font-semibold text-sm shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <Link
            href="/shop"
            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-900 hover:border-pink-400 hover:bg-pink-50 transition-all font-semibold text-sm shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
            Need help?{" "}
            <Link
              href="#"
              className="text-pink-500 hover:text-pink-600 font-semibold"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>

      {/* Floating decoration */}
      <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-300 rounded-full opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-200 rounded-full opacity-30 animate-pulse delay-700"></div>
    </div>
  );
};

export default ThankYouPage;
