import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import Cart from "@/lib/db/models/cart.model";
import Order from "@/lib/db/models/order.model";
import Product from "@/lib/db/models/product.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const session = await auth();
        const body = await req.json();

        const { shipping_address, items } = body;

        if (!shipping_address || !items || items.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields or empty cart" },
                { status: 400 }
            );
        }

        // Calculate Totals and Verify Stock
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return NextResponse.json(
                    { error: `Product not found: ${item.productId}` },
                    { status: 400 }
                );
            }

            const variant = product.variants.find(
                (v: any) => v.sku === item.variant_sku || v.size === item.size // Fallback to size if sku missing in client
            );

            if (!variant) {
                return NextResponse.json(
                    { error: `Variant not found for product ${product.name}` },
                    { status: 400 }
                );
            }

            if (variant.stock < item.quantity) {
                return NextResponse.json(
                    { error: `Insufficient stock for ${product.name} (${variant.size})` },
                    { status: 400 }
                );
            }

            subtotal += variant.price * item.quantity;

            orderItems.push({
                product: product._id,
                variant_sku: variant.sku,
                name: product.name,
                price: variant.price,
                quantity: item.quantity,
                image: product.featured_image,
                size: variant.size,
            });
        }

        const shipping_cost = 0; // Free shipping for now
        const total = subtotal + shipping_cost;

        // Create Order
        const order = await Order.create({
            user: session?.user?.id,
            order_number: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            items: orderItems,
            shipping_address,
            billing_address: shipping_address, // Use shipping as billing for now
            payment_method: "cod",
            subtotal,
            shipping_cost,
            total,
        });

        // Update Stock
        for (const item of orderItems) {
            await Product.updateOne(
                { _id: item.product, "variants.sku": item.variant_sku },
                { $inc: { "variants.$.stock": -item.quantity } }
            );
        }

        return NextResponse.json({ order_id: order._id }, { status: 201 });
    } catch (error) {
        console.error("Order creation error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
