"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export function NewsletterSignup() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Thank you for subscribing!");
            setEmail("");
        }, 1000);
    };

    return (
        <section className="py-24 bg-primary text-primary-foreground">
            <div className="container">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl font-serif font-bold mb-4">Join Our Community</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Subscribe to our newsletter to receive updates on new arrivals, special offers, and exclusive events.
                    </p>
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-primary-foreground text-primary border-none h-12"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="secondary"
                            size="lg"
                            className="h-12 px-8"
                            disabled={isLoading}
                        >
                            {isLoading ? "Subscribing..." : "Subscribe"}
                        </Button>
                    </form>
                    <p className="text-xs mt-4 opacity-70">
                        By subscribing, you agree to our Privacy Policy and Terms of Service.
                    </p>
                </div>
            </div>
        </section>
    );
}
