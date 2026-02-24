import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await connectToDatabase();

        const email = "testuser@example.com";
        const password = "password123";

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            return NextResponse.json({ message: "User already exists", user });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user = await User.create({
            name: "Test User",
            email,
            password: hashedPassword,
            role: "customer",
            loyalty_points: 100,
            loyalty_tier: "bronze",
        });

        return NextResponse.json({ message: "User created", user });
    } catch (error) {
        console.error("Seed user error:", error);
        return NextResponse.json({ error: "Seed failed", details: String(error) }, { status: 500 });
    }
}
