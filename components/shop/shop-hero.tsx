
"use client";

import { motion } from "framer-motion";

export function ShopHero() {
    return (
        <section className="relative overflow-hidden bg-primary py-20 lg:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent opacity-20 blur-[100px]"></div>
            </div>

            <div className="container relative z-10 text-center text-primary-foreground">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="mb-4 inline-block font-sans text-sm font-medium tracking-[0.2em] text-accent">
                        THE COLLECTION
                    </span>
                    <h1 className="mb-6 font-serif text-3xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Discover Your <span className="text-accent italic">Signature</span> Scent
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-primary-foreground/80 font-light leading-relaxed">
                        Explore our curated selection of luxury fragrances, crafted with the finest ingredients to leave a lasting impression.
                    </p>
                </motion.div>
            </div>

            {/* Decorative bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        </section>
    );
}
