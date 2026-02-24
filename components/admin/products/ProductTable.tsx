"use client";

import Link from "next/link";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, AlertTriangle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface ProductVariant {
    size: string;
    stock: number;
    low_stock_threshold?: number;
    batch_code?: string;
}

interface Product {
    _id: string;
    name: string;
    sku: string;
    price: number;
    stock: number; // Placeholder for legacy or simple products
    variants?: ProductVariant[];
    status: string;
}

interface ProductTableProps {
    products: any[]; // Using any to be flexible with DB returns, but typed interface above for clarity
}

export function ProductTable({ products: initialProducts }: ProductTableProps) {
    const [products, setProducts] = useState(initialProducts);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (productId: string, productName: string) => {
        if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(productId);
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete product");
            }

            // Remove product from local state
            setProducts(products.filter(p => p._id !== productId));
            toast.success(`Product "${productName}" deleted successfully`);
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete product");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock / Inventory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-10">
                                No products found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        products.map((product) => {
                            // Calculate total stock and check for low stock across variants
                            let totalStock = product.stock || 0;
                            let isLowStock = false;
                            let variantDetails = "No variants";

                            if (product.variants && product.variants.length > 0) {
                                totalStock = product.variants.reduce((acc: number, curr: ProductVariant) => acc + (curr.stock || 0), 0);
                                isLowStock = product.variants.some((v: ProductVariant) => (v.stock || 0) <= (v.low_stock_threshold || 5));
                                variantDetails = product.variants.map((v: ProductVariant) => `${v.size}: ${v.stock} (Batch: ${v.batch_code || 'N/A'})`).join('\n');
                            } else {
                                // Fallback if no variants, although schema says variants are required.
                                // Assuming generic low stock threshold of 5
                                if (totalStock <= 5) isLowStock = true;
                            }

                            return (
                                <TableRow key={product._id}>
                                    <TableCell className="font-medium">{product.name}</TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                    <TableCell>{product.price ? `$${product.price.toFixed(2)}` : 'Var'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>{totalStock}</span>
                                            {isLowStock && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Low Stock Alert!</p>
                                                            <pre className="text-xs">{variantDetails}</pre>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === 'published' ? 'secondary' : 'outline'}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/products/${product._id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive"
                                            onClick={() => handleDelete(product._id, product.name)}
                                            disabled={deletingId === product._id}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
