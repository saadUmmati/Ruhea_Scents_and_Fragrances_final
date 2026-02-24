"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const products = [
    {
        id: 1,
        name: "HUNZA",
        brand: "RUHEA",
        price: 12500,
        rating: 5.0,
        reviews: 12,
        image: "/images/carousel/natural-bottles.png",
    },
    {
        id: 2,
        name: "Velvet Rose",
        brand: "RUHEA",
        price: 9500,
        rating: 4.8,
        reviews: 96,
        image: "/images/carousel/floral-romance.png",
    },
    {
        id: 3,
        name: "Ocean Mist",
        brand: "RUHEA",
        price: 7500,
        rating: 4.7,
        reviews: 84,
        image: "/images/carousel/fresh-citrus.png",
    },
    {
        id: 4,
        name: "Saffron Spice",
        brand: "RUHEA",
        price: 14000,
        rating: 5.0,
        reviews: 42,
        image: "/images/carousel/spices-ingredients.png",
    },
];

export function BestSellers({ products = [] }: { products?: any[] }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 bg-muted/30">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-serif font-bold mb-4">Best Sellers</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our most loved fragrances, chosen by you. Discover the scents that have captured hearts across Pakistan.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product._id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow group">
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src={product.featured_image || product.images?.[0] || "/images/product-placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                                    <Link href={`/shop/${product.slug}`}>
                                        <Button className="w-full" size="sm">
                                            Quick View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <CardHeader className="p-4 pb-0">
                                <p className="text-sm text-muted-foreground">{product.brand || "RUHEA"}</p>
                                <CardTitle className="text-lg font-medium">{product.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="flex items-center gap-1 mb-2">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{product.rating_average || 5.0}</span>
                                    <span className="text-sm text-muted-foreground">({product.rating_count || 12})</span>
                                </div>
                                <div className="font-bold">Rs. {product.price.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button asChild size="lg" variant="outline">
                        <Link href="/shop">Shop All Best Sellers</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
