"use client";

import { ProductCard } from "@/components/shop/product-card";
import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { useEffect, useState } from "react";

interface RecentlyViewedProps {
    product?: any; // Current product to exclude or just context
}

export function RecentlyViewed({ product }: RecentlyViewedProps) {
    const [isMounted, setIsMounted] = useState(false);
    const viewedProducts = useRecentlyViewedStore((state) => state.products);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || viewedProducts.length === 0) return null;

    // Filter out the current product if passed
    const displayProducts = product
        ? viewedProducts.filter(p => p.id !== product._id)
        : viewedProducts;

    if (displayProducts.length === 0) return null;

    return (
        <section className="py-12 border-t">
            <h2 className="text-2xl font-serif font-bold mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {displayProducts.slice(0, 4).map((item) => (
                    <ProductCard
                        key={item.id}
                        product={{
                            id: item.id,
                            name: item.name,
                            brand: item.brand,
                            price: item.price,
                            rating: item.rating,
                            reviews: item.reviews,
                            image: item.image,
                            isNew: false
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
