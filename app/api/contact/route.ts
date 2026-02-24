import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, message } = body;

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // For now, we'll just log the contact form submission
        // In production, you would:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send auto-reply to user

        console.log("Contact Form Submission:", {
            name,
            email,
            message,
            timestamp: new Date().toISOString()
        });

        // TODO: Implement email sending with Nodemailer
        // TODO: Save to Contact collection in database

        return NextResponse.json(
            {
                success: true,
                message: "Thank you for your message! We'll get back to you soon."
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Failed to send message. Please try again." },
            { status: 500 }
        );
    }
}
