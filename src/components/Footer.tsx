import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background ">
      <div className="mx-auto max-w-screen-2xl flex flex-col md:flex-row items-center justify-between py-8">
        <div className="mb-4 md:mb-0">
          <Link href="/" className="text-2xl font-bold">
            Logo
          </Link>
        </div>
        <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
          <Link href="/privacy-policy" className="text-sm hover:underline">
            Tietosuojakäytäntö
          </Link>
          <Link href="/terms" className="text-sm hover:underline">
            Maksu- ja toimitusehdot
          </Link>
          <Link href="/about" className="text-sm hover:underline">
            Yhteystiedot
          </Link>
        </nav>
        <div className="flex space-x-4">
          <Link
            href="https://facebook.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Facebook className="h-5 w-5" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            href="https://instagram.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://twitter.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
      <Separator />
      <div className="py-6 text-center text-sm">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
}
