import mongoose from "mongoose";
import Product from "@/models/product";
import connectDB from "@/lib/mongodb";
import cloudinary from "cloudinary";
import formidable from "formidable";
import { Readable } from "stream";
import fs from "fs/promises";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const config = { api: { bodyParser: false } };

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

async function parseForm(req) {
  const nodeReq = readableFromWebReadable(req.body);
  nodeReq.headers = Object.fromEntries(req.headers);

  const form = formidable({ multiples: true });
  return new Promise((resolve, reject) => {
    form.parse(nodeReq, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

function normalizeField(field) {
  if (Array.isArray(field)) return field[0];
  return field;
}

export async function GET(req, { params }) {
  try {
    const { id } = await params; // AWAIT PARAMS
    if (!isValidObjectId(id))
      return new Response(JSON.stringify({ message: "Invalid ID" }), {
        status: 400,
      });

    await connectDB();
    const product = await Product.findById(id).lean();
    if (!product)
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params; // AWAIT PARAMS HERE
    if (!isValidObjectId(id))
      return new Response(JSON.stringify({ message: "Invalid ID" }), {
        status: 400,
      });

    await connectDB();
    const { fields, files } = await parseForm(req);

    // First, get the existing product to preserve current images
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });
    }

    const updatedData = {
      title: normalizeField(fields.title),
      price: Number(normalizeField(fields.price)),
      priceAfterSolde: fields.priceAfterSolde
        ? Number(normalizeField(fields.priceAfterSolde))
        : undefined,
      description: normalizeField(fields.description),
      category: normalizeField(fields.category),
      xsQuantity: Number(normalizeField(fields.xsQuantity)) || 0,
      sQuantity: Number(normalizeField(fields.sQuantity)) || 0,
      mQuantity: Number(normalizeField(fields.mQuantity)) || 0,
      lQuantity: Number(normalizeField(fields.lQuantity)) || 0,
      xlQuantity: Number(normalizeField(fields.xlQuantity)) || 0,
      xxlQuantity: Number(normalizeField(fields.xxlQuantity)) || 0,
      xxxlQuantity: Number(normalizeField(fields.xxxlQuantity)) || 0,
    };

    // Start with existing images
    let updatedImages = [...existingProduct.images];

    // Handle new image uploads
    if (files.images && files.images.length > 0) {
      const imagesArr = Array.isArray(files.images) ? files.images : [files.images];
      const colorsArr = Array.isArray(fields.colors) ? fields.colors : [fields.colors];

      console.log(`Uploading ${imagesArr.length} new images`);

      for (let i = 0; i < imagesArr.length; i++) {
        const imgFile = imagesArr[i];
        // Only upload if it's a new file with filepath
        if (imgFile && imgFile.filepath) {
          try {
            const uploaded = await cloudinary.v2.uploader.upload(imgFile.filepath, {
              folder: "productImages",
            });
            
            updatedImages.push({
              imageUrl: uploaded.secure_url,
              color: colorsArr[i] || "#000000",
            });
            
            await fs.unlink(imgFile.filepath);
            console.log(`Uploaded new image: ${uploaded.secure_url}`);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
          }
        }
      }
    }

    // If existingImages are sent, rebuild the array based on frontend state
    if (fields.existingImages) {
      const existingImagesArr = Array.isArray(fields.existingImages) 
        ? fields.existingImages 
        : [fields.existingImages];
      const colorsArr = Array.isArray(fields.colors) ? fields.colors : [fields.colors];
      
      updatedImages = [];
      
      for (let i = 0; i < existingImagesArr.length; i++) {
        const imageUrl = existingImagesArr[i];
        const color = colorsArr[i] || "#000000";
        
        // Only add if it's a real URL (not a blob URL from new upload preview)
        if (imageUrl && !imageUrl.startsWith('blob:')) {
          updatedImages.push({
            imageUrl: imageUrl,
            color: color,
          });
        }
      }

      // Now add any new uploaded images that might not be in existingImages
      if (files.images && files.images.length > 0) {
        const imagesArr = Array.isArray(files.images) ? files.images : [files.images];
        
        for (let i = 0; i < imagesArr.length; i++) {
          const imgFile = imagesArr[i];
          if (imgFile && imgFile.filepath) {
            try {
              const uploaded = await cloudinary.v2.uploader.upload(imgFile.filepath, {
                folder: "productImages",
              });
              
              updatedImages.push({
                imageUrl: uploaded.secure_url,
                color: colorsArr[existingImagesArr.length + i] || "#000000",
              });
              
              await fs.unlink(imgFile.filepath);
            } catch (uploadError) {
              console.error("Error uploading new image:", uploadError);
            }
          }
        }
      }
    }

    updatedData.images = updatedImages;

    console.log(`Final images count: ${updatedImages.length}`);
    
    const result = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    console.log("Update result:", result);

    return new Response(JSON.stringify({ message: "Product updated successfully" }), {
      status: 200,
    });
  } catch (err) {
    console.error("Update error:", err);
    return new Response(JSON.stringify({ message: "Failed to update product" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params; // AWAIT PARAMS
    if (!isValidObjectId(id))
      return new Response(JSON.stringify({ message: "Invalid ID" }), {
        status: 400,
      });

    await connectDB();
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      return new Response(JSON.stringify({ message: "Product not found" }), {
        status: 404,
      });

    return new Response(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}