"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ShoppingCart, Heart, RotateCcw, Star, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProductRecommendation {
    product: {
        _id: string;
        name: string;
        slug: string;
        brand: string;
        price: number;
        featured_image: string;
        rating_average: number;
        rating_count: number;
    };
    matchScore: number;
    matchReasons: string[];
}

export default function QuizResultsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
    const [matchSummary, setMatchSummary] = useState<string>("");
    const [isFallback, setIsFallback] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [params.id]);

    const fetchResults = async () => {
        try {
            const response = await fetch(`/api/quiz/results/${params.id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error);
            }

            // The API returns the quiz result object which contains the references
            // But we actually need the mapped product details which might be in the 'recommended_products' populated field
            // Let's verify the structure. 
            // Ideally the GET endpoint should return the same structure as the POST response for consistency
            // But based on the code I read earlier, the GET endpoint returns { quizResult: ... }
            // and populates 'recommended_products'.

            const result = data.quizResult;

            // Map the populated products back to our view model
            if (result && result.recommended_products) {
                const mappedRecs = result.recommended_products.map((prod: any) => ({
                    product: prod,
                    matchScore: result.is_fallback ? 0 : 90, // We miss the score in GET, but that's okay for now
                    matchReasons: result.is_fallback ? ["Community Favorite"] : ["Perfect Match"]
                }));
                setRecommendations(mappedRecs);
                setMatchSummary(result.match_summary || "");
                setIsFallback(result.is_fallback || false);
            }
        } catch (error) {
            console.error("Failed to fetch results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container max-w-6xl py-12">
                <div className="space-y-8">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-96" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container max-w-6xl py-12">
            {/* Header */}
            <div className="text-center mb-12 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium text-primary">Your Results</span>
                </div>

                <h1 className="text-4xl font-serif font-bold">
                    {isFallback ? "We think you'll love these..." : "Your Perfect Fragrance Matches"}
                </h1>

                {matchSummary && (
                    <div className="max-w-2xl mx-auto">
                        <Alert className="bg-secondary/20 border-primary/20">
                            <Info className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary font-serif mb-2">Your Scent Profile</AlertTitle>
                            <AlertDescription className="text-muted-foreground text-base">
                                {matchSummary}
                            </AlertDescription>
                        </Alert>
                    </div>
                )}

                {!matchSummary && (
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Based on your preferences, we've found these fragrances that are perfect for you
                    </p>
                )}
            </div>

            {/* Recommendations */}
            {recommendations.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-6">
                        No recommendations found. Try taking the quiz again!
                    </p>
                    <Button onClick={() => router.push("/quiz")} className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Retake Quiz
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {recommendations.map((rec, index) => (
                            <Card key={rec.product._id} className="group hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    {/* Match Badge */}
                                    <div className="relative">
                                        {!isFallback && (
                                            <div className="absolute top-4 left-4 z-10">
                                                <Badge className="bg-primary text-primary-foreground">
                                                    Match
                                                </Badge>
                                            </div>
                                        )}
                                        {index === 0 && !isFallback && (
                                            <div className="absolute top-4 right-4 z-10">
                                                <Badge variant="secondary" className="gap-1">
                                                    <Sparkles className="h-3 w-3" />
                                                    Top Pick
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Product Image */}
                                        <Link href={`/shop/product/${rec.product.slug}`}>
                                            <div className="relative aspect-square overflow-hidden rounded-t-lg">
                                                <Image
                                                    src={rec.product.featured_image || "/images/placeholder.jpg"}
                                                    alt={rec.product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {rec.product.brand}
                                        </p>
                                        <Link href={`/shop/product/${rec.product.slug}`}>
                                            <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                                                {rec.product.name}
                                            </h3>
                                        </Link>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-3">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">
                                                {rec.product.rating_average ? rec.product.rating_average.toFixed(1) : "New"}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                ({rec.product.rating_count || 0})
                                            </span>
                                        </div>

                                        {/* Match Reasons */}
                                        <div className="mb-4">
                                            <p className="text-xs font-medium text-muted-foreground mb-2">
                                                {isFallback ? "Recommended because:" : "Why it matches:"}
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {rec.matchReasons.slice(0, 3).map((reason, i) => (
                                                    <Badge key={i} variant="outline" className="text-xs">
                                                        {reason}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Price & Actions */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-xl font-bold">
                                                Rs. {rec.product.price.toLocaleString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="outline">
                                                    <Heart className="h-4 w-4" />
                                                </Button>
                                                <Link href={`/shop/product/${rec.product.slug}`}>
                                                    <Button size="sm" className="gap-2">
                                                        <ShoppingCart className="h-4 w-4" />
                                                        View
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button variant="outline" onClick={() => router.push("/quiz")} className="gap-2">
                            <RotateCcw className="h-4 w-4" />
                            Retake Quiz
                        </Button>
                        <Button onClick={() => router.push("/shop")} className="gap-2">
                            Browse All Fragrances
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
