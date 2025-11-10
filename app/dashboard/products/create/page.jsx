"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowUp } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const categories = [
    { value: "robe", label: "Robe" },
    { value: "sweatshirt à capuche", label: "Sweatshirt à capuche" },
    { value: "jupe", label: "Jupe" },
    { value: "chemise", label: "Chemise" },
    { value: "pull", label: "Pull" },
    { value: "pantalon", label: "Pantalon" },
    { value: "top", label: "Top" },
    { value: "maillots de bain", label: "Maillots de bain" },
  ];

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "robe",
    xsQuantity: "",
    sQuantity: "",
    mQuantity: "",
    lQuantity: "",
    xlQuantity: "",
    xxlQuantity: "",
    xxxlQuantity: "",
  });

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (name === "frontImg") {
      setFrontImg(file);
      setPreviewFront(URL.createObjectURL(file));
    } else if (name === "backImg") {
      setBackImg(file);
      setPreviewBack(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));

    if (frontImg) data.append("frontImg", frontImg);
    if (backImg) data.append("backImg", backImg);

    const toastId = toast.loading("Submitting product...");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Product added successfully!", { id: toastId });
        router.push("/dashboard/products");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to add product", {
          id: toastId,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Create Product
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8"
          encType="multipart/form-data"
        >
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-900 mb-2">
              Product Title
            </label>
            <input
              name="title"
              onChange={handleChange}
              placeholder="Enter product title..."
              className="p-3 text-zinc-900 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-900 mb-2">
              Price (TND)
            </label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              placeholder="0.00"
              className="p-3 text-zinc-900 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-900 mb-2">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-3 border text-zinc-900 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition bg-white"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-900 mb-2">
              Description
            </label>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Enter product description..."
              rows="5"
              className="p-3 text-zinc-900 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition resize-none"
            />
          </div>

          {/* Size Quantities */}
          <div className="flex flex-col">
            <label className="font-semibold text-gray-900 mb-4">
              Quantities by Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { key: "xsQuantity", label: "XS" },
                { key: "sQuantity", label: "S" },
                { key: "mQuantity", label: "M" },
                { key: "lQuantity", label: "L" },
                { key: "xlQuantity", label: "XL" },
                { key: "xxlQuantity", label: "XXL" },
                { key: "xxxlQuantity", label: "XXXL" },
              ].map((size) => (
                <div key={size.key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {size.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    name={size.key}
                    value={form[size.key]}
                    onChange={handleChange}
                    placeholder="0"
                    className="p-2 text-zinc-900 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Front Image */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-900 mb-4">
                Front Image
              </label>
              {isMounted && previewFront ? (
                <div className="relative">
                  <img
                    src={previewFront}
                    alt="Front Preview"
                    className="w-full h-64 object-contain rounded-lg border border-gray-300 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewFront(null);
                      setFrontImg(null);
                      frontInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                  <div className="flex flex-col items-center justify-center pt-8 pb-8">
                    <ArrowUp size={32} className="text-pink-500 mb-2" />
                    <p className="text-gray-700 font-medium">
                      Upload Front Image
                    </p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    ref={frontInputRef}
                    type="file"
                    name="frontImg"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Back Image */}
            <div className="flex flex-col">
              <label className="font-semibold text-gray-900 mb-4">
                Back Image
              </label>
              {isMounted && previewBack ? (
                <div className="relative">
                  <img
                    src={previewBack}
                    alt="Back Preview"
                    className="w-full h-64 object-contain rounded-lg border border-gray-300 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewBack(null);
                      setBackImg(null);
                      backInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                  <div className="flex flex-col items-center justify-center pt-8 pb-8">
                    <ArrowUp size={32} className="text-pink-500 mb-2" />
                    <p className="text-gray-700 font-medium">
                      Upload Back Image
                    </p>
                    <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    ref={backInputRef}
                    type="file"
                    name="backImg"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition duration-300 font-semibold mt-4"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
