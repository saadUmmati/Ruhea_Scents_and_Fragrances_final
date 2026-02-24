"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ProductTabsProps {
    product: {
        description: string;
        notes?: {
            top: string[];
            heart: string[];
            base: string[];
        };
        ingredients?: string;
        usage?: string;
    };
}

export function ProductTabs({ product }: ProductTabsProps) {
    return (
        <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent overflow-x-auto">
                <TabsTrigger
                    value="details"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                    Details
                </TabsTrigger>
                {product.notes && (
                    <TabsTrigger
                        value="notes"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                    >
                        Fragrance Notes
                    </TabsTrigger>
                )}
                <TabsTrigger
                    value="shipping"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                    Shipping & Returns
                </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-6">
                <div className="prose max-w-none text-muted-foreground leading-relaxed">
                    <p>{product.description}</p>
                    {/* Placeholder for additional details if available in the future */}
                </div>
            </TabsContent>

            {product.notes && (
                <TabsContent value="notes" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-serif font-bold mb-2">Top Notes</h3>
                                <p className="text-muted-foreground">
                                    {product.notes.top?.join(", ") || "N/A"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-serif font-bold mb-2">Heart Notes</h3>
                                <p className="text-muted-foreground">
                                    {product.notes.heart?.join(", ") || "N/A"}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-serif font-bold mb-2">Base Notes</h3>
                                <p className="text-muted-foreground">
                                    {product.notes.base?.join(", ") || "N/A"}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            )}

            <TabsContent value="shipping" className="pt-6">
                <div className="space-y-4 text-muted-foreground">
                    <p>
                        <strong>Shipping:</strong> We offer free standard shipping on all orders over Rs. 5000.
                        Orders are processed within 1-2 business days.
                    </p>
                    <p>
                        <strong>Returns:</strong> We accept returns within 14 days of delivery.
                        Items must be unused and in their original packaging.
                        Please note that opened bottles cannot be returned due to hygiene reasons.
                    </p>
                </div>
            </TabsContent>
        </Tabs>
    );
}
