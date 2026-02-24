"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { X, Upload, ImagePlus } from "lucide-react";

// Define strict types for Cloudinary result
interface CloudinaryResult {
    info: {
        secure_url: string;
        [key: string]: unknown;
    };
    event: string;
}

const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    sku: z.string().min(3, "SKU is required"),
    price: z.number().min(0.01, "Price must be greater than 0"),
    originalPrice: z.number().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    short_description: z.string().max(160, "Short description must be under 160 characters").optional(),
    concentration_type: z.enum(["Attar", "Parfum", "EDP", "EDT", "EDC"]),
    gender: z.enum(["men", "women", "unisex"]),
    top_notes: z.string().optional(),
    heart_notes: z.string().optional(),
    base_notes: z.string().optional(),
    featured_image: z.string().optional(),
    images: z.array(z.string()),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("basic");
    const [isLoading, setIsLoading] = useState(false);

    const defaultValues: ProductFormValues = initialData ? {
        name: initialData.name || "",
        sku: initialData.sku || "",
        price: typeof initialData.price === 'number' ? initialData.price : parseFloat(initialData.price) || 0,
        originalPrice: initialData.originalPrice ? (typeof initialData.originalPrice === 'number' ? initialData.originalPrice : parseFloat(initialData.originalPrice)) : undefined,
        description: initialData.description || "",
        short_description: initialData.short_description || "",
        concentration_type: initialData.concentration_type || "EDP",
        gender: initialData.gender || "unisex",
        top_notes: initialData.notes?.top?.join(", ") || "",
        heart_notes: initialData.notes?.heart?.join(", ") || "",
        base_notes: initialData.notes?.base?.join(", ") || "",
        featured_image: initialData.featured_image || "",
        images: Array.isArray(initialData.images) ? initialData.images : [],
    } : {
        name: "",
        sku: "",
        price: 0,
        originalPrice: undefined,
        description: "",
        short_description: "",
        concentration_type: "EDP",
        gender: "unisex",
        top_notes: "",
        heart_notes: "",
        base_notes: "",
        featured_image: "",
        images: [],
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues,
    });

    async function onSubmit(data: ProductFormValues) {
        setIsLoading(true);
        try {
            // Transform notes from comma-separated string to arrays
            const formattedData = {
                ...data,
                notes: {
                    top: data.top_notes?.split(",").map(n => n.trim()).filter(Boolean) || [],
                    heart: data.heart_notes?.split(",").map(n => n.trim()).filter(Boolean) || [],
                    base: data.base_notes?.split(",").map(n => n.trim()).filter(Boolean) || [],
                }
            };

            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const method = initialData ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${initialData ? "update" : "create"} product`);
            }

            toast.success(`Product ${initialData ? "updated" : "created"} successfully!`);
            router.push("/admin/products");
            router.refresh();
        } catch (error) {
            console.error("Submission error:", error);
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            {(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) && (
                <div className="p-4 mb-6 mx-auto max-w-3xl bg-destructive/15 text-destructive border border-destructive/20 rounded-md">
                    <p className="font-bold">Configuration Error</p>
                    <p className="text-sm">
                        Cloudinary environment variables are missing. Image upload will not work.
                        Please check your <code>.env.local</code> file and restart the server.
                    </p>
                    <pre className="mt-2 p-2 bg-background rounded text-xs select-all">
                        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Configured' : 'Missing'}
                        {"\n"}
                        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? 'Configured' : 'Missing'}
                    </pre>
                </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error("Form Validation Errors:", errors);
                toast.error("Please check the form for errors. " + Object.keys(errors).join(", ") + " are required.");
            })}>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="fragrance">Fragrance Details</TabsTrigger>
                        <TabsTrigger value="variants">Variants</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                    </TabsList>

                    <div className="mt-6 space-y-8">
                        {/* BASIC INFO TAB */}
                        <TabsContent value="basic">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>
                                        Enter the core details of the product.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Name *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Midnight Oud" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="sku"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SKU *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. RUHEA-001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price (PKR) *</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="5000"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                            value={field.value || 0}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="originalPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Original Price (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="6000"
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                                            value={field.value || ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem className="space-y-2">
                                                <FormLabel>Description *</FormLabel>
                                                <FormControl>
                                                    <div className="h-64 pb-12">
                                                        <Textarea
                                                            className="h-full resize-none"
                                                            placeholder="Product description..."
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* FRAGRANCE TAB */}
                        <TabsContent value="fragrance">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Fragrance Profile</CardTitle>
                                    <CardDescription>
                                        Define the characteristics.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Gender</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="men">Men</SelectItem>
                                                            <SelectItem value="women">Women</SelectItem>
                                                            <SelectItem value="unisex">Unisex</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="concentration_type"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Concentration</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select concentration" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Parfum">Parfum</SelectItem>
                                                            <SelectItem value="EDP">Eau de Parfum (EDP)</SelectItem>
                                                            <SelectItem value="EDT">Eau de Toilette (EDT)</SelectItem>
                                                            <SelectItem value="EDC">Eau de Cologne (EDC)</SelectItem>
                                                            <SelectItem value="Attar">Attar</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Olfactory Pyramid (Comma separated)</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="top_notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Top Notes</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Citrus, Bergamot..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="heart_notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Heart Notes</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Rose, Jasmine..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="base_notes"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Base Notes</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Oud, Musk, Amber..." {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* OTHER TABS Placeholder */}
                        <TabsContent value="variants">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Variants</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">Default variant will be created automatically. Advanced variant management coming soon.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="media">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Media</CardTitle>
                                    <CardDescription>
                                        Upload product images. The first image will be the featured image.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="featured_image"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Featured Image</FormLabel>
                                                <FormControl>
                                                    <div className="flex flex-col gap-4">
                                                        {field.value ? (
                                                            <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                                <Image
                                                                    src={field.value}
                                                                    alt="Featured"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    className="absolute right-1 top-1 h-6 w-6 z-10"
                                                                    onClick={() => field.onChange("")}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex h-40 w-40 items-center justify-center rounded-md border border-dashed bg-muted/50">
                                                                <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <CldUploadWidget
                                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                            onSuccess={(result) => {
                                                                if (typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
                                                                    const secureUrl = (result.info as CloudinaryResult['info']).secure_url;
                                                                    field.onChange(secureUrl);
                                                                    toast.success("Image uploaded successfully");
                                                                }
                                                            }}
                                                        >
                                                            {({ open }) => (
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    onClick={() => open?.()}
                                                                >
                                                                    <Upload className="mr-2 h-4 w-4" />
                                                                    Upload Featured
                                                                </Button>
                                                            )}
                                                        </CldUploadWidget>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="images"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Gallery Images</FormLabel>
                                                <FormControl>
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            {(field.value || []).map((url, index) => (
                                                                <div key={url} className="relative h-32 w-32 overflow-hidden rounded-md border">
                                                                    <Image
                                                                        src={url}
                                                                        alt={`Gallery ${index}`}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute right-1 top-1 h-6 w-6 z-10"
                                                                        onClick={() => {
                                                                            const newImages = [...(field.value || [])];
                                                                            newImages.splice(index, 1);
                                                                            field.onChange(newImages);
                                                                        }}
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <CldUploadWidget
                                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                                            options={{
                                                                sources: ['local', 'url'],
                                                                multiple: true,
                                                            }}
                                                            onError={(err) => {
                                                                console.error("Cloudinary Error:", err);
                                                                toast.error("Upload failed. Check console for details.");
                                                            }}
                                                            onSuccess={(result) => {
                                                                if (typeof result.info === 'object' && result.info !== null && 'secure_url' in result.info) {
                                                                    const secureUrl = (result.info as CloudinaryResult['info']).secure_url;
                                                                    // Fix: Ensure we don't spread undefined
                                                                    const currentImages = Array.isArray(field.value) ? field.value : [];
                                                                    field.onChange([...currentImages, secureUrl]);
                                                                    toast.success("Gallery image uploaded");
                                                                }
                                                            }}
                                                        >
                                                            {({ open }) => (
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    onClick={() => open?.()}
                                                                >
                                                                    <Upload className="mr-2 h-4 w-4" />
                                                                    Upload Gallery Images
                                                                </Button>
                                                            )}
                                                        </CldUploadWidget>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Product"}
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </form >
        </Form >
    );
}
