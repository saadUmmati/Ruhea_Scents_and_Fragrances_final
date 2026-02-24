import { UserTable } from "@/components/admin/users/UserTable";
import { getUsers } from "@/lib/actions/user.actions";
import { PaginationControl } from "@/components/admin/PaginationControl";

interface UsersPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const params = await searchParams;
    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;

    const data = await getUsers({ page, limit: 10 });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Manage customers, admins, and roles.</p>
            </div>
            <UserTable initialUsers={data.users} />
            <PaginationControl currentPage={data.currentPage} totalPages={data.totalPages} />
        </div>
    );
}
