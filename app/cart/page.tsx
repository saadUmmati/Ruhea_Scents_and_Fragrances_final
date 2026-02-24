"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
    const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="min-h-[60vh] flex items-center justify-center"><p>Loading cart...</p></div>;
    }

    if (items.length === 0) {
        return (
            <div className="container min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
                <div className="rounded-full bg-secondary/20 p-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-serif font-bold">Your cart is empty</h1>
                <p className="text-muted-foreground max-w-sm">
                    Looks like you haven't added any fragrances to your cart yet.
                </p>
                <Button asChild size="lg" className="mt-4">
                    <Link href="/shop">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h1>
            <div className="grid lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 border rounded-lg bg-card"
                            >
                                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-secondary/20">
                                    <Image
                                        src={item.image || "/ruhea-logo.png"}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {item.size || "Standard"}
                                            </p>
                                        </div>
                                        <p className="font-medium">
                                            {formatCurrency(item.price * item.quantity)}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                                }
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive/90"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="lg:col-span-4">
                    <div className="rounded-lg border bg-card p-6 sticky top-24">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatCurrency(getCartTotal())}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-muted-foreground">Calculated at checkout</span>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between font-medium mb-6">
                            <span>Total</span>
                            <span>{formatCurrency(getCartTotal())}</span>
                        </div>
                        <Button asChild className="w-full" size="lg">
                            <Link href="/checkout">
                                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Taxes and shipping calculated at checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
