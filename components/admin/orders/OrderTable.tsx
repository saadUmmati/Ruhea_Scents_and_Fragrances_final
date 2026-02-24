"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import Link from "next/link";
import { updateOrderStatus } from "@/lib/actions/order.actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";

interface OrderTableProps {
    initialOrders: any[];
}

export function OrderTable({ initialOrders }: OrderTableProps) {
    const handleStatusChange = async (orderId: string, newStatus: string) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (!result.success) {
            alert("Failed to update status");
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "default"; // or green-ish style if custom
            case "shipped": return "secondary";
            case "processing": return "outline";
            case "cancelled": return "destructive";
            default: return "outline";
        }
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>Order #</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialOrders.map((order) => {
                        const ship = order.shipping_address;
                        const addressString = ship
                            ? `${ship.address}, ${ship.city}`
                            : "-";

                        return (
                            <TableRow key={order._id}>
                                <TableCell className="font-medium">{order.order_number}</TableCell>
                                <TableCell>
                                    {ship?.first_name} {ship?.last_name}
                                    <br />
                                    <span className="text-xs text-muted-foreground">{ship?.email || order.user?.email}</span>
                                </TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{ship?.phone || "-"}</TableCell>
                                <TableCell className="max-w-[250px] truncate" title={addressString}>
                                    {addressString}
                                </TableCell>
                                <TableCell>PKR {order.total}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{order.payment_status}</Badge>
                                </TableCell>
                                <TableCell>
                                    <Select defaultValue={order.status} onValueChange={(val) => handleStatusChange(order._id, val)}>
                                        <SelectTrigger className="w-[130px]">
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="shipped">Shipped</SelectItem>
                                            <SelectItem value="delivered">Delivered</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/orders/${order._id}`}>
                                                    <Eye className="mr-2 h-4 w-4" /> View Details
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {initialOrders.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                                No orders found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
