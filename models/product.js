import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true },
  category: {
    type: String,
    enum: ["tshirt", "sneakers", "trouser"],
    required: true,
  },
  frontImg: String,
  backImg: String,
  description: String,

  // T-shirt sizes
  xsmallQuantity: { type: String, default: "0" },
  smallQuantity: { type: String, default: "0" },
  mediumQuantity: { type: String, default: "0" },
  largeQuantity: { type: String, default: "0" },
  xlargeQuantity: { type: String, default: "0" },
  xxlargeQuantity: { type: String, default: "0" },

  // EUR sizes for sneakers/trousers
  eurQuantities: {
    type: Map,
    of: String, // e.g., { "36": "10", "37": "5", "38": "0" }
    default: {},
  },
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
