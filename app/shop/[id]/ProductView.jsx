"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Heart,
  Share2,
  ChevronRight,
  ShoppingCart,
  X,
  Star,
} from "lucide-react";

const ProductView = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const [activeImage, setActiveImage] = useState("front");
  const [wishlist, setWishlist] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Sizes
  const sizes = useMemo(
    () => [
      { label: "XS", quantity: +product.xsQuantity || 0 },
      { label: "S", quantity: +product.sQuantity || 0 },
      { label: "M", quantity: +product.mQuantity || 0 },
      { label: "L", quantity: +product.lQuantity || 0 },
      { label: "XL", quantity: +product.xlQuantity || 0 },
      { label: "XXL", quantity: +product.xxlQuantity || 0 },
      { label: "XXXL", quantity: +product.xxxlQuantity || 0 },
    ],
    [product]
  );

  const [selectedSize, setSelectedSize] = useState(() => {
    const firstAvailable = sizes.find((s) => s.quantity > 0);
    return firstAvailable ? firstAvailable.label : "";
  });
  const [quantity, setQuantity] = useState(1);

  const getAvailableStock = () => {
    switch (selectedSize) {
      case "XS":
        return +product.xsQuantity || 0;
      case "S":
        return +product.sQuantity || 0;
      case "M":
        return +product.mQuantity || 0;
      case "L":
        return +product.lQuantity || 0;
      case "XL":
        return +product.xlQuantity || 0;
      case "XXL":
        return +product.xxlQuantity || 0;
      case "XXXL":
        return +product.xxxlQuantity || 0;
      default:
        return 0;
    }
  };

  const handleQuantityChange = (type) => {
    if (!selectedSize)
      return toast.error("Veuillez sélectionner une taille d'abord.");
    const max = getAvailableStock();
    if (type === "inc") {
      if (quantity < max) setQuantity(quantity + 1);
      else
        toast.error(`Seulement ${max} article${max > 1 ? "s" : ""} en stock.`);
    } else setQuantity(quantity > 1 ? quantity - 1 : 1);
  };

  const handleBuyNow = () => {
    if (!selectedSize)
      return toast.error("Veuillez sélectionner une taille pour continuer.");
    const productToBuy = {
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      size: selectedSize,
      quantity,
      category: product.category,
    };
    sessionStorage.setItem(
      "checkoutSingleProduct",
      JSON.stringify(productToBuy)
    );
    router.push("/checkout");
  };

  const handleAddToCart = () => {
    if (!selectedSize)
      return toast.error(
        "Veuillez sélectionner une taille pour ajouter au panier."
      );
    addToCart({
      _id: product._id,
      title: product.title,
      image: product.frontImg,
      price: product.price,
      size: selectedSize,
      quantity,
      category: product.category,
    });
    toast.success("Ajouté au panier!");
  };

  const soldOut = sizes.every((s) => s.quantity === 0);

  // Review form state
  const [reviewData, setReviewData] = useState({
    nom: "",
    prenom: "",
    email: "",
    tel: "",
    stars: 5,
    commentaire: "",
  });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        body: JSON.stringify({ ...reviewData, productId: product._id }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Avis soumis avec succès!");
        setShowReviewModal(false);
        setReviewData({
          nom: "",
          prenom: "",
          email: "",
          tel: "",
          stars: 5,
          commentaire: "",
        });
      } else toast.error("Erreur lors de l'envoi de l'avis.");
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur.");
    }
  };

  return (
    <div className="bg-white min-h-screen mt-18 md:mt-25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* IMAGES */}
          <div className="w-full md:w-1/2">
            <div className="sticky top-4">
              <div className="relative w-full aspect-square overflow-hidden mb-4 rounded-lg border border-gray-200">
                <Image
                  src={
                    activeImage === "front" ? product.frontImg : product.backImg
                  }
                  alt={product.title || "Product"}
                  fill
                  className="object-contain transition-opacity duration-500"
                />
              </div>
              <div className="flex gap-2">
                {["front", "back"].map((imgType) => (
                  <button
                    key={imgType}
                    onClick={() => setActiveImage(imgType)}
                    className={`w-20 h-20 border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer ${
                      activeImage === imgType
                        ? "border-pink-500 shadow-md"
                        : "border-gray-200 hover:border-pink-300"
                    }`}
                  >
                    <Image
                      src={
                        imgType === "front" ? product.frontImg : product.backImg
                      }
                      alt={imgType}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* INFO */}
          <div className="w-full md:w-1/2">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
                {product.title}
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {product.price}{" "}
                <span className="text-sm font-medium text-gray-600">TND</span>
              </p>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-700 mb-6 leading-relaxed border-b border-gray-200 pb-6">
              {product.description}
            </p>

            {/* SIZES */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold text-gray-900">TAILLE</h3>
                <p className="text-xs text-gray-500 font-medium">
                  Stock: {getAvailableStock()}
                </p>
              </div>
              <ul className="flex gap-2 flex-wrap">
                {sizes.map(({ label, quantity }) => {
                  const disabled = quantity <= 0;
                  return (
                    <li key={label}>
                      <button
                        onClick={() => !disabled && setSelectedSize(label)}
                        disabled={disabled}
                        className={`px-4 py-2 text-xs font-bold border rounded-md transition-all duration-300 cursor-pointer ${
                          disabled
                            ? "bg-gray-100 text-gray-400 border-gray-200 line-through"
                            : selectedSize === label
                            ? "bg-black text-white border-black shadow-sm"
                            : "bg-white text-gray-900 border-gray-300 hover:border-pink-400 hover:bg-pink-50"
                        }`}
                      >
                        {label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* QUANTITY */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">QTÉ</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-fit bg-white hover:border-pink-300 transition-colors">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  className="px-4 py-2 text-lg text-gray-900 font-light hover:text-pink-600 transition-colors cursor-pointer"
                >
                  −
                </button>
                <span className="px-5 py-2 text-sm text-gray-900 font-bold border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("inc")}
                  className="px-4 py-2 text-lg text-gray-900 font-light hover:text-pink-600 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            {soldOut ? (
              <button
                className="w-full py-3 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed font-semibold text-sm"
                disabled
              >
                Rupture de Stock
              </button>
            ) : (
              <>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 mb-2 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Acheter Maintenant
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center gap-2 justify-center py-3 mb-4 rounded-lg bg-black hover:bg-gray-900 text-white font-bold text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <ShoppingCart size={16} /> Ajouter au Panier
                </button>

                {/* Divider */}
                <hr className="my-4 border-gray-200" />

                {/* Avis Client */}
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="w-full py-3 rounded-lg bg-pink-100 hover:bg-pink-200 text-gray-900 font-bold text-sm transition-all duration-300 cursor-pointer"
                >
                  Avis Client
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Votre Avis</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={reviewData.nom}
                  onChange={handleReviewChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm"
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={reviewData.prenom}
                  onChange={handleReviewChange}
                  required
                  className="p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm"
                />
              </div>

              {/* Email & Phone */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={reviewData.email}
                onChange={handleReviewChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm"
              />
              <input
                type="tel"
                name="tel"
                placeholder="Numéro de téléphone"
                value={reviewData.tel}
                onChange={handleReviewChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm"
              />

              {/* Stars Rating */}
              <div className="py-2">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Évaluation
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewData((prev) => ({ ...prev, stars: star }))
                      }
                      className="transition-all duration-200 cursor-pointer"
                    >
                      <Star
                        size={28}
                        className={`${
                          star <= reviewData.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } transition-all`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <textarea
                name="commentaire"
                placeholder="Votre commentaire..."
                value={reviewData.commentaire}
                onChange={handleReviewChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition text-sm resize-none"
                rows={4}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-black text-white font-bold rounded-lg mt-4 hover:bg-gray-900 transition-all duration-300 cursor-pointer text-sm"
              >
                Soumettre l'Avis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;
