import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/session-provider";
import { generateMetadata, generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "RUHÉA | Scents & Fragrances",
    template: "%s | RUHÉA",
  },
  description: "Discover exquisite luxury fragrances and traditional attars at RUHÉA. Premium perfumes for men and women, crafted with the finest ingredients. Free shipping across Pakistan.",
  metadataBase: new URL("https://ruhea.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "/",
    title: "RUHÉA | Scents & Fragrances",
    description: "Discover exquisite luxury fragrances and traditional attars at RUHÉA. Premium perfumes for men and women, crafted with the finest ingredients. Free shipping across Pakistan.",
    siteName: "RUHÉA",
  },
};

import SmoothScroll from "@/components/ui/smooth-scroll";

/* ... imports ... */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden max-w-[100vw]">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-background text-foreground overflow-x-hidden w-full max-w-[100vw] relative`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              {/* Structured Data */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(generateOrganizationSchema()),
                }}
              />
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(generateWebsiteSchema()),
                }}
              />
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <WhatsAppButton />
              <Toaster />
            </Providers>
          </ThemeProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
