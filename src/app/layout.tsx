import type { Metadata, Viewport } from "next";

import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { textPrimary, textSecondary } from "@/lib/fonts";
import StickyNavbar from "@/components/Navigation/StickyNavbar";
import { getStoreConfig, getSEOValue, SEO_FALLBACKS } from "@/lib/actions/storeConfigActions";
import OrganizationSchema from "@/components/StructuredData/OrganizationSchema";
import LocalBusinessSchema from "@/components/StructuredData/LocalBusinessSchema";
import { GOOGLE_VERIFICATION, SEO_ENABLED } from "@/app/utils/constants";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getStoreConfig();

    const title = getSEOValue(config.seo.seoTitle, config.store.name);
    const description = getSEOValue(config.seo.seoDescription, SEO_FALLBACKS.description);
    const domain = getSEOValue(config.seo.domain, SEO_FALLBACKS.domain);
    const ogImage = getSEOValue(config.seo.openGraphImageUrl, SEO_FALLBACKS.openGraphImage);
    const twitterImage = getSEOValue(config.seo.twitterImageUrl, SEO_FALLBACKS.twitterImage);

    return {
      metadataBase: new URL(domain),
      title: {
        default: title,
        template: `%s | ${config.store.name}`,
      },
      description,
      // Disable SEO indexing when SEO_ENABLED is false (for template/development)
      robots: SEO_ENABLED
        ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        : "noindex, nofollow",
      openGraph: {
        title,
        description,
        url: domain,
        siteName: config.store.name,
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "fi_FI",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [twitterImage],
      },
      ...(GOOGLE_VERIFICATION
        ? {
            verification: {
              google: GOOGLE_VERIFICATION,
            },
          }
        : {}),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);

    // Fallback metadata if API fails
    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
      title: SEO_FALLBACKS.title,
      description: SEO_FALLBACKS.description,
      robots: "noindex, nofollow",
    };
  }
}

// Separate viewport export (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFBF7" }, // warm-white
    { media: "(prefers-color-scheme: dark)", color: "#3B3939" }, // charcoal
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeConfig = await getStoreConfig();
  const campaigns = storeConfig.campaigns;

  return (
    <html
      lang="fi"
      suppressHydrationWarning
      className={`${textPrimary.variable} ${textSecondary.variable}`}
    >
      <head>
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>

      <body className="bg-warm-white">
        <StickyNavbar campaigns={campaigns}>
          <Navbar campaigns={campaigns} />
        </StickyNavbar>
        <main className="min-h-[75vh] max-w-[3500px]">{children}</main>
        <Footer />

        <Toaster />
      </body>
    </html>
  );
}
