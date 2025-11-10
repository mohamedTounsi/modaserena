"use client";

import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[50vh] md:h-[80vh] w-full overflow-hidden mt-20">
      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-left md:bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/hero.png')` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full w-full px-6">
        {/* Button */}
        <motion.button
          onClick={() => router.push("/shop")}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 15px rgba(255,255,255,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="flex items-center gap-2 px-4 py-2 md:px-8 md:py-4 border border-white text-white rounded-sm cursor-pointer font-semibold text-sm md:text-lg tracking-wide hover:bg-white hover:text-black transition-all duration-300"
        >
          <Store size={20} /> Shop Now
        </motion.button>
      </div>
    </section>
  );
}
