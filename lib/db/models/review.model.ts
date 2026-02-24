import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IReview extends Document {
    product: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    rating: number;
    title: string;
    comment: string;
    verified_purchase: boolean;
    helpful_count: number;
    images?: string[];
    status: "pending" | "approved" | "rejected";
    admin_reply?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
    {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, required: true },
        comment: { type: String, required: true },
        verified_purchase: { type: Boolean, default: false },
        helpful_count: { type: Number, default: 0 },
        images: [{ type: String }],
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        admin_reply: { type: String },
    },
    { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
