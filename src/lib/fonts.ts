import { Cinzel_Decorative, Jost } from "next/font/google";

export const textPrimary = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: "400",
});

export const textSecondary = Jost({
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});
