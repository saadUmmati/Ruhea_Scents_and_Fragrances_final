import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

export async function GET() {
    try {
        await connectToDatabase();

        // Update strict match
        const product = await Product.findOneAndUpdate(
            { name: "HUNZA" },
            { featured_image: "/images/products/hunza.jpg" },
            { new: true }
        );

        return NextResponse.json({
            success: !!product,
            product: product ? { name: product.name, image: product.featured_image } : "Not found"
        });
    } catch (e) {
        return NextResponse.json({ error: (e as Error).message });
    }
}
