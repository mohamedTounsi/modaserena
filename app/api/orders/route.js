import connectDB from "@/lib/mongodb";
import Order from "@/models/order";
import Product from "@/models/product";
import nodemailer from "nodemailer";

// Function to send email notification for a new order
const sendOrderNotification = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const productList = order.products
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.title}" width="60" style="border-radius: 6px; border: 1px solid #ccc;" />
        </td>
        <td style="padding: 10px;">
          <strong>${item.title}</strong><br/>
          Size: ${item.size}<br/>
          Quantity: ${item.quantity}<br/>
          Price: ${item.price} TND
        </td>
      </tr>
    `
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #2b2b2b;">🛒 New Order Received</h2>
      </div>

      <p><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
      <p><strong>Email:</strong> ${order.email}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.postalCode}</p>
      <p><strong>Notes:</strong> ${order.notes || "None"}</p>
      <p><strong>Total:</strong> ${order.total} TND</p>
      <p><strong>Shipping Method:</strong> ${order.shippingMethod}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>

      <h3 style="margin-top: 30px;">🧾 Products:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        ${productList}
      </table>

      <p style="margin-top: 30px; font-size: 13px; color: #777;">Thank you for your order!</p>
    </div>
  `;

  const mailOptions = {
    from: `"Your Store" <${process.env.GMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL,
    subject: `New Order from ${order.firstName} ${order.lastName}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

// POST - Create new order
export async function POST(req) {
  await connectDB();
  const data = await req.json();

  try {
    for (const item of data.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (["tshirt", "hoodie", "dress", "skirt"].includes(product.category)) {
        const sizeKeyMap = {
          XS: "xsmallQuantity",
          S: "smallQuantity",
          M: "mediumQuantity",
          L: "largeQuantity",
          XL: "xlargeQuantity",
          XXL: "xxlargeQuantity",
        };
        const sizeKey = sizeKeyMap[item.size];
        if (sizeKey) {
          const currentQty = parseInt(product[sizeKey] || "0");
          product[sizeKey] = Math.max(0, currentQty - item.quantity).toString();
        }
      } else {
        // Sneakers / trousers: EUR sizes (Map)
        const currentQty = parseInt(product.eurQuantities.get(item.size) || "0");
        product.eurQuantities.set(item.size, Math.max(0, currentQty - item.quantity).toString());
      }

      await product.save();
    }

    const newOrder = await Order.create(data);

    try {
      await sendOrderNotification(newOrder);
    } catch (mailErr) {
      console.error("Failed to send email:", mailErr);
    }

    return new Response(JSON.stringify(newOrder), { status: 201 });
  } catch (error) {
    console.error("Failed to create order:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// GET - Fetch all orders (pending & delivered)
export async function GET() {
  try {
    await connectDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    const pendingOrders = orders.filter(order => !order.isDelivered);
    const deliveredOrders = orders.filter(order => order.isDelivered);

    return new Response(JSON.stringify({ pendingOrders, deliveredOrders }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return new Response("Failed to fetch orders", { status: 500 });
  }
}
