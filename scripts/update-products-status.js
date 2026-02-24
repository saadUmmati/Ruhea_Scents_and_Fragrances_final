const mongoose = require('mongoose');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ruheasnf_db_user:Ruhea78621@ruheastore.twpdxr5.mongodb.net/?appName=RuheaStore';

// Product Schema (simplified)
const productSchema = new mongoose.Schema({
    name: String,
    status: String,
    featured: Boolean
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

async function updateProductsStatus() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Update all products to published status
        const result = await Product.updateMany(
            {}, // Match all products
            {
                $set: {
                    status: 'published',
                    featured: true
                }
            }
        );

        console.log(`✅ Updated ${result.modifiedCount} products to 'published' status`);

        // List all products to verify
        const products = await Product.find({}).select('name status featured').lean();
        console.log('\n📦 Current Products:');
        products.forEach((p, i) => {
            console.log(`${i + 1}. ${p.name} - Status: ${p.status}, Featured: ${p.featured}`);
        });

        await mongoose.disconnect();
        console.log('\n✨ Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateProductsStatus();
