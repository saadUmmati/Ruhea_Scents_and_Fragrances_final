import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import QuizResult from "@/lib/db/models/quiz-result.model";
import Product from "@/lib/db/models/product.model";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const quizResult = await QuizResult.findById(id)
            .populate("recommended_products")
            .lean();

        if (!quizResult) {
            return NextResponse.json(
                { error: "Quiz result not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ quizResult });
    } catch (error) {
        console.error("Error fetching quiz result:", error);
        return NextResponse.json(
            { error: "Failed to fetch quiz result" },
            { status: 500 }
        );
    }
}
