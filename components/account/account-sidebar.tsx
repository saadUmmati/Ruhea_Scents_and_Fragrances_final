"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    User,
    MapPin,
    ShoppingBag,
    Heart,
    Settings,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/account/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Profile",
        href: "/account/profile",
        icon: User,
    },
    {
        title: "Orders",
        href: "/account/orders",
        icon: ShoppingBag,
    },
    {
        title: "Addresses",
        href: "/account/addresses",
        icon: MapPin,
    },
    {
        title: "Wishlist",
        href: "/wishlist",
        icon: Heart,
    },
    {
        title: "Settings",
        href: "/account/settings",
        icon: Settings,
    },
];

export function AccountSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex flex-col space-y-1", className)}>
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                );
            })}
            <div className="pt-4 mt-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </nav>
    );
}
