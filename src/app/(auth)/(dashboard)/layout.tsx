import { ShoppingCart, User, Mail, LogOut, Home, Heart } from "lucide-react";
import Link from "next/link";

const MyPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="pt-8 md:pt-16 pb-16 md:pb-24 bg-warm-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-72 lg:w-80">
            <div className="relative bg-warm-white p-6 md:sticky md:top-8">
              {/* Border frame */}
              <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-rose-gold/40" />
              <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-rose-gold/40" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-rose-gold/40" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-rose-gold/40" />

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
                <h2 className="font-primary text-xl text-charcoal">Oma tili</h2>
              </div>

              {/* Divider */}
              <div className="mb-6 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />

              <nav className="space-y-1">
                <Link
                  href="/mypage"
                  className="group flex items-center gap-3 px-4 py-3 font-secondary text-sm text-charcoal/70 hover:text-charcoal transition-all duration-300 hover:bg-cream/50 border-l-2 border-transparent hover:border-rose-gold/60"
                >
                  <Home className="w-4 h-4 transition-colors group-hover:text-rose-gold" />
                  <span>Yleiskatsaus</span>
                </Link>
                <Link
                  href="/myorders"
                  className="group flex items-center gap-3 px-4 py-3 font-secondary text-sm text-charcoal/70 hover:text-charcoal transition-all duration-300 hover:bg-cream/50 border-l-2 border-transparent hover:border-rose-gold/60"
                >
                  <ShoppingCart className="w-4 h-4 transition-colors group-hover:text-rose-gold" />
                  <span>Tilaukset</span>
                </Link>
                <Link
                  href="/myinfo"
                  className="group flex items-center gap-3 px-4 py-3 font-secondary text-sm text-charcoal/70 hover:text-charcoal transition-all duration-300 hover:bg-cream/50 border-l-2 border-transparent hover:border-rose-gold/60"
                >
                  <User className="w-4 h-4 transition-colors group-hover:text-rose-gold" />
                  <span>Omat tiedot</span>
                </Link>
                <Link
                  href="/mywishlist"
                  className="group flex items-center gap-3 px-4 py-3 font-secondary text-sm text-charcoal/70 hover:text-charcoal transition-all duration-300 hover:bg-cream/50 border-l-2 border-transparent hover:border-rose-gold/60"
                >
                  <Heart className="w-4 h-4 transition-colors group-hover:text-rose-gold" />
                  <span>Toivelista</span>
                </Link>
              </nav>

              {/* Divider */}
              <div className="my-6 h-[1px] bg-gradient-to-r from-rose-gold/30 to-transparent" />

              <Link
                href="/login"
                className="group flex items-center gap-3 px-4 py-3 font-secondary text-sm text-charcoal/50 hover:text-deep-burgundy transition-all duration-300 hover:bg-deep-burgundy/5 border-l-2 border-transparent hover:border-deep-burgundy/60"
              >
                <LogOut className="w-4 h-4 transition-colors group-hover:text-deep-burgundy" />
                <span>Kirjaudu ulos</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </section>
  );
};

export default MyPageLayout;
