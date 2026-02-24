import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Smartphone, MapPin, User as UserIcon, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import connectToDatabase from "@/lib/db/mongoose";
import User from "@/lib/db/models/user.model";
import Order from "@/lib/db/models/order.model";
import { Types } from "mongoose";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p>Please log in to view your dashboard.</p>
                <Button asChild className="mt-4">
                    <Link href="/login">Log In</Link>
                </Button>
            </div>
        );
    }

    await connectToDatabase();

    // Fetch user details for loyalty points
    const user = await User.findById(session.user.id).select("loyalty_points loyalty_tier");

    // Fetch orders
    const orderCount = await Order.countDocuments({ user: session.user.id });

    // Calculate Total Spent
    const totalSpentRaw = await Order.aggregate([
        { $match: { user: new Types.ObjectId(session.user.id), status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalSpent = totalSpentRaw[0]?.total || 0;

    const recentOrder = await Order.findOne({ user: session.user.id })
        .sort({ createdAt: -1 })
        .lean() as any;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Manage your account and view your recent activity.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Spent
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rs. {totalSpent.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime value
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Orders
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orderCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime orders
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Loyalty Points
                        </CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{user?.loyalty_points || 0}</div>
                        <p className="text-xs text-muted-foreground capitalize">
                            {user?.loyalty_tier || "Bronze"} Tier
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentOrder ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">Order #{recentOrder.order_number}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(recentOrder.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">Rs. {recentOrder.total.toLocaleString()}</p>
                                        <p className="text-xs capitalize bg-secondary px-2 py-0.5 rounded-full inline-block mt-1">
                                            {recentOrder.status}
                                        </p>
                                    </div>
                                </div>
                                <Button asChild variant="outline" size="sm" className="w-full">
                                    <Link href={`/orders/${recentOrder._id}`}>View Order Details</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-muted-foreground mb-4">
                                    You haven't placed any orders yet.
                                </p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/shop">Start Shopping</Link>
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Account Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-1">
                            <p className="font-medium">{session?.user?.name}</p>
                            <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        </div>
                        <Button asChild variant="link" className="px-0 mt-2">
                            <Link href="/account/profile">Edit Profile</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
