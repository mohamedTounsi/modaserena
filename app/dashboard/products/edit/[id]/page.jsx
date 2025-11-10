"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

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

  const sizeKeys = [
    "xsQuantity",
    "sQuantity",
    "mQuantity",
    "lQuantity",
    "xlQuantity",
    "xxlQuantity",
    "xxxlQuantity",
  ];

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "robe",
    xsQuantity: 0,
    sQuantity: 0,
    mQuantity: 0,
    lQuantity: 0,
    xlQuantity: 0,
    xxlQuantity: 0,
    xxxlQuantity: 0,
  });

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        setForm({
          title: data.title || "",
          price: data.price || "",
          description: data.description || "",
          category: data.category || "robe",
          xsQuantity: data.xsQuantity || 0,
          sQuantity: data.sQuantity || 0,
          mQuantity: data.mQuantity || 0,
          lQuantity: data.lQuantity || 0,
          xlQuantity: data.xlQuantity || 0,
          xxlQuantity: data.xxlQuantity || 0,
          xxxlQuantity: data.xxxlQuantity || 0,
        });

        setPreviewFront(data.frontImg || null);
        setPreviewBack(data.backImg || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (size, value) => {
    setForm((prev) => ({ ...prev, [size]: value === "" ? 0 : Number(value) }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

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

    const toastId = toast.loading("Updating product...");

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: data,
      });

      if (res.ok) {
        toast.success("Product updated!", { id: toastId });
        router.push("/dashboard/products");
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to update", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <div className="w-full h-full text-zinc-800">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          {/* Title */}
          <div className="flex flex-col">
            <label className="font-medium">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col">
            <label className="font-medium">Price (TND)</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="font-medium">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-2 border rounded-lg"
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
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="p-3 border rounded-lg"
            />
          </div>

          {/* Sizes */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Quantités par taille</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sizeKeys.map((size) => (
                <div key={size} className="flex flex-col">
                  <label className="text-sm font-medium uppercase mb-1">
                    {size.replace("Quantity", "")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    name={size}
                    value={form[size]}
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                    className="p-2 border rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* Front */}
            <div className="flex flex-col">
              <label className="font-medium flex items-center gap-2">
                Front Image <Upload size={16} />
              </label>
              {previewFront && (
                <img
                  src={previewFront}
                  alt="Front Preview"
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
              )}
              <input
                id="frontImg"
                type="file"
                name="frontImg"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            {/* Back */}
            <div className="flex flex-col">
              <label className="font-medium flex items-center gap-2">
                Back Image <Upload size={16} />
              </label>
              {previewBack && (
                <img
                  src={previewBack}
                  alt="Back Preview"
                  className="w-32 h-32 object-cover rounded mb-2 border"
                />
              )}
              <input
                id="backImg"
                type="file"
                name="backImg"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition duration-200 mt-4"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
