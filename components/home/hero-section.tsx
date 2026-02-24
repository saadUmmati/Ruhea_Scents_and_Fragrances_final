"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import Magnetic from "@/components/ui/magnetic";

const slides = [
    {
        id: 1,
        title: "Natural Essence",
        subtitle: "Discover our botanical fragrance collection",
        image: "/images/carousel/natural-bottles.png",
        cta: "Shop Collection",
        link: "/shop",
    },
    {
        id: 2,
        title: "Oriental Spices",
        subtitle: "Timeless scents crafted with exotic ingredients",
        image: "/images/carousel/spices-ingredients.png",
        cta: "Explore Fragrances",
        link: "/shop",
    },
    {
        id: 3,
        title: "Luxury Night",
        subtitle: "Captivating evening fragrances",
        image: "/images/carousel/luxury-purple.png",
        cta: "Shop Now",
        link: "/shop",
    },
    {
        id: 4,
        title: "Fresh Citrus",
        subtitle: "Refreshing scents for every day",
        image: "/images/carousel/fresh-citrus.png",
        cta: "Discover More",
        link: "/shop",
    },
    {
        id: 5,
        title: "Floral Romance",
        subtitle: "Elegant rose and floral compositions",
        image: "/images/carousel/floral-romance.png",
        cta: "View Collection",
        link: "/shop",
    },
];

export function HeroSection() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    const carouselOptions = {
        loop: true,
    };

    return (
        <section className="relative w-full overflow-hidden">
            <Carousel
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    loop: true,
                }}
            >
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative h-[600px] w-full overflow-hidden">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover brightness-75"
                                    sizes="100vw"
                                    priority={slide.id === 1}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="mb-4 font-serif text-3xl font-bold tracking-tight sm:text-5xl md:text-7xl"
                                    >
                                        {slide.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                        className="mb-6 max-w-sm text-sm sm:max-w-lg sm:text-xl md:text-2xl"
                                    >
                                        {slide.subtitle}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                    >
                                        <Magnetic>
                                            <Button
                                                asChild
                                                size="default"
                                                className="bg-white text-black hover:bg-white/90 sm:h-11 sm:px-8"
                                            >
                                                <Link href={slide.link}>{slide.cta}</Link>
                                            </Button>
                                        </Magnetic>
                                    </motion.div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 hidden md:flex" />
                <CarouselNext className="right-4 hidden md:flex" />
            </Carousel>
        </section>
    );
}
