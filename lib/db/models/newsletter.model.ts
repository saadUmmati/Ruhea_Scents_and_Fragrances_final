import { Schema, Document, models, model } from "mongoose";

export interface INewsletterSubscriber extends Document {
    email: string;
    is_active: boolean;
    source?: string;
    createdAt: Date;
    updatedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
    {
        email: { type: String, required: true, unique: true },
        is_active: { type: Boolean, default: true },
        source: { type: String, default: "website_footer" },
    },
    { timestamps: true }
);

const NewsletterSubscriber =
    models.NewsletterSubscriber ||
    model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

export default NewsletterSubscriber;
