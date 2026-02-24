const mongoose = require('mongoose');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ruheasnf_db_user:Ruhea78621@ruheastore.twpdxr5.mongodb.net/?appName=RuheaStore';

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ name: String }, { strict: false }));

const productsToDelete = [
    "Velvet Saffron",
    "White Musk",
    "Amber Royale",
    "Rose Mystique",
    "Oud Noir"
];

async function cleanupProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected\n');

        for (const name of productsToDelete) {
            // Case-insensitive deletion
            const result = await Product.deleteMany({
                name: { $regex: new RegExp(`^${name}$`, 'i') }
            });

            if (result.deletedCount > 0) {
                console.log(`✅ Deleted ${result.deletedCount} product(s) named: "${name}"`);
            } else {
                console.log(`⚠️  Product not found: "${name}"`);
            }
        }

        console.log('\n✨ Cleanup complete!');
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

cleanupProducts();
