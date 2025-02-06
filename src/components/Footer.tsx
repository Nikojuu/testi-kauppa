import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 py-12">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="https://ik.imagekit.io/putiikkipalvelu/tr:w-80,h-80/https:/dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iZ21jgtkpBdQ56DKGgHuI8cM2XEZmqPvzU1fn"
                alt="logo"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center md:items-start gap-6 flex-wrap justify-center">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tietosuojakäytäntö
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Maksu- ja toimitusehdot
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Yhteystiedot
            </Link>
          </nav>
        </div>

        <Separator className="my-4" />

        {/* Copyright */}
        <div className="py-6 text-center md:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Pupun korvat. Kaikki oikeudet
            pidätetään.
          </p>
        </div>
      </div>
    </footer>
  );
}
