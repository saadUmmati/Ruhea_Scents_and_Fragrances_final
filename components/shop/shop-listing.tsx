"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortOptions } from "@/components/shop/sort-options";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Loader2 } from "lucide-react";
import { SearchWithSuggestions } from "@/components/shop/search-with-suggestions";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Product {
    _id: string;
    name: string;
    slug: string;
    brand: string;
    price: number;
    originalPrice?: number;
    rating_average: number;
    rating_count: number;
    featured_image: string;
    images: string[];
    inStock: boolean;
    variants: Array<{ size: string; price: number; stock: number; sku: string }>;
}

interface PaginationData {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface ShopListingProps {
    products: Product[];
    pagination: PaginationData;
}

export function ShopListing({ products, pagination }: ShopListingProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        router.push(`/shop?${params.toString()}`);
    };

    const renderPaginationItems = () => {
        const items = [];
        const { page, totalPages } = pagination;

        // Always show first page
        items.push(
            <PaginationItem key={1}>
                <PaginationLink
                    href="#"
                    isActive={page === 1}
                    onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                    }}
                >
                    1
                </PaginationLink>
            </PaginationItem>
        );

        // Show ellipsis if needed
        if (page > 3) {
            items.push(
                <PaginationItem key="ellipsis-1">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Show pages around current page
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={page === i}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(i);
                        }}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Show ellipsis if needed
        if (page < totalPages - 2) {
            items.push(
                <PaginationItem key="ellipsis-2">
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }

        // Always show last page if more than 1 page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        isActive={page === totalPages}
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 shrink-0">
                <FilterSidebar />
            </aside>

            {/* Mobile Filter & Content */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-primary sm:text-3xl">Shop All Fragrances</h2>
                        <p className="text-muted-foreground mt-2">
                            {`Showing ${products.length} of ${pagination.total} products`}
                        </p>
                    </div>
                    <div className="w-full sm:w-auto">
                        <SearchWithSuggestions />
                    </div>
                </div>

                <div className="flex items-center justify-between md:hidden mb-4">
                    {/* Mobile Filter Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="default" className="w-full">
                                <Filter className="mr-2 h-4 w-4" />
                                Filters & Sort
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <FilterSidebar />
                        </SheetContent>
                    </Sheet>
                </div>

                <SortOptions viewMode={viewMode} setViewMode={setViewMode} />

                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No products found</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your filters or search query
                        </p>
                    </div>
                ) : (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                                : "flex flex-col gap-4"
                        }
                    >
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={{
                                    id: product._id,
                                    name: product.name,
                                    brand: product.brand,
                                    price: product.price,
                                    originalPrice: product.originalPrice,
                                    rating: product.rating_average,
                                    reviews: product.rating_count,
                                    image: product.featured_image,
                                    isNew: false,
                                    isSale: !!product.originalPrice,
                                    notes: [],
                                }}
                                viewMode={viewMode}
                                priority={index < 4}
                            />
                        ))}
                    </div>
                )}

                {pagination.totalPages > 1 && (
                    <div className="mt-12">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (pagination.page > 1) {
                                                handlePageChange(pagination.page - 1);
                                            }
                                        }}
                                        aria-disabled={pagination.page === 1}
                                        className={
                                            pagination.page === 1
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (pagination.page < pagination.totalPages) {
                                                handlePageChange(pagination.page + 1);
                                            }
                                        }}
                                        aria-disabled={pagination.page === pagination.totalPages}
                                        className={
                                            pagination.page === pagination.totalPages
                                                ? "pointer-events-none opacity-50"
                                                : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
