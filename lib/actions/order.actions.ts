"use server";

import connectToDatabase from "../db/mongoose";
import Order from "../db/models/order.model";
import { revalidatePath } from "next/cache";

export async function getOrders({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) {
    try {
        await connectToDatabase();

        const skip = (page - 1) * limit;

        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .populate("user", "name email")
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({});
        const totalPages = Math.ceil(totalOrders / limit);

        return {
            orders: JSON.parse(JSON.stringify(orders)),
            totalPages,
            currentPage: page,
            totalOrders
        };
    } catch (error) {
        console.log(error);
        return { orders: [], totalPages: 0, currentPage: 1, totalOrders: 0 };
    }
}

export async function getOrderById(orderId: string) {
    try {
        await connectToDatabase();
        const order = await Order.findById(orderId).populate("user", "name email");
        return JSON.parse(JSON.stringify(order));
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        await connectToDatabase();
        await Order.findByIdAndUpdate(orderId, { status });
        revalidatePath("/admin/orders");
        // revalidatePath(`/admin/orders/${orderId}`);
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false, error: "Failed to update order status" };
    }
}
