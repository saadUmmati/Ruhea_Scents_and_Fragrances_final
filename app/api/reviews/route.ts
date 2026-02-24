import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Review from "@/lib/db/models/review.model";
import { auth } from "@/auth";
import Product from "@/lib/db/models/product.model";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        const limit = parseInt(searchParams.get("limit") || "5");
        const page = parseInt(searchParams.get("page") || "1");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        const skip = (page - 1) * limit;

        const reviews = await Review.find({ product: productId, status: "approved" })
            .populate("user", "name image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Review.countDocuments({
            product: productId,
            status: "approved",
        });

        return NextResponse.json({
            reviews,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();
        const { productId, rating, title, comment } = body;

        if (!productId || !rating || !title || !comment) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({
            product: productId,
            user: session.user.id,
        });

        if (existingReview) {
            return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 });
        }

        // Create review
        // IMPORTANT: Defaulting to 'approved' for development/demo purposes
        const newReview = await Review.create({
            product: productId,
            user: session.user.id,
            rating,
            title,
            comment,
            status: "approved",
            verified_purchase: false, // In a real app, we'd check orders here
        });

        // Update product stats
        const stats = await Review.aggregate([
            { $match: { product: newReview.product, status: "approved" } },
            {
                $group: {
                    _id: "$product",
                    averageRating: { $avg: "$rating" },
                    totalReviews: { $sum: 1 },
                },
            },
        ]);

        if (stats.length > 0) {
            await Product.findByIdAndUpdate(productId, {
                rating_average: stats[0].averageRating,
                rating_count: stats[0].totalReviews,
            });
        }

        return NextResponse.json({ review: newReview }, { status: 201 });
    } catch (error) {
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
