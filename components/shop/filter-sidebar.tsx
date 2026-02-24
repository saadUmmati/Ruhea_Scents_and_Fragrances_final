"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const fragranceFamilies = [
    "Floral",
    "Woody",
    "Oriental",
    "Fresh",
    "Citrus",
    "Spicy",
    "Musk",
    "Oud",
];

const concentrations = [
    "Parfum",
    "EDP",
    "EDT",
    "Attar",
];

const genders = [
    { value: "men", label: "For Men" },
    { value: "women", label: "For Women" },
    { value: "unisex", label: "Unisex" },
];

export function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [priceRange, setPriceRange] = useState([0, 50000]);

    // Initialize price range from URL
    useEffect(() => {
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice || maxPrice) {
            setPriceRange([
                minPrice ? parseInt(minPrice) : 0,
                maxPrice ? parseInt(maxPrice) : 50000,
            ]);
        }
    }, []);

    const updateURL = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set("page", "1"); // Reset to page 1 when filtering
        router.push(`/shop?${params.toString()}`);
    };

    const toggleArrayParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const existing = params.getAll(key);

        if (existing.includes(value)) {
            // Remove this value
            params.delete(key);
            existing.filter(v => v !== value).forEach(v => params.append(key, v));
        } else {
            // Add this value
            params.append(key, value);
        }

        params.set("page", "1");
        router.push(`/shop?${params.toString()}`);
    };

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
        params.set("page", "1");
        router.push(`/shop?${params.toString()}`);
    };

    const clearAllFilters = () => {
        router.push("/shop");
        setPriceRange([0, 50000]);
    };

    const selectedFamilies = searchParams.getAll("fragranceFamily");
    const selectedGender = searchParams.get("gender");
    const selectedConcentration = searchParams.get("concentration");

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-serif font-bold text-lg mb-4">Filters</h3>
                <Button
                    variant="link"
                    className="h-auto p-2 text-muted-foreground hover:text-primary sm:p-0"
                    onClick={clearAllFilters}
                >
                    Clear all
                </Button>
            </div>

            <Separator />

            <Accordion type="multiple" defaultValue={["price", "family", "gender", "concentration"]} className="w-full">
                <AccordionItem value="price">
                    <AccordionTrigger className="font-serif">Price Range</AccordionTrigger>
                    <AccordionContent>
                        <div className="px-2 py-4 space-y-4">
                            <Slider
                                defaultValue={[0, 50000]}
                                max={50000}
                                step={500}
                                value={priceRange}
                                onValueChange={handlePriceChange}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span>Rs. {priceRange[0]}</span>
                                <span>Rs. {priceRange[1]}</span>
                            </div>
                            <Button
                                size="sm"
                                className="w-full"
                                onClick={applyPriceFilter}
                            >
                                Apply
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="gender">
                    <AccordionTrigger className="font-serif">Gender</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {genders.map((gender) => (
                                <div key={gender.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`gender-${gender.value}`}
                                        checked={selectedGender === gender.value}
                                        onCheckedChange={(checked) => {
                                            updateURL("gender", checked ? gender.value : null);
                                        }}
                                    />
                                    <Label htmlFor={`gender-${gender.value}`} className="text-sm font-normal cursor-pointer">
                                        {gender.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="family">
                    <AccordionTrigger className="font-serif">Fragrance Family</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {fragranceFamilies.map((family) => (
                                <div key={family} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`family-${family}`}
                                        checked={selectedFamilies.includes(family)}
                                        onCheckedChange={() => toggleArrayParam("fragranceFamily", family)}
                                    />
                                    <Label htmlFor={`family-${family}`} className="text-sm font-normal cursor-pointer">
                                        {family}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="concentration">
                    <AccordionTrigger className="font-serif">Concentration</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-2">
                            {concentrations.map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`type-${type}`}
                                        checked={selectedConcentration === type}
                                        onCheckedChange={(checked) => {
                                            updateURL("concentration", checked ? type : null);
                                        }}
                                    />
                                    <Label htmlFor={`type-${type}`} className="text-sm font-normal cursor-pointer">
                                        {type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
