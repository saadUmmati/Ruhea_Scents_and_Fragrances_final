import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";

const posts = [
    {
        id: 1,
        image: "/images/carousel/natural-bottles.png",
        link: "https://www.instagram.com/ruhea_21?utm_source=qr&igsh=MXJpZXd6amphdTVxbQ==",
    },
    {
        id: 2,
        image: "/images/carousel/spices-ingredients.png",
        link: "https://instagram.com",
    },
    {
        id: 3,
        image: "/images/carousel/luxury-purple.png",
        link: "https://instagram.com",
    },
    {
        id: 4,
        image: "/images/carousel/fresh-citrus.png",
        link: "https://instagram.com",
    },
    {
        id: 5,
        image: "/images/carousel/floral-romance.png",
        link: "https://instagram.com",
    },
    {
        id: 6,
        image: "/images/traditional-attar.jpg",
        link: "https://instagram.com",
    },
];

export function InstagramFeed() {
    return (
        <section className="py-16">
            <div className="container">
                <div className="flex flex-col items-center justify-center mb-12 text-center">
                    <Instagram className="h-8 w-8 mb-4" />
                    <h2 className="text-3xl font-serif font-bold mb-2">@RuheaFragrances</h2>
                    <p className="text-muted-foreground mb-6">Follow us on Instagram for daily inspiration</p>
                    <Button asChild variant="outline">
                        <Link href="https://www.instagram.com/ruhea_21?utm_source=qr&igsh=MXJpZXd6amphdTVxbQ==" target="_blank">Follow Us</Link>
                    </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {posts.map((post) => (
                        <Link key={post.id} href={post.link} target="_blank" className="relative aspect-square group overflow-hidden rounded-md">
                            <Image
                                src={post.image}
                                alt="Instagram post"
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
