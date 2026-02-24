import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IWishlist extends Document {
    user: mongoose.Types.ObjectId;
    products: {
        product: mongoose.Types.ObjectId;
        added_at: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const WishlistSchema = new Schema<IWishlist>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        products: [
            {
                product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                added_at: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Wishlist = models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
