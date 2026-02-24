"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/shop/wishlist-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    isNew?: boolean;
    isSale?: boolean;
    notes?: string[];
}

interface ProductCardProps {
    product: Product;
    viewMode?: "grid" | "list";
    priority?: boolean;
}

export function ProductCard({ product, viewMode = "grid", priority = false }: ProductCardProps) {
    const { addItem } = useCartStore();
    const router = useRouter();
    const [imgSrc, setImgSrc] = React.useState(product.image);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if inside a Link
        e.stopPropagation();

        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            size: "Standard", // Default size for quick add
            quantity: 1,
            slug: product.id,
        });

        toast.success(`${product.name} has been added to your cart.`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/shop/product/${product.id}`);
    };

    const discountPercentage = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    if (viewMode === "list") {
        return (
            <Card className="group flex flex-row overflow-hidden border-none bg-card shadow-sm transition-all hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[4/5] w-48 shrink-0 overflow-hidden bg-muted">
                    <Image
                        src={imgSrc || "/images/product-placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={() => setImgSrc("/images/product-placeholder.png")}
                    />
                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                        {product.isNew && (
                            <Badge className="bg-primary text-primary-foreground font-medium tracking-wide rounded-none px-2 py-1 uppercase text-[10px]">
                                New Arrival
                            </Badge>
                        )}
                        {product.isSale && (
                            <Badge variant="destructive" className="font-medium tracking-wide rounded-none px-2 py-1 uppercase text-[10px]">
                                -{discountPercentage}%
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
                            {product.brand}
                        </span>
                        <WishlistButton
                            productId={product.id}
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive"
                        />
                    </div>

                    <Link href={`/shop/product/${product.id}`} className="group-hover:text-primary transition-colors">
                        <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">{product.name}</h3>
                    </Link>

                    <div className="mb-4 flex items-center gap-2">
                        <div className="flex text-accent">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        i < Math.floor(product.rating) ? "fill-current" : "text-muted/30"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({product.reviews} reviews)</span>
                    </div>

                    <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
                        {product.notes?.join(" • ") || "A luxurious fragrance suitable for any occasion."}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                            {product.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                                    Rs. {product.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="font-serif text-2xl font-bold text-primary">
                                Rs. {product.price.toLocaleString()}
                            </span>
                        </div>
                        <Button
                            className="min-w-[140px] rounded-sm bg-primary px-6 hover:bg-primary/90 text-primary-foreground"
                            onClick={handleAddToCart}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Add to Cart
                        </Button>
                    </div>
                </div>
            </Card>
        );
    }

    // Grid View (Default)
    return (
        <Card className="group relative overflow-hidden border-none bg-transparent transition-all duration-300">
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted/20">
                <Image
                    src={imgSrc || "/images/product-placeholder.png"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                    priority={priority}
                    loading={priority ? "eager" : "lazy"}
                    onError={() => setImgSrc("/images/product-placeholder.png")}
                />

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />

                {/* Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {product.isNew && (
                        <Badge className="bg-primary/95 text-primary-foreground font-semibold tracking-wider backdrop-blur-sm rounded-none shadow-sm px-3 py-1 uppercase text-[10px]">
                            New
                        </Badge>
                    )}
                    {product.isSale && (
                        <Badge variant="secondary" className="bg-destructive/90 text-white font-semibold tracking-wider backdrop-blur-sm rounded-none shadow-sm px-3 py-1 uppercase text-[10px]">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Quick Actions - Slide in from right or appear */}
                <div className="absolute right-3 top-3 flex flex-col gap-2 translate-x-12 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <WishlistButton
                        productId={product.id}
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-background/80 text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground backdrop-blur-sm transition-colors"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-background/80 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground backdrop-blur-sm transition-colors"
                        title="Quick View"
                        onClick={handleQuickView}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                {/* Add to Cart - Slide Up */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                    <Button
                        className="w-full rounded-sm bg-card/95 text-foreground shadow-lg hover:bg-primary hover:text-primary-foreground backdrop-blur-md transition-all font-medium tracking-wide uppercase text-xs h-10 border border-border"
                        onClick={handleAddToCart}
                    >
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Content */}
            <CardContent className="pt-4 px-1">
                <div className="mb-1 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        {product.brand}
                    </span>
                    <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span className="text-xs font-medium text-muted-foreground">{product.rating.toFixed(1)}</span>
                    </div>
                </div>

                <Link href={`/shop/product/${product.id}`} className="block group/title">
                    <h3 className="mb-1 font-serif text-lg font-bold text-foreground transition-colors group-hover/title:text-primary leading-tight truncate">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mt-2">
                    <span className="font-serif text-lg font-bold text-primary">
                        Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through decoration-destructive/40">
                            Rs. {product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
