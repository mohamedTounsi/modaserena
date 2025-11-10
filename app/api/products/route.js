// app/api/products/route.js
import { NextResponse } from "next/server";
import { Readable } from "stream";
import formidable from "formidable";
import fs from "fs";
import cloudinary from "cloudinary";
import connectDB from "@/lib/mongodb";
import Product from "@/models/product";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = { api: { bodyParser: false } };

// Helper: convert Web ReadableStream to Node Readable
function readableFromWebReadable(webReadable) {
  const reader = webReadable.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) return this.push(null);
      this.push(value);
    },
  });
}

// POST — Create product
export async function POST(req) {
  try {
    await connectDB();

    const form = formidable({ multiples: true });
    const nodeReq = readableFromWebReadable(req.body);
    nodeReq.headers = Object.fromEntries(req.headers);

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const requiredFields = ["title", "price", "category"];
    for (const field of requiredFields) {
      if (!fields[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    if (!files.frontImg || !files.backImg) {
      return NextResponse.json(
        { message: "Both front and back images are required" },
        { status: 400 }
      );
    }

    // Upload helper
    const uploadToCloudinary = async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "productImages",
        resource_type: "image",
        quality: "auto:eco",
      });
      fs.unlinkSync(file.filepath);
      return result.secure_url;
    };

    const frontImgUrl = await uploadToCloudinary(files.frontImg[0]);
    const backImgUrl = await uploadToCloudinary(files.backImg[0]);

    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;

    const productData = {
      title: Array.isArray(fields.title) ? fields.title[0] : fields.title,
      price: Number(Array.isArray(fields.price) ? fields.price[0] : fields.price),
      category,
      description: Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description || "",
      frontImg: frontImgUrl,
      backImg: backImgUrl,
      xsQuantity: Number(fields.xsQuantity?.[0] || 0),
      sQuantity: Number(fields.sQuantity?.[0] || 0),
      mQuantity: Number(fields.mQuantity?.[0] || 0),
      lQuantity: Number(fields.lQuantity?.[0] || 0),
      xlQuantity: Number(fields.xlQuantity?.[0] || 0),
      xxlQuantity: Number(fields.xxlQuantity?.[0] || 0),
      xxxlQuantity: Number(fields.xxxlQuantity?.[0] || 0),
    };

    const newProduct = await Product.create(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

// GET — Fetch all products
export async function GET(req) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    let query = {};
    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// PATCH — Decrease stock after checkout
export async function PATCH(req) {
  try {
    await connectDB();
    const { products } = await req.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ message: "Invalid products array" }, { status: 400 });
    }

    const bulkOps = products.map((item) => {
      const normalizedSize = item.size?.toLowerCase();
      const validSizes = ["xs", "s", "m", "l", "xl", "xxl", "xxxl"];

      if (!validSizes.includes(normalizedSize)) {
        console.warn(`⚠️ Invalid size '${item.size}' for product ${item._id}`);
        return null;
      }

      const sizeField = `${normalizedSize}Quantity`;
      const quantityToDecrement = Number(item.quantity);

      if (quantityToDecrement <= 0) {
        console.warn(`⚠️ Skipping product ${item._id}, invalid quantity: ${item.quantity}`);
        return null;
      }

      return {
        updateOne: {
          filter: { _id: item._id, [sizeField]: { $gte: quantityToDecrement } },
          update: { $inc: { [sizeField]: -quantityToDecrement } },
        },
      };
    }).filter(Boolean);

    if (bulkOps.length > 0) {
      const result = await Product.bulkWrite(bulkOps);
      console.log("✅ Stock updated:", result);
    } else {
      console.warn("⚠️ No valid products to update stock");
    }

    return NextResponse.json({ message: "Stock updated successfully ✅" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating stock:", error);
    return NextResponse.json(
      { message: "Failed to update stock", error: error.message },
      { status: 500 }
    );
  }
}
