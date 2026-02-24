import { ProductCard } from "@/components/shop/product-card";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";

interface RelatedProductsProps {
    categoryId?: string;
    currentProductId?: string;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
    if (!categoryId) return [];

    await connectToDatabase();

    // Find products in the same category, excluding the current one
    const products = await Product.find({
        categories: categoryId,
        _id: { $ne: currentProductId },
        status: "published"
    })
        .limit(4)
        .lean();

    return JSON.parse(JSON.stringify(products));
}

export async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    if (!categoryId || !currentProductId) return null;

    const relatedProducts = await getRelatedProducts(categoryId, currentProductId);

    if (relatedProducts.length === 0) return null;

    return (
        <section className="py-12">
            <h2 className="text-2xl font-serif font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((product: any) => (
                    <ProductCard
                        key={product._id}
                        product={{
                            id: product._id,
                            name: product.name,
                            brand: product.brand || "RUHEA",
                            price: product.variants[0]?.price || 0,
                            rating: product.rating_average || 0,
                            reviews: product.rating_count || 0,
                            image: product.featured_image,
                            isNew: false // You can add logic for this if needed
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
