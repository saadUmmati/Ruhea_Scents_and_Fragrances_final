"use client";

import { quizQuestions, QuizQuestion, QuizOption } from "@/lib/quiz/questions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
    question: QuizQuestion;
    value: string | string[];
    onChange: (value: string | string[]) => void;
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
    const handleSingleChange = (newValue: string) => {
        onChange(newValue);
    };

    const handleMultipleChange = (optionValue: string, checked: boolean) => {
        const currentValues = Array.isArray(value) ? value : [];
        if (checked) {
            onChange([...currentValues, optionValue]);
        } else {
            onChange(currentValues.filter((v) => v !== optionValue));
        }
    };

    return (
        <Card className="border-2">
            <CardContent className="pt-6">
                <h3 className="text-xl font-serif font-bold mb-6">{question.question}</h3>

                {question.type === "single" && (
                    <RadioGroup
                        value={value as string}
                        onValueChange={handleSingleChange}
                        className="space-y-3"
                    >
                        {question.options?.map((option) => (
                            <div
                                key={option.value}
                                className={cn(
                                    "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                    value === option.value
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200 hover:border-primary/50"
                                )}
                                onClick={() => handleSingleChange(option.value)}
                            >
                                <RadioGroupItem value={option.value} id={option.value} />
                                <Label
                                    htmlFor={option.value}
                                    className="flex-1 cursor-pointer font-medium"
                                >
                                    {option.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                )}

                {question.type === "multiple" && (
                    <div className="space-y-3">
                        {question.options?.map((option) => {
                            const isChecked = Array.isArray(value) && value.includes(option.value);
                            return (
                                <div
                                    key={option.value}
                                    className={cn(
                                        "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                                        isChecked
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 hover:border-primary/50"
                                    )}
                                    onClick={() => handleMultipleChange(option.value, !isChecked)}
                                >
                                    <Checkbox
                                        id={option.value}
                                        checked={isChecked}
                                        onCheckedChange={(checked) =>
                                            handleMultipleChange(option.value, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={option.value}
                                        className="flex-1 cursor-pointer font-medium"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
