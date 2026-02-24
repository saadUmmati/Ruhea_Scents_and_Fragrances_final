"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Magnetic from "@/components/ui/magnetic";

import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="bg-secondary/10 pt-16 pb-8">
            <div className="container">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Brand & About */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="relative h-12 w-48">
                                <img
                                    src="/ruhea-logo.png"
                                    alt="RUHEA Scents & Fragrance"
                                    className="h-full w-full object-contain dark:brightness-0 dark:invert"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-sm">
                            Exquisite fragrances and traditional attars tailored for the modern
                            connoisseur. Experience the essence of luxury.
                        </p>
                        <div className="flex space-x-4">
                            <Magnetic>
                                <Link
                                    href="https://facebook.com"
                                    className="text-muted-foreground hover:text-primary block p-2"
                                >
                                    <Facebook className="h-5 w-5" />
                                    <span className="sr-only">Facebook</span>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link
                                    href="https://www.instagram.com/ruhea_21?utm_source=qr&igsh=MXJpZXd6amphdTVxbQ=="
                                    className="text-muted-foreground hover:text-primary block p-2"
                                >
                                    <Instagram className="h-5 w-5" />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link
                                    href="https://twitter.com"
                                    className="text-muted-foreground hover:text-primary block p-2"
                                >
                                    {/* X Icon (formerly Twitter) */}
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 fill-current"
                                    >
                                        <title>X</title>
                                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                    </svg>
                                    <span className="sr-only">X</span>
                                </Link>
                            </Magnetic>
                            <Magnetic>
                                <Link
                                    href="https://tiktok.com"
                                    className="text-muted-foreground hover:text-primary block p-2"
                                >
                                    {/* TikTok Icon */}
                                    <svg
                                        role="img"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 fill-current"
                                    >
                                        <title>TikTok</title>
                                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.65-1.55-1.09-.33-.33-.66-.67-1-1.02v12.05c-.01.85-.2 1.73-.59 2.5a5.59 5.59 0 0 1-5.18 3.51c-2.73.16-5.13-1.61-5.91-4.24a5.55 5.55 0 0 1 2.05-6.23c1.78-1.29 4.29-1.07 5.86.52.09.09.18.19.26.29V4.92c-1.15-.32-2.36-.5-3.56-.47-3.83.07-6.91 3.2-6.9 7.03.01 3.83 3.12 6.94 6.95 6.9 3.25-.03 6.03-2.3 6.64-5.46.33-1.69.05-3.46-.77-4.94L12.525.02z" />
                                    </svg>
                                    <span className="sr-only">TikTok</span>
                                </Link>
                            </Magnetic>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 md:pl-8">
                        <h3 className="font-serif text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/shop"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Shop All
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Journal
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-lg font-semibold">Customer Care</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/faq"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/shipping"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Shipping & Returns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-muted-foreground hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} RUHEA Scents & Fragrances. All
                        rights reserved.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
                        <a
                            href="https://share.google/IW9U4ytwCYDxpem59"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-3 hover:text-accent transition-colors cursor-pointer"
                        >
                            <MapPin className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                            <span>New City Phase 2, Commercial Avenue M40, Motorway Wah Cantt</span>
                        </a>
                        <a
                            href="https://wa.me/+923101038060"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-accent transition-colors"
                        >
                            <Phone className="h-4 w-4" />
                            <span>+92 310 1038060</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
