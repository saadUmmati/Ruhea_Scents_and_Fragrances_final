import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductInfo } from "@/components/shop/product-info";
import { ProductTabs } from "@/components/shop/product-tabs";
import { RelatedProducts } from "@/components/shop/related-products";
import { ProductReviews } from "@/components/shop/product-reviews";
import { RecentlyViewed } from "@/components/shop/recently-viewed";
import { notFound } from "next/navigation";
import { AddToHistory } from "@/components/shop/add-to-history";

// 🚨 Directory structure ke mutabiq exact imports
import connectToDatabase from "@/lib/db/mongoose"; 
import Product from "@/lib/db/models/product.model"; 
import mongoose from "mongoose";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    // 1. Next.js 16 Fix: params ko await karna lazmi hai
    const { id } = await params;

    // 2. ID Validation: Agar ID MongoDB format ki nahi hai to foran 404
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.error("Invalid Product ID format:", id);
        notFound();
    }

    try {
        // 3. Database Connection
        await connectToDatabase();

        // 4. Fetch Product: .lean() performance ke liye behtar hai
        const product = await Product.findById(id).lean();

        if (!product) {
            console.error("Product not found in DB for ID:", id);
            notFound();
        }

        // 5. Serialization: MongoDB object ko plain JSON mein convert karna
        const serializedProduct = JSON.parse(JSON.stringify(product));

        // Variants aur stock ki safety mapping
        const variants = Array.isArray(serializedProduct.variants) ? serializedProduct.variants : [];
        const productData = {
            _id: serializedProduct._id.toString(),
            name: serializedProduct.name,
            brand: serializedProduct.brand || "RUHEA",
            price: variants[0]?.price || serializedProduct.price || 0,
            originalPrice: variants[0]?.compare_at_price || serializedProduct.originalPrice || null,
            rating: serializedProduct.rating_average || 0,
            reviews: serializedProduct.rating_count || 0,
            description: serializedProduct.description,
            variants: variants,
            inStock: variants.length > 0 
                ? variants.some((v: any) => (v.stock || 0) > 0) 
                : (serializedProduct.stock > 0),
            slug: serializedProduct.slug,
            featured_image: serializedProduct.featured_image,
        };

        return (
            <main className="container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <ProductGallery 
                        images={Array.isArray(serializedProduct.images) && serializedProduct.images.length > 0 
                            ? serializedProduct.images 
                            : [serializedProduct.featured_image]} 
                    />
                    <ProductInfo product={productData} />
                </div>

                <div className="mb-16">
                    <ProductTabs product={serializedProduct} />
                </div>

                <div className="mb-16">
                    <ProductReviews productId={productData._id} />
                </div>

                <RelatedProducts 
                    categoryId={Array.isArray(serializedProduct.categories) ? serializedProduct.categories[0] : serializedProduct.categories} 
                    currentProductId={productData._id} 
                />
                
                <RecentlyViewed product={productData} />
                <AddToHistory product={productData} />
            </main>
        );
    } catch (error) {
        console.error("Critical Server Error on Product Page:", error);
        // Error ki soorat mein 404 trigger karein taake site crash na ho
        notFound();
    }
}
