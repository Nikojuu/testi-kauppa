import { getUser } from "@/lib/actions/authActions";
import { redirect } from "next/navigation";

const MyPage = async () => {
  const { user } = await getUser();

  if (!user) {
    redirect("/login"); // Redirect to login if not authenticated
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Oma sivu</h2>
        <p className="text-muted-foreground">Hallitse tiliäsi ja tilauksiasi</p>
      </div>

      {user && (
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-medium mb-2">Tervetuloa takaisin!</h3>
          <p className="text-muted-foreground">
            Hei <span className="font-semibold">{user.firstName}</span>, voit
            hallita tiliäsi sivupalkista.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-medium">Tilaukset</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Näe tilaushistoriasi
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-medium">Omat tiedot</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Päivitä henkilötietojasi
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h4 className="font-medium">Uutiskirje</h4>
          <p className="text-sm text-muted-foreground mt-1">
            Hallitse tilauksiasi
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
