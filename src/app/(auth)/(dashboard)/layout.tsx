import { ShoppingCart, User, Mail, LogOut, Home, Heart } from "lucide-react";
import Link from "next/link";

const MyPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="mt-24 md:mt-48 container mx-auto px-4">
      <div className="flex gap-8">
        {/* Simple Sidebar */}
        <aside className="hidden md:block w-64 space-y-2">
          <div className="bg-card border rounded-lg p-6">
            <h2 className="font-semibold text-lg mb-4">Oma tili</h2>
            <nav className="space-y-2">
              <Link
                href="/mypage"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Yleiskatsaus
              </Link>
              <Link
                href="/myorders"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Tilaukset
              </Link>
              <Link
                href="/myinfo"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <User className="w-4 h-4" />
                Omat tiedot
              </Link>
              <Link
                href="/mywishlist"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Heart className="w-4 h-4" />
                Toivelista
              </Link>
              <Link
                href="/newsletter"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                Uutiskirje
              </Link>
            </nav>
            <div className="border-t pt-4 mt-4">
              <Link
                href="/login"
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
                Kirjaudu ulos
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </section>
  );
};

export default MyPageLayout;
