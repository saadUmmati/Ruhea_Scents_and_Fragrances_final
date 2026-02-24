import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ViewedProduct {
    id: string;
    name: string;
    brand: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    slug: string;
}

interface RecentlyViewedStore {
    products: ViewedProduct[];
    addProduct: (product: ViewedProduct) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
    persist(
        (set) => ({
            products: [],
            addProduct: (product) => {
                set((state) => {
                    // Remove if already exists to move it to the top (front)
                    const filtered = state.products.filter((p) => p.id !== product.id);
                    // Add to front, keep max 10 items
                    return {
                        products: [product, ...filtered].slice(0, 10),
                    };
                });
            },
        }),
        {
            name: 'ruhea-recently-viewed',
        }
    )
);
