"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowUp } from "lucide-react";

export default function CreateProductPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const categories = [
    { value: "robe", label: "Robe" },
    { value: "sweatshirt à capuche", label: "Sweatshirt à capuche" },
    { value: "jupe", label: "Jupe" },
    { value: "chemise", label: "Chemise" },
    { value: "pull", label: "Pull" },
    { value: "pantalon", label: "Pantalon" },
    { value: "top", label: "Top" },
    { value: "maillots de bain", label: "Maillots de bain" },
    { value: "pyjama", label: "pyjama" },
  ];

  const fullColorOptions = [
    { name: "Black", value: "#000000", gradient: "from-black to-gray-800" },
    { name: "White", value: "#ffffff", gradient: "from-gray-100 to-white" },
    { name: "Red", value: "#ff0000", gradient: "from-red-500 to-red-700" },
    { name: "Blue", value: "#1e40af", gradient: "from-blue-500 to-blue-700" },
    {
      name: "Green",
      value: "#22c55e",
      gradient: "from-green-400 to-green-600",
    },
    { name: "Pink", value: "#ec4899", gradient: "from-pink-400 to-pink-600" },
    {
      name: "Yellow",
      value: "#fbbf24",
      gradient: "from-yellow-400 to-yellow-600",
    },
    {
      name: "Purple",
      value: "#a855f7",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      name: "Orange",
      value: "#f97316",
      gradient: "from-orange-400 to-orange-600",
    },
    { name: "Cyan", value: "#06b6d4", gradient: "from-cyan-400 to-cyan-600" },
    {
      name: "Indigo",
      value: "#4f46e5",
      gradient: "from-indigo-500 to-indigo-700",
    },
    { name: "Rose", value: "#f43f5e", gradient: "from-rose-400 to-rose-600" },
    { name: "Lime", value: "#84cc16", gradient: "from-lime-400 to-lime-600" },
    { name: "Sky", value: "#0ea5e9", gradient: "from-sky-400 to-sky-600" },
    { name: "Teal", value: "#14b8a6", gradient: "from-teal-400 to-teal-600" },
    {
      name: "Amber",
      value: "#f59e0b",
      gradient: "from-amber-400 to-amber-600",
    },
    {
      name: "Emerald",
      value: "#10b981",
      gradient: "from-emerald-400 to-emerald-600",
    },
    {
      name: "Violet",
      value: "#7c3aed",
      gradient: "from-violet-500 to-violet-700",
    },
    {
      name: "Slate",
      value: "#64748b",
      gradient: "from-slate-500 to-slate-700",
    },
    { name: "Gray", value: "#6b7280", gradient: "from-gray-500 to-gray-700" },
    {
      name: "Stone",
      value: "#78716c",
      gradient: "from-stone-500 to-stone-700",
    },
    {
      name: "Fuchsia",
      value: "#d946ef",
      gradient: "from-fuchsia-500 to-fuchsia-700",
    },
  ];

  const [form, setForm] = useState({
    title: "",
    price: "",
    priceAfterSolde: "",
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

  const [productImages, setProductImages] = useState([
    { file: null, preview: null, color: "#000000" },
  ]);

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index, file) => {
    const updated = [...productImages];
    updated[index].file = file;
    updated[index].preview = URL.createObjectURL(file);
    setProductImages(updated);
  };

  const handleColorChange = (index, color) => {
    const updated = [...productImages];
    updated[index].color = color;
    setProductImages(updated);
  };

  const addImageBlock = () => {
    setProductImages([
      ...productImages,
      { file: null, preview: null, color: "#000000" },
    ]);
  };

  const deleteImageBlock = (index) => {
    const updated = productImages.filter((_, i) => i !== index);
    setProductImages(updated);
  };

  // -------------------------------
  // SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(form).forEach(([key, val]) => data.append(key, val));

    // Append images + colors
    productImages.forEach((item) => {
      if (item.file) data.append("images", item.file);
      data.append("colors", item.color);
    });

    const loadingId = toast.loading("Adding product...");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        toast.success("Product created!", { id: loadingId });
        router.push("/dashboard/products");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to add product", {
          id: loadingId,
        });
      }
    } catch (err) {
      toast.error("Something went wrong", { id: loadingId });
      console.error(err);
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3">
          Create Product
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full mb-8"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          {/* Title */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">Product Title</label>
            <input
              name="title"
              onChange={handleChange}
              required
              className="p-3 mt-2 w-full border rounded-lg text-zinc-900 placeholder-zinc-500"
            />
          </div>

          {/* Price */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">Price (TND)</label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              required
              className="p-3 mt-2 w-full border rounded-lg text-zinc-900 placeholder-zinc-500"
            />
          </div>

          {/* Price after solde */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">
              Price After Solde (optional)
            </label>
            <input
              name="priceAfterSolde"
              type="number"
              onChange={handleChange}
              className="p-3 mt-2 w-full border rounded-lg text-zinc-900 placeholder-zinc-500"
            />
          </div>

          {/* Category */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-3 mt-2 w-full border rounded-lg bg-white text-zinc-900"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">Description</label>
            <textarea
              name="description"
              rows="5"
              onChange={handleChange}
              className="p-3 mt-2 w-full border rounded-lg resize-none text-zinc-900 placeholder-zinc-500"
            />
          </div>

          {/* Quantities */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">
              Quantities by Size
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                ["xsQuantity", "XS"],
                ["sQuantity", "S"],
                ["mQuantity", "M"],
                ["lQuantity", "L"],
                ["xlQuantity", "XL"],
                ["xxlQuantity", "XXL"],
                ["xxxlQuantity", "XXXL"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="text-zinc-900">{label}</label>
                  <input
                    type="number"
                    name={key}
                    onChange={handleChange}
                    className="p-2 mt-1 w-full border rounded-lg text-zinc-900 placeholder-zinc-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* IMAGES WITH COLOR */}
          <div className="text-zinc-900">
            <label className="font-semibold text-lg text-zinc-900">
              Product Images
            </label>

            {productImages.map((item, index) => (
              <div
                key={index}
                className="border p-4 rounded-lg bg-gray-50 mt-4"
              >
                {/* Image Preview */}
                {item.preview ? (
                  <div className="relative mb-4">
                    <img
                      src={item.preview}
                      className="w-full h-64 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => deleteImageBlock(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                    <ArrowUp size={32} className="text-pink-500 mb-2" />
                    <p className="font-medium text-zinc-900">Upload Image</p>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                  </label>
                )}

                {/* Color Picker */}
                <div className="mt-4">
                  <label className="font-medium text-zinc-900">
                    Choose Color
                  </label>

                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-3">
                    {fullColorOptions.map((col) => (
                      <button
                        key={col.value}
                        type="button"
                        onClick={() => handleColorChange(index, col.value)}
                        className={`h-12 rounded-xl bg-gradient-to-r ${
                          col.gradient
                        } border-4 transition-all ${
                          item.color === col.value
                            ? "border-zinc-900 scale-110"
                            : "border-transparent"
                        }`}
                        title={col.name}
                      ></button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addImageBlock}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              + Add Image
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800"
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
}
