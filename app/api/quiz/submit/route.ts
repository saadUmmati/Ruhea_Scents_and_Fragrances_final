import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Product from "@/lib/db/models/product.model";
import QuizResult from "@/lib/db/models/quiz-result.model";
import { auth } from "@/auth";
import { quizQuestions } from "@/lib/quiz/questions";

interface ProductMatch {
    product: any;
    matchScore: number;
    matchReasons: string[];
}

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const session = await auth();
        const { answers } = await req.json();

        if (!answers || typeof answers !== "object") {
            return NextResponse.json(
                { error: "Invalid answers format" },
                { status: 400 }
            );
        }

        // Generate profile summary
        const summary = generateProfileSummary(answers);

        // Get all PUBLISHED and IN-STOCK products
        // A product is in stock if at least one variant has stock > 0
        const products = await Product.find({
            status: "published",
            "variants.stock": { $gt: 0 }
        }).lean();

        // Calculate match scores for each product
        const productMatches: ProductMatch[] = products.map((product) => {
            let totalScore = 0;
            let totalWeight = 0;
            const matchReasons: string[] = [];

            // Gender match (25% weight)
            const genderQuestion = quizQuestions.find((q) => q.id === "gender");
            if (genderQuestion && answers.gender) {
                totalWeight += genderQuestion.weight;
                if (product.gender === answers.gender || product.gender === "unisex") {
                    totalScore += genderQuestion.weight * 100;
                    matchReasons.push(`Perfect for ${answers.gender === "men" ? "him" : answers.gender === "women" ? "her" : "everyone"}`);
                }
            }

            // Fragrance family match (30% weight)
            const familyQuestion = quizQuestions.find((q) => q.id === "fragranceFamily");
            if (familyQuestion && answers.fragranceFamily) {
                totalWeight += familyQuestion.weight;
                const selectedFamilies = Array.isArray(answers.fragranceFamily)
                    ? answers.fragranceFamily
                    : [answers.fragranceFamily];

                const productFamilies = product.fragrance_family || [];
                const matchingFamilies = selectedFamilies.filter((f: string) =>
                    productFamilies.some((pf: string) => pf.toLowerCase() === f.toLowerCase())
                );

                if (matchingFamilies.length > 0) {
                    const familyScore = (matchingFamilies.length / selectedFamilies.length) * 100;
                    totalScore += familyQuestion.weight * familyScore;
                    matchReasons.push(`${matchingFamilies.join(", ")} fragrance`);
                }
            }

            // Intensity/Concentration match (15% weight)
            const intensityQuestion = quizQuestions.find((q) => q.id === "intensity");
            if (intensityQuestion && answers.intensity) {
                totalWeight += intensityQuestion.weight;
                const concentrationMap: Record<string, string[]> = {
                    light: ["EDT"],
                    moderate: ["EDP"],
                    bold: ["Parfum", "Attar"],
                };

                const targetConcentrations = concentrationMap[answers.intensity] || [];
                if (targetConcentrations.some((c) => product.concentration_type?.includes(c))) {
                    totalScore += intensityQuestion.weight * 100;
                    matchReasons.push(`${answers.intensity} intensity`);
                }
            }

            // Longevity match (20% weight)
            const longevityQuestion = quizQuestions.find((q) => q.id === "longevity");
            if (longevityQuestion && answers.longevity) {
                totalWeight += longevityQuestion.weight;
                const longevityMap: Record<string, string[]> = {
                    short: ["EDT"],
                    medium: ["EDP"],
                    long: ["Parfum", "Attar"],
                };

                const targetConcentrations = longevityMap[answers.longevity] || [];
                if (targetConcentrations.some((c) => product.concentration_type?.includes(c))) {
                    totalScore += longevityQuestion.weight * 100;
                    matchReasons.push("Long-lasting");
                }
            }

            // Budget match (15% weight)
            const budgetQuestion = quizQuestions.find((q) => q.id === "budget");
            if (budgetQuestion && answers.budget) {
                totalWeight += budgetQuestion.weight;
                const [min, max] = answers.budget.split("-").map((v: string) => parseInt(v.replace("+", "")));
                const productPrice = product.price || 0;

                if (max) {
                    if (productPrice >= min && productPrice <= max) {
                        totalScore += budgetQuestion.weight * 100;
                        matchReasons.push("Within budget");
                    }
                } else {
                    if (productPrice >= min) {
                        totalScore += budgetQuestion.weight * 100;
                        matchReasons.push("Within budget");
                    }
                }
            }

            // Calculate final match score (0-100)
            const matchScore = totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;

            return {
                product,
                matchScore,
                matchReasons,
            };
        });

        // Filter valid matches
        let topMatches = productMatches
            .filter((m) => m.matchScore > 30) // Only show products with >30% match
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);

        let isFallback = false;

        // Fallback Logic: If no good matches, pick 3 random available products
        if (topMatches.length === 0) {
            isFallback = true;
            // Shuffle array using Fisher-Yates
            const shuffled = [...products];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }

            // Take top 3 random products as suggestions
            const randomPicks = shuffled.slice(0, 3);

            topMatches = randomPicks.map(product => ({
                product,
                matchScore: 0, // Fallback score
                matchReasons: ["Store Favorite", "Highly Recommended"]
            }));
        }

        // Save quiz result
        const quizResult = await QuizResult.create({
            user: session?.user?.id,
            session_id: !session?.user?.id ? req.headers.get("x-session-id") : undefined,
            answers,
            recommended_products: topMatches.map((m) => m.product._id),
            is_fallback: isFallback,
            match_summary: summary
        });

        return NextResponse.json({
            quizResultId: quizResult._id,
            recommendations: topMatches.map((m) => ({
                product: {
                    _id: m.product._id,
                    name: m.product.name,
                    slug: m.product.slug,
                    brand: m.product.brand,
                    price: m.product.price,
                    featured_image: m.product.featured_image,
                    rating_average: m.product.rating_average,
                    rating_count: m.product.rating_count,
                },
                matchScore: m.matchScore,
                matchReasons: m.matchReasons,
            })),
            isFallback,
            matchSummary: summary
        });
    } catch (error) {
        console.error("Quiz submission error:", error);
        return NextResponse.json(
            { error: "Failed to process quiz" },
            { status: 500 }
        );
    }
}

function generateProfileSummary(answers: any): string {
    const parts = [];

    if (answers.fragranceFamily) {
        const families = Array.isArray(answers.fragranceFamily)
            ? answers.fragranceFamily.join(" and ")
            : answers.fragranceFamily;
        parts.push(`You seem to enjoy **${families}** notes`);
    }

    if (answers.intensity) {
        parts.push(`you prefer a **${answers.intensity}** scent profile`);
    } else {
        parts.push("you appreciate a balanced scent profile");
    }

    if (answers.occasions && answers.occasions.length > 0) {
        // Just take the first one or two for brevity
        const occ = Array.isArray(answers.occasions) ? answers.occasions[0] : answers.occasions;
        parts.push(`that works well for **${occ}**`);
    }

    return parts.length > 0
        ? parts.join(", and ") + "."
        : "Based on your choices, we've curated a selection of fragrances just for you.";
}
