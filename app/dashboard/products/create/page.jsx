"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

const CreateProductPage = () => {
  const categories = [
    { value: "tshirt", label: "T-shirt" },
    { value: "hoodie", label: "Sweat à capuche" },
    { value: "trouser", label: "Pantalon" },
    { value: "dress", label: "Robe" },
    { value: "skirt", label: "Jupe" },
    { value: "sneakers", label: "Chaussures" },
    { value: "all", label: "Tous" },
  ];

  const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const eurSizes = Array.from({ length: 10 }, (_, i) => 36 + i); // 36–45
  const router = useRouter();
  const [category, setCategory] = useState("tshirt");

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [sizes, setSizes] = useState({}); // dynamic quantities

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (name === "frontImg") {
      setFrontImg(file);
      setPreviewFront(URL.createObjectURL(file));
    } else {
      setBackImg(file);
      setPreviewBack(URL.createObjectURL(file));
    }
  };

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({ ...prev, [size]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", form.title);
    data.append("price", form.price);
    data.append("description", form.description);
    data.append("category", category);
    data.append("sizes", JSON.stringify(sizes));

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
    <div className="w-full h-full text-zinc-800">
      <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
        <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">
          Create Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6"
          encType="multipart/form-data"
        >
          <div className="flex flex-col">
            <label className="font-medium">Title</label>
            <input
              name="title"
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Price (TND)</label>
            <input
              name="price"
              type="number"
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSizes({}); // reset sizes when changing category
              }}
              className="p-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              onChange={handleChange}
              className="p-3 border rounded-lg"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-2">
              {category === "sneakers" || category === "trouser"
                ? "EUR Pointures"
                : "Tailles (XS–XXL)"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(category === "sneakers" || category === "trouser"
                ? eurSizes
                : tshirtSizes
              ).map((size) => (
                <div key={size} className="flex flex-col items-center">
                  <span className="text-sm font-medium">{size}</span>
                  <input
                    type="number"
                    min="0"
                    className="p-1 border rounded-lg text-center w-16"
                    onChange={(e) => handleSizeChange(size, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-2 gap-4">
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
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductPage;
