"use client";

import { useEffect, useState } from "react";
import { Trash2, Star } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

const AvisDashboard = () => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState({});

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data);

      // Fetch product details for each review
      const productIds = [...new Set(data.map((r) => r.productId))];
      for (const productId of productIds) {
        const productRes = await fetch(`/api/products/${productId}`);
        if (productRes.ok) {
          const productData = await productRes.json();
          setProducts((prev) => ({ ...prev, [productId]: productData }));
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la récupération des avis.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Avis supprimé !");
        setReviews(reviews.filter((r) => r._id !== id));
      } else toast.error("Erreur lors de la suppression.");
    } catch (err) {
      console.error(err);
      toast.error("Erreur serveur.");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Avis Clients
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-pink-300 rounded-full"></div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Prénom
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Tel
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Évaluation
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Commentaire
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                  {r.nom}
                </td>
                <td className="px-4 py-4 text-sm text-gray-700">{r.prenom}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{r.email}</td>
                <td className="px-4 py-4 text-sm text-gray-700">
                  {r.tel || "-"}
                </td>
                <td className="px-4 py-4 text-sm">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < r.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {r.commentaire}
                </td>
                <td className="px-4 py-4 text-sm">
                  {products[r.productId] ? (
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <Image
                          src={products[r.productId].frontImg}
                          alt={products[r.productId].title}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                          {products[r.productId].title}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs">Chargement...</span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-500 hover:text-red-700 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  Aucun avis pour le moment
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Aucun avis pour le moment</p>
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Header with name and stars */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    {r.nom} {r.prenom}
                  </h3>
                  <div className="flex gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < r.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(r._id)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer p-2 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="text-xs text-gray-600">
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="text-gray-900">{r.email}</span>
                </div>
                {r.tel && (
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Tél:</span>{" "}
                    <span className="text-gray-900">{r.tel}</span>
                  </div>
                )}
              </div>

              {/* Comment */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  Commentaire
                </p>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {r.commentaire}
                </p>
              </div>

              {/* Product ID */}
              <div className="pt-2 border-t border-gray-200">
                {products[r.productId] ? (
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <Image
                        src={products[r.productId].frontImg}
                        alt={products[r.productId].title}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        {products[r.productId].title}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {products[r.productId].price} TND
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Chargement...</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AvisDashboard;
