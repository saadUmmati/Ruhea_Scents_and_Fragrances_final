"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Truck, ShieldCheck, Gift, Heart, Share2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/lib/store/cart-store";
import { WishlistButton } from "@/components/shop/wishlist-button";

interface ProductInfoProps {
    product: {
        _id: string;
        name: string;
        brand: string;
        price: number;
        originalPrice?: number;
        rating: number;
        reviews: number;
        description: string;
        variants: { size: string; price: number; stock: number; compare_at_price?: number }[];
        inStock: boolean;
        slug: string;
        featured_image: string;
    };
}

export function ProductInfo({ product }: ProductInfoProps) {
    const router = useRouter();
    const [selectedVariant, setSelectedVariant] = useState(
        Array.isArray(product.variants) && product.variants.length > 0
            ? product.variants[0]
            : { size: "Standard", price: product.price || 0, stock: 0 }
    );
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (!selectedVariant) return;

        setIsAdding(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            addItem({
                productId: product._id,
                name: product.name,
                price: selectedVariant?.price || 0,
                image: product.featured_image,
                size: selectedVariant?.size || "Standard",
                quantity: quantity,
                slug: product.slug,
            });

            setIsAdding(false);
            toast.success("Added to cart", {
                description: `${product.name} (${selectedVariant?.size}) x ${quantity}`,
                action: {
                    label: "View Cart",
                    onClick: () => router.push("/cart"),
                },
            });
        }, 600);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">{product.brand}</h2>
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">{product.name}</h1>
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews} reviews)</span>
                    </div>
                    {product.inStock ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">In Stock</Badge>
                    ) : (
                        <Badge variant="destructive">Out of Stock</Badge>
                    )}
                </div>
                <div className="flex items-baseline gap-3">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={selectedVariant?.price}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-3xl font-bold"
                        >
                            Rs. {(selectedVariant?.price || 0).toLocaleString()}
                        </motion.span>
                    </AnimatePresence>
                    {selectedVariant?.compare_at_price && selectedVariant.compare_at_price > selectedVariant.price && (
                        <span className="text-lg text-muted-foreground line-through">
                            Rs. {selectedVariant.compare_at_price.toLocaleString()}
                        </span>
                    )}
                </div>
            </div>

            <Separator />

            <p className="text-muted-foreground leading-relaxed">
                {product.description}
            </p>

            {Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-base">Size</Label>
                    <RadioGroup
                        defaultValue={selectedVariant?.size}
                        onValueChange={(val) => {
                            const variant = product.variants.find((v) => v.size === val);
                            if (variant) setSelectedVariant(variant);
                        }}
                        className="flex flex-wrap gap-3"
                    >
                        {product.variants.map((variant) => (
                            <div key={variant.size}>
                                <RadioGroupItem value={variant.size} id={variant.size} className="peer sr-only" />
                                <Label
                                    htmlFor={variant.size}
                                    className="flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer hover:bg-muted peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary transition-all"
                                >
                                    {variant.size}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className="w-24">
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="text-center"
                    />
                </div>
                <motion.div className="flex-1" whileTap={{ scale: 0.95 }}>
                    <Button
                        size="lg"
                        className="w-full relative overflow-hidden"
                        onClick={handleAddToCart}
                        disabled={isAdding || !product.inStock}
                    >
                        {isAdding ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-primary"
                            >
                                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                        ) : (
                            <span className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Add to Cart
                            </span>
                        )}
                    </Button>
                </motion.div>
                <WishlistButton
                    productId={product._id}
                    variant="outline"
                    size="icon"
                    className="h-11 w-11"
                />
                <Button variant="outline" size="icon" className="h-11 w-11">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>

            <Button
                className="w-full"
                variant="secondary"
                size="lg"
                disabled={!product.inStock}
                onClick={() => {
                    handleAddToCart();
                    // TODO: In a real app, this might redirect to checkout immediately
                    // For now, it adds to cart which opens the drawer (if we trigger it)
                    // or we can redirect to /checkout
                }}
            >
                Buy Now
            </Button>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Authentic</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4" />
                    <span>Gift Wrapping</span>
                </div>
            </div>
        </div>
    );
}
