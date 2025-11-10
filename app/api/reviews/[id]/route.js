import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Review.findByIdAndDelete(params.id);
    return new Response(JSON.stringify({ message: "Avis supprimé" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Erreur serveur" }), { status: 500 });
  }
}
