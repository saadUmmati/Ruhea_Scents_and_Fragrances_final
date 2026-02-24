import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IProductVariant {
    size: string;
    concentration?: "Attar" | "Parfum" | "EDP" | "EDT" | "EDC";
    type?: "bottle" | "sample" | "tester" | "gift_set";
    price: number;
    compare_at_price?: number;
    stock: number;
    sku: string;
    batch_code?: string;
    low_stock_threshold?: number;
}

export interface IFragranceNotes {
    top: string[];
    heart: string[];
    base: string[];
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    short_description: string;
    brand: string;
    sku: string;
    price: number;
    originalPrice?: number;

    // Fragrance Details
    fragrance_family: string[];
    concentration_type: "Attar" | "Parfum" | "EDP" | "EDT" | "EDC";
    gender: "men" | "women" | "unisex";
    notes: IFragranceNotes;
    longevity: "2-4h" | "4-6h" | "6-8h" | "8+h";
    sillage: "soft" | "moderate" | "heavy";
    best_season: string[];
    best_time: string[];
    occasions: string[];

    // Variants
    variants: IProductVariant[];

    // Media
    images: string[];
    featured_image: string;
    video_url?: string;

    // Categorization
    categories: mongoose.Types.ObjectId[];
    tags: string[];

    // Cultural
    is_halal: boolean;
    is_alcohol_free: boolean;
    religious_significance?: string;

    // SEO
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];

    // Stats
    rating_average: number;
    rating_count: number;
    views: number;
    sales_count: number;

    // Status
    status: "draft" | "published";
    featured: boolean;

    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String, required: true },
        short_description: { type: String, required: true },
        brand: { type: String, default: "RUHEA" },
        sku: { type: String, required: true, unique: true },
        price: { type: Number, required: true, default: 0 },
        originalPrice: { type: Number },

        // Fragrance Details
        fragrance_family: [{ type: String }],
        concentration_type: {
            type: String,
            enum: ["Attar", "Parfum", "EDP", "EDT", "EDC"],
            required: true,
        },
        gender: {
            type: String,
            enum: ["men", "women", "unisex"],
            required: true,
        },
        notes: {
            top: [{ type: String }],
            heart: [{ type: String }],
            base: [{ type: String }],
        },
        longevity: {
            type: String,
            enum: ["2-4h", "4-6h", "6-8h", "8+h"],
        },
        sillage: {
            type: String,
            enum: ["soft", "moderate", "heavy"],
        },
        best_season: [{ type: String }],
        best_time: [{ type: String }],
        occasions: [{ type: String }],

        // Variants
        variants: [
            {
                size: { type: String, required: true },
                concentration: {
                    type: String,
                    enum: ["Attar", "Parfum", "EDP", "EDT", "EDC"],
                },
                type: {
                    type: String,
                    enum: ["bottle", "sample", "tester", "gift_set"],
                    default: "bottle"
                },
                price: { type: Number, required: true },
                compare_at_price: { type: Number },
                stock: { type: Number, required: true, default: 0 },
                sku: { type: String, required: true },
                batch_code: { type: String },
                low_stock_threshold: { type: Number, default: 5 },
            },
        ],

        // Media
        images: [{ type: String }],
        featured_image: { type: String, default: "" },
        video_url: { type: String },

        categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
        tags: [{ type: String }],

        // Cultural
        is_halal: { type: Boolean, default: true },
        is_alcohol_free: { type: Boolean, default: false },
        religious_significance: { type: String },

        // SEO
        meta_title: { type: String },
        meta_description: { type: String },
        meta_keywords: [{ type: String }],

        // Stats
        rating_average: { type: Number, default: 0 },
        rating_count: { type: Number, default: 0 },
        views: { type: Number, default: 0 },
        sales_count: { type: Number, default: 0 },

        // Status
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
        },
        featured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
