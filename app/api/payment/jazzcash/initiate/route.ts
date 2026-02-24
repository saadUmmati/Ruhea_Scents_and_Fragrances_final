import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order.model";
import {
    createJazzCashPaymentForm,
    type JazzCashConfig,
    type JazzCashPaymentData,
} from "@/lib/payment/jazzcash";

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const { orderId } = await req.json();

        if (!orderId) {
            return NextResponse.json(
                { error: "Order ID is required" },
                { status: 400 }
            );
        }

        // Fetch order
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Verify order belongs to user
        if (order.user.toString() !== session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check if order is already paid
        if (order.payment_status === "paid") {
            return NextResponse.json(
                { error: "Order already paid" },
                { status: 400 }
            );
        }

        // JazzCash configuration
        const config: JazzCashConfig = {
            merchantId: process.env.JAZZCASH_MERCHANT_ID!,
            password: process.env.JAZZCASH_PASSWORD!,
            integritySalt: process.env.JAZZCASH_INTEGRITY_SALT!,
            returnUrl: `${process.env.NEXTAUTH_URL}/api/payment/jazzcash/callback`,
        };

        // Validate configuration
        if (!config.merchantId || !config.password || !config.integritySalt) {
            return NextResponse.json(
                { error: "JazzCash configuration missing" },
                { status: 500 }
            );
        }

        // Payment data
        const paymentData: JazzCashPaymentData = {
            amount: order.total,
            billReference: order.order_number,
            description: `Order ${order.order_number}`,
            customerEmail: session.user.email || undefined,
        };

        // Generate payment form data
        const formData = createJazzCashPaymentForm(config, paymentData, orderId);

        // Update order with payment details
        order.payment_method = "jazzcash";
        order.payment_status = "pending";
        order.payment_details = {
            transaction_id: formData.pp_TxnRefNo,
            initiated_at: new Date(),
        };
        await order.save();

        // Return form data for frontend to submit
        return NextResponse.json({
            formData,
            postUrl: "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/",
            // For production: https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/
        });
    } catch (error) {
        console.error("JazzCash initiation error:", error);
        return NextResponse.json(
            { error: "Failed to initiate payment" },
            { status: 500 }
        );
    }
}
