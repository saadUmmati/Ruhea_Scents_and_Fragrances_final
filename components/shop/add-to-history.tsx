"use client";

import { useRecentlyViewedStore } from "@/lib/store/recently-viewed-store";
import { useEffect } from "react";

interface AddToHistoryProps {
    product: {
        _id: string;
        name: string;
        brand: string;
        price: number;
        rating: number;
        reviews: number;
        featured_image: string;
        slug: string;
    };
}

export function AddToHistory({ product }: AddToHistoryProps) {
    const addProduct = useRecentlyViewedStore((state) => state.addProduct);

    useEffect(() => {
        addProduct({
            id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            rating: product.rating,
            reviews: product.reviews,
            image: product.featured_image,
            slug: product.slug,
        });
    }, [product, addProduct]);

    return null;
}
