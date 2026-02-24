"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Timer } from "lucide-react";

const deals = [
    {
        id: 1,
        name: "Midnight Oud",
        brand: "RUHEA",
        originalPrice: 12000,
        salePrice: 8500,
        image: "/images/traditional-attar.jpg",
        discount: "30% OFF",
        endsIn: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
    {
        id: 2,
        name: "Rose & Amber",
        brand: "RUHEA",
        originalPrice: 9500,
        salePrice: 7000,
        image: "/images/carousel/floral-romance.png",
        discount: "25% OFF",
        endsIn: new Date(Date.now() + 12 * 60 * 60 * 1000),
    },
    {
        id: 3,
        name: "Sandalwood Musk",
        brand: "RUHEA",
        originalPrice: 15000,
        salePrice: 10500,
        image: "/images/carousel/spices-ingredients.png",
        discount: "30% OFF",
        endsIn: new Date(Date.now() + 48 * 60 * 60 * 1000),
    },
    {
        id: 4,
        name: "Jasmine Breeze",
        brand: "RUHEA",
        originalPrice: 8000,
        salePrice: 6000,
        image: "/images/carousel/luxury-purple.png",
        discount: "25% OFF",
        endsIn: new Date(Date.now() + 6 * 60 * 60 * 1000),
    },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = React.useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex items-center gap-1 text-sm font-medium text-destructive">
            <Timer className="h-4 w-4" />
            <span>
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
            </span>
        </div>
    );
}

export function TodaysDeals({ products = [] }: { products?: any[] }) {
    // If no products provided, return null or empty state
    if (!products || products.length === 0) return null;

    return (
        <section className="py-16 container">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-serif font-bold">Today&apos;s Deals</h2>
                <Link href="/shop" className="text-primary hover:underline underline-offset-4">
                    View All Deals
                </Link>
            </div>
            <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full"
            >
                <CarouselContent>
                    {products.map((product) => {
                        // Calculate discount if originalPrice exists
                        const originalPrice = product.originalPrice || product.price * 1.2; // Fallback simulation
                        const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

                        return (
                            <CarouselItem key={product._id} className="md:basis-1/2 lg:basis-1/4">
                                <div className="p-1">
                                    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={product.featured_image || product.images?.[0] || "/images/product-placeholder.png"}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
                                                {discount}% OFF
                                            </Badge>
                                        </div>
                                        <CardHeader className="p-4 pb-0">
                                            <p className="text-sm text-muted-foreground">{product.brand || "RUHEA"}</p>
                                            <CardTitle className="text-lg font-medium line-clamp-1">
                                                {product.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            <div className="flex items-baseline gap-2 mb-2">
                                                <span className="text-lg font-bold">
                                                    Rs. {product.price.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-muted-foreground line-through">
                                                    Rs. {Math.round(originalPrice).toLocaleString()}
                                                </span>
                                            </div>
                                            {/* Timer removed for specific product card simplicity or use fixed date */}
                                            <div className="flex items-center gap-1 text-sm font-medium text-destructive">
                                                <Timer className="h-4 w-4" />
                                                <span>Ends in 12:45:30</span>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0">
                                            <Link href={`/shop/product/${product._id}`} className="w-full">
                                                <Button className="w-full" variant="secondary">
                                                    View Product
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    );
}
