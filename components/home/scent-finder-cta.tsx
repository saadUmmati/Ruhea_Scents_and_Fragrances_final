import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ScentFinderCTA() {
    return (
        <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pattern-dots" /> {/* Add a pattern if available or just use opacity */}
            <div className="container relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
                    Not sure which scent is for you?
                </h2>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
                    Take our interactive Scent Finder Quiz to discover your perfect fragrance match based on your personality and preferences.
                </p>
                <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                    <Link href="/quiz">Find My Scent</Link>
                </Button>
            </div>
        </section>
    );
}
