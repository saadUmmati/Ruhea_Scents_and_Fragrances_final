import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    html,
    from = 'RUHEA <onboarding@resend.dev>', // Update with your verified domain
}: {
    to: string;
    subject: string;
    html: string;
    from?: string;
}) => {
    if (!process.env.RESEND_API_KEY) {
        console.log('RESEND_API_KEY is missing, skipping email send');
        return { success: false, error: 'Missing API key' };
    }

    try {
        const data = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    return await sendEmail({
        to: email,
        subject: "Reset your password - RUHEA",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Reset Your Password</h1>
                <p>You requested to reset your password for your RUHEA account.</p>
                <p>Click the button below to reset it:</p>
                <a href="${resetLink}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
                <p style="color: #666; font-size: 14px;">If you didn't request this, purely ignore this email. The link will expire in 1 hour.</p>
            </div>
        `
    });
};
