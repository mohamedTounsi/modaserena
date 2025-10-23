"use client";

import { Plus, Trash2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast"; // Import toast

const Page = () => {
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for the modal visibility

  // Fetch current hero image on load
  useEffect(() => {
    fetchHeroImage();
  }, []);

  const fetchHeroImage = async () => {
    try {
      const res = await fetch("/api/hero/upload");
      const data = await res.json();
      if (data?.imageUrl) {
        setHeroImage(data.imageUrl);
      } else {
        setHeroImage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);

    try {
      const res = await fetch("/api/hero/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.imageUrl) {
        setHeroImage(data.imageUrl);
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed!");
    }

    setUploading(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete the hero image?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/hero/upload", { method: "DELETE" });
      const data = await res.json();
      setHeroImage(null);
      toast.success("Image deleted successfully!");
      setShowDeleteModal(false); // Close modal after delete
    } catch (err) {
      console.error(err);
      toast.error("Delete failed!");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false); // Close the modal if cancel is clicked
  };

  return (
    <div className="w-full h-full">
      <div className="w-[90%] mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-light text-neutral-900">
            Hero Image
          </h1>

          <button
            onClick={handleClick}
            className="bg-neutral-900 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2"
            disabled={uploading}
          >
            <Plus />
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

        {/* Display uploaded image */}
        {heroImage && (
          <div className="relative w-full h-[90%] mx-auto">
            <img
              src={heroImage}
              alt="Hero"
              className="w-full h-full rounded-lg shadow"
            />
            <button
              onClick={() => setShowDeleteModal(true)} // Show the modal when clicked
              className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Modal for Confirm Delete */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          {/* Background with low brightness */}
          <div className="absolute inset-0 brightness-40"></div>

          {/* Modal content */}
          <div className="relative bg-white p-6 rounded-lg w-96 shadow-lg z-10">
            <p className="text-lg font-semibold text-neutral-900 mb-4">
              Are you sure you want to delete this image?
            </p>
            <div className="flex justify-between">
              <button
                onClick={handleCancelDelete}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
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
