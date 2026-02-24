
import dotenv from "dotenv";
import path from "path";

// Initialize dotenv first to populate process.env
const envPath = path.resolve(__dirname, "../.env.local");
dotenv.config({ path: envPath });

console.log("Loading env from:", envPath);
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);

async function testCreate() {
    try {
        // Dynamic imports to ensure env vars are loaded before modules are evaluated
        const { default: connectToDatabase } = await import("../lib/db/mongoose");
        const { default: Product } = await import("../lib/db/models/product.model");

        console.log("Connecting to DB...");
        await connectToDatabase();
        console.log("Connected.");

        const testProduct = {
            name: "Test Fragrance " + Date.now(),
            sku: "TEST-" + Date.now(),
            price: 5000,
            description: "A test description for debugging.",
            short_description: "Short desc",
            concentration_type: "EDP",
            gender: "unisex",
            variants: [{
                size: "Standard",
                price: 5000,
                stock: 10,
                sku: "TEST-" + Date.now() + "-STD",
                concentration: "EDP",
                type: "bottle"
            }],
            notes: {
                top: ["Citrus"],
                heart: ["Rose"],
                base: ["Musk"]
            },
            slug: "test-fragrance-" + Date.now(),
            images: [],
            featured_image: "https://example.com/image.jpg"
        };

        console.log("Creating product:", testProduct);

        const res = await Product.create(testProduct);
        console.log("Product created successfully:", res._id);

    } catch (error: any) {
        console.error("Creation Failed!");
        console.error("Error Name:", error.name);
        console.error("Error Message:", error.message);
        if (error.errors) {
            console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
        }
    } finally {
        process.exit();
    }
}

testCreate();
