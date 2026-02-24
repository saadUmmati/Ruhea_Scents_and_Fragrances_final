import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Wishlist from "@/lib/db/models/wishlist.model";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const wishlist = await Wishlist.findOne({ user: session.user.id })
            .populate("products.product");

        return NextResponse.json({
            wishlist: wishlist ? wishlist.products : []
        });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        let wishlist = await Wishlist.findOne({ user: session.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: session.user.id,
                products: [{ product: productId }],
            });
        } else {
            // Check if product already exists
            const exists = wishlist.products.some(
                (item: any) => item.product.toString() === productId
            );

            if (!exists) {
                wishlist.products.push({ product: productId });
                await wishlist.save();
            }
        }

        return NextResponse.json({ message: "Product added to wishlist" }, { status: 200 });
    } catch (error) {
        console.error("Error adding to wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        await Wishlist.findOneAndUpdate(
            { user: session.user.id },
            { $pull: { products: { product: productId } } }
        );

        return NextResponse.json({ message: "Product removed from wishlist" }, { status: 200 });
    } catch (error) {
        console.error("Error removing from wishlist:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
