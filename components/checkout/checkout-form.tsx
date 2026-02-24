"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^03\d{9}$/, "Please enter a valid Pakistani mobile number (e.g., 03001234567)"),
    address: z.string().min(5, "Address is required"),
    apartment: z.string().optional(),
    city: z.string().min(2, "City is required"),
    postalCode: z.string().min(4, "Postal code is required"),
    paymentMethod: z.enum(["cod", "jazzcash", "easypaisa"]),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
    onSubmit: (data: CheckoutFormData) => void;
    isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            apartment: "",
            city: "",
            postalCode: "",
            paymentMethod: "cod",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0300 1234567" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123 Main St" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apartment"
                            render={({ field }) => (
                                <FormItem className="col-span-1 md:col-span-2">
                                    <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apt 4B" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Karachi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="75500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Payment Method</h2>
                    <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-3"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors">
                                            <FormControl>
                                                <RadioGroupItem value="cod" />
                                            </FormControl>
                                            <div className="flex-1">
                                                <FormLabel className="font-semibold cursor-pointer">
                                                    Cash on Delivery (COD)
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Pay when you receive your order
                                                </p>
                                            </div>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors">
                                            <FormControl>
                                                <RadioGroupItem value="jazzcash" />
                                            </FormControl>
                                            <div className="flex-1">
                                                <FormLabel className="font-semibold cursor-pointer flex items-center gap-2">
                                                    <span className="text-[#FF6B00]">JazzCash</span>
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Pay securely with JazzCash Mobile Account
                                                </p>
                                            </div>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent transition-colors">
                                            <FormControl>
                                                <RadioGroupItem value="easypaisa" />
                                            </FormControl>
                                            <div className="flex-1">
                                                <FormLabel className="font-semibold cursor-pointer flex items-center gap-2">
                                                    <span className="text-[#00A859]">EasyPaisa</span>
                                                </FormLabel>
                                                <p className="text-sm text-muted-foreground">
                                                    Pay securely with EasyPaisa Mobile Account
                                                </p>
                                            </div>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
            </form>
        </Form>
    );
}
