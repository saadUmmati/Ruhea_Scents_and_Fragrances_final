"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store/cart-store";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Search,
    ShoppingCart,
    Heart,
    User,
    Menu,
    LogOut,
    Settings,
    Package,
    Sun,
    Moon,
} from "lucide-react";
import Magnetic from "@/components/ui/magnetic";

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isVisible, setIsVisible] = React.useState(true);
    const [lastScrollY, setLastScrollY] = React.useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const { data: session } = useSession();
    const { items: cartItems } = useCartStore();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled (for background transparency)
            setIsScrolled(currentScrollY > 20);

            // Smart Navbar Logic (Hide on down, Show on up)
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false); // Scroll Down > Hide
            } else {
                setIsVisible(true);  // Scroll Up/Top > Show
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    React.useEffect(() => {
        setMounted(true);
    }, []);


    const pathname = usePathname();

    if (pathname?.startsWith("/admin")) {
        return null;
    }

    // Unified Visibility Logic
    // 1. Solid Mode: Active on any Scroll OR any page that isn't Home.
    // 2. Transparent Mode: Active ONLY at the top of the Home Page.
    const isHomePage = pathname === "/";
    const forceSolid = !isHomePage || isScrolled;

    const navClasses = forceSolid
        ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
        : "bg-transparent";

    // Text Color Logic:
    // Solid Mode -> Text-Foreground (Black in Light, White in Dark)
    // Transparent Mode -> Text-White (Always White for Dark Hero)
    const itemClass = forceSolid
        ? "text-foreground hover:text-accent"
        : "text-white hover:text-white/80 drop-shadow-md";

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/shop", label: "Shop" },
        { href: "/quiz", label: "Scent Quiz" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300 transform",
                isVisible ? "translate-y-0" : "-translate-y-full",
                navClasses
            )}
        >
            <div className="container">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className={cn("flex items-center space-x-2 group", itemClass)}>
                        {/* Fallback to Text Logo if Image is missing, but styled elegantly */}
                        <span className="font-serif text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase">
                            RUHÉA
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Magnetic key={link.href}>
                                <Link
                                    href={link.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors relative group block p-2",
                                        itemClass
                                    )}
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-2 w-0 h-0.5 bg-accent transition-all group-hover:w-[calc(100%-16px)]" />
                                </Link>
                            </Magnetic>
                        ))}
                    </nav>

                    {/* Right Section */}
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Search Icon */}
                        <Magnetic>
                            <Button variant="ghost" size="icon" className={cn("hidden sm:flex", itemClass)}>
                                <Search className="h-5 w-5" />
                                <span className="sr-only">Search</span>
                            </Button>
                        </Magnetic>

                        {/* Wishlist */}
                        <Magnetic>
                            <Link href="/wishlist">
                                <Button variant="ghost" size="icon" className={cn("relative", itemClass)}>
                                    <Heart className="h-5 w-5" />
                                    <span className="sr-only">Wishlist</span>
                                </Button>
                            </Link>
                        </Magnetic>

                        {/* Cart */}
                        <Magnetic>
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className={cn("relative", itemClass)}>
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                                            {cartItems.length}
                                        </span>
                                    )}
                                    <span className="sr-only">Cart</span>
                                </Button>
                            </Link>
                        </Magnetic>

                        {/* Theme Toggle */}
                        {mounted && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="inline-block">
                                        <Magnetic>
                                            <Button variant="ghost" size="icon" className={itemClass}>
                                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                                <span className="sr-only">Toggle theme</span>
                                            </Button>
                                        </Magnetic>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        <Sun className="mr-2 h-4 w-4" />
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        <Moon className="mr-2 h-4 w-4" />
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        <Settings className="mr-2 h-4 w-4" />
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Auth Buttons / User Menu */}
                        {session ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <div className="inline-block">
                                        <Magnetic>
                                            <Button variant="ghost" size="icon" className={cn("relative", itemClass)}>
                                                <User className="h-5 w-5" />
                                                <span className="sr-only">User menu</span>
                                            </Button>
                                        </Magnetic>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {session.user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {session.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/dashboard" className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/orders" className="cursor-pointer">
                                            <Package className="mr-2 h-4 w-4" />
                                            Orders
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/account/settings" className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => signOut()}
                                        className="cursor-pointer text-destructive"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="hidden sm:flex items-center space-x-2">
                                <Magnetic>
                                    <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </Magnetic>
                                <Magnetic>
                                    <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                                        <Link href="/register">Sign Up</Link>
                                    </Button>
                                </Magnetic>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild className="lg:hidden">
                                <Button variant="ghost" size="icon" className={itemClass}>
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[400px] overflow-y-auto bg-background/95 backdrop-blur-xl border-l border-border transition-colors duration-300">
                                <div className="flex flex-col h-full text-foreground">
                                    <div className="flex items-center justify-center py-6 border-b border-border">
                                        <span className="text-2xl font-playfair font-bold">Menu</span>
                                    </div>
                                    <nav className="flex flex-col space-y-4 mt-8 items-center text-center">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-2xl font-bold px-4 py-2 hover:text-accent transition-colors w-full block"
                                            >
                                                {link.label}
                                            </Link>
                                        ))}

                                        {!session && (
                                            <>
                                                <div className="pt-4 border-t">
                                                    <Button asChild className="w-full mb-2" variant="outline">
                                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                            Login
                                                        </Link>
                                                    </Button>
                                                    <Button asChild className="w-full bg-accent text-accent-foreground">
                                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                                            Sign Up
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
