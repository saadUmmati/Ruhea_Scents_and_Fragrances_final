
import { Suspense } from "react";
import { getProducts } from "@/lib/actions/product.actions";
import { ShopListing } from "@/components/shop/shop-listing";
import { Loader2 } from "lucide-react";

import { ShopHero } from "@/components/shop/shop-hero";

export const dynamic = "force-dynamic";

interface ShopPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    // Convert searchParams to simple object for our action
    const actionParams: any = {
        page: typeof params.page === 'string' ? params.page : "1",
        limit: typeof params.limit === 'string' ? params.limit : "12",
        sort: typeof params.sort === 'string' ? params.sort : "newest",
        search: typeof params.search === 'string' ? params.search : "",
    };

    if (typeof params.category === 'string') actionParams.category = params.category;
    if (typeof params.gender === 'string') actionParams.gender = params.gender;
    if (typeof params.concentration === 'string') actionParams.concentration = params.concentration;

    // Handle frequencyFamily (could be string or array)
    if (params.fragranceFamily) {
        actionParams.fragranceFamily = Array.isArray(params.fragranceFamily)
            ? params.fragranceFamily
            : [params.fragranceFamily];
    }

    if (typeof params.minPrice === 'string') actionParams.minPrice = params.minPrice;
    if (typeof params.maxPrice === 'string') actionParams.maxPrice = params.maxPrice;

    // Server-side fetch
    let products = [];
    let pagination = { page: 1, limit: 12, total: 0, totalPages: 0 };
    let error = null;

    try {
        const data = await getProducts(actionParams);
        products = data.products;
        pagination = data.pagination;
    } catch (e) {
        console.error("Failed to load products:", e);
        error = "Failed to load products. Please try again later.";
    }

    if (error) {
        return (
            <main className="container py-8">
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <h2 className="text-xl font-semibold text-destructive mb-2">Something went wrong</h2>
                    <p className="text-muted-foreground">{error}</p>
                </div>
            </main>
        )
    }



    return (
        <main>
            <ShopHero />
            <div className="container py-12">
                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[50vh]">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                }>
                    <ShopListing products={products} pagination={pagination} />
                </Suspense>
            </div>
        </main>
    );
}
