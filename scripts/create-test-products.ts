// Script to create 10 test products with images
import { loadEnvConfig } from '@next/env';

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function createTestProducts() {
    const products = [
        {
            name: "Golden Amber Luxury",
            sku: "TEST-001",
            price: 8500,
            originalPrice: 10000,
            description: "A luxurious blend of amber and gold notes, perfect for evening wear. This sophisticated fragrance combines warm amber with precious woods and a hint of vanilla.",
            short_description: "Luxurious amber fragrance with golden accents",
            concentration_type: "EDP",
            gender: "unisex",
            top_notes: "Bergamot, Saffron",
            heart_notes: "Amber, Rose",
            base_notes: "Vanilla, Sandalwood",
            featured_image: "/images/products/perfume_product_1_1767631524560.png",
            images: ["/images/products/perfume_product_1_1767631524560.png"]
        },
        {
            name: "Midnight Black Essence",
            sku: "TEST-002",
            price: 9200,
            originalPrice: 11000,
            description: "A mysterious and captivating fragrance with deep black notes. Modern and sophisticated, perfect for the contemporary gentleman.",
            short_description: "Modern black fragrance with mysterious depth",
            concentration_type: "EDP",
            gender: "men",
            top_notes: "Black Pepper, Cardamom",
            heart_notes: "Leather, Vetiver",
            base_notes: "Patchouli, Musk",
            featured_image: "/images/products/perfume_product_2_1767631567559.png",
            images: ["/images/products/perfume_product_2_1767631567559.png"]
        },
        {
            name: "Rose Crystal Elegance",
            sku: "TEST-003",
            price: 7800,
            originalPrice: 9500,
            description: "An elegant floral fragrance with crystal-clear rose notes. Delicate and feminine, perfect for daytime elegance.",
            short_description: "Elegant rose fragrance with crystal clarity",
            concentration_type: "EDP",
            gender: "women",
            top_notes: "Rose, Peony",
            heart_notes: "Jasmine, Lily",
            base_notes: "White Musk, Cedarwood",
            featured_image: "/images/products/perfume_product_3_1767631613469.png",
            images: ["/images/products/perfume_product_3_1767631613469.png"]
        },
        {
            name: "Natural Green Botanica",
            sku: "TEST-004",
            price: 6500,
            originalPrice: 8000,
            description: "A fresh botanical fragrance with natural green notes. Eco-friendly and organic, perfect for nature lovers.",
            short_description: "Fresh botanical fragrance with natural greens",
            concentration_type: "EDT",
            gender: "unisex",
            top_notes: "Green Tea, Mint",
            heart_notes: "Basil, Sage",
            base_notes: "Oakmoss, Vetiver",
            featured_image: "/images/products/perfume_product_4_1767631641410.png",
            images: ["/images/products/perfume_product_4_1767631641410.png"]
        },
        {
            name: "Vintage Ruby Prestige",
            sku: "TEST-005",
            price: 12500,
            originalPrice: 15000,
            description: "A prestigious vintage fragrance with deep ruby notes. Classic and timeless, perfect for special occasions.",
            short_description: "Vintage prestige fragrance with ruby depth",
            concentration_type: "Parfum",
            gender: "unisex",
            top_notes: "Bergamot, Cinnamon",
            heart_notes: "Rose, Oud",
            base_notes: "Amber, Tonka Bean",
            featured_image: "/images/products/perfume_product_5_1767631696065.png",
            images: ["/images/products/perfume_product_5_1767631696065.png"]
        },
        {
            name: "Copper Citrus Modern",
            sku: "TEST-006",
            price: 7200,
            originalPrice: 8500,
            description: "A modern citrus fragrance with copper accents. Fresh and contemporary, perfect for daily wear.",
            short_description: "Modern citrus fragrance with copper notes",
            concentration_type: "EDT",
            gender: "men",
            top_notes: "Orange, Lemon",
            heart_notes: "Ginger, Neroli",
            base_notes: "Cedarwood, Amber",
            featured_image: "/images/products/perfume_product_6_1767631765823.png",
            images: ["/images/products/perfume_product_6_1767631765823.png"]
        },
        {
            name: "Azure Ocean Breeze",
            sku: "TEST-007",
            price: 6800,
            originalPrice: 8200,
            description: "A refreshing aquatic fragrance inspired by ocean breezes. Clean and invigorating, perfect for summer days.",
            short_description: "Refreshing aquatic fragrance",
            concentration_type: "EDT",
            gender: "unisex",
            top_notes: "Sea Salt, Bergamot",
            heart_notes: "Marine Notes, Lavender",
            base_notes: "Driftwood, Musk",
            featured_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
            images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800"]
        },
        {
            name: "Velvet Noir Mystique",
            sku: "TEST-008",
            price: 9800,
            originalPrice: 11500,
            description: "A mysterious velvet fragrance with noir sophistication. Deep and sensual, perfect for evening allure.",
            short_description: "Mysterious velvet noir fragrance",
            concentration_type: "EDP",
            gender: "women",
            top_notes: "Black Currant, Pink Pepper",
            heart_notes: "Iris, Violet",
            base_notes: "Vanilla, Patchouli",
            featured_image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
            images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800"]
        },
        {
            name: "Spice Route Heritage",
            sku: "TEST-009",
            price: 10500,
            originalPrice: 12000,
            description: "An exotic spice fragrance inspired by ancient trade routes. Rich and complex, perfect for connoisseurs.",
            short_description: "Exotic spice heritage fragrance",
            concentration_type: "EDP",
            gender: "men",
            top_notes: "Cardamom, Nutmeg",
            heart_notes: "Saffron, Cinnamon",
            base_notes: "Oud, Sandalwood",
            featured_image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
            images: ["https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800"]
        },
        {
            name: "Blossom Garden Romance",
            sku: "TEST-010",
            price: 7500,
            originalPrice: 9000,
            description: "A romantic floral fragrance from a blooming garden. Sweet and delicate, perfect for romantic occasions.",
            short_description: "Romantic garden blossom fragrance",
            concentration_type: "EDP",
            gender: "women",
            top_notes: "Peach, Freesia",
            heart_notes: "Peony, Cherry Blossom",
            base_notes: "White Musk, Vanilla",
            featured_image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
            images: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800"]
        }
    ];

    console.log('Creating 10 test products...\n');

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`Creating product ${i + 1}/10: ${product.name}...`);

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (!response.ok) {
                const error = await response.json();
                console.error(`  ❌ Failed: ${error.error}`);
            } else {
                const result = await response.json();
                console.log(`  ✅ Created: ${result.product.name} (ID: ${result.product._id})`);
            }
        } catch (error) {
            console.error(`  ❌ Error: ${error}`);
        }
    }

    console.log('\n✨ Test products creation complete!');
}

createTestProducts().catch(console.error);
