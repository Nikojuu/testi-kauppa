import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const MyPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login"); // Redirect to login if not authenticated
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 bg-rose-gold/60 diamond-shape" />
          <h2 className="text-2xl md:text-3xl font-primary text-charcoal">Oma sivu</h2>
        </div>
        <p className="font-secondary text-charcoal/60 ml-5">Hallitse tiliäsi ja tilauksiasi</p>
      </div>

      {user && (
        <div className="relative bg-warm-white p-6 md:p-8">
          {/* Border frame */}
          <div className="absolute inset-0 border border-rose-gold/15 pointer-events-none" />

          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-rose-gold/30" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-rose-gold/30" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-rose-gold/30" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-rose-gold/30" />

          <h3 className="font-primary text-xl text-charcoal mb-3">Tervetuloa takaisin!</h3>
          <p className="font-secondary text-charcoal/70">
            Hei <span className="font-medium text-charcoal">{user.firstName}</span>, voit
            hallita tiliäsi sivupalkista.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="group relative bg-warm-white p-6 transition-all duration-300 hover:shadow-md">
          <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none group-hover:border-rose-gold/25 transition-colors" />
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

          <h4 className="font-primary text-lg text-charcoal mb-2">Tilaukset</h4>
          <p className="text-sm font-secondary text-charcoal/60">
            Näe tilaushistoriasi
          </p>
        </div>

        <div className="group relative bg-warm-white p-6 transition-all duration-300 hover:shadow-md">
          <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none group-hover:border-rose-gold/25 transition-colors" />
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

          <h4 className="font-primary text-lg text-charcoal mb-2">Omat tiedot</h4>
          <p className="text-sm font-secondary text-charcoal/60">
            Päivitä henkilötietojasi
          </p>
        </div>

        <div className="group relative bg-warm-white p-6 transition-all duration-300 hover:shadow-md">
          <div className="absolute inset-0 border border-rose-gold/10 pointer-events-none group-hover:border-rose-gold/25 transition-colors" />
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-rose-gold/20 group-hover:w-6 group-hover:h-6 transition-all duration-300" />

          <h4 className="font-primary text-lg text-charcoal mb-2">Uutiskirje</h4>
          <p className="text-sm font-secondary text-charcoal/60">
            Hallitse tilauksiasi
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
