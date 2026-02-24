import { MetadataRoute } from "next";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://ruhea.com";

    // Static pages
    const staticPages = [
        "",
        "/shop",
        "/quiz",
        "/about",
        "/contact",
        "/blog",
        "/faq",
        "/shipping",
        "/terms",
        "/privacy",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Dynamic product pages
    try {
        await connectToDatabase();
        const products = await Product.find({ status: "published" }).select("slug updatedAt").lean();

        const productPages = products.map((product: any) => ({
            url: `${baseUrl}/shop/product/${product.slug}`,
            lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
            changeFrequency: "daily" as const,
            priority: 0.7,
        }));

        return [...staticPages, ...productPages];
    } catch (error) {
        console.error("Failed to generate product sitemap:", error);
        return [...staticPages];
    }
}
