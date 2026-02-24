import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
    {
        id: 1,
        name: "Men's Fragrances",
        image: "/images/categories/mens-fragrances.png",
        link: "/shop/men",
    },
    {
        id: 2,
        name: "Floral Fragrances",
        image: "/images/categories/floral-fragrances.png",
        link: "/shop/women",
    },
    {
        id: 3,
        name: "Unisex Scents",
        image: "/images/categories/unisex-scents.png",
        link: "/shop/unisex",
    },
    {
        id: 4,
        name: "Traditional Attars",
        image: "/images/categories/traditional-attars.png",
        link: "/shop/attars",
    },
    {
        id: 5,
        name: "Gift Sets",
        image: "/images/categories/gift-sets.png",
        link: "/shop/gifts",
    },
    {
        id: 6,
        name: "New Arrivals",
        image: "/images/categories/new-arrivals.png",
        link: "/shop/new-arrivals",
    },
];

export function FeaturedCategories() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categories.map((category) => (
                        <Link key={category.id} href={category.link} className="group">
                            <Card className="overflow-hidden border-none shadow-md transition-transform duration-300 group-hover:-translate-y-1">
                                <CardContent className="p-0 relative aspect-[16/9] sm:aspect-[4/3]">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h3 className="text-2xl font-bold text-white tracking-wide border-b-2 border-transparent group-hover:border-white transition-all pb-1">
                                            {category.name}
                                        </h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
