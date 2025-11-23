import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/Navigation/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { textPrimary, textSecondary } from "@/lib/fonts";
import StickyNavbar from "@/components/Navigation/StickyNavbar";
import { getCampaigns } from "./utils/campaignUtils";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "Pupun Korvat",
  description: "Käsintehtyjä koruja",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const campaigns = await getCampaigns();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${textPrimary.variable} ${textSecondary.variable}`}
    >
      <head />

      <body className="bg-[radial-gradient(1px_1px_at_1px_1px,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:20px_20px]">
        <StickyNavbar campaigns={campaigns}>
          <Navbar />
        </StickyNavbar>
        <main className="min-h-[75vh]  max-w-[3500px]">{children}</main>
        <Footer />

        <Toaster />
      </body>
    </html>
  );
}
