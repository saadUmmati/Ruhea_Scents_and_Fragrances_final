
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

async function connectToDatabase() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    await mongoose.connect(MONGODB_URI!);
}

async function cleanupBrokenProducts() {
    try {
        await connectToDatabase();
        console.log("Connected to database");

        // We want to delete products that have empty featured_image AND are named "Test Perfume X"
        // The schema fix is technically applied, so we can query for them.
        // However, since they were created when the field didn't exist in the schema,
        // queries on 'featured_image' might be tricky depending on how Mongoose handles strictly schema-less data.
        // But we know their names are "Test Perfume X".

        // Define a basic model just for deletion if needed, but we can try with the existing model
        // Dynamically import to ensure schema is registered
        const { default: Product } = await import("@/lib/db/models/product.model");

        // Delete "Test Perfume" products
        const result = await Product.deleteMany({
            name: { $regex: /Test Perfume/, $options: "i" }
        });

        console.log(`Deleted ${result.deletedCount} broken 'Test Perfume' products.`);

        // Also check for products with "Subagent Test Product" name from browser testing
        const result2 = await Product.deleteMany({
            name: { $regex: /Subagent Test/, $options: "i" }
        });
        console.log(`Deleted ${result2.deletedCount} broken 'Subagent' products.`);

        console.log("Cleanup complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error deleting products:", error);
        process.exit(1);
    }
}

cleanupBrokenProducts();
