const mongoose = require('mongoose');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ruheasnf_db_user:Ruhea78621@ruheastore.twpdxr5.mongodb.net/?appName=RuheaStore';

const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({ name: String }, { strict: false }));

async function cleanup() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const result = await Product.deleteMany({ name: "fjhfj" });
        console.log(`✅ Deleted ${result.deletedCount} dummy products (name: "fjhfj")`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

cleanup();
