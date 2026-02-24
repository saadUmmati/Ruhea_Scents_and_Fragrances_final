"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { quizQuestions, QuizAnswers } from "@/lib/quiz/questions";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizProgress } from "@/components/quiz/quiz-progress";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function QuizPage() {
    const router = useRouter();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const question = quizQuestions[currentQuestion];
    const isLastQuestion = currentQuestion === quizQuestions.length - 1;
    const isFirstQuestion = currentQuestion === 0;

    const handleAnswer = (value: string | string[]) => {
        setAnswers((prev) => ({
            ...prev,
            [question.id]: value,
        }));
    };

    const handleNext = () => {
        if (!answers[question.id]) {
            toast.error("Please select an answer before continuing");
            return;
        }

        if (isLastQuestion) {
            handleSubmit();
        } else {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstQuestion) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit quiz");
            }

            toast.success("Quiz completed! Finding your perfect matches...");

            // Pass recommendations via URL params
            const recsParam = encodeURIComponent(JSON.stringify(data.recommendations));
            router.push(`/quiz/results/${data.quizResultId}?recs=${recsParam}`);
        } catch (error) {
            console.error("Quiz submission error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to submit quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-3xl py-12">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Fragrance Quiz</span>
                </div>
                <h1 className="text-4xl font-serif font-bold mb-4">
                    Find Your Perfect Scent
                </h1>
                <p className="text-lg text-muted-foreground">
                    Answer a few questions and we'll recommend fragrances tailored just for you
                </p>
            </div>

            {/* Progress */}
            <div className="mb-8">
                <QuizProgress current={currentQuestion + 1} total={quizQuestions.length} />
            </div>

            {/* Question */}
            <div className="mb-8">
                <QuestionCard
                    question={question}
                    value={answers[question.id] || (question.type === "multiple" ? [] : "")}
                    onChange={handleAnswer}
                />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isFirstQuestion}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="text-sm text-muted-foreground">
                    {currentQuestion + 1} / {quizQuestions.length}
                </div>

                <Button
                    onClick={handleNext}
                    disabled={!answers[question.id] || isSubmitting}
                    className="gap-2"
                >
                    {isLastQuestion ? (
                        <>
                            {isSubmitting ? "Submitting..." : "Get Results"}
                            <Sparkles className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Next
                            <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
                {question.type === "multiple" && "You can select multiple options"}
            </div>
        </div>
    );
}
