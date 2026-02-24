const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ruhea-fragrances';

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@ruhea.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('Email: admin@ruhea.com');
            console.log('Role:', existingAdmin.role);

            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated existing user to admin role');
            }
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const adminUser = new User({
                name: 'Admin User',
                email: 'admin@ruhea.com',
                password: hashedPassword,
                role: 'admin'
            });

            await adminUser.save();
            console.log('✅ Admin user created successfully!');
            console.log('\n📧 Login Credentials:');
            console.log('Email: admin@ruhea.com');
            console.log('Password: admin123');
            console.log('Role: admin');
        }

        await mongoose.disconnect();
        console.log('\n✨ Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdminUser();
