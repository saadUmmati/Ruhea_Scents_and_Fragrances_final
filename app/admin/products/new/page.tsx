import { ProductForm } from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
                <p className="text-muted-foreground">
                    Add a new fragrance to your catalog with detailed specifications.
                </p>
            </div>

            <ProductForm />
        </div>
    );
}
