import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    variant_sku: string;
    quantity: number;
    added_at: Date;
}

export interface ICart extends Document {
    user?: mongoose.Types.ObjectId;
    session_id?: string;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variant_sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    added_at: { type: Date, default: Date.now },
});

const CartSchema = new Schema<ICart>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        session_id: { type: String },
        items: [CartItemSchema],
    },
    { timestamps: true }
);

// Ensure either user or session_id is present
CartSchema.pre("save", function (next) {
    if (!this.user && !this.session_id) {
        next(new Error("Cart must have either a user or a session_id"));
    } else {
        next();
    }
});

const Cart = models.Cart || model<ICart>("Cart", CartSchema);

export default Cart;
