import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import connectToDatabase from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";
import { sendPasswordResetEmail } from "@/lib/mail";

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();

        const validation = forgotPasswordSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 }
            );
        }

        const { email } = validation.data;

        const user = await User.findOne({ email });
        if (!user) {
            // We return success even if user not found to prevent email enumeration
            return NextResponse.json(
                { message: "If an account exists, a reset link has been sent." },
                { status: 200 }
            );
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Send email
        const emailResult = await sendPasswordResetEmail(user.email, resetToken);

        if (!emailResult.success) {
            console.error("Failed to send email:", emailResult.error);
            return NextResponse.json(
                { error: "Failed to send reset email" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Reset link sent successfully" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
