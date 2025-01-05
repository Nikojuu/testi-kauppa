"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface GlassySquareButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const GlassySquareButton = React.forwardRef<
  HTMLButtonElement,
  GlassySquareButtonProps
>(({ className, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "relative overflow-hidden px-2 sm:px-6  py-1 sm:py-3 group bg-white bg-opacity-15 ml-4",
        "text-white font-semibold text-lg",
        "border border-white border-opacity-20",
        "shadow-[0_0_15px_rgba(255,255,255,0.3)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        "hover:bg-opacity-20",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50",
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 before:ease-out",
        "hover:before:opacity-20",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center font-primary   text-xl md:text-3xl lg:text-4xl font-medium">
        {children}
        <ArrowRight className="ml-4 h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50 animate-shimmer-x"></span>
        <span className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-pink-200 to-transparent opacity-50 animate-shimmer-y"></span>
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50 animate-shimmer-x"></span>
        <span className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-pink-200 to-transparent opacity-50 animate-shimmer-y"></span>
      </span>
    </button>
  );
});
GlassySquareButton.displayName = "GlassySquareButton";
