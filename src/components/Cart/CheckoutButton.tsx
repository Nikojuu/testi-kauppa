import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export function CheckoutButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled size="lg" className="w-full mt-5">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Odota
        </Button>
      ) : (
        <Button
          type="submit"
          variant="gooeyLeft"
          size="lg"
          className="w-full mt-5"
        >
          Siirry maksamaan
        </Button>
      )}
    </>
  );
}
