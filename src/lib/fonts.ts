import { DM_Serif_Text, Recursive, Tangerine, Ubuntu } from "next/font/google";

export const textPrimary = Recursive({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: "variable",
});

// export const textPrimary = DM_Serif_Text({
//   subsets: ["latin"],
//   variable: "--font-primary",
//   display: "swap",
//   weight: "400",
// });

// export const textPrimary = Bodoni_Moda({
//   subsets: ["latin"],
//   variable: "--font-primary",
//   display: "swap",
//   weight: "400",
// });
// export const textPrimary = Cinzel({
//   weight: "400",
//   subsets: ["latin"],
//   variable: "--font-primary",
//   display: "swap",
// });

export const textSecondary = Ubuntu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-secondary",
  display: "swap",
});
