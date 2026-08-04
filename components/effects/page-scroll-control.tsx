"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

type ScrollDirection = "down" | "up";

export function PageScrollControl() {
  const [direction, setDirection] = useState<ScrollDirection>("down");

  useEffect(() => {
    let animationFrame: number | null = null;

    const updateDirection = () => {
      setDirection(window.scrollY > 96 ? "up" : "down");
      animationFrame = null;
    };

    const handleScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateDirection);
      }
    };

    updateDirection();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const handleClick = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";

    if (direction === "up") {
      window.scrollTo({ top: 0, behavior });
      return;
    }

    const firstSection = document.querySelector("#site-content main section");
    const nextContent = firstSection?.nextElementSibling;

    if (nextContent instanceof HTMLElement) {
      nextContent.scrollIntoView({ behavior, block: "start" });
      return;
    }

    window.scrollBy({
      top: Math.min(window.innerHeight * 0.82, 720),
      behavior,
    });
  };

  const isDown = direction === "down";
  const Icon = isDown ? ArrowDown : ArrowUp;

  return (
    <button
      type="button"
      onClick={handleClick}
      data-direction={direction}
      className="page-scroll-control fixed bottom-5 right-4 z-40 inline-flex size-11 items-center justify-center rounded-full border border-primary/15 bg-background/90 text-primary shadow-[0_14px_38px_-16px_rgba(27,42,94,0.65)] backdrop-blur-md transition-[transform,background-color,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-7 sm:right-7 sm:size-12 dark:border-white/15 dark:bg-primary-950/85 dark:text-primary-100 dark:hover:border-accent/60 dark:hover:bg-accent dark:hover:text-accent-foreground"
      aria-label={isDown ? "Sayfada aşağı kaydır" : "Sayfanın başına dön"}
      title={isDown ? "Aşağı kaydır" : "Yukarı dön"}
    >
      <Icon
        className="page-scroll-control__icon size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    </button>
  );
}
