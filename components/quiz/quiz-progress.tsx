import { Progress } from "@/components/ui/progress";

interface QuizProgressProps {
    current: number;
    total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
    const percentage = (current / total) * 100;

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Question {current} of {total}</span>
                <span>{Math.round(percentage)}% Complete</span>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    );
}
