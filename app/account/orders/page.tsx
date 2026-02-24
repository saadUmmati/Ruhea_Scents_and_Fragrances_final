import { auth } from "@/auth";
import { EmptyState } from "@/components/ui/empty-state";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order.model";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default async function OrdersPage() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p>Please log in to view your orders.</p>
                <Button asChild className="mt-4">
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    await connectToDatabase();
    const orders = await Order.find({ user: session.user.id })
        .sort({ createdAt: -1 })
        .lean();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Order History</h1>
                <p className="text-muted-foreground">
                    View and track your past orders.
                </p>
            </div>

            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order: any) => (
                        <div key={order._id.toString()} className="border rounded-lg overflow-hidden">
                            <div className="bg-muted/50 p-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2">
                                    <div>
                                        <p className="text-muted-foreground">Order Placed</p>
                                        <p className="font-medium">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Total</p>
                                        <p className="font-medium">Rs. {order.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Order #</p>
                                        <p className="font-medium">{order.order_number}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Status</p>
                                        <Badge variant={order.status === "delivered" ? "default" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/orders/${order._id}`}>View Details</Link>
                                </Button>
                            </div>
                            <div className="p-4 space-y-4">
                                {order.items.map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-sm">{item.name}</h3>
                                            <p className="text-xs text-muted-foreground">{item.size}</p>
                                            <p className="text-sm mt-1">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={ShoppingBag}
                    title="No orders yet"
                    description="You haven't placed any orders yet. Start shopping to find your signature scent."
                    action={{
                        label: "Start Shopping",
                        href: "/shop",
                    }}
                />
            )}
        </div>
    );
}
