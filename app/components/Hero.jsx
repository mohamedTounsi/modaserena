"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  return (
    <section className="relative bg-navy-900 overflow-hidden md:py-9">
      {/* Navy zinc gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-800 via-navy-900 to-zinc-600" />

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-20">
        {/* Left text */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="text-center md:text-left md:w-1/2"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
            L’élégance réinventée par{" "}
            <span className="text-zinc-700">Miro Fashion</span>
          </h1>

          <p className="text-zinc-100 text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
            Découvrez l’univers de la mode moderne et raffinée. Chez Miro
            Fashion, chaque tenue incarne le style, la confiance et la
            sophistication. Des pièces uniques pensées pour sublimer votre
            personnalité au quotidien.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.button
              onClick={() => router.push("/shop")}
              whileTap={{ scale: 0.95 }}
              className="bg-zinc-500 cursor-pointer text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-transparent hover:border hover:border-zinc-900 hover:text-zinc-900 transition-all duration-300 border border-zinc-400"
            >
              Explorer la Collection
            </motion.button>
          </div>
        </motion.div>

        {/* Right image */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="mt-12 md:mt-0 md:w-1/2 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-zinc-400 rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-zinc-300 rounded-full opacity-30"></div>

          <div className="relative">
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <Image
                src="/mirologo4.png"
                alt="Collection Miro Fashion"
                width={500}
                height={500}
                className="rounded-2xl object-cover shadow-2xl border-4 border-zinc-400 border-opacity-30"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
