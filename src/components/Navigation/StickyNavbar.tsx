"use client";

import Image from "next/image";
import Link from "next/link";

export default function StickyNavbar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <header className="fixed top-0 w-full z-50 bg-transparent md:bg-white/90 md:backdrop-blur-md md:border-b md:border-gray-100">
      <nav
        className={`w-full max-w-[3500px] mx-auto px-4 
         flex items-center h-24  `}
      >
        <Link href="/" className="lg:mr-20 hidden md:block">
          <Image
            src="https://ik.imagekit.io/putiikkipalvelu/tr:w-80,h-80/https:/dsh3gv4ve2.ufs.sh/f/PRCJ5a0N1o4iZ21jgtkpBdQ56DKGgHuI8cM2XEZmqPvzU1fn"
            alt="logo"
            width="80"
            sizes="80px"
            height="80"
          />
        </Link>
        {children}
      </nav>
    </header>
  );
}
