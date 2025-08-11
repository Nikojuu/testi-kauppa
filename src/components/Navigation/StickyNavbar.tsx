"use client";

import { LOGO_URL } from "@/app/utils/constants";
import { Campaign } from "@/app/utils/types";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function StickyNavbar({
  children,
  campaigns,
}: {
  children: React.ReactNode;
  campaigns: Campaign[];
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const getCampaignEmoji = (type: string) => {
    switch (type) {
      case "FREE_SHIPPING":
        return "🚚";
      case "BUY_X_PAY_Y":
        return "💰";
        // case "PERCENTAGE_DISCOUNT":
        //   return "🏷️";
        // case "FIXED_DISCOUNT":
        //   return "💸";
        // case "FLASH_SALE":
        //   return "⚡";
        // case "SEASONAL_SALE":
        //   return "🎉";
        // case "NEW_CUSTOMER":
        //   return "👋";
        // case "LOYALTY_REWARD":
        //   return "🎁";
        // case "BULK_DISCOUNT":
        //   return "📦";
        // case "HOLIDAY_SALE":
        //   return "🎄";
        // default:
        return "🎯";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        // At the top - always show banner
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide banner
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show banner
        setIsScrolled(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className="fixed top-0 w-full z-50 bg-transparent md:bg-white/90 md:backdrop-blur-md md:border-b md:border-gray-100">
      <nav
        className={`w-full max-w-[3500px] mx-auto px-4 
         flex items-center h-20  `}
      >
        <Link href="/" className="lg:mr-20 hidden md:block">
          <Image
            src={LOGO_URL}
            alt="logo"
            width="80"
            sizes="80px"
            height="80"
          />
        </Link>
        {children}
      </nav>
      {!isScrolled && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-center py-2 px-4 shadow-sm"
        >
          <p className="text-sm font-medium tracking-wide text-center">
            Aktiiviset kampanjat:
          </p>
          <div className="flex flex-wrap justify-center">
            {campaigns.map((campaign, index) => (
              <span key={campaign.id}>
                <span className="text-white text-sm font-medium tracking-wide">
                  {getCampaignEmoji(campaign.type)} {campaign.name}
                </span>
                {index < campaigns.length - 1 && (
                  <span className="text-white text-sm font-medium tracking-wide mx-4">
                    |
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
}
