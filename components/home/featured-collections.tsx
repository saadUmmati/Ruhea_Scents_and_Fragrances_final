import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const collections = [
    {
        id: 1,
        title: "The Royal Oud Collection",
        description: "Experience the majesty of pure Oud, sourced from the finest agarwood.",
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2053&auto=format&fit=crop",
        link: "/shop/collection/royal-oud",
        size: "large", // Takes up 2 columns on large screens
    },
    {
        id: 2,
        title: "Floral Symphony",
        description: "A delicate blend of nature's finest blooms.",
        image: "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?q=80&w=2070&auto=format&fit=crop",
        link: "/shop/collection/floral",
        size: "small",
    },
    {
        id: 3,
        title: "Musk & Amber",
        description: "Warm, sensual, and enduring.",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=2074&auto=format&fit=crop",
        link: "/shop/collection/musk-amber",
        size: "small",
    },
];

export function FeaturedCollections() {
    return (
        <section className="py-16">
            <div className="container">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Featured Collections</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-auto lg:h-[600px]">
                    {collections.map((collection) => (
                        <div
                            key={collection.id}
                            className={`relative group overflow-hidden rounded-lg ${collection.size === "large" ? "lg:row-span-2" : ""
                                }`}
                        >
                            <Image
                                src={collection.image}
                                alt={collection.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
                                <h3 className="text-3xl font-serif font-bold mb-4">{collection.title}</h3>
                                <p className="text-lg mb-8 max-w-md text-white/90">{collection.description}</p>
                                <Button asChild variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                                    <Link href={collection.link}>Explore Collection</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
