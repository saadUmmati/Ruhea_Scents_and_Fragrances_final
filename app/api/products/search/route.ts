import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const limit = parseInt(searchParams.get("limit") || "5");

        if (!query) {
            return NextResponse.json({ suggestions: [] });
        }

        const products = await Product.find({
            status: "published",
            $or: [
                { name: { $regex: query, $options: "i" } },
                { brand: { $regex: query, $options: "i" } },
            ],
        })
            .select("name slug featured_image price brand")
            .limit(limit)
            .lean();

        const suggestions = products.map((product) => ({
            id: (product as any)._id.toString(),
            name: product.name,
            slug: product.slug,
            image: product.featured_image,
            price: product.price,
            brand: product.brand,
        }));

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error("Error searching products:", error);
        return NextResponse.json(
            { error: "Failed to search products" },
            { status: 500 }
        );
    }
}
