import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { ProductTable } from "@/components/admin/products/ProductTable";
import { getProducts } from "@/lib/actions/product.actions";

export default async function ProductsPage() {
    const { products } = await getProducts({});

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your fragrance catalog, variants, and stock.
                    </p>
                </div>
                <Link href="/admin/products/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border">
                <ProductTable products={products} />
            </div>
        </div>
    );
}
