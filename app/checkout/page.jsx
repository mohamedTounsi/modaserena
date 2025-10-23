"use client";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";
// adjust path if needed

const CheckoutPage = () => {
  const { clearCart } = useCart(); // access clearCart function

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      notes,
      shippingMethod: "Delivery",
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (res.ok) {
      toast.success("Order placed successfully!");

      // 🔥 Clear everything after order
      clearCart();
      setItems([]); // Clear `items` state
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

  useEffect(() => {
    const singleItem = sessionStorage.getItem("checkoutSingleProduct");
    const cartItems = sessionStorage.getItem("checkoutCart");

    if (singleItem) {
      const parsedItem = JSON.parse(singleItem);
      setItems([parsedItem]);
      sessionStorage.removeItem("checkoutSingleProduct");
    } else if (cartItems) {
      const parsedCart = JSON.parse(cartItems);
      setItems(parsedCart);
      sessionStorage.removeItem("checkoutCart");
    }
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      const subtotal = items.reduce(
        (acc, item) => acc + parseFloat(item.price) * item.quantity,
        0
      );
      setTotal((subtotal + 8).toFixed(2));
    }
  }, [items]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />

      <main className="flex-grow px-4 py-10 md:px-16 text-zinc-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              Shipping Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6 text-zinc-800">
              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-zinc-800">
                <input
                  type="text"
                  placeholder="First Name"
                  className="input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="City"
                  className="input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  className="input"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>

              {/* Notes */}
              <textarea
                placeholder="Order Notes (Optional)"
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              {/* Shipping Method */}
              <div className="pt-6 border-t">
                <h3 className="text-xl font-semibold mb-2">Shipping Method</h3>
                <div className="bg-blue-100 rounded-lg p-4 border">
                  <label className="flex items-center space-x-4 cursor-pointer">
                    <input
                      type="radio"
                      name="shipping"
                      defaultChecked
                      className="accent-blue-500"
                    />
                    <div>
                      <p className="font-medium">Delivery</p>
                      <p className="text-sm text-gray-600">TND 8.000</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-6 border-t">
                <h3 className="text-xl font-semibold mb-2">Payment Method</h3>
                <div className="bg-blue-100 rounded-lg p-4 border">
                  <label className="flex items-center space-x-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                      className="accent-blue-500"
                    />
                    <div>
                      <p className="font-medium">
                        الدفع عند التوصيل - Cash on Delivery - Paiement à la
                        livraison
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-lg font-semibold shadow-md"
              >
                Confirm Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg sticky top-28 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Order Summary
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center border-b pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-700">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} TND
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
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
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>8.00 TND</span>
              </div>
              <div className="flex justify-between font-bold text-base">
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
