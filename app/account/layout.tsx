import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="container py-10">
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 shrink-0">
                    <div className="sticky top-24">
                        <div className="mb-6">
                            <h2 className="text-2xl font-serif font-bold">My Account</h2>
                            <p className="text-sm text-muted-foreground">
                                Welcome back, {session.user.name?.split(" ")[0]}
                            </p>
                        </div>
                        <AccountSidebar />
                    </div>
                </aside>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
