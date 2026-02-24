import { getOrderById } from "@/lib/actions/order.actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import Image from "next/image";
import InvoiceButton from "@/components/admin/orders/InvoiceButton";

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await getOrderById(params.id);

    if (!order) {
        return <div>Order not found</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Order {order.order_number}</h1>
                    <p className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                    <InvoiceButton />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border text-muted-foreground flex items-center justify-center bg-muted">
                                            {/* Placeholder image if not stored or if stored as url */}
                                            {item.image ? (
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                            ) : (
                                                <span>Img</span>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.size} • SKU: {item.variant_sku}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">PKR {item.price} x {item.quantity}</p>
                                        <p className="font-bold">PKR {item.price * item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            <Separator />
                            <div className="flex justify-end gap-x-4">
                                <div className="text-right space-y-1">
                                    <p className="text-sm text-muted-foreground">Subtotal</p>
                                    <p className="text-sm text-muted-foreground">Shipping</p>
                                    <p className="text-lg font-bold">Total</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-sm">PKR {order.subtotal}</p>
                                    <p className="text-sm">PKR {order.shipping_cost}</p>
                                    <p className="text-lg font-bold">PKR {order.total}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold">Contact Information</p>
                            <p className="text-sm text-muted-foreground">{order.shipping_address.email}</p>
                            <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Shipping Address</p>
                            <p className="text-sm text-muted-foreground">
                                {order.shipping_address.first_name} {order.shipping_address.last_name}<br />
                                {order.shipping_address.address}
                                {order.shipping_address.apartment && <><br />{order.shipping_address.apartment}</>}
                                <br />
                                {order.shipping_address.city}, {order.shipping_address.postal_code}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Payment & Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold mb-2">Payment Method</p>
                            <Badge variant="outline" className="capitalize">{order.payment_method}</Badge>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Payment Status</p>
                            <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="capitalize">{order.payment_status}</Badge>
                        </div>
                        <div>
                            <p className="font-semibold mb-2">Order Status</p>
                            <Badge variant="outline" className="capitalize">{order.status}</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Simple print CSS to hide non-printable elements */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white; }
                    .border { border: none; }
                }
            `}} />
        </div>
    );
}
