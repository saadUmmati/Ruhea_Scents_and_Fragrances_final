
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { headers } from "next/headers";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

const BASE_URL = "http://localhost:3000/api/products";

async function testCRUDFlow() {
    console.log("🚀 Starting Admin Panel CRUD Flow Evaluation...");

    let createdProductId: string | null = null;
    const timestamp = Date.now();
    const testProduct = {
        name: `Evaluation Product ${timestamp}`,
        sku: `EVAL-${timestamp}`,
        price: 99.99,
        description: "This is a test product for evaluating the admin panel CRUD functionality.",
        concentration_type: "EDP",
        gender: "unisex",
        featured_image: "https://res.cloudinary.com/demo/image/upload/v1/sample.jpg",
        images: ["https://res.cloudinary.com/demo/image/upload/v1/sample.jpg"]
    };

    try {
        // 1. CREATE (POST)
        console.log("\n1. Testing Product Creation (POST)...");
        const createRes = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(testProduct)
        });

        if (!createRes.ok) {
            const err = await createRes.json();
            throw new Error(`Failed to create product: ${JSON.stringify(err)}`);
        }

        const createData = await createRes.json();
        const product = createData.product;
        createdProductId = product._id;
        console.log("✅ Create Success!");
        console.log(`   ID: ${product._id}`);
        console.log(`   Slug: ${product.slug}`);

        // 2. READ (GET)
        console.log("\n2. Testing Product Retrieval (GET)...");
        const getRes = await fetch(`${BASE_URL}/${createdProductId}`);

        if (!getRes.ok) {
            throw new Error("Failed to fetch created product");
        }

        const fetchedProduct = await getRes.json();
        if (fetchedProduct.name !== testProduct.name) {
            throw new Error("Fetched product name mismatch");
        }
        console.log("✅ Read Success!");

        // 3. UPDATE (PUT) - This checks our critical fix
        console.log("\n3. Testing Product Update (PUT)...");
        const updatePayload = {
            ...testProduct,
            name: `Updated Evaluation Product ${timestamp}`,
            price: 149.99,
            description: "Updated description."
        };

        const updateRes = await fetch(`${BASE_URL}/${createdProductId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload)
        });

        if (!updateRes.ok) {
            const err = await updateRes.json();
            throw new Error(`Failed to update product: ${JSON.stringify(err)}`);
        }

        const updateData = await updateRes.json();
        const updatedProduct = updateData.product;

        if (updatedProduct.price !== 149.99) {
            throw new Error("Updated price verification failed");
        }
        console.log("✅ Update Success! (Fix Confirmed)");
        console.log(`   New Price: ${updatedProduct.price}`);

        // 4. DELETE (DELETE)
        console.log("\n4. Testing Product Deletion (DELETE)...");
        const deleteRes = await fetch(`${BASE_URL}/${createdProductId}`, {
            method: "DELETE"
        });

        if (!deleteRes.ok) {
            const err = await deleteRes.json();
            throw new Error(`Failed to delete product: ${JSON.stringify(err)}`);
        }
        console.log("✅ Delete Success!");

        // 5. VERIFY DELETION
        console.log("\n5. Verifying Deletion...");
        const verifyRes = await fetch(`${BASE_URL}/${createdProductId}`);
        if (verifyRes.status === 404) {
            console.log("✅ Verification Success! Product is gone (404).");
        } else {
            console.error("❌ Verification Failed. Product still exists or other error:", verifyRes.status);
            throw new Error("Product was not properly deleted");
        }

        console.log("\n🎉 ALL CRUD TESTS PASSED! Admin Panel Backend is fully functional.");

    } catch (error) {
        console.error("\n❌ TEST FAILED:", error);

        // Cleanup if failed
        if (createdProductId) {
            console.log("Attempting cleanup...");
            await fetch(`${BASE_URL}/${createdProductId}`, { method: "DELETE" });
        }
        process.exit(1);
    }
}

testCRUDFlow();
