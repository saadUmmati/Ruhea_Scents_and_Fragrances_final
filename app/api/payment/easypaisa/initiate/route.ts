import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order.model";
import {
    createEasyPaisaPaymentRequest,
    type EasyPaisaConfig,
    type EasyPaisaPaymentData,
} from "@/lib/payment/easypaisa";

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

        // EasyPaisa configuration
        const config: EasyPaisaConfig = {
            storeId: process.env.EASYPAISA_STORE_ID!,
            apiKey: process.env.EASYPAISA_API_KEY!,
            returnUrl: `${process.env.NEXTAUTH_URL}/api/payment/easypaisa/callback`,
            apiUrl: "https://easypay.easypaisa.com.pk/easypay/Index.jsf",
            // For sandbox: https://easypaystg.easypaisa.com.pk/easypay/Index.jsf
        };

        // Validate configuration
        if (!config.storeId || !config.apiKey) {
            return NextResponse.json(
                { error: "EasyPaisa configuration missing" },
                { status: 500 }
            );
        }

        // Payment data
        const paymentData: EasyPaisaPaymentData = {
            amount: order.total,
            orderId: order.order_number,
            description: `Order ${order.order_number}`,
            customerEmail: session.user.email || undefined,
        };

        // Generate payment request
        const requestData = createEasyPaisaPaymentRequest(config, paymentData);

        // Update order with payment details
        order.payment_method = "easypaisa";
        order.payment_status = "pending";
        order.payment_details = {
            transaction_id: requestData.orderId,
            initiated_at: new Date(),
        };
        await order.save();

        // Return request data for frontend
        return NextResponse.json({
            requestData,
            postUrl: config.apiUrl,
        });
    } catch (error) {
        console.error("EasyPaisa initiation error:", error);
        return NextResponse.json(
            { error: "Failed to initiate payment" },
            { status: 500 }
        );
    }
}
