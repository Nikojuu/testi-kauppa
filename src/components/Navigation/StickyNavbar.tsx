"use client";

import Image from "next/image";
import Link from "next/link";
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
      className={`fixed top-0 flex left-0 right-0 z-50 transition-colors duration-300 ${
        isHomepage && !isScrolled
          ? "bg-transparent text-white"
          : "bg-white text-black shadow-md"
      }`}
    >
      <nav
        className={`w-full max-w-[3500px] mx-auto px-4 
         flex items-center h-28  bg-transparent   border-b  border-white`}
      >
        <Link href="/" className="lg:mr-20 hidden md:block">
          <Image
            src={isHomepage && isScrolled ? "logo-dark.svg" : "logo-light.svg"}
            alt="logo"
            width={100}
            height={20}
          />
        </Link>
        {children}
      </nav>
    </div>
  );
}
