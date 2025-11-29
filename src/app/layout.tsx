import type { Metadata, Viewport } from "next";

import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { textPrimary, textSecondary } from "@/lib/fonts";
import StickyNavbar from "@/components/Navigation/StickyNavbar";
import { getStoreConfig } from "@/lib/actions/storeConfigActions";
import { StoreConfigProvider } from "@/components/StoreConfigProvider";
import OrganizationSchema from "@/components/StructuredData/OrganizationSchema";
import LocalBusinessSchema from "@/components/StructuredData/LocalBusinessSchema";
import {
  STORE_NAME,
  STORE_DESCRIPTION,
  GOOGLE_VERIFICATION,
  SEO_ENABLED,
} from "@/app/utils/constants";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: STORE_NAME,
  description: STORE_DESCRIPTION,
  // Disable SEO indexing when SEO_ENABLED is false (for template/development)
  robots: SEO_ENABLED
    ? "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    : "noindex, nofollow",
  ...(GOOGLE_VERIFICATION ? {
    verification: {
      google: GOOGLE_VERIFICATION,
    },
  } : {}),
};

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
        <StoreConfigProvider config={storeConfig}>
          <StickyNavbar campaigns={campaigns}>
            <Navbar />
          </StickyNavbar>
          <main className="min-h-[75vh] max-w-[3500px]">{children}</main>
          <Footer />

          <Toaster />
        </StoreConfigProvider>
      </body>
    </html>
  );
}
