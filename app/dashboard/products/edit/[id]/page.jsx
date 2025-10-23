"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

const EditProductPage = () => {
  const { id } = useParams();
  const router = useRouter();

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

  const [category, setCategory] = useState("tshirt");
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });

  const [sizes, setSizes] = useState({});
  const [frontImg, setFrontImg] = useState(null);
  const [backImg, setBackImg] = useState(null);
  const [previewFront, setPreviewFront] = useState(null);
  const [previewBack, setPreviewBack] = useState(null);
  const [existingFront, setExistingFront] = useState("");
  const [existingBack, setExistingBack] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        setForm({
          title: data.title || "",
          price: data.price || "",
          description: data.description || "",
        });

        setCategory(data.category || "tshirt");

        // ✅ Parse sizes if it is a string
        let productSizes = {};
        if (data.sizes) {
          productSizes =
            typeof data.sizes === "string"
              ? JSON.parse(data.sizes)
              : data.sizes;
        }
        setSizes(productSizes);

        setExistingFront(data.frontImg || "");
        setExistingBack(data.backImg || "");

        if (data.frontImg) setPreviewFront(data.frontImg);
        if (data.backImg) setPreviewBack(data.backImg);
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;

    if (name === "frontImg") {
      setFrontImg(file);
      setPreviewFront(URL.createObjectURL(file));
    } else {
      setBackImg(file);
      setPreviewBack(URL.createObjectURL(file));
    }
  };

  const handleSizeChange = (size, value) => {
    setSizes((prev) => ({
      ...prev,
      [size]: value === "" ? 0 : Number(value),
    }));
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
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSizes({});
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
                    value={sizes[String(size)] || ""}
                    onChange={(e) =>
                      handleSizeChange(String(size), e.target.value)
                    }
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
};

export default EditProductPage;
