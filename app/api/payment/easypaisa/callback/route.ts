import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order.model";
import {
    verifyEasyPaisaResponse,
    isEasyPaisaPaymentSuccessful,
    getEasyPaisaResponseMessage,
} from "@/lib/payment/easypaisa";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // Get response data from EasyPaisa
        const responseData = await req.json();

        // Verify hash
        const storeId = process.env.EASYPAISA_STORE_ID!;
        const apiKey = process.env.EASYPAISA_API_KEY!;
        const isValid = verifyEasyPaisaResponse(responseData, apiKey, storeId);

        if (!isValid) {
            console.error("Invalid EasyPaisa response hash");
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=invalid_hash`
            );
        }

        // Get order ID from response
        const orderNumber = responseData.orderId;
        const responseCode = responseData.responseCode || responseData.status;
        const responseMessage = responseData.responseDesc || responseData.message;

        if (!orderNumber) {
            console.error("Order ID missing in callback");
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=missing_order`
            );
        }

        // Find order by order number
        const order = await Order.findOne({ order_number: orderNumber });
        if (!order) {
            console.error("Order not found:", orderNumber);
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=order_not_found`
            );
        }

        // Check payment status
        const isSuccessful = isEasyPaisaPaymentSuccessful(responseCode);

        if (isSuccessful) {
            // Payment successful
            order.payment_status = "paid";
            order.payment_details = {
                ...order.payment_details,
                transaction_id: responseData.transactionId || responseData.orderId,
                payment_date: new Date(),
                gateway_response: responseData,
                response_code: responseCode,
                response_message: responseMessage,
            };
            order.status = "confirmed";
            await order.save();

            // Redirect to success page
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/success?order=${order._id}`
            );
        } else {
            // Payment failed
            order.payment_status = "failed";
            order.payment_details = {
                ...order.payment_details,
                gateway_response: responseData,
                response_code: responseCode,
                response_message: responseMessage,
                failed_at: new Date(),
            };
            await order.save();

            const message = getEasyPaisaResponseMessage(responseCode);
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=${encodeURIComponent(message)}`
            );
        }
    } catch (error) {
        console.error("EasyPaisa callback error:", error);
        return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}/checkout/failed?reason=server_error`
        );
    }
}

// Also handle GET requests
export async function GET(req: NextRequest) {
    return POST(req);
}
