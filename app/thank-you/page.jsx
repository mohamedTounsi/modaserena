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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-zinc-50 via-gray-100 to-blue-50 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-zinc-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gray-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse delay-500"></div>

      {/* Logo */}
      <div className="mb-8 relative">
        <div className="absolute -inset-4 bg-white/70 rounded-2xl shadow-lg transform rotate-3 opacity-60"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-gray-200">
          <Image
            src="/mirologo3.png"
            alt="Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </div>
      </div>

      {/* Success Card */}
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 relative z-10 transform hover:scale-[1.02] transition-all duration-300">
        {/* Success Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-zinc-500 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle className="text-white w-12 h-12" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 text-blue-400 w-6 h-6 animate-bounce" />
        </div>

        {/* Content */}
        <h1 className="text-3xl text-center font-bold text-gray-900 mb-4 tracking-tight">
          Thank You for Your Order!
        </h1>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Your order has been successfully placed and is being processed.
        </p>

        <div className="flex items-center justify-center gap-2 text-gray-500 mb-6">
          <Package className="w-4 h-4" />
          <span className="text-sm">
            We'll begin preparing your package shortly
          </span>
        </div>

        {/* Order Details Card */}
        <div className="bg-zinc-50 rounded-2xl p-4 mb-8 border border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Estimated Delivery</span>
            <span className="font-medium text-gray-900">3-5 Business Days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 px-6 py-4 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Home
          </Link>
          <Link
            href="/shop"
            className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Continue Shopping
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            Need help?{" "}
            <Link
              href=""
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Contact Us
            </Link>
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute bottom-20 left-20 animate-float">
        <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60"></div>
      </div>
      <div className="absolute top-20 right-20 animate-float delay-1000">
        <div className="w-2 h-2 bg-gray-400 rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default ThankYouPage;
