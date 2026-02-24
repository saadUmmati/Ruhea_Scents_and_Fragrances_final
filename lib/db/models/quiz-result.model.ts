import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IQuizResult extends Document {
    user?: mongoose.Types.ObjectId;
    session_id?: string;
    answers: Record<string, unknown>;
    recommended_products: mongoose.Types.ObjectId[];
    is_fallback?: boolean;
    match_summary?: string;
    createdAt: Date;
    updatedAt: Date;
}

const QuizResultSchema = new Schema<IQuizResult>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        session_id: { type: String },
        answers: { type: Map, of: Schema.Types.Mixed, required: true },
        recommended_products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
        is_fallback: { type: Boolean, default: false },
        match_summary: { type: String },
    },
    { timestamps: true }
);

const QuizResult = models.QuizResult || model<IQuizResult>("QuizResult", QuizResultSchema);

export default QuizResult;
