import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },

    // New optional price after discount
    priceAfterSolde: { type: Number, default: null },

    category: {
      type: String,
      enum: [
        "robe",
        "sweatshirt à capuche",
        "jupe",
        "chemise",
        "pull",
        "pantalon",
        "top",
        "maillots de bain",
        "pyjama",
      ],
      required: true,
    },

    // NEW: Array of images with color
    images: [
      {
        imageUrl: { type: String, required: true },
        color: { type: String, required: true }, // Hex color
      },
    ],

    description: String,

    xsQuantity: { type: Number, default: 0 },
    sQuantity: { type: Number, default: 0 },
    mQuantity: { type: Number, default: 0 },
    lQuantity: { type: Number, default: 0 },
    xlQuantity: { type: Number, default: 0 },
    xxlQuantity: { type: Number, default: 0 },
    xxxlQuantity: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
