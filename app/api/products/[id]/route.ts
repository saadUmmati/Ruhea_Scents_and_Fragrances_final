import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";
import { revalidatePath } from "next/cache";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        let product;
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }

        if (!product) {
            product = await Product.findOne({ slug: id });
        }

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const body = await request.json();

        // Check if product exists
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Generate slug if name changed (optional, usually slug stays persistent unless explicitly changed, but let's regenerate to be safe if name changes drastically, OR just keep it. 
        // For simplicity and stability, we should only update slug if explicitly requested or let it be. 
        // Let's assume slug updates are manual or auto-generated on creation only to avoid breaking SEO links.
        // However, if we want to support slug updates:
        let slug = body.slug;
        if (body.name && body.name !== existingProduct.name) {
            slug = body.name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
        }

        // Update fields
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...body,
                slug: slug || existingProduct.slug,
                // Ensure media fields are updated
                images: body.images || existingProduct.images,
                featured_image: body.featured_image || existingProduct.featured_image,
                lastUpdated: new Date()
            },
            { new: true, runValidators: true }
        );

        revalidatePath("/shop");
        revalidatePath(`/shop/product/${updatedProduct.slug}`);
        revalidatePath("/admin/products");

        return NextResponse.json({ product: updatedProduct });

    } catch (error: any) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update product" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        revalidatePath("/shop");
        revalidatePath("/admin/products");

        return NextResponse.json({ message: "Product deleted successfully" });

    } catch (error: any) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete product" },
            { status: 500 }
        );
    }
}
