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

export const config = {
  api: { bodyParser: false },
};

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

// POST: create product
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

    // Required fields
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
        { message: "Both images are required" },
        { status: 400 }
      );
    }

    // Upload to Cloudinary
    const uploadToCloudinary = async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.filepath, {
        folder: "productImages",
        resource_type: "image",
        quality: "auto:eco",
      });
      fs.unlinkSync(file.filepath); // remove temp file
      return result.secure_url;
    };

    const frontImgUrl = await uploadToCloudinary(files.frontImg[0]);
    const backImgUrl = await uploadToCloudinary(files.backImg[0]);

    // Parse sizes (dynamic quantities)
    let sizes = {};
    try {
      sizes = JSON.parse(fields.sizes?.[0] || "{}");
    } catch {
      sizes = {};
    }

    const category = fields.category[0];

    // Prepare product data
    const productData = {
      title: fields.title[0],
      price: fields.price[0],
      category,
      description: fields.description?.[0] || "",
      frontImg: frontImgUrl,
      backImg: backImgUrl,
    };

    if (category === "tshirt") {
      // Standard T-shirt sizes
      productData.xsmallQuantity = sizes["XS"] || "0";
      productData.smallQuantity = sizes["S"] || "0";
      productData.mediumQuantity = sizes["M"] || "0";
      productData.largeQuantity = sizes["L"] || "0";
      productData.xlargeQuantity = sizes["XL"] || "0";
      productData.xxlargeQuantity = sizes["XXL"] || "0";
    } else {
      // Sneakers & trousers → EUR sizes as plain object
      productData.eurQuantities = Object.fromEntries(Object.entries(sizes));
    }

    const newProduct = await Product.create(productData);

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Error uploading product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error: error.message },
      { status: 500 }
    );
  }
}

// GET: fetch all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });

    // Convert Maps to plain objects
    const cleanProducts = products.map((p) => {
      const obj = p.toObject();
      if (obj.eurQuantities instanceof Map) {
        obj.eurQuantities = Object.fromEntries(obj.eurQuantities);
      }
      return obj;
    });

    return NextResponse.json(cleanProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    // Always return array to avoid frontend filter crash
    return NextResponse.json([], { status: 200 });
  }
}
