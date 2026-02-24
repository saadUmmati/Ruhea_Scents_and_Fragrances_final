"use client";

import { CheckoutForm, CheckoutFormData } from "@/components/checkout/checkout-form";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCartStore } from "@/lib/store/cart-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && items.length === 0) {
            router.push("/shop");
        }
    }, [isMounted, items, router]);

    if (!isMounted) {
        return null; // Or a loading spinner
    }

    const handleCheckout = async (data: CheckoutFormData) => {
        setIsSubmitting(true);
        try {
            // Step 1: Create order
            const orderResponse = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shipping_address: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                        email: data.email,
                        phone: data.phone,
                        address: data.address,
                        apartment: data.apartment,
                        city: data.city,
                        postal_code: data.postalCode,
                    },
                    items: items.map((item) => ({
                        productId: item.productId,
                        size: item.size,
                        quantity: item.quantity,
                    })),
                    payment_method: data.paymentMethod,
                }),
            });

            const orderResult = await orderResponse.json();

            if (!orderResponse.ok) {
                throw new Error(orderResult.error || "Failed to create order");
            }

            const orderId = orderResult.order_id;

            // Step 2: Handle payment based on method
            if (data.paymentMethod === "cod") {
                // COD - Direct success
                clearCart();
                toast.success("Order placed successfully!");
                router.push(`/checkout/success?order=${orderId}`);
            } else if (data.paymentMethod === "jazzcash") {
                // JazzCash - Initiate payment
                const paymentResponse = await fetch("/api/payment/jazzcash/initiate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                });

                const paymentData = await paymentResponse.json();

                if (!paymentResponse.ok) {
                    throw new Error(paymentData.error || "Failed to initiate payment");
                }

                // Clear cart before redirect
                clearCart();

                // Create and submit form to JazzCash
                const form = document.createElement("form");
                form.method = "POST";
                form.action = paymentData.postUrl;

                Object.keys(paymentData.formData).forEach((key) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = paymentData.formData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else if (data.paymentMethod === "easypaisa") {
                // EasyPaisa - Initiate payment
                const paymentResponse = await fetch("/api/payment/easypaisa/initiate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ orderId }),
                });

                const paymentData = await paymentResponse.json();

                if (!paymentResponse.ok) {
                    throw new Error(paymentData.error || "Failed to initiate payment");
                }

                // Clear cart before redirect
                clearCart();

                // Create and submit form to EasyPaisa
                const form = document.createElement("form");
                form.method = "POST";
                form.action = paymentData.postUrl;

                Object.keys(paymentData.requestData).forEach((key) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = paymentData.requestData[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            }
        } catch (error: any) {
            console.error("Checkout error:", error);
            toast.error(error.message || "Failed to place order");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <CheckoutForm onSubmit={handleCheckout} isSubmitting={isSubmitting} />
                </div>
                <div>
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}
