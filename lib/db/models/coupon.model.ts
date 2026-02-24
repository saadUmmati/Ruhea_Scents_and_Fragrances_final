import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    description: string;
    discount_type: "percentage" | "fixed" | "free_shipping";
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    applicable_products?: mongoose.Types.ObjectId[];
    applicable_categories?: mongoose.Types.ObjectId[];
    usage_limit?: number;
    usage_limit_per_user?: number;
    used_count: number;
    start_date: Date;
    expiry_date: Date;
    is_active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: { type: String, required: true, unique: true, uppercase: true },
        description: { type: String, required: true },
        discount_type: {
            type: String,
            enum: ["percentage", "fixed", "free_shipping"],
            required: true,
        },
        discount_value: { type: Number, required: true },
        min_order_amount: { type: Number },
        max_discount_amount: { type: Number },
        applicable_products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        applicable_categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        usage_limit: { type: Number },
        usage_limit_per_user: { type: Number },
        used_count: { type: Number, default: 0 },
        start_date: { type: Date, default: Date.now },
        expiry_date: { type: Date, required: true },
        is_active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Coupon = models.Coupon || model<ICoupon>("Coupon", CouponSchema);

export default Coupon;
