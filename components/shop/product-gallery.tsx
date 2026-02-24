"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
    images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
    // Use placeholder if no images or empty array
    const displayImages = images && images.length > 0 && images[0]
        ? images
        : ["/images/product-placeholder.png"];

    const [selectedImage, setSelectedImage] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    const scrollTo = useCallback((index: number) => {
        if (emblaApi) emblaApi.scrollTo(index);
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedImage(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    useEffect(() => {
        if (emblaApi && emblaApi.selectedScrollSnap() !== selectedImage) {
            emblaApi.scrollTo(selectedImage);
        }
    }, [selectedImage, emblaApi]);

    const nextImage = () => {
        if (emblaApi) emblaApi.scrollNext();
        else setSelectedImage((prev) => (prev + 1) % displayImages.length);
    };

    const prevImage = () => {
        if (emblaApi) emblaApi.scrollPrev();
        else setSelectedImage((prev) => (prev - 1 + displayImages.length) % displayImages.length);
    };

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] scrollbar-hide">
                {displayImages.map((image, index) => (
                    <button
                        key={index}
                        className={cn(
                            "relative w-20 h-20 md:w-24 md:h-24 shrink-0 border-2 rounded-md overflow-hidden transition-all",
                            selectedImage === index ? "border-primary" : "border-transparent hover:border-muted-foreground/50"
                        )}
                        onClick={() => scrollTo(index)}
                    >
                        <Image
                            src={image}
                            alt={`Product thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image Area */}
            <div className="relative flex-1 aspect-square md:aspect-[4/5] bg-muted rounded-lg overflow-hidden group">
                {/* Desktop View (Fade) */}
                <div className="hidden md:block w-full h-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={displayImages[selectedImage]}
                                alt="Product main image"
                                fill
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Zoom Trigger */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-background">
                                <ZoomIn className="h-5 w-5" />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden bg-transparent border-none shadow-none">
                            <div className="relative w-full h-full">
                                <Image
                                    src={displayImages[selectedImage]}
                                    alt="Product zoom"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Mobile View (Carousel) */}
                <div className="md:hidden w-full h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {displayImages.map((image, index) => (
                            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full">
                                <Image
                                    src={image}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Arrows (Mobile/Tablet) */}
                <div className="absolute inset-0 flex items-center justify-between p-4 md:hidden pointer-events-none">
                    <button
                        onClick={prevImage}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm pointer-events-auto"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={nextImage}
                        className="p-2 bg-background/80 backdrop-blur-sm rounded-full shadow-sm pointer-events-auto"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* Mobile Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
                    {displayImages.map((_, index) => (
                        <div
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                selectedImage === index ? "bg-primary" : "bg-primary/30"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
