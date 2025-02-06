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
        "relative overflow-hidden px-4 sm:px-6  py-3  group bg-black bg-opacity-50 ml-4",
        "text-white ",
        "border border-black border-opacity-20",
        "shadow-[0_0_15px_rgba(255,255,255,0.5)]",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]",
        "hover:bg-opacity-80",
        "focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50",
        "before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 before:ease-out",
        "hover:before:opacity-20",
        className
      )}
      ref={ref}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center font-secondary  text-sm lg:text-xl font-semibold">
        {children}
        <ArrowRight className="ml-4 h-5 w-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
      </span>
      <span className="absolute inset-0 overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-shimmer-x"></span>
        <span className="absolute inset-y-0 right-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent opacity-80 animate-shimmer-y"></span>
        <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 animate-shimmer-x"></span>
        <span className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent opacity-80 animate-shimmer-y"></span>
      </span>
    </button>
  );
});
GlassySquareButton.displayName = "GlassySquareButton";
