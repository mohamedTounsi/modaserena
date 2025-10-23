"use client";

import {
  Images,
  PillBottle,
  Shirt,
  Store,
  Menu,
  X,
  ListOrdered,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Leftsidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navigate = (path) => {
    router.push(path);
    setIsOpen(false); // Close mobile menu
  };

  return (
    <div className="lg:h-screen lg:w-[350px] h-fit w-full bg-neutral-900 z-100 sticky top-0">
      <div className="flex flex-col items-center justify-center py-4">
        <button onClick={() => navigate("/")}>
          <Image
            src="/mirologo3.png"
            alt=""
            width={125}
            height={125}
            className=""
          />
        </button>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-white absolute top-4 right-4 z-20"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation Items */}
        <ul
          className={`text-white flex flex-col gap-6 pb-5 transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          } lg:flex`}
        >
          <li
            className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/dashboard/products")}
          >
            <Shirt /> Products
          </li>

          <li
            className="flex flex-col lg:flex-row items-center gap-2 hover:bg-white hover:text-black transition-all duration-300 ease-in-out px-2 py-2 rounded-md cursor-pointer"
            onClick={() => navigate("/dashboard/orders")}
          >
            <ListOrdered /> Orders
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Leftsidebar;
