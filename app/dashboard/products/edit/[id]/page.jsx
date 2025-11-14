"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowUp } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const [productImages, setProductImages] = useState([]);

  // -------------------------------
  // Fetch existing product
  // -------------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        console.log("Fetched product data:", data); // Debug log

        setForm({
          title: data.title || "",
          price: data.price || "",
          priceAfterSolde: data.priceAfterSolde || "",
          description: data.description || "",
          category: data.category || "robe",
          xsQuantity: data.xsQuantity || "",
          sQuantity: data.sQuantity || "",
          mQuantity: data.mQuantity || "",
          lQuantity: data.lQuantity || "",
          xlQuantity: data.xlQuantity || "",
          xxlQuantity: data.xxlQuantity || "",
          xxxlQuantity: data.xxxlQuantity || "",
        });

        // Initialize images array with existing images
        if (data.images && data.images.length > 0) {
          console.log("Existing images:", data.images); // Debug log
          const imagesWithData = data.images.map((img, index) => ({
            file: null,
            preview: img.imageUrl || img.url || img, // Handle different image field names
            color: img.color || "#000000",
            isExisting: true,
          }));
          setProductImages(imagesWithData);
        } else {
          setProductImages([{ file: null, preview: null, color: "#000000" }]);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (index, file) => {
    const updated = [...productImages];
    updated[index] = {
      ...updated[index],
      file: file,
      preview: URL.createObjectURL(file),
      isExisting: false,
    };
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
  // In your EditProductPage component, update the handleSubmit function:

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append form fields
    Object.entries(form).forEach(([key, val]) => {
      data.append(key, val.toString());
    });

    // Append images and colors in correct order
    productImages.forEach((item, index) => {
      if (item.file) {
        // New file upload
        data.append("images", item.file);
        console.log(`Appending new file: ${item.file.name}`);
      }

      // Always send the image URL (for existing) or null (for new) to maintain order
      if (item.preview && !item.preview.startsWith("blob:")) {
        data.append("existingImages", item.preview);
        console.log(`Appending existing image: ${item.preview}`);
      } else {
        data.append("existingImages", ""); // placeholder for new images
      }

      // Append color for this image
      data.append("colors", item.color);
    });

    console.log("Submitting form with:", {
      title: form.title,
      imageCount: productImages.length,
      hasNewImages: productImages.filter((img) => img.file).length,
    });

    const loadingId = toast.loading("Updating product...");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Product updated successfully!", { id: loadingId });
        router.push("/dashboard/products");
      } else {
        toast.error(result.message || "Failed to update product", {
          id: loadingId,
        });
        console.error("Update failed:", result);
      }
    } catch (err) {
      toast.error("Network error - please try again", { id: loadingId });
      console.error("Submission error:", err);
    }
  };
  // -------------------------------
  // RENDER
  // -------------------------------
  if (!isMounted || isLoading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-xl text-zinc-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3">
          Edit Product
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full mb-8"></div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
          {/* ... (rest of your form JSX remains exactly the same as Create form) */}
          {/* Title */}
          <div className="text-zinc-900">
            <label className="font-semibold text-zinc-900">Product Title</label>
            <input
              name="title"
              value={form.title}
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
              value={form.price}
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
              value={form.priceAfterSolde}
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
              value={form.description}
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
                    value={form[key]}
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
                      alt={`Product image ${index + 1}`}
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
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
