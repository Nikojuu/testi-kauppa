import Link from "next/link";
import Image from "next/image";
import { InstagramLogoIcon } from "@radix-ui/react-icons";
import { LOGO_URL, STORE_NAME } from "@/app/utils/constants";

export function Footer() {
  return (
    <footer className="relative bg-charcoal overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-gold/40 to-transparent" />

      {/* Corner accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-rose-gold/20 hidden sm:block" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-rose-gold/20 hidden sm:block" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-rose-gold/20 hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-rose-gold/20 hidden sm:block" />

      {/* Floating diamonds */}
      <div className="absolute top-1/4 left-[15%] w-2 h-2 bg-rose-gold/15 diamond-shape hidden lg:block" />
      <div className="absolute top-1/3 right-[20%] w-1.5 h-1.5 bg-champagne/20 diamond-shape hidden lg:block" />
      <div className="absolute bottom-1/4 left-[25%] w-1 h-1 bg-rose-gold/10 diamond-shape hidden lg:block" />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo & Brand Section */}
          <div className="flex flex-col items-center md:items-start gap-5">
            <Link href="/" className="group flex-shrink-0">
              <div className="relative">
                <Image
                  src={LOGO_URL}
                  alt={`${STORE_NAME} logo`}
                  width={80}
                  height={80}
                  className="w-16 h-16 md:w-20 md:h-20 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="text-warm-white/60 font-secondary text-sm text-center md:text-left max-w-xs leading-relaxed">
              Laadukkaat tuotteet ja moderni ostoskokemus.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xs tracking-[0.3em] uppercase font-secondary text-rose-gold mb-2">
              Tietoa
            </h3>
            <nav className="flex flex-col items-center gap-3">
              <Link
                href="/about"
                className="text-sm font-secondary text-warm-white/70 hover:text-rose-gold transition-colors duration-300"
              >
                Yhteystiedot
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm font-secondary text-warm-white/70 hover:text-rose-gold transition-colors duration-300"
              >
                Tietosuojakäytäntö
              </Link>
              <Link
                href="/terms"
                className="text-sm font-secondary text-warm-white/70 hover:text-rose-gold transition-colors duration-300"
              >
                Maksu- ja toimitusehdot
              </Link>
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h3 className="text-xs tracking-[0.3em] uppercase font-secondary text-rose-gold mb-2">
              Seuraa meitä
            </h3>
            <p className="text-warm-white/60 font-secondary text-sm text-center md:text-right mb-2">
              Löydä meidät myös somesta!
            </p>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group flex items-center gap-2 text-warm-white/70 hover:text-rose-gold transition-colors duration-300"
            >
              <InstagramLogoIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="text-sm font-secondary">@{STORE_NAME.toLowerCase().replace(/\s+/g, '_')}</span>
            </a>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-4 my-10">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-rose-gold/20" />
          <div className="w-1.5 h-1.5 bg-rose-gold/40 diamond-shape" />
          <div className="w-2 h-2 bg-champagne/30 diamond-shape" />
          <div className="w-1.5 h-1.5 bg-rose-gold/40 diamond-shape" />
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-rose-gold/20" />
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs font-secondary text-warm-white/70">
            © {new Date().getFullYear()} {STORE_NAME}. Kaikki oikeudet pidätetään.
          </p>
        </div>
      </div>
    </footer>
  );
}
