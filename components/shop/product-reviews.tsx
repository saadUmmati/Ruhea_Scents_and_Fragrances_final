"use client";

import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductReviewsProps {
    productId: string;
}

interface Review {
    _id: string;
    user: {
        name: string;
        image?: string;
    };
    rating: number;
    title: string;
    comment: string;
    verified_purchase: boolean;
    helpful_count: number;
    createdAt: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        average: 0,
        total: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<number, number>,
    });

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [comment, setComment] = useState("");

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?productId=${productId}`);
            const data = await response.json();

            if (data.reviews) {
                setReviews(data.reviews);

                // Calculate stats based on fetched reviews
                const total = data.reviews.length;
                const sum = data.reviews.reduce((acc: number, r: Review) => acc + r.rating, 0);
                const average = total > 0 ? (sum / total).toFixed(1) : 0;

                const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
                data.reviews.forEach((r: Review) => {
                    if (r.rating >= 1 && r.rating <= 5) {
                        distribution[r.rating as keyof typeof distribution]++;
                    }
                });

                setStats({
                    average: Number(average),
                    total,
                    distribution,
                });
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) {
            fetchReviews();
        }
    }, [productId]);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            toast.error("You must be logged in to write a review");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    rating,
                    title,
                    comment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit review");
            }

            toast.success("Review submitted successfully!");
            setIsDialogOpen(false);
            // Reset form
            setRating(5);
            setTitle("");
            setComment("");
            // Refresh reviews
            fetchReviews();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-12" id="reviews">
            <h2 className="text-2xl font-serif font-bold mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Summary */}
                <div className="md:col-span-1 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold">{stats.average || "0.0"}</div>
                        <div className="space-y-1">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-5 w-5 ${star <= Math.round(stats.average) ? "fill-current" : "text-muted"}`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
                            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-sm">
                                    <span className="w-3">{star}</span>
                                    <Star className="h-3 w-3 text-muted-foreground" />
                                    <Progress value={percentage} className="h-2" />
                                    <span className="w-8 text-right text-muted-foreground">{Math.round(percentage)}%</span>
                                </div>
                            );
                        })}
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full" variant="outline">Write a Review</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Write a Review</DialogTitle>
                                <DialogDescription>
                                    Share your experience with this product.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmitReview} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Summarize your experience"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="comment">Review</Label>
                                    <Textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="What did you like or dislike?"
                                        required
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Review
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Reviews List */}
                <div className="md:col-span-2 space-y-8">
                    {loading ? (
                        <div className="text-center py-12 text-muted-foreground">Loading reviews...</div>
                    ) : reviews.length > 0 ? (
                        <>
                            {reviews.map((review) => (
                                <div key={review._id} className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={review.user.image} alt={review.user.name} />
                                                <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold">{review.user.name}</h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>{format(new Date(review.createdAt), "MMMM d, yyyy")}</span>
                                                    {review.verified_purchase && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="text-green-600">Verified Purchase</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted"}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h5 className="font-medium mb-1">{review.title}</h5>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                            <ThumbsUp className="h-4 w-4" />
                                            Helpful ({review.helpful_count})
                                        </button>
                                        <button className="hover:text-foreground transition-colors">Report</button>
                                    </div>

                                    <Separator />
                                </div>
                            ))}
                            {/* Pagination could go here */}
                        </>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            No reviews yet. Be the first to review this product!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
