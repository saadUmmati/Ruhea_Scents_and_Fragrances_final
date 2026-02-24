export { };
const mongooseLib = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

async function checkDatabase() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }

        console.log("Connecting to MongoDB...");
        await mongooseLib.connect(process.env.MONGODB_URI);
        console.log("Connected successfully!");

        console.log("Database Name:", mongooseLib.connection.name);

        // Check if products collection exists and has data
        if (!mongooseLib.connection.db) {
            console.log("Database connection object is undefined.");
            return;
        }

        const collections = await mongooseLib.connection.db.listCollections().toArray();
        console.log("Collections:", collections.map((c: any) => c.name));

        const productCollection = mongooseLib.connection.db.collection("products");
        const count = await productCollection.countDocuments();
        console.log(`Number of products: ${count}`);

        if (count > 0) {
            const sample = await productCollection.findOne();
            console.log("Sample product:", JSON.stringify(sample, null, 2));
        }

    } catch (error) {
        console.error("Database connection failed:", error);
    } finally {
        await mongooseLib.disconnect();
    }
}

checkDatabase();
