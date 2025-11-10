import dbConnect from "@/lib/mongodb";
import Product from "@/models/product";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { products } = req.body; // Array of purchased items

    // Loop through each product in the order
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // Reduce the quantity based on the selected size
      const sizeField = `${item.size.toLowerCase()}Quantity`; // e.g., "mQuantity"
      if (product[sizeField] && parseInt(product[sizeField], 10) >= item.quantity) {
        product[sizeField] = (parseInt(product[sizeField], 10) - item.quantity).toString();
        await product.save();
      } else {
        // Not enough stock
        return res.status(400).json({
          message: `Not enough stock for ${product.title}, size ${item.size}`,
        });
      }
    }

    return res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
