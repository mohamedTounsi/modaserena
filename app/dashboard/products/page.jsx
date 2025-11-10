"use client";
import { Plus, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setShowConfirm(false);
        console.log("Product deleted successfully");
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleConfirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setProductToDelete(null);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-[90%] mx-auto mt-10">
        {/* Title & Add Product Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2">
              Products
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
          </div>
          <Link href="/dashboard/products/create">
            <button className=" cursor-pointer text-zinc-800 border border-zinc-800 hover:text-white hover:bg-zinc-800 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg">
              <Plus size={20} />
              <span className="hidden md:inline font-medium">Add Product</span>
            </button>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-zinc-700 mb-12"></div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-12">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-pink-100 group"
            >
              {/* Image Container */}
              <div className="relative h-96 overflow-hidden bg-gray-50">
                <Image
                  src={product.frontImg}
                  alt={product.title}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain p-4"
                />
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 text-center line-clamp-2 hover:text-pink-500 transition-colors mb-4">
                  {product.title}
                </h2>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() =>
                      router.push(`/dashboard/products/edit/${product._id}`)
                    }
                    className="text-black cursor-pointer border-2 border-black hover:text-white hover:bg-zinc-800 p-2 rounded-lg transition-all duration-300 flex items-center gap-2 flex-1 justify-center "
                  >
                    <Edit size={20} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(product)}
                    className="bg-red-500 hover:bg-white cursor-pointer text-white hover:text-red-500 hover:border hover:border-red-500 p-2 rounded-lg transition-all duration-300 shadow-md flex items-center gap-2 flex-1 justify-center"
                  >
                    <Trash2 size={20} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-96 text-center">
            <p className="text-gray-500 text-lg mb-4">No products yet</p>
            <Link href="/dashboard/products/create">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Create Your First Product
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
          <div className="bg-white p-8 rounded-lg shadow-2xl w-96 z-10 border border-pink-100">
            <p className="text-xl font-semibold text-gray-900 mb-6">
              Delete Product?
            </p>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>{productToDelete?.title}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(productToDelete._id)}
                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
