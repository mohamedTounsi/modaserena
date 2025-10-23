"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef();
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/recent-capsule/upload");
        const data = await res.json();
        setImages(data || []);
      } catch (err) {
        console.error("Error loading images:", err);
      }
    };

    fetchImages();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file || !title) {
      toast.error("Please provide both image and title");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);

    setUploading(true);

    try {
      const res = await fetch("/api/recent-capsule/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data?._id) {
        setImages((prev) => [data, ...prev]);
        toast.success("Image uploaded!");
        setShowForm(false);
        setTitle("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    }
    console.log("Uploading image from path:", imagePath);
    console.log("Title:", title);
    console.log("Cloudinary result:", result);

    setUploading(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/recent-capsule/upload?id=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data?.message === "Capsule image deleted") {
        setImages(images.filter((img) => img._id !== id));
        toast.success("Image deleted!");
        router.push("/dashboard/recentCapsuleImages");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="w-[90%] mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-light text-neutral-900">
            Recent Capsule Images
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-neutral-900 text-white px-6 py-2 rounded-md"
            disabled={uploading}
          >
            Add Image
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleFormSubmit}
            className="bg-neutral-100 p-6 rounded-md mb-8"
          >
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-2 border border-neutral-400 rounded-md"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="border p-3 rounded-md border-gray-400 text-gray-400  "
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-neutral-900 text-white px-4 py-2 rounded-md"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="w-full h-[1px] bg-neutral-700 mb-10"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(({ _id, imageUrl, title }) => (
            <div
              key={_id}
              className="relative w-full aspect-square bg-gray-200 overflow-hidden"
            >
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white text-center py-1 text-sm">
                {title}
              </div>
              <button
                onClick={() => handleDelete(_id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
