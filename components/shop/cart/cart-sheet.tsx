"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store/cart-store";
import { CartItem } from "./cart-item";
import { useEffect, useState } from "react";
import Link from "next/link";

export function CartSheet() {
    const [isMounted, setIsMounted] = useState(false);
    const items = useCartStore((state) => state.items);
    const getCartTotal = useCartStore((state) => state.getCartTotal);
    const getItemCount = useCartStore((state) => state.getItemCount);

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Cart</span>
            </Button>
        );
    }

    const itemCount = getItemCount();
    const total = getCartTotal();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                    <span className="sr-only">Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle>Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                <Separator />
                {items.length > 0 ? (
                    <>
                        <div className="flex-1 overflow-y-auto pr-6">
                            {items.map((item) => (
                                <div key={item.id}>
                                    <CartItem item={item} />
                                    <Separator />
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4 pr-6 pt-4">
                            <div className="space-y-1.5 text-sm">
                                <div className="flex">
                                    <span className="flex-1">Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1">Total</span>
                                    <span className="font-medium">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>
                            <SheetFooter>
                                <Button className="w-full" asChild>
                                    <Link href="/checkout">Checkout</Link>
                                </Button>
                            </SheetFooter>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-2">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                        <span className="text-lg font-medium text-muted-foreground">
                            Your cart is empty
                        </span>
                        <Button variant="link" asChild className="text-sm text-primary">
                            <Link href="/shop">Start Shopping</Link>
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
