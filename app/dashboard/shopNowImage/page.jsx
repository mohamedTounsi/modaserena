"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";

const Page = () => {
  const [uploading, setUploading] = useState(false);
  const [shopNowImage, setShopNowImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchShopNowImage = async () => {
      try {
        const res = await fetch("/api/shop-now/upload");
        const data = await res.json();
        setShopNowImage(data.imageUrl || null);
      } catch (err) {
        console.error("Failed to fetch shop now image:", err);
      }
    };

    fetchShopNowImage();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch("/api/shop-now/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?.imageUrl) {
        setShopNowImage(data.imageUrl);
        toast.success("Shop Now Image uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed!");
    }

    setUploading(false);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch("/api/shop-now/upload", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data?.message === "Image deleted successfully!") {
        setShopNowImage(null);
        toast.success("Image deleted successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image.");
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-[90%] mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-light text-neutral-900">
            Shop Now Image
          </h1>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-neutral-900 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2"
            disabled={uploading}
          >
            <span className="hidden md:inline">
              {uploading ? "Uploading..." : "Add Image"}
            </span>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="w-full h-[1px] bg-neutral-700 mb-10"></div>

        {shopNowImage && (
          <div className="relative w-full h-[90%] bg-gray-200 mb-6">
            <img
              src={shopNowImage}
              alt="Shop Now"
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => setShowDeleteModal(true)}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
            >
              <Trash2 />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <p className="text-lg font-semibold text-neutral-900 mb-6 text-center">
              Are you sure you want to delete this image?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 w-full"
              >
                Discard
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 w-full"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
