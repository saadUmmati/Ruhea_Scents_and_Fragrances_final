const products = [
    {
        name: "Oud Noir",
        slug: "oud-noir",
        brand: "RUHÉA",
        sku: "OUD-NOIR-001",
        description: "A sophisticated blend of rare oud wood and dark spices. Deep, mysterious, and intensely masculine.",
        short_description: "Rare oud wood with dark spices",
        price: 15000,
        featured_image: "/images/products/oud-noir.png",
        images: ["/images/products/oud-noir.png"],
        fragrance_family: ["woody"],
        concentration_type: "EDP",
        gender: "men",
        stock: 50,
        is_active: true,
        is_featured: true,
        status: "published",
        featured: true,
        rating_average: 4.8,
        rating_count: 24,
        variants: [
            {
                size: "50ml",
                price: 15000,
                stock: 50,
                sku: "OUD-NOIR-50ML"
            }
        ]
    },
    {
        name: "Rose Mystique",
        slug: "rose-mystique",
        brand: "RUHÉA",
        sku: "ROSE-MYST-001",
        description: "An enchanting rose fragrance with hints of jasmine and vanilla. Romantic, elegant, and timeless.",
        short_description: "Enchanting rose with jasmine and vanilla",
        price: 12000,
        featured_image: "/images/products/rose-mystique.png",
        images: ["/images/products/rose-mystique.png"],
        fragrance_family: ["floral"],
        concentration_type: "EDP",
        gender: "women",
        stock: 75,
        is_active: true,
        is_featured: true,
        status: "published",
        featured: true,
        rating_average: 4.9,
        rating_count: 38,
        variants: [
            {
                size: "50ml",
                price: 12000,
                stock: 75,
                sku: "ROSE-MYST-50ML"
            }
        ]
    },
    {
        name: "Amber Royale",
        slug: "amber-royale",
        brand: "RUHÉA",
        sku: "AMBER-ROY-001",
        description: "A regal composition of warm amber, sandalwood, and precious spices. Luxurious and commanding.",
        short_description: "Warm amber with sandalwood and spices",
        price: 18000,
        featured_image: "/images/products/amber-royale.png",
        images: ["/images/products/amber-royale.png"],
        fragrance_family: ["oriental"],
        concentration_type: "Parfum",
        gender: "unisex",
        stock: 40,
        is_active: true,
        is_featured: true,
        status: "published",
        featured: true,
        rating_average: 5.0,
        rating_count: 15,
        variants: [
            {
                size: "50ml",
                price: 18000,
                stock: 40,
                sku: "AMBER-ROY-50ML"
            }
        ]
    },
    {
        name: "White Musk",
        slug: "white-musk",
        brand: "RUHÉA",
        sku: "WHITE-MUSK-001",
        description: "A clean, fresh musk with subtle floral undertones. Pure, modern, and effortlessly sophisticated.",
        short_description: "Clean fresh musk with floral notes",
        price: 10000,
        featured_image: "/images/products/white-musk.png",
        images: ["/images/products/white-musk.png"],
        fragrance_family: ["fresh"],
        concentration_type: "EDT",
        gender: "unisex",
        stock: 100,
        is_active: true,
        is_featured: false,
        status: "published",
        featured: false,
        rating_average: 4.6,
        rating_count: 52,
        variants: [
            {
                size: "50ml",
                price: 10000,
                stock: 100,
                sku: "WHITE-MUSK-50ML"
            }
        ]
    },
    {
        name: "Velvet Saffron",
        slug: "velvet-saffron",
        brand: "RUHÉA",
        sku: "VELVET-SAFF-001",
        description: "An opulent blend of saffron, leather, and dark florals. Rich, sensual, and unforgettable.",
        short_description: "Opulent saffron with leather and florals",
        price: 16000,
        featured_image: "/images/products/velvet-saffron.png",
        images: ["/images/products/velvet-saffron.png"],
        fragrance_family: ["oriental"],
        concentration_type: "EDP",
        gender: "unisex",
        stock: 60,
        is_active: true,
        is_featured: true,
        status: "published",
        featured: true,
        rating_average: 4.7,
        rating_count: 19,
        variants: [
            {
                size: "50ml",
                price: 16000,
                stock: 60,
                sku: "VELVET-SAFF-50ML"
            }
        ]
    }
];

async function createProducts() {
    console.log('Starting product creation...\n');

    for (const product of products) {
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`✅ Created: ${product.name} (ID: ${data._id})`);
            } else {
                const error = await response.text();
                console.log(`❌ Failed to create ${product.name}: ${error}`);
            }
        } catch (error) {
            console.log(`❌ Error creating ${product.name}:`, error.message);
        }
    }

    console.log('\n✨ Product creation complete!');
}

createProducts();
