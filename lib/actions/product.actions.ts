"use server";

import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

export async function getProducts(params: {
    page?: string;
    limit?: string;
    category?: string;
    fragranceFamily?: string[];
    gender?: string;
    concentration?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    sort?: string;
}) {
    try {
        await connectToDatabase();

        const page = parseInt(params.page || "1");
        const limit = parseInt(params.limit || "12");
        const skip = (page - 1) * limit;

        // Build query
        const query: any = { status: "published" };

        if (params.category) {
            query.category = params.category;
        }

        if (params.gender) {
            query.gender = params.gender;
        }

        if (params.concentration) {
            query.concentration_type = params.concentration;
        }

        if (params.fragranceFamily && params.fragranceFamily.length > 0) {
            query.fragrance_family = { $in: params.fragranceFamily };
        }

        if (params.minPrice || params.maxPrice) {
            query.price = {};
            if (params.minPrice) query.price.$gte = parseFloat(params.minPrice);
            if (params.maxPrice) query.price.$lte = parseFloat(params.maxPrice);
        }

        if (params.search) {
            query.$or = [
                { name: { $regex: params.search, $options: "i" } },
                { description: { $regex: params.search, $options: "i" } },
                { short_description: { $regex: params.search, $options: "i" } },
            ];
        }

        // Sort mapping
        const sortMap: Record<string, any> = {
            "price-asc": { price: 1 },
            "price-desc": { price: -1 },
            "rating": { rating_average: -1 },
            "newest": { createdAt: -1 },
            "name": { name: 1 },
        };

        const sortOption = sortMap[params.sort || "newest"] || sortMap["newest"];

        // Execute query
        const [productsRaw, total] = await Promise.all([
            Product.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .select("name slug brand price originalPrice rating_average rating_count featured_image images variants")
                .lean(),
            Product.countDocuments(query),
        ]);

        // Transform products to add inStock computed field and serialize IDs
        const products = productsRaw.map((product: any) => ({
            ...JSON.parse(JSON.stringify(product)),
            _id: product._id.toString(),
            inStock: product.variants && product.variants.length > 0
                ? product.variants.some((v: any) => v.stock > 0)
                : false,
        }));

        const totalPages = Math.ceil(total / limit);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw new Error("Failed to fetch products");
    }
}

export async function getProductById(id: string) {
    try {
        await connectToDatabase();

        let product;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }

        if (!product) {
            product = await Product.findOne({ slug: id });
        }

        return product ? JSON.parse(JSON.stringify(product)) : null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
