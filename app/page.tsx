import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCategories } from "@/components/home/featured-categories";
import { TodaysDeals } from "@/components/home/todays-deals";
import { BestSellers } from "@/components/home/best-sellers";
import { FeaturedCollections } from "@/components/home/featured-collections";
import { ScentFinderCTA } from "@/components/home/scent-finder-cta";
import { CulturalShowcase } from "@/components/home/cultural-showcase";
import { BrandStory } from "@/components/home/brand-story";
import { InstagramFeed } from "@/components/home/instagram-feed";
import { NewsletterSignup } from "@/components/home/newsletter-signup";

import { getProducts } from "@/lib/actions/product.actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch real products for homepage sections
  // Fetch "Best Sellers" (sorted by rating or random for variety)
  const { products: bestSellers } = await getProducts({ limit: "4", sort: "rating" });

  // Fetch "Today's Deals" (could be simply featured products or another sort)
  // Using 'price-asc' to simulate "deals" or just different products
  const { products: deals } = await getProducts({ limit: "6", sort: "name" });

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <FeaturedCategories />
      <TodaysDeals products={deals} />
      <BestSellers products={bestSellers} />
      <FeaturedCollections />
      <ScentFinderCTA />
      <CulturalShowcase />
      <BrandStory />
      <InstagramFeed />
      <NewsletterSignup />
    </main>
  );
}
