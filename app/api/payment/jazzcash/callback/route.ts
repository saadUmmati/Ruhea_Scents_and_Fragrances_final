import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order.model";
import {
    verifyJazzCashResponse,
    isJazzCashPaymentSuccessful,
    getJazzCashResponseMessage,
} from "@/lib/payment/jazzcash";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        // Get form data from JazzCash callback
        const formData = await req.formData();
        const responseData: Record<string, string> = {};

        formData.forEach((value, key) => {
            responseData[key] = value.toString();
        });

        // Verify hash
        const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;
        const isValid = verifyJazzCashResponse(responseData, integritySalt);

        if (!isValid) {
            console.error("Invalid JazzCash response hash");
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=invalid_hash`
            );
        }

        // Get order ID from response
        const orderId = responseData.ppmpf_3; // We stored this in initiation
        const responseCode = responseData.pp_ResponseCode;
        const responseMessage = responseData.pp_ResponseMessage;
        const txnRefNo = responseData.pp_TxnRefNo;

        if (!orderId) {
            console.error("Order ID missing in callback");
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=missing_order`
            );
        }

        // Find order
        const order = await Order.findById(orderId);
        if (!order) {
            console.error("Order not found:", orderId);
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=order_not_found`
            );
        }

        // Check payment status
        const isSuccessful = isJazzCashPaymentSuccessful(responseCode);

        if (isSuccessful) {
            // Payment successful
            order.payment_status = "paid";
            order.payment_details = {
                ...order.payment_details,
                transaction_id: txnRefNo,
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

            const message = getJazzCashResponseMessage(responseCode);
            return NextResponse.redirect(
                `${process.env.NEXTAUTH_URL}/checkout/failed?reason=${encodeURIComponent(message)}`
            );
        }
    } catch (error) {
        console.error("JazzCash callback error:", error);
        return NextResponse.redirect(
            `${process.env.NEXTAUTH_URL}/checkout/failed?reason=server_error`
        );
    }
}

// Also handle GET requests (some gateways use GET)
export async function GET(req: NextRequest) {
    return POST(req);
}
