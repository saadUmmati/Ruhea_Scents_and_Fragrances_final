import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

export async function GET() {
    try {
        console.log("Seeding started...");
        console.log("Connecting to DB...");
        await connectToDatabase();
        console.log("Connected to DB");

        const product = {
            name: "Royal Oudh Intense",
            slug: "royal-oudh",
            brand: "RUHEA",
            sku: "ROI-001",
            description: "Experience the majesty of pure Oud, sourced from the finest agarwood. This intense fragrance is a tribute to the timeless traditions of the East, blending spicy saffron with deep, woody notes for a scent that commands attention.",
            short_description: "A majestic blend of pure Oud and spicy saffron.",
            price: 12500,
            originalPrice: 15000,
            rating_average: 4.9,
            rating_count: 128,
            inStock: true,
            variants: [
                { size: "50ml", price: 12500, stock: 50, sku: "ROI-50" },
                { size: "100ml", price: 22000, stock: 20, sku: "ROI-100" },
                { size: "Sample (3ml)", price: 850, stock: 100, sku: "ROI-03" },
            ],
            images: [
                "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2070&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=2074&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2070&auto=format&fit=crop",
            ],
            featured_image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop",
            fragrance_family: ["Woody", "Spicy"],
            concentration_type: "Parfum",
            gender: "unisex",
            notes: {
                top: ["Saffron", "Rose"],
                heart: ["Oud", "Amber"],
                base: ["Musk", "Sandalwood"],
            },
            status: "published"
        };

        console.log("Checking for existing product...");
        // Check if exists
        const existing = await Product.findOne({ slug: product.slug });
        if (existing) {
            console.log("Product already exists");
            return NextResponse.json({ message: "Product already exists", product: existing });
        }

        console.log("Creating new product...");
        const newProduct = await Product.create(product);
        console.log("Product created");
        return NextResponse.json({ message: "Product created", product: newProduct });
    } catch (error) {
        console.error("Seed error details:", error);
        return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
    }
}
