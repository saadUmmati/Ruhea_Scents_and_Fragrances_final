import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BrandStory() {
    return (
        <section className="py-24 bg-background">
            <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[600px] w-full rounded-lg overflow-hidden shadow-xl">
                        <Image
                            src="/images/brand-story.png"
                            alt="Master perfumer crafting traditional fragrances"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-4xl font-serif font-bold">The Art of Scent</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            At RUHEA, we believe that fragrance is more than just a scent—it&apos;s a journey through memory and emotion. Rooted in the rich heritage of Pakistani perfumery and infused with modern elegance, our creations are designed to tell your unique story.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Every bottle is a masterpiece, meticulously crafted using the finest ingredients from around the world. From the deep, resinous notes of Oud to the delicate whispers of Jasmine, we bring you the essence of luxury.
                        </p>
                        <div className="pt-4">
                            <Button asChild variant="outline" size="lg">
                                <Link href="/about">Read Our Story</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
