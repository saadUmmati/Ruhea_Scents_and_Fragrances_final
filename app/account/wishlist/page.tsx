import { auth } from "@/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/mongoose";
import Wishlist from "@/lib/db/models/wishlist.model";
import { ProductCard } from "@/components/shop/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Wishlist | RUHEA",
    description: "View and manage your saved items.",
};

export default async function WishlistPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login?callbackUrl=/wishlist");
    }

    await connectToDatabase();

    const wishlist = await Wishlist.findOne({ user: session.user.id })
        .populate({
            path: "products.product",
            model: "Product"
        });

    // Filter out any null products (in case a product was deleted)
    const products = wishlist?.products
        .map((item: any) => item.product)
        .filter((product: any) => product !== null) || [];

    return (
        <div className="container py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold mb-2">My Wishlist</h1>
                <p className="text-muted-foreground">
                    {products.length} {products.length === 1 ? "item" : "items"} saved for later
                </p>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product: any) => (
                        <ProductCard
                            key={product._id.toString()}
                            product={{
                                id: product._id.toString(),
                                name: product.name,
                                brand: product.brand,
                                price: product.variants?.[0]?.price || 0,
                                originalPrice: product.variants?.[0]?.compare_at_price,
                                rating: product.rating || 0,
                                reviews: product.reviews || 0,
                                image: product.featured_image || "/placeholder.jpg",
                                isNew: product.isNew,
                                isSale: product.isSale,
                                notes: product.notes,
                            }}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Heart}
                    title="Your wishlist is empty"
                    description="Save items you love to your wishlist. Review them anytime and easily move them to the bag."
                    action={{
                        label: "Start Shopping",
                        href: "/shop",
                    }}
                />
            )}
        </div>
    );
}
