import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IAddress {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    label?: string; // e.g., "Home", "Work"
}

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    image?: string;
    role: "customer" | "admin" | "super_admin";
    permissions?: string[];
    isBlocked: boolean;
    emailVerified?: Date;
    phoneNumber?: string;
    addresses: IAddress[];
    wishlist: mongoose.Types.ObjectId[];
    loyalty_points: number;
    loyalty_tier: "bronze" | "silver" | "gold" | "platinum";
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true, default: "Pakistan" },
    isDefault: { type: Boolean, default: false },
    label: { type: String, default: "Home" },
});

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        image: { type: String },
        role: { type: String, enum: ["customer", "admin", "super_admin"], default: "customer" },
        permissions: [{ type: String }], // e.g., "manage_products", "manage_orders", "manage_users"
        isBlocked: { type: Boolean, default: false },
        emailVerified: { type: Date },
        phoneNumber: { type: String },
        addresses: [AddressSchema],
        wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        loyalty_tier: {
            type: String,
            enum: ["bronze", "silver", "gold", "platinum"],
            default: "bronze",
        },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
    },
    { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;
