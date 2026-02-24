import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId: string }>;
}) {
    const { orderId } = await searchParams;

    return (
        <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center space-y-6">
            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
                <h1 className="text-3xl font-serif font-bold">Order Placed Successfully!</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Thank you for your purchase. Your order has been received and is being processed.
                </p>
            </div>

            {orderId && (
                <div className="bg-muted p-4 rounded-md">
                    <p className="text-sm font-medium">Order ID: <span className="font-mono">{orderId}</span></p>
                </div>
            )}

            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/shop">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/orders">View Orders</Link>
                </Button>
            </div>
        </div>
    );
}
