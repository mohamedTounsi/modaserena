import mongoose from "mongoose";
import Product from "@/models/product";
import connectDB from "@/lib/mongodb";
import cloudinary from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";
import fsPromises from "fs/promises";

// ✅ Cloudinary Configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = { api: { bodyParser: false } };

// ✅ Convert WebReadable to Node.js Readable (for formidable)
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

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export async function PUT(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    await connectDB();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
      });
    }

    const form = formidable({ multiples: true });
    const nodeReq = readableFromWebReadable(req.body);
    nodeReq.headers = Object.fromEntries(req.headers);

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // ✅ Parse fields properly
    const updatedData = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => {
        // Formidable gives arrays for each field
        const val = Array.isArray(value) ? value[0] : value;

        if (key === "sizes") {
          try {
            return [key, JSON.parse(val)]; // parse sizes JSON
          } catch (err) {
            console.error("Failed to parse sizes:", err);
            return [key, {}]; // fallback
          }
        }

        return [key, val];
      })
    );

    // ✅ Handle Image Uploads
    if (files.frontImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(
        files.frontImg[0].filepath,
        { folder: "productImages" }
      );
      updatedData.frontImg = uploaded.secure_url;
      await fsPromises.unlink(files.frontImg[0].filepath);
    }

    if (files.backImg?.[0]?.filepath) {
      const uploaded = await cloudinary.v2.uploader.upload(
        files.backImg[0].filepath,
        { folder: "productImages" }
      );
      updatedData.backImg = uploaded.secure_url;
      await fsPromises.unlink(files.backImg[0].filepath);
    }

    await Product.findByIdAndUpdate(id, updatedData, { new: true });

    return new Response(JSON.stringify({ message: "Product updated" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Update error:", err);
    return new Response(JSON.stringify({ message: "Update failed" }), {
      status: 500,
    });
  }
}
export async function GET(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    await connectDB();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
      });
    }

    const product = await Product.findById(id).lean(); // use lean() for plain JS object
    if (!product) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    // ✅ Ensure sizes is always an object with number values
    if (product.sizes) {
      let sizesObj =
        typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;

      // convert all values to numbers
      product.sizes = Object.fromEntries(
        Object.entries(sizesObj).map(([key, val]) => [key, Number(val) || 0])
      );
    } else {
      product.sizes = {};
    }

    return new Response(JSON.stringify(product), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch product" }),
      { status: 500 }
    );
  }
}


// ✅ DELETE — Remove product by ID
export async function DELETE(req, context) {
  const params = await context.params;
  const { id } = params;

  try {
    await connectDB();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ message: "Invalid product ID" }), {
        status: 400,
      });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    return new Response(
      JSON.stringify({ message: "Product deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete product" }),
      { status: 500 }
    );
  }
}
