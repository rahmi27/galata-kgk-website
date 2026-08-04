"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Mouse } from "lucide-react";

import { cn } from "@/lib/utils";

type HeroScrollIndicatorProps = {
  targetId: string;
};

export function HeroScrollIndicator({ targetId }: HeroScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY < 32);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTarget = () => {
    const target = document.getElementById(targetId);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTarget}
      className={cn(
        "absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full px-3 py-2 text-primary-600 outline-none transition-opacity duration-200 hover:text-accent-700 focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:text-primary-200 dark:hover:text-accent-300",
        isVisible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      aria-label="İstatistikler bölümüne kaydır"
      aria-controls={targetId}
    >
      <span className="hero-scroll-hint flex flex-col items-center gap-0.5">
        <Mouse className="size-5" strokeWidth={1.5} aria-hidden="true" />
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}
