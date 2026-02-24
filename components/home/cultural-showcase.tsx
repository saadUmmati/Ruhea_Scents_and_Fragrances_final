import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const occasions = [
    {
        id: 1,
        title: "Jummah Essentials",
        description: "Pure, alcohol-free attars perfect for Friday prayers.",
        image: "/images/traditional-attar.jpg",
        link: "/shop/occasion/jummah",
    },
    {
        id: 2,
        title: "Wedding Season",
        description: "Long-lasting, luxurious scents for your special moments.",
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
        link: "/shop/occasion/wedding",
    },
    {
        id: 3,
        title: "Ramadan & Eid",
        description: "Spiritual scents to elevate your festive celebrations.",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=2074&auto=format&fit=crop",
        link: "/shop/occasion/eid",
    },
];

export function CulturalShowcase() {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">Curated for Your Moments</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {occasions.map((occasion) => (
                        <div key={occasion.id} className="group text-center">
                            <div className="relative aspect-[3/4] mb-6 overflow-hidden rounded-lg shadow-md">
                                <Image
                                    src={occasion.image}
                                    alt={occasion.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold mb-2">{occasion.title}</h3>
                            <p className="text-muted-foreground mb-4">{occasion.description}</p>
                            <Button asChild variant="link" className="text-primary underline-offset-4 group-hover:underline">
                                <Link href={occasion.link}>Shop Collection</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
