import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";
import { ProductForm } from "@/components/admin/products/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;

    // Validate ID format to avoid CastError
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        notFound();
    }

    const product = await Product.findById(id).lean();

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
            </div>
            <ProductForm initialData={JSON.parse(JSON.stringify(product))} />
        </div>
    );
}
