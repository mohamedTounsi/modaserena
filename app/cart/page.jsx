"use client";
import { useCart } from "@/context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Trash, Wallet } from "lucide-react";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const newTotal = cart.reduce(
      (acc, item) => acc + parseFloat(item.price) * item.quantity,
      0
    );
    setTotal(newTotal.toFixed(2));
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Clear any single product checkout
    sessionStorage.removeItem("checkoutSingleProduct");

    // Store the current cart
    sessionStorage.setItem("checkoutCart", JSON.stringify(cart));
    window.location.href = "/checkout";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow text-zinc-900">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <h2 className="text-3xl font-light text-gray-600 mb-4">
              🛒 Your cart is empty
            </h2>
            <p className="text-gray-500">
              Start shopping and add items to your cart!
            </p>
          </div>
        ) : (
          <div className="p-2 md:p-12 w-full md:w-[65%] mx-auto">
            <h1 className="text-3xl font-light mb-8 border-b pb-4">
              Your Cart
            </h1>
            <ul className="space-y-6">
              {cart.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-lg shadow-sm bg-white"
                >
                  <div className="flex items-center gap-6 w-full">
                    <a href={`/shop/${item._id}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-28 h-28 md:w-36 md:h-36 object-cover rounded-md transition hover:scale-105"
                      />
                    </a>
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                        <div>
                          <a
                            href={`/shop/${item._id}`}
                            className="text-lg md:text-xl font-semibold text-black hover:underline"
                          >
                            {item.title}
                          </a>
                          <p className="text-sm text-gray-600">
                            Size: {item.size}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 text-right sm:text-left">
                          <p className="text-md font-semibold text-gray-800">
                            {(
                              parseFloat(item.price) *
                              parseInt(item.quantity, 10)
                            ).toFixed(2)}{" "}
                            TND
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2 sm:mt-1">
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-neutral-900 cursor-pointer hover:text-red-700 transition"
                          aria-label="Remove item"
                        >
                          <Trash size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Summary Section */}
            <div className="mt-10 p-6 rounded-lg bg-gray-50 shadow-sm">
              <div className="flex justify-between items-center text-lg font-medium">
                <span>Total:</span>
                <span>{total} DT</span>
              </div>
              <button
                onClick={clearCart}
                className="mt-6 w-full py-3 gap-1.5 bg-neutral-900 flex items-center justify-center cursor-pointer hover:bg-red-400 transition text-white rounded-md font-medium"
              >
                <Trash /> Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="mt-6 w-full py-3 gap-1.5 bg-neutral-900 flex items-center justify-center cursor-pointer hover:bg-green-400 transition text-white rounded-md font-medium"
              >
                <Wallet /> Check Out
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
