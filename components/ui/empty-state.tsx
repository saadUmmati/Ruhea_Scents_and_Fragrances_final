import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        href: string;
        onClick?: () => void;
    };
}

export function EmptyState({
    className,
    icon: Icon,
    title,
    description,
    action,
    ...props
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50",
                className
            )}
            {...props}
        >
            {Icon && (
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                {description}
            </p>
            {action && (
                action.onClick ? (
                    <Button onClick={action.onClick}>{action.label}</Button>
                ) : (
                    <Link href={action.href}>
                        <Button>{action.label}</Button>
                    </Link>
                )
            )}
        </div>
    );
}
