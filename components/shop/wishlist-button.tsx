"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
    productId: string;
    className?: string;
    variant?: "default" | "outline" | "ghost" | "secondary";
    size?: "default" | "sm" | "lg" | "icon";
}

export function WishlistButton({
    productId,
    className,
    variant = "ghost",
    size = "icon"
}: WishlistButtonProps) {
    const { data: session } = useSession();
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch initial state
    useEffect(() => {
        if (session?.user) {
            checkWishlistStatus();
        }
    }, [session, productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch("/api/wishlist");
            const data = await response.json();
            if (data.wishlist) {
                const exists = data.wishlist.some(
                    (item: any) => item.product._id === productId || item.product === productId
                );
                setIsInWishlist(exists);
            }
        } catch (error) {
            console.error("Failed to check wishlist status", error);
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            toast.error("Please login to add items to your wishlist");
            return;
        }

        setIsLoading(true);
        // Optimistic update
        const previousState = isInWishlist;
        setIsInWishlist(!previousState);

        try {
            const method = previousState ? "DELETE" : "POST";
            const response = await fetch("/api/wishlist", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update wishlist");
            }

            toast.success(
                previousState
                    ? "Removed from wishlist"
                    : "Added to wishlist"
            );
        } catch (error) {
            // Revert on error
            setIsInWishlist(previousState);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={cn("rounded-full", className)}
            onClick={toggleWishlist}
            disabled={isLoading}
        >
            <Heart
                className={cn(
                    "h-5 w-5 transition-colors",
                    isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground"
                )}
            />
            <span className="sr-only">
                {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            </span>
        </Button>
    );
}
