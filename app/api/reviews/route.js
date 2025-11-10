import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function POST(req) {
  await connectDB();
  try {
    const body = await req.json();
    const review = new Review(body);
    await review.save();
    return new Response(JSON.stringify({ message: "Avis ajouté avec succès" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Erreur lors de l'ajout" }), { status: 500 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // latest first
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Erreur lors de la récupération" }), { status: 500 });
  }
}
