import mongoose, { Schema, Document, models, model } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: mongoose.Types.ObjectId;
    meta_title?: string;
    meta_description?: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
        parent: { type: Schema.Types.ObjectId, ref: "Category" },
        meta_title: { type: String },
        meta_description: { type: String },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
