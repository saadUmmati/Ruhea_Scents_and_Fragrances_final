import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";

export async function POST(req: Request) {
    try {
        const { name, email, password, phoneNumber, address } = await req.json();

        if (!name || !email || !password) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return new NextResponse("User already exists", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            addresses: address ? [address] : [],
        });

        return NextResponse.json(newUser);
    } catch (_error) {
        console.error("[REGISTER_ERROR]", _error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
