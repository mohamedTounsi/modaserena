"use client";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]); // State to store fetched products
  const [showConfirm, setShowConfirm] = useState(false); // State to control modal visibility
  const [productToDelete, setProductToDelete] = useState(null); // State to store the product to be deleted

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data); // Store fetched data in the state
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Call the fetch function when the component mounts
  }, []);

  // Function to handle deleting a product
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // On success, remove the deleted product from the state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setShowConfirm(false); // Close the confirmation modal
        console.log("Product deleted successfully");
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Function to show the confirmation modal
  const handleConfirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  // Function to hide the confirmation modal
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="w-full h-full bg-gray-50">
      <div className="w-[90%] mx-auto mt-10">
        {/* Title & Add Product Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-light text-neutral-900">
            Products
          </h1>
          <Link href="/dashboard/products/create">
            <button className="bg-neutral-900 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2">
              <Plus />
              <span className="hidden md:inline">Add Product</span>
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-neutral-700 mb-10"></div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() =>
                router.push(`/dashboard/products/edit/${product._id}`)
              }
              className="flex flex-col items-center justify-center bg-white shadow-lg hover:shadow-xl rounded-md p-6 relative transition-all duration-300"
            >
              <Image
                src={product.frontImg} // Dynamically set the image path
                alt={product.title} // Set the alt text to the product title
                width={500}
                height={500}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 text-center mb-4">
                {product.title}
              </h1>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 👈 prevents routing to edit page
                  handleConfirmDelete(product);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          {/* Background with blur and low brightness */}
          <div className="absolute inset-0 backdrop-blur-xl brightness-50  bg-opacity-50"></div>

          {/* Modal content */}
          <div className="bg-white p-6 rounded-md shadow-lg w-96 z-10">
            <p className="text-xl mb-4">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Discard
              </button>
              <button
                onClick={() => handleDelete(productToDelete._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
