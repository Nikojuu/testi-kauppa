import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function CheckoutButton({
  disabled,
}: {
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <button
          disabled
          className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal/50 text-warm-white font-secondary text-sm tracking-wider uppercase cursor-not-allowed"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Odota</span>
        </button>
      ) : (
        <button
          type="submit"
          disabled={disabled}
          className="group inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-warm-white font-secondary text-sm tracking-wider uppercase transition-all duration-300 hover:bg-rose-gold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Siirry maksamaan</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      )}
    </>
  );
}
