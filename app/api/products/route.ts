import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();

        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const skip = (page - 1) * limit;

        // Filters
        const category = searchParams.get("category");
        const fragranceFamily = searchParams.getAll("fragranceFamily");
        const gender = searchParams.get("gender");
        const concentration = searchParams.get("concentration");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const search = searchParams.get("search");

        // Sorting
        const sort = searchParams.get("sort") || "newest";

        // Build query
        const query: any = { status: "published" };

        if (category) {
            query.category = category;
        }

        if (gender) {
            // If gender is selected, include products for that gender AND unisex
            if (gender === 'unisex') {
                query.gender = 'unisex';
            } else {
                query.gender = { $in: [gender, 'unisex'] };
            }
        }

        if (concentration) {
            query.concentration_type = concentration;
        }

        if (fragranceFamily.length > 0) {
            // Normalize to lowercase for matching
            const normalizedFamilies = fragranceFamily.map(f => f.toLowerCase());

            // Use $in operator to find products that have ANY of the selected fragrance families
            // We'll try to match both exact case and lowercase just to be safe, 
            // but primarily relying on the data being lowercase based on our seed script
            query.fragrance_family = { $in: [...fragranceFamily, ...normalizedFamilies] };
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { short_description: { $regex: search, $options: "i" } },
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

        const sortOption = sortMap[sort] || sortMap["newest"];

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

        // Transform products to add inStock computed field
        const products = productsRaw.map(product => ({
            ...product,
            inStock: product.variants && product.variants.length > 0
                ? product.variants.some((v: any) => v.stock > 0)
                : false
        }));

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();

        const body = await req.json();

        // Validation
        if (!body.name || !body.price || !body.sku) {
            return NextResponse.json(
                { error: "Name, Price, and SKU are required fields." },
                { status: 400 }
            );
        }

        const slug = body.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        // Create default variant if none provided
        const variants = body.variants && body.variants.length > 0 ? body.variants : [{
            size: "Standard",
            price: Number(body.price),
            stock: 10,
            sku: body.sku + "-STD",
            concentration: body.concentration_type || "EDP",
            type: "bottle"
        }];

        // Strip HTML for short description
        const cleanDescription = body.description.replace(/<[^>]*>?/gm, "");
        const shortDesc = body.short_description || cleanDescription.substring(0, 150).trim();

        const newProduct = await Product.create({
            ...body,
            slug: slug || `product-${Date.now()}`, // Fallback if slug generation fails
            // Defaults for strict schema
            short_description: shortDesc.length > 0 ? shortDesc : "No description available",
            concentration_type: body.concentration_type || "EDP",
            gender: body.gender || "unisex",
            variants: variants,
            // Ensure media fields exist
            images: body.images || [],
            featured_image: body.featured_image || "",
            status: "published",
        });

        // Revalidate Paths
        revalidatePath("/shop");
        revalidatePath("/");
        revalidatePath("/admin/products");

        return NextResponse.json({ product: newProduct }, { status: 201 });

    } catch (error: any) {
        console.error("Error creating product:", error);

        let errorMessage = "Failed to create product";

        // Mongoose validation error
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            errorMessage = messages.join(", ");
        } else if (error.code === 11000) {
            errorMessage = "A product with this name (slug) or SKU already exists.";
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
