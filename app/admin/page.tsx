import Link from "next/link";
import Order from "@/lib/db/models/order.model";
import User from "@/lib/db/models/user.model";
import connectToDatabase from "@/lib/db/mongoose";
import { formatCurrency } from "@/lib/utils";
import { RecentOrders } from "@/components/admin/dashboard/RecentOrders";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminDashboardPage() {
    try {
        await connectToDatabase();
    } catch (error) {
        console.error("Database connection error:", error);
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Database Connection Error</h1>
                    <p className="text-muted-foreground">Unable to connect to database. Please check your connection.</p>
                </div>
            </div>
        );
    }

    // Initialize default values
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalUsers = 0;
    let recentOrdersCount = 0;
    let salesData: { name: string; total: number }[] = [];
    let popularProducts: { name: string; sales: number }[] = [];
    let recentOrdersList: any[] = [];

    try {
        // Fetch Key Metrics
        const totalRevenueRaw = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        totalRevenue = totalRevenueRaw[0]?.total || 0;

        totalOrders = await Order.countDocuments({ status: { $ne: "cancelled" } });
        totalUsers = await User.countDocuments();

        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        recentOrdersCount = await Order.countDocuments({
            createdAt: { $gte: oneDayAgo }
        });

        // Aggregate Monthly Sales
        const monthlySalesRaw = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$total" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        salesData = monthlySalesRaw.map(item => ({
            name: months[item._id - 1],
            total: item.total
        }));

        // Aggregate Popular Products
        const popularProductsRaw = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.name",
                    sales: { $sum: "$items.quantity" }
                }
            },
            { $sort: { sales: -1 } },
            { $limit: 5 }
        ]);

        popularProducts = popularProductsRaw.map(item => ({
            name: item._id,
            sales: item.sales
        }));

        // Fetch Recent Orders List
        const recentOrdersRaw = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();

        recentOrdersList = recentOrdersRaw.map((order: any) => ({
            id: order.order_number || order._id.toString().substring(0, 8).toUpperCase(),
            customer: order.shipping_address ? `${order.shipping_address.first_name} ${order.shipping_address.last_name}` : "Guest",
            date: new Date(order.createdAt).toISOString().split('T')[0],
            total: order.total,
            status: order.status
        }));
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        // Continue with default values - dashboard will show zeros but won't crash
    }


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Overview of your store's performance.</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>Analytics</TabsTrigger>
                    <TabsTrigger value="reports" disabled>Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Revenue
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 0 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                                <p className="text-xs text-muted-foreground">
                                    Lifetime Revenue
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Customers
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{totalUsers}</div>
                                <p className="text-xs text-muted-foreground">
                                    Total Registered
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Orders</CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <rect width="20" height="14" x="2" y="5" rx="2" />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{totalOrders}</div>
                                <p className="text-xs text-muted-foreground">
                                    Lifetime Orders
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Recent Activity
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground"
                                >
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+{recentOrdersCount}</div>
                                <p className="text-xs text-muted-foreground">
                                    Orders in last 24h
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <DashboardCharts salesData={salesData} popularProducts={popularProducts} />
                    <RecentOrders orders={recentOrdersList} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
