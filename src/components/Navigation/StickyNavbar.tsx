"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function StickyNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isHomepage && !isScrolled
          ? "bg-transparent text-white"
          : "bg-white text-black shadow-md"
      }`}
    >
      {children}
    </div>
  );
}
