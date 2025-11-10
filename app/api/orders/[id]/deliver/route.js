import connectDB from "@/lib/mongodb";
import Order from "@/models/order";

export async function PUT(request, context) {
  const { id } = context.params; // remove await

  await connectDB();

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { isDelivered: true },
      { new: true }
    );

    if (!updatedOrder) {
      return new Response(JSON.stringify({ error: "Order not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(updatedOrder), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to update order:", error);
    return new Response(JSON.stringify({ error: "Failed to update order" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
