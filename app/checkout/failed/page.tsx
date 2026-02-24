"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft, Home } from "lucide-react";

import { Suspense } from "react";

function CheckoutFailedContent() {
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason") || "Unknown error occurred";

    return (
        <div className="container max-w-2xl py-12">
            <Card className="border-2 border-red-200">
                <CardContent className="pt-12 pb-8 text-center">
                    <div className="mb-6">
                        <XCircle className="h-20 w-20 text-red-500 mx-auto" />
                    </div>

                    <h1 className="text-3xl font-serif font-bold mb-4">
                        Payment Failed
                    </h1>

                    <p className="text-lg text-muted-foreground mb-4">
                        We couldn't process your payment.
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-red-800">
                            <strong>Reason:</strong> {decodeURIComponent(reason)}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Don't worry, your order was not placed and you were not charged.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button asChild variant="outline" className="gap-2">
                                <Link href="/">
                                    <Home className="h-4 w-4" />
                                    Go Home
                                </Link>
                            </Button>
                            <Button asChild className="gap-2">
                                <Link href="/checkout">
                                    <ArrowLeft className="h-4 w-4" />
                                    Try Again
                                </Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function CheckoutFailedPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CheckoutFailedContent />
        </Suspense>
    );
}
