"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";

const ProductView = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  // Colors only for sneakers (tshirts can skip if needed)
  const colors = useMemo(() => {
    if (product.category !== "sneakers") return [];
    if (!product?.colors) return ["#000"];
    if (Array.isArray(product.colors)) return product.colors.filter(Boolean);
    return String(product.colors)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
  }, [product]);

  const [activeImage, setActiveImage] = useState("front");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "#000");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Get available stock for the selected size
  const getAvailableStock = () => {
    if (!selectedSize) return 0;

    if (product.category === "tshirt") {
      switch (selectedSize) {
        case "XS":
          return +product.xsmallQuantity || 0;
        case "S":
          return +product.smallQuantity || 0;
        case "M":
          return +product.mediumQuantity || 0;
        case "L":
          return +product.largeQuantity || 0;
        case "XL":
          return +product.xlargeQuantity || 0;
        case "XXL":
          return +product.xxlargeQuantity || 0;
        default:
          return 0;
      }
    } else {
      // Sneakers or trousers: use eurQuantities map
      return +(product.eurQuantities?.[selectedSize] || 0);
    }
  };

  const handleQuantityChange = (type) => {
    if (!selectedSize) return toast.error("Please select a size first.");
    const max = getAvailableStock();
    setQuantity((q) => {
      if (type === "inc") {
        if (q < max) return q + 1;
        toast.error(`Only ${max} item${max > 1 ? "s" : ""} left in stock.`);
        return q;
      }
      return q > 1 ? q - 1 : 1;
    });
  };

  const handleBuyNow = () => {
    if (!selectedSize) return toast.error("Please select a size to proceed.");
    const productToBuy = {
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      size: selectedSize,
      color: product.category === "sneakers" ? selectedColor : null,
      quantity,
      category: product.category,
    };
    sessionStorage.setItem(
      "checkoutSingleProduct",
      JSON.stringify(productToBuy)
    );
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (!selectedSize)
      return toast.error("Please select a size to add to cart.");
    addToCart({
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      size: selectedSize,
      color: product.category === "sneakers" ? selectedColor : null,
      quantity,
      category: product.category,
    });
    toast.success("Added to cart!");
  };

  // Check sold out
  // Check sold out
  const soldOut = (() => {
    // Categories using XS–XXL
    const xsToXxlCategories = ["tshirt", "hoodie", "dress", "skirt"];

    if (xsToXxlCategories.includes(product.category)) {
      return (
        +product.xsmallQuantity === 0 &&
        +product.smallQuantity === 0 &&
        +product.mediumQuantity === 0 &&
        +product.largeQuantity === 0 &&
        +product.xlargeQuantity === 0 &&
        +product.xxlargeQuantity === 0
      );
    } else {
      // Sneakers / trousers / EUR sizes
      return Object.values(product.eurQuantities || {}).every((q) => +q === 0);
    }
  })();

  // Sizes to display
  const sizes = useMemo(() => {
    if (product.category === "tshirt") {
      return [
        { label: "XS", quantity: product.xsmallQuantity },
        { label: "S", quantity: product.smallQuantity },
        { label: "M", quantity: product.mediumQuantity },
        { label: "L", quantity: product.largeQuantity },
        { label: "XL", quantity: product.xlargeQuantity },
        { label: "XXL", quantity: product.xxlargeQuantity },
      ];
    } else {
      return Object.entries(product.eurQuantities || {}).map(
        ([label, quantity]) => ({
          label,
          quantity,
        })
      );
    }
  }, [product]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          {/* IMAGES */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-4">
              <div className="relative w-full aspect-square overflow-hidden mb-4 rounded-lg">
                <Image
                  src={
                    activeImage === "front" ? product.frontImg : product.backImg
                  }
                  alt={product.title || "Product"}
                  fill
                  className="object-contain transition-opacity duration-500"
                />
              </div>

              <div className="flex gap-2">
                {["front", "back"].map((imgType) => (
                  <button
                    key={imgType}
                    onClick={() => setActiveImage(imgType)}
                    className={`w-20 h-20 border rounded-md overflow-hidden ${
                      activeImage === imgType
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={
                        imgType === "front" ? product.frontImg : product.backImg
                      }
                      alt={imgType}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              {product.title}
            </h1>
            <p className="text-2xl text-gray-900 mb-6 underline">
              {product.price} TND
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* SIZES */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-900">Size</h3>
                <button className="text-xs underline text-gray-500">
                  Size guide
                </button>
              </div>
              <ul className="flex gap-4 flex-wrap">
                {sizes.map(({ label, quantity }) => {
                  const disabled = +quantity <= 0;
                  return (
                    <li key={label}>
                      <button
                        onClick={() => !disabled && setSelectedSize(label)}
                        disabled={disabled}
                        className={`px-5 py-1 text-lg text-zinc-900  font-light border rounded-xl transition-all ${
                          disabled
                            ? "bg-gray-200 line-through cursor-not-allowed"
                            : selectedSize === label
                            ? "bg-neutral-500 text-white border-neutral-900"
                            : "bg-transparent text-neutral-900 border-neutral-900 hover:bg-neutral-100"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* QUANTITY */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                Quantity
              </h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="px-3 py-2 text-zinc-800 text-lg"
                >
                  -
                </button>
                <span className="px-4 py-2 text-zinc-800 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="px-3 py-2 text-zinc-800 text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            {soldOut ? (
              <button
                className="w-full py-4 rounded-md bg-gray-400 text-white cursor-not-allowed"
                disabled
              >
                Sold Out
              </button>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 mb-2 rounded-md border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300"
                >
                  Buy Now
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 rounded-md bg-neutral-900 text-white hover:bg-white hover:text-neutral-900 border border-neutral-900 transition-all duration-300"
                >
                  Add to Cart
                </button>
              </>
            )}

            {/* DETAILS */}
            <div className="border-t border-gray-200 pt-6 mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;
