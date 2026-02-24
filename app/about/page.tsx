import Image from "next/image";
import { Award, Leaf, Droplets } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="bg-background">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <Image
                    src="/about_brand_story_black_gold_pink_fish_1768054260787.png" // Local generated asset
                    alt="RUHEA Luxury Perfume - Black & Gold Aesthetic"
                    fill
                    className="object-cover brightness-[0.6]"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 animate-fade-in">
                    <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                        RUHEA
                    </h1>
                    <p className="text-xl md:text-3xl font-light tracking-widest uppercase">
                        The Essence of Luxury
                    </p>
                </div>
            </div>

            <div className="container py-24 px-4 md:px-6">
                <div className="max-w-6xl mx-auto space-y-32">
                    {/* Story Section */}
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                                A Legacy of <span className="text-accent italic">Scent</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                Born from a deep appreciation for traditional perfumery, RUHEA merges ancient
                                artistry with modern sophistication. Our journey began with a single quest:
                                to find the perfect balance between the raw power of nature and the refined
                                elegance of luxury.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                Every drop of our attar is a story—a memory of rain-soaked earth,
                                blooming night gardens, and the warmth of amber.
                            </p>
                        </div>
                        <div className="relative h-[600px] w-full rounded-sm overflow-hidden shadow-2xl group">
                            <Image
                                src="/about_craftsmanship_black_gold_pink_fish_1768054299476.png" // Local generated asset
                                alt="Raw Ingredients & Craftsmanship"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                    </div>

                    {/* Values Section (New) */}
                    <div className="grid md:grid-cols-3 gap-12 text-center py-12 border-y border-border/50">
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Award className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="font-serif text-xl font-bold">Master Craftsmanship</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                Hand-blended by expert perfumers using age-old techniques preserved through generations.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Leaf className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="font-serif text-xl font-bold">Pure Ingredients</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                Sourced responsibly from the finest harvests—sustainable oud, rare florals, and natural resins.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="mx-auto w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                <Droplets className="h-8 w-8 text-accent" />
                            </div>
                            <h3 className="font-serif text-xl font-bold">High Concentration</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                Our Extrait de Parfum and Attars offer exceptional longevity and sillage for a lasting impression.
                            </p>
                        </div>
                    </div>

                    {/* Philosophy Section */}
                    <div className="grid md:grid-cols-2 gap-16 items-center md:flex-row-reverse">
                        <div className="relative h-[600px] w-full rounded-sm overflow-hidden shadow-2xl md:order-1 group">
                            <Image
                                src="/about_philosophy_black_gold_pink_fish_1768054346910.png" // Local generated asset
                                alt="Abstract Luxury Philosophy"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                        <div className="space-y-8 md:order-2">
                            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
                                Pure <span className="text-accent italic">Philosophy</span>
                            </h2>
                            <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                We believe true luxury lies in authenticity. That's why we refuse to compromise
                                on the quality of our ingredients. No synthetics where nature creates perfection.
                            </p>
                            <p className="text-muted-foreground text-lg leading-relaxed font-light">
                                From the dewy rose fields of Isparta to the deep agarwood forests of Assam,
                                RUHEA captures the world in a bottle.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visit Us Section */}
                <div className="mt-32 pt-16 relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 bg-secondary/5 rounded-2xl overflow-hidden shadow-lg border border-border/50">
                            <div className="relative h-64 md:h-auto min-h-[300px]">
                                <Image
                                    src="https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=2000&auto=format&fit=crop"
                                    alt="Luxury Boutique Interior Abstract"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <h3 className="font-serif text-3xl font-bold text-white tracking-widest uppercase border-2 border-white/50 px-8 py-4">
                                        Flagship Store
                                    </h3>
                                </div>
                            </div>
                            <div className="p-8 md:p-12 space-y-8 flex flex-col justify-center">
                                <div className="space-y-2">
                                    <h3 className="font-serif text-2xl font-bold">Visit Us</h3>
                                    <p className="text-muted-foreground">
                                        Experience the fragrances in our immersive boutique.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Address</p>
                                        <p className="text-muted-foreground font-light">
                                            New City Phase 2, Commercial Avenue M40,<br />
                                            Motorway Wah Cantt
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Hours</p>
                                        <div className="text-muted-foreground font-light">
                                            <p>Monday - Sunday</p>
                                            <p>10:00 AM - 10:00 PM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
