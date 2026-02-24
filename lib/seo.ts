import { Metadata } from "next";

export const siteConfig = {
    name: "RUHEA",
    title: "RUHEA | Luxury Fragrances & Attars in Pakistan",
    description:
        "Discover exquisite luxury fragrances and traditional attars at RUHEA. Premium perfumes for men and women, crafted with the finest ingredients. Free shipping across Pakistan on orders over PKR 5,000.",
    url: "https://ruhea.com",
    ogImage: "https://ruhea.com/og-image.jpg",
    keywords: [
        "luxury fragrances Pakistan",
        "premium perfumes",
        "attars",
        "men's cologne",
        "women's perfume",
        "RUHEA",
        "fragrance shop Pakistan",
        "Lahore perfumes",
        "online perfume store",
        "luxury scents",
        "oriental fragrances",
        "oudh perfumes",
    ],
    author: "RUHEA Scents & Fragrances",
    creator: "RUHEA",
    publisher: "RUHEA",
    contact: {
        email: "Ruheasnf@gmail.com",
        phone: "+92 310 1038060",
        address: "New City Phase 2, Commercial Avenue M40, Motorway Wah Cantt",
    },
    social: {
        facebook: "https://facebook.com/ruhea",
        instagram: "https://instagram.com/ruhea",
        twitter: "https://twitter.com/ruhea",
    },
};

export function generateMetadata({
    title,
    description,
    image,
    url,
    type = "website",
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    noIndex?: boolean;
}): Metadata {
    const metaTitle = title
        ? `${title} | ${siteConfig.name}`
        : siteConfig.title;
    const metaDescription = description || siteConfig.description;
    const metaImage = image || siteConfig.ogImage;
    const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: siteConfig.keywords,
        authors: [{ name: siteConfig.author }],
        creator: siteConfig.creator,
        publisher: siteConfig.publisher,
        robots: noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        alternates: {
            canonical: metaUrl,
        },
        openGraph: {
            type: type === "product" ? "website" : type,
            locale: "en_PK",
            url: metaUrl,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: "@ruhea",
        },
        verification: {
            google: "your-google-verification-code",
            yandex: "your-yandex-verification-code",
        },
        category: "E-commerce",
    };
}

// JSON-LD Structured Data Generators
export function generateOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/ruhea-logo.png`,
        description: siteConfig.description,
        contactPoint: {
            "@type": "ContactPoint",
            telephone: siteConfig.contact.phone,
            email: siteConfig.contact.email,
            contactType: "Customer Service",
            areaServed: "PK",
            availableLanguage: ["English", "Urdu"],
        },
        address: {
            "@type": "PostalAddress",
            streetAddress: "New City Phase 2, Commercial Avenue M40",
            addressLocality: "Wah Cantt",
            addressCountry: "PK",
        },
        sameAs: [
            siteConfig.social.facebook,
            siteConfig.social.instagram,
            siteConfig.social.twitter,
        ],
    };
}

export function generateProductSchema(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    brand?: string;
    sku?: string;
    rating?: number;
    reviewCount?: number;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image,
        brand: {
            "@type": "Brand",
            name: product.brand || siteConfig.name,
        },
        sku: product.sku,
        offers: {
            "@type": "Offer",
            url: `${siteConfig.url}/products/${product.sku}`,
            priceCurrency: product.currency || "PKR",
            price: product.price,
            availability: "https://schema.org/InStock",
            seller: {
                "@type": "Organization",
                name: siteConfig.name,
            },
        },
        aggregateRating: product.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: product.rating,
                reviewCount: product.reviewCount || 0,
            }
            : undefined,
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/shop?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}
