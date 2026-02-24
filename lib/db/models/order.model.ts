import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    variant_sku: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size: string;
}

export interface IOrder extends Document {
    user?: mongoose.Types.ObjectId;
    order_number: string;
    items: IOrderItem[];
    shipping_address: {
        first_name: string;
        last_name: string;
        address: string;
        apartment?: string;
        city: string;
        postal_code: string;
        phone: string;
        email: string;
    };
    billing_address?: {
        first_name: string;
        last_name: string;
        address: string;
        apartment?: string;
        city: string;
        postal_code: string;
        phone: string;
    };
    payment_method: "cod" | "jazzcash" | "easypaisa" | "stripe";
    payment_status: "pending" | "paid" | "failed" | "refunded";
    payment_details?: {
        transaction_id?: string;
        payment_date?: Date;
        initiated_at?: Date;
        failed_at?: Date;
        gateway_response?: any;
        response_code?: string;
        response_message?: string;
    };
    status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
    subtotal: number;
    shipping_cost: number;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant_sku: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
    size: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        order_number: { type: String, required: true, unique: true },
        items: [OrderItemSchema],
        shipping_address: {
            first_name: { type: String, required: true },
            last_name: { type: String, required: true },
            address: { type: String, required: true },
            apartment: { type: String },
            city: { type: String, required: true },
            postal_code: { type: String, required: true },
            phone: { type: String, required: true },
            email: { type: String, required: true },
        },
        billing_address: {
            first_name: { type: String },
            last_name: { type: String },
            address: { type: String },
            apartment: { type: String },
            city: { type: String },
            postal_code: { type: String },
            phone: { type: String },
        },
        payment_method: {
            type: String,
            enum: ["cod", "jazzcash", "easypaisa", "stripe"],
            default: "cod"
        },
        payment_status: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        payment_details: {
            transaction_id: { type: String },
            payment_date: { type: Date },
            initiated_at: { type: Date },
            failed_at: { type: Date },
            gateway_response: { type: Schema.Types.Mixed },
            response_code: { type: String },
            response_message: { type: String },
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        subtotal: { type: Number, required: true },
        shipping_cost: { type: Number, required: true },
        total: { type: Number, required: true },
    },
    { timestamps: true }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;
