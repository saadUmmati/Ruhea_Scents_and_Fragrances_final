"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SearchSuggestion {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
    brand: string;
}

export function SearchWithSuggestions() {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Debounced search
    React.useEffect(() => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSuggestions(data.suggestions || []);
            } catch (error) {
                console.error("Search error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false);
        setQuery("");
        setSuggestions([]);
        command();
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            runCommand(() => router.push(`/shop?search=${encodeURIComponent(query)}`));
        }
    };

    return (
        <>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Button
                    variant="outline"
                    className="w-full justify-start pl-8 text-sm text-muted-foreground font-normal"
                    onClick={() => setOpen(true)}
                >
                    Search products...
                    <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </Button>
            </div>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search for fragrances..."
                    value={query}
                    onValueChange={setQuery}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <CommandList>
                    {isLoading ? (
                        <div className="py-6 text-center text-sm">Searching...</div>
                    ) : query.length < 2 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            Type at least 2 characters to search
                        </div>
                    ) : suggestions.length === 0 ? (
                        <CommandEmpty>
                            No products found.
                            <Button
                                variant="link"
                                className="mt-2"
                                onClick={handleSearch}
                            >
                                Search for "{query}" in shop
                            </Button>
                        </CommandEmpty>
                    ) : (
                        <CommandGroup heading="Products">
                            {suggestions.map((product) => (
                                <CommandItem
                                    key={product.id}
                                    onSelect={() => {
                                        runCommand(() => router.push(`/shop/product/${product.slug}`));
                                    }}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{product.brand}</p>
                                    </div>
                                    <div className="text-sm font-medium">
                                        Rs. {product.price.toLocaleString()}
                                    </div>
                                </CommandItem>
                            ))}
                            {suggestions.length > 0 && (
                                <CommandItem
                                    onSelect={handleSearch}
                                    className="justify-center text-primary"
                                >
                                    View all results for "{query}"
                                </CommandItem>
                            )}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}
