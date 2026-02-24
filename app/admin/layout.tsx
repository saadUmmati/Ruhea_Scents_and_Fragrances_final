"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-muted/20">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-shrink-0 md:block fixed inset-y-0 left-0 z-40">
                <AdminSidebar />
            </aside>

            {/* Mobile Sidebar */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <AdminSidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:pl-64 transition-all duration-300">
                <AdminHeader onMobileMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
