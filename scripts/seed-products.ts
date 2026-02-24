import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import connectToDatabase from "../lib/db/mongoose";
import Product from "../lib/db/models/product.model";

const products = [
    {
        name: "Royal Oudh Intense",
        slug: "royal-oudh-intense",
        brand: "RUHEA",
        sku: "RO-INTENSE",
        description: "A luxurious blend of rare oudh and precious woods, Royal Oudh Intense embodies sophistication and power. This masterpiece opens with saffron and bergamot, revealing a heart of pure oudh and Damascus rose, settling into a base of amber and musk. Perfect for the modern gentleman who appreciates timeless elegance.",
        short_description: "A luxurious blend of rare oudh and precious woods.",
        price: 15000,
        originalPrice: 18000,
        concentration_type: "EDP",
        gender: "men",
        fragrance_family: ["Woody", "Oriental"],
        notes: {
            top: ["Bergamot", "Saffron", "Cardamom"],
            heart: ["Oudh", "Rose", "Jasmine"],
            base: ["Amber", "Musk", "Sandalwood"],
        },
        longevity: "8+h",
        sillage: "heavy",
        best_season: ["winter", "all"],
        occasions: ["evening", "special"],
        variants: [
            { size: "50ml", price: 15000, stock: 25, sku: "RO-50" },
            { size: "100ml", price: 25000, stock: 15, sku: "RO-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        images: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        ],
        rating_average: 4.8,
        rating_count: 124,
        featured: true,
        status: "published"
    },
    {
        name: "Velvet Rose Noir",
        slug: "velvet-rose-noir",
        brand: "RUHEA",
        sku: "VR-NOIR",
        description: "A dark, seductive rose fragrance that defies convention. Velvet Rose Noir combines the richness of Bulgarian rose with smoky incense and leather, creating an intoxicating scent that lingers in memory. Bold yet refined, mysterious yet inviting.",
        short_description: "A dark, seductive rose fragrance with smoky incense.",
        price: 12000,
        originalPrice: 14000,
        concentration_type: "EDP",
        gender: "unisex",
        fragrance_family: ["Floral", "Oriental"],
        notes: {
            top: ["Black Pepper", "Pink Pepper"],
            heart: ["Bulgarian Rose", "Violet", "Incense"],
            base: ["Leather", "Patchouli", "Vanilla"],
        },
        longevity: "6-8h",
        sillage: "moderate",
        best_season: ["fall", "winter"],
        occasions: ["evening", "date"],
        variants: [
            { size: "50ml", price: 12000, stock: 30, sku: "VRN-50" },
            { size: "100ml", price: 20000, stock: 20, sku: "VRN-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
        images: [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
            "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
        ],
        rating_average: 4.6,
        rating_count: 89,
        featured: true,
        status: "published"
    },
    {
        name: "Amber Mystique",
        slug: "amber-mystique",
        brand: "RUHEA",
        sku: "AM-MYSTIQUE",
        description: "Warm, enveloping, and utterly captivating. Amber Mystique weaves together golden amber, rich vanilla, and exotic spices to create a fragrance that feels like liquid gold. A timeless classic that exudes confidence and warmth.",
        short_description: "Warm amber, rich vanilla, and exotic spices.",
        price: 10000,
        concentration_type: "EDP",
        gender: "men",
        fragrance_family: ["Oriental", "Amber"],
        notes: {
            top: ["Cinnamon", "Orange"],
            heart: ["Amber", "Labdanum", "Benzoin"],
            base: ["Vanilla", "Tonka Bean", "Myrrh"],
        },
        longevity: "8+h",
        sillage: "moderate",
        best_season: ["fall", "winter", "all"],
        occasions: ["daily", "office"],
        variants: [
            { size: "50ml", price: 10000, stock: 40, sku: "AM-50" },
            { size: "100ml", price: 17000, stock: 25, sku: "AM-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
        images: [
            "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        ],
        rating_average: 4.7,
        rating_count: 156,
        status: "published"
    },
    {
        name: "Sandalwood Essence",
        slug: "sandalwood-essence",
        brand: "RUHEA",
        sku: "SW-ESSENCE",
        description: "Pure, meditative, and grounding. Sandalwood Essence celebrates the beauty of natural sandalwood with subtle hints of cedar and vetiver. A minimalist masterpiece for those who appreciate understated elegance and natural sophistication.",
        short_description: "Pure sandalwood with subtle hints of cedar and vetiver.",
        price: 9000,
        concentration_type: "EDT",
        gender: "men",
        fragrance_family: ["Woody"],
        notes: {
            top: ["Bergamot", "Lemon"],
            heart: ["Sandalwood", "Cedar", "Iris"],
            base: ["Vetiver", "Musk", "Amber"],
        },
        longevity: "4-6h",
        sillage: "moderate",
        best_season: ["spring", "summer", "all"],
        occasions: ["daily", "casual"],
        variants: [
            { size: "50ml", price: 9000, stock: 35, sku: "SE-50" },
            { size: "100ml", price: 15000, stock: 20, sku: "SE-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
        images: [
            "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        ],
        rating_average: 4.5,
        rating_count: 78,
        status: "published"
    },
    {
        name: "Citrus Breeze",
        slug: "citrus-breeze",
        brand: "RUHEA",
        sku: "CT-BREEZE",
        description: "Fresh, vibrant, and invigorating. Citrus Breeze captures the essence of Mediterranean summers with its blend of bergamot, lemon, and neroli. Light yet memorable, it's the perfect companion for warm days and new beginnings.",
        short_description: "Fresh bergamot, lemon, and neroli blend.",
        price: 7500,
        concentration_type: "EDT",
        gender: "men",
        fragrance_family: ["Citrus", "Fresh"],
        notes: {
            top: ["Bergamot", "Lemon", "Grapefruit"],
            heart: ["Neroli", "Lavender", "Green Tea"],
            base: ["White Musk", "Cedarwood"],
        },
        longevity: "2-4h",
        sillage: "soft",
        best_season: ["spring", "summer"],
        occasions: ["daily", "sport"],
        variants: [
            { size: "50ml", price: 7500, stock: 50, sku: "CB-50" },
            { size: "100ml", price: 12000, stock: 30, sku: "CB-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        images: [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
        ],
        rating_average: 4.4,
        rating_count: 92,
        status: "published"
    },
    {
        name: "Leather & Spice",
        slug: "leather-and-spice",
        brand: "RUHEA",
        sku: "LS-SPICE",
        description: "Bold, masculine, and unapologetically powerful. Leather & Spice combines rich leather with black pepper and cardamom, creating a fragrance that commands attention. For the man who leads with confidence.",
        short_description: "Bold leather with black pepper and cardamom.",
        price: 13000,
        concentration_type: "EDP",
        gender: "men",
        fragrance_family: ["Leather", "Spicy"],
        notes: {
            top: ["Black Pepper", "Cardamom", "Ginger"],
            heart: ["Leather", "Tobacco", "Clove"],
            base: ["Vetiver", "Patchouli", "Amber"],
        },
        longevity: "8+h",
        sillage: "heavy",
        best_season: ["fall", "winter"],
        occasions: ["evening", "business"],
        variants: [
            { size: "50ml", price: 13000, stock: 20, sku: "LS-50" },
            { size: "100ml", price: 22000, stock: 12, sku: "LS-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
        images: [
            "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
            "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
        ],
        rating_average: 4.9,
        rating_count: 145,
        featured: true,
        status: "published"
    },
    {
        name: "Ocean Mist",
        slug: "ocean-mist",
        brand: "RUHEA",
        sku: "OM-MIST",
        description: "Crisp, aquatic, and refreshingly modern. Ocean Mist evokes the feeling of sea spray and coastal winds with its blend of marine notes, mint, and driftwood. Clean, contemporary, and effortlessly cool.",
        short_description: "Crisp marine notes with mint and driftwood.",
        price: 8500,
        concentration_type: "EDT",
        gender: "men",
        fragrance_family: ["Aquatic", "Fresh"],
        notes: {
            top: ["Sea Salt", "Mint", "Bergamot"],
            heart: ["Marine Notes", "Lavender", "Geranium"],
            base: ["Driftwood", "Ambergris", "Musk"],
        },
        longevity: "4-6h",
        sillage: "moderate",
        best_season: ["spring", "summer"],
        occasions: ["daily", "casual"],
        variants: [
            { size: "50ml", price: 8500, stock: 45, sku: "OM-50" },
            { size: "100ml", price: 14000, stock: 28, sku: "OM-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
        images: [
            "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        ],
        rating_average: 4.3,
        rating_count: 67,
        status: "published"
    },
    {
        name: "Black Pepper & Vetiver",
        slug: "black-pepper-vetiver",
        brand: "RUHEA",
        sku: "BP-VETIVER",
        description: "Sharp, earthy, and intensely sophisticated. This fragrance pairs the spicy kick of black pepper with the smoky depth of vetiver, creating a scent that's both invigorating and grounding. Modern masculinity redefined.",
        short_description: "Spicy black pepper with smoky vetiver.",
        price: 11000,
        concentration_type: "EDP",
        gender: "men",
        fragrance_family: ["Woody", "Spicy"],
        notes: {
            top: ["Black Pepper", "Pink Pepper", "Ginger"],
            heart: ["Vetiver", "Geranium", "Elemi"],
            base: ["Cedarwood", "Patchouli", "Oakmoss"],
        },
        longevity: "8+h",
        sillage: "heavy",
        best_season: ["all"],
        occasions: ["daily", "office"],
        variants: [
            { size: "50ml", price: 11000, stock: 30, sku: "BPV-50" },
            { size: "100ml", price: 18000, stock: 18, sku: "BPV-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
        images: [
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800",
            "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=800",
        ],
        rating_average: 4.6,
        rating_count: 103,
        status: "published"
    },
    {
        name: "Tobacco Vanilla",
        slug: "tobacco-vanilla",
        brand: "RUHEA",
        sku: "TV-VANILLA",
        description: "Warm, sweet, and irresistibly comforting. Tobacco Vanilla blends rich tobacco leaves with creamy vanilla and tonka bean, creating a gourmand fragrance that's both sophisticated and inviting. A modern classic.",
        short_description: "Rich tobacco leaves with creamy vanilla.",
        price: 12500,
        concentration_type: "EDP",
        gender: "unisex",
        fragrance_family: ["Oriental", "Gourmand"],
        notes: {
            top: ["Tobacco Leaf", "Spices"],
            heart: ["Vanilla", "Cacao", "Tonka Bean"],
            base: ["Dried Fruits", "Wood Notes"],
        },
        longevity: "8+h",
        sillage: "heavy",
        best_season: ["fall", "winter"],
        occasions: ["evening", "date"],
        variants: [
            { size: "50ml", price: 12500, stock: 25, sku: "TV-50" },
            { size: "100ml", price: 21000, stock: 15, sku: "TV-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
        images: [
            "https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=800",
            "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=800",
        ],
        rating_average: 4.8,
        rating_count: 187,
        status: "published"
    },
    {
        name: "Fresh Bergamot",
        slug: "fresh-bergamot",
        brand: "RUHEA",
        sku: "FB-BERGAMOT",
        description: "Bright, elegant, and timelessly refined. Fresh Bergamot showcases the finest Italian bergamot with subtle hints of white tea and musk. A versatile fragrance that transitions seamlessly from day to night.",
        short_description: "Bright Italian bergamot with white tea.",
        price: 8000,
        concentration_type: "EDT",
        gender: "men",
        fragrance_family: ["Citrus", "Fresh"],
        notes: {
            top: ["Bergamot", "Lemon", "Petitgrain"],
            heart: ["White Tea", "Jasmine", "Neroli"],
            base: ["White Musk", "Amber"],
        },
        longevity: "4-6h",
        sillage: "moderate",
        best_season: ["spring", "summer", "all"],
        occasions: ["daily", "office"],
        variants: [
            { size: "50ml", price: 8000, stock: 40, sku: "FB-50" },
            { size: "100ml", price: 13000, stock: 25, sku: "FB-100" },
        ],
        featured_image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
        images: [
            "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800",
            "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=800",
        ],
        rating_average: 4.4,
        rating_count: 95,
        status: "published"
    },
];

async function seedProducts() {
    try {
        console.log("Connecting to database...");
        await connectToDatabase();

        console.log("Clearing existing products...");
        await Product.deleteMany({});

        console.log("Seeding products...");
        const createdProducts = await Product.insertMany(products);

        console.log(`✅ Successfully seeded ${createdProducts.length} products!`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding products:", error);
        process.exit(1);
    }
}

seedProducts();
