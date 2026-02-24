"use client";

import * as React from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType, useCartStore } from "@/lib/store/cart-store";
import { cn } from "@/lib/utils";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const [imgSrc, setImgSrc] = React.useState(item.image || "/images/product-placeholder.png");

    return (
        <div className="flex gap-4 py-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                <Image
                    src={imgSrc}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={() => setImgSrc("/images/product-placeholder.png")}
                />
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div className="grid gap-1">
                    <div className="flex justify-between">
                        <h3 className="font-medium leading-none">{item.name}</h3>
                        <p className="font-medium text-muted-foreground">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.size}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => {
                                if (item.quantity > 1) {
                                    updateQuantity(item.id, item.quantity - 1);
                                } else {
                                    removeItem(item.id);
                                }
                            }}
                        >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Decrease quantity</span>
                        </Button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Increase quantity</span>
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
