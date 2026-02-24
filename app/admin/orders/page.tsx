import { OrderTable } from "@/components/admin/orders/OrderTable";
import { getOrders } from "@/lib/actions/order.actions";
import { PaginationControl } from "@/components/admin/PaginationControl";

interface OrdersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    const data = await getOrders({ page, limit: 10 });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
                <p className="text-muted-foreground">Manage and process customer orders.</p>
            </div>
            <OrderTable initialOrders={data.orders} />
            <PaginationControl currentPage={data.currentPage} totalPages={data.totalPages} />
        </div>
    );
}
