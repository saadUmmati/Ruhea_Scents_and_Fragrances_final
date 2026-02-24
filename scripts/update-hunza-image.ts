
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function updateHunzaImage() {
    try {
        console.log("CWD:", process.cwd());
        console.log("Loading modules...");

        // Dynamically import to ensure env vars are loaded first
        const { default: connectToDatabase } = await import("../lib/db/mongoose");
        const { default: Product } = await import("../lib/db/models/product.model");

        console.log("MONGODB_URI present:", !!process.env.MONGODB_URI);

        console.log("Connecting to database...");
        await connectToDatabase();

        const imagePath = "/images/products/hunza-generated.jpg";

        console.log("Searching for product 'HUNZA'...");
        const product = await Product.findOne({ name: { $regex: /hunza/i } });

        if (product) {
            console.log(`Found product: ${product.name}`);
            product.featured_image = imagePath;
            product.images = [imagePath, ...(product.images || [])];
            product.images = [...new Set(product.images)];
            await product.save();
            console.log("✅ Successfully updated HUNZA product image!");
        } else {
            console.log("HUNZA product not found. Creating a new one...");
            await Product.create({
                name: "HUNZA",
                slug: "hunza",
                brand: "RUHEA",
                sku: "HUNZA-001",
                description: "A fragrance inspired by the majestic beauty of Hunza valley.",
                short_description: "Majestic beauty of Hunza.",
                price: 5000,
                concentration_type: "EDP",
                gender: "unisex",
                featured_image: imagePath,
                images: [imagePath],
                status: "published"
            });
            console.log("✅ Successfully created HUNZA product!");
        }

        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating product:", error);
        process.exit(1);
    }
}

updateHunzaImage();
