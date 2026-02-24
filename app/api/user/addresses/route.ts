import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongoose";
import User, { IAddress } from "@/lib/db/models/user.model";

export async function GET(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id).select("addresses");

        return NextResponse.json({ addresses: user?.addresses || [] });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const addressData = await req.json();

        // Basic validation
        if (!addressData.street || !addressData.city || !addressData.state || !addressData.postalCode) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // If this is the first address or marked as default, handle defaults
        if (addressData.isDefault || user.addresses.length === 0) {
            user.addresses.forEach((addr: any) => (addr.isDefault = false));
            addressData.isDefault = true;
        }

        user.addresses.push(addressData);
        await user.save();

        return NextResponse.json({ message: "Address added successfully", addresses: user.addresses });
    } catch (error) {
        console.error("Error adding address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const addressId = searchParams.get("id");

        if (!addressId) {
            return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        user.addresses = user.addresses.filter((addr: any) => addr._id.toString() !== addressId);
        await user.save();

        return NextResponse.json({ message: "Address removed successfully", addresses: user.addresses });
    } catch (error) {
        console.error("Error removing address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
