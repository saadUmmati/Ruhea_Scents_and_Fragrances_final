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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, ShieldAlert, ShieldCheck } from "lucide-react";
import { toggleUserBlockStatus, updateUserRole } from "@/lib/actions/user.actions";
import { toast } from "sonner"; // Assuming sonner is installed, if not, use standard alert or install it. I'll use simple console for now if not sure, but shadcn usually installs sonner or toast.

interface UserTableProps {
    initialUsers: any[];
}

export function UserTable({ initialUsers }: UserTableProps) {

    const handleBlockToggle = async (userId: string, currentStatus: boolean) => {
        const result = await toggleUserBlockStatus(userId, !currentStatus);
        if (!result.success) {
            alert("Failed to update status");
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        const result = await updateUserRole(userId, newRole);
        if (!result.success) {
            alert("Failed to update role");
        }
    }

    return (
        <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[800px]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Avatar</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialUsers.map((user) => {
                        const defaultAddress = user.addresses?.find((a: any) => a.isDefault) || user.addresses?.[0];
                        const addressString = defaultAddress
                            ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state}`
                            : "-";

                        return (
                            <TableRow key={user._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={user.image} alt={user.name} />
                                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber || "-"}</TableCell>
                                <TableCell className="max-w-[250px] truncate" title={addressString}>
                                    {addressString}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.role === 'super_admin' ? 'default' : user.role === 'admin' ? 'secondary' : 'outline'}>
                                        {user.role}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={user.isBlocked ? 'destructive' : 'outline'}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </Badge>
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
                                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user._id)}>
                                                Copy ID
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => handleRoleChange(user._id, user.role === 'admin' ? 'customer' : 'admin')}>
                                                {user.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className={user.isBlocked ? "text-green-600" : "text-destructive"}
                                                onClick={() => handleBlockToggle(user._id, user.isBlocked)}
                                            >
                                                {user.isBlocked ? (
                                                    <>
                                                        <ShieldCheck className="mr-2 h-4 w-4" /> Unblock User
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldAlert className="mr-2 h-4 w-4" /> Block User
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {initialUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
