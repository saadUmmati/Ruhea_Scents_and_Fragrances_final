"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export function OrderSummary() {
    const [isMounted, setIsMounted] = useState(false);
    const items = useCartStore((state) => state.items);
    const getCartTotal = useCartStore((state) => state.getCartTotal);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="animate-pulse h-64 bg-muted rounded-md" />;
    }

    const subtotal = getCartTotal();
    const shipping: number = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <div className="bg-muted/50 rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-background">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                {item.quantity}
                            </span>
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                            <h3 className="font-medium text-sm">{item.name}</h3>
                            <p className="text-xs text-muted-foreground">{item.size}</p>
                        </div>
                        <div className="flex flex-col justify-center items-end">
                            <p className="font-medium text-sm">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <Separator />

            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
            </div>
        </div>
    );
}
