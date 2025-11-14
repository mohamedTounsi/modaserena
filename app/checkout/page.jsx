"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const CheckoutPage = () => {
  const { clearCart } = useCart();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  // Load cart or single product from sessionStorage
  useEffect(() => {
    const singleItem = sessionStorage.getItem("checkoutSingleProduct");
    const cartItems = sessionStorage.getItem("checkoutCart");

    if (singleItem) {
      setItems([JSON.parse(singleItem)]);
      sessionStorage.removeItem("checkoutSingleProduct");
    } else if (cartItems) {
      setItems(JSON.parse(cartItems));
      sessionStorage.removeItem("checkoutCart");
    }
  }, []);

  // Calculate total including shipping
  useEffect(() => {
    if (items.length > 0) {
      const subtotal = items.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
      );
      setTotal(subtotal.toFixed(2)); // 8 TND shipping
    }
  }, [items]);

  // 🔥 Main submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) return toast.error("No items to checkout!");

    const orderData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      notes,
      paymentMethod: "Cash on Delivery",
      total: parseFloat(total),
      products: items.map((item) => ({
        productId: item._id,
        title: item.title,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
        price: parseFloat(item.price),
      })),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      toast.success("Order placed successfully!");

      await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: items }),
      });

      // Clear cart
      clearCart();
      setItems([]);
      localStorage.removeItem("cart");
      sessionStorage.removeItem("checkoutCart");
      sessionStorage.removeItem("checkoutSingleProduct");

      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 500);
    } else {
      toast.error("Failed to place order");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white mt-16 md:mt-27 ">
      <Header />

      <main className="flex-grow px-4 py-10 md:px-8 text-zinc-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="md:col-span-2 bg-white">
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Shipping Information
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-zinc-900">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
              <textarea
                placeholder="Order Notes (Optional)"
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm placeholder-gray-500 resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">
                  Payment Method
                </h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">
                    Cash on Delivery
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all text-sm font-bold shadow-md hover:shadow-lg cursor-pointer mt-8"
              >
                Confirm Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg sticky top-28 h-fit">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Order Summary
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar mb-6 border-b border-gray-200 pb-6">
              {items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-contain rounded-md border border-gray-200 bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Size: <span className="font-medium">{item.size}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Qty: <span className="font-medium">{item.quantity}</span>
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} TND
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>
                  {items
                    .reduce(
                      (acc, item) =>
                        acc + parseFloat(item.price) * item.quantity,
                      0
                    )
                    .toFixed(2)}{" "}
                  TND
                </span>
              </div>

              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200 text-gray-900">
                <span>Total</span>
                <span>{total} TND</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CheckoutPage;
