const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection string from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ruheasnf_db_user:Ruhea78621@ruheastore.twpdxr5.mongodb.net/?appName=RuheaStore';

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'user' },
    image: String,
    emailVerified: Date,
}, { timestamps: true }));

const authorizedAdmins = [
    'saadi@gmail.com',
    'msaadisiddiqui@gmail.com'
];

async function setAdmins() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected\n');

        // 1. Revoke admin access from EVERYONE first
        console.log('Revoking admin access from all users...');
        await User.updateMany({}, { $set: { role: 'user' } });
        console.log('✅ All users set to "user" role.');

        // 2. Grant admin access to specific emails
        const hashedPassword = await bcrypt.hash('admin123', 10);

        for (const email of authorizedAdmins) {
            const user = await User.findOne({ email });

            if (user) {
                user.role = 'admin';
                await user.save();
                console.log(`✅ Updated existing user to ADMIN: ${email}`);
            } else {
                // Create if not exists
                await User.create({
                    name: email.split('@')[0], // Default name from email
                    email: email,
                    password: hashedPassword,
                    role: 'admin',
                    emailVerified: new Date()
                });
                console.log(`✅ Created NEW user as ADMIN: ${email} (Password: admin123)`);
            }
        }

        console.log('\n✨ Admin permissions updated successfully!');
        console.log('Only the following users are now admins:');
        authorizedAdmins.forEach(email => console.log(` - ${email}`));

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

setAdmins();
