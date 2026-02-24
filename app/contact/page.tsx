"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Message sent successfully!");
                setFormData({ name: "", email: "", message: "" });
            } else {
                toast.error(data.error || "Failed to send message");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    return (
        <div className="container py-16">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-muted-foreground">
                        We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <Textarea
                                    id="message"
                                    placeholder="Your message..."
                                    rows={6}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button
                                className="w-full"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </Button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="font-serif text-2xl font-semibold mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <MapPin className="h-5 w-5 text-accent mt-1" />
                                    <div>
                                        <p className="font-medium">Address</p>
                                        <p className="text-muted-foreground">
                                            New City Phase 2, Commercial Avenue M40,<br />
                                            Motorway Wah Cantt
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone className="h-5 w-5 text-accent mt-1" />
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <a
                                            href="https://wa.me/+923101038060"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-accent transition-colors"
                                        >
                                            +92 310 1038060
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail className="h-5 w-5 text-accent mt-1" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">Ruheasnf@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-serif text-xl font-semibold mb-4">Business Hours</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p>Monday - Sunday: 10:00 AM - 10:00 PM</p>
                                <p>(7 Days a Week)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
