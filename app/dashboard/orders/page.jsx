"use client";
import { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.pendingOrders);
      setDeliveredOrders(data.deliveredOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchOrders();
        toast.success("Order deleted successfully!"); // 👈 Show success toast
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("An error occurred while deleting.");
    }
  };

  const handleFillAddress = (order) => {
    // Open the website and attempt to fill the input field with the address
    const deliveryUrl = "https://www.delivery.com/";
    window.open(deliveryUrl, "_blank");

    // Wait for the page to load, then try to fill the address
    setTimeout(() => {
      const addressInput = document.querySelector(
        'input[name="AutocompleteInput-0"]'
      );
      if (addressInput) {
        addressInput.value = order.address;
      } else {
        toast.error("Address field not found on delivery.com.");
      }
    }, 2000); // Allow time for the page to load
  };

  const handleCopyAddress = (order) => {
    // Copy the address to clipboard
    navigator.clipboard
      .writeText(order.address)
      .then(() => {
        toast.success(
          "Address copied to clipboard! Paste it in the address field."
        );
      })
      .catch(() => {
        toast.error("Failed to copy address.");
      });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">All Orders</h1>

      <div className="mb-12">
        <h2 className="text-xl font-medium mb-6 text-gray-700">
          Pending Orders ({orders.length})
        </h2>

        {orders.length > 0 ? (
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full bg-white shadow-sm border border-gray-200">
              <thead>
                <tr className="text-left text-gray-700 bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-medium text-sm">#</th>
                  <th className="p-4 font-medium text-sm">Name</th>
                  <th className="p-4 font-medium text-sm">Email</th>
                  <th className="p-4 font-medium text-sm">Phone</th>
                  <th className="p-4 font-medium text-sm">Address</th>
                  <th className="p-4 font-medium text-sm">Products</th>
                  <th className="p-4 font-medium text-sm">Total</th>
                  <th className="p-4 font-medium text-sm">Date</th>
                  <th className="p-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 text-sm text-zinc-800">{index + 1}</td>
                    <td className="p-4 text-sm text-zinc-800">
                      {order.firstName} {order.lastName}
                    </td>
                    <td className="p-4 text-sm text-zinc-800 ">
                      {order.email}
                    </td>
                    <td className="p-4 text-sm text-zinc-800 ">
                      {order.phone}
                    </td>
                    <td className="p-4 text-sm text-zinc-800 ">
                      {order.address}, {order.city}, {order.postalCode}
                    </td>
                    <td className="p-4 text-sm text-zinc-800 ">
                      {order.products.map((p, idx) => (
                        <div key={idx} className="flex items-center mb-1">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-10 h-10 mr-2 object-cover rounded-md"
                          />
                          <span className="text-zinc-800">
                            {p.title} (x{p.quantity}) - {p.size}
                          </span>
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-sm text-zinc-800">
                      {order.total} TND
                    </td>
                    <td className="p-4 text-sm text-zinc-800">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="p-4 text-sm flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(order._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete order"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            No pending orders found
          </div>
        )}

        {/* Mobile View */}
        <div className="md:hidden flex flex-col gap-4">
          {orders.map((order, index) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 shadow-sm p-4 text-sm"
            >
              <div className="font-semibold text-gray-800 mb-1">
                #{index + 1} - {order.firstName} {order.lastName}
              </div>
              <div className="text-gray-700 mb-1">
                <strong>Email:</strong> {order.email}
              </div>
              <div className="text-gray-700 mb-1">
                <strong>Phone:</strong> {order.phone}
              </div>
              <div className="text-gray-700 mb-1">
                <strong>Address:</strong> {order.address}, {order.city},{" "}
                {order.postalCode}
              </div>
              <div className="text-gray-700 mb-2">
                <strong>Products:</strong>
                {order.products.map((p, idx) => (
                  <div key={idx} className="flex items-center mt-1">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 mr-2 object-cover rounded-md"
                    />
                    {p.title} (x{p.quantity}) - {p.size}
                  </div>
                ))}
              </div>
              <div className="text-gray-700">
                <strong>Total:</strong> {order.total} TND
              </div>
              <div className="text-gray-700 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleDateString()}{" "}
                <span className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => handleDelete(order._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash size={18} />
                </button>
                <button
                  onClick={() => handleFillAddress(order)}
                  className="text-blue-600 hover:text-blue-800 ml-2"
                >
                  Fill Address
                </button>
                <button
                  onClick={() => handleCopyAddress(order)}
                  className="text-green-600 hover:text-green-800 ml-2"
                >
                  Copy Address
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
