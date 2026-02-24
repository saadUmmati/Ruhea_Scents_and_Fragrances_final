import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ILoyaltyTransaction extends Document {
    user: mongoose.Types.ObjectId;
    points: number;
    type: "earned" | "redeemed" | "expired" | "adjustment";
    description: string;
    order?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        points: { type: Number, required: true },
        type: {
            type: String,
            enum: ["earned", "redeemed", "expired", "adjustment"],
            required: true,
        },
        description: { type: String, required: true },
        order: { type: Schema.Types.ObjectId, ref: "Order" },
    },
    { timestamps: true }
);

const LoyaltyTransaction =
    models.LoyaltyTransaction ||
    model<ILoyaltyTransaction>("LoyaltyTransaction", LoyaltyTransactionSchema);

export default LoyaltyTransaction;
