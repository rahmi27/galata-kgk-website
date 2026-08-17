"use client";

import { useEffect } from "react";

type ScrollMotionRuntimeProps = {
  routeKey: string;
};

function parseCounterValue(rawValue: string) {
  const numericMatch = rawValue.match(/\d[\d.,]*/);

  if (!numericMatch) {
    return null;
  }

  const matchedValue = numericMatch[0];
  const normalizedValue = matchedValue
    .replace(/[.,](?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const target = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(target)) {
    return null;
  }

  const decimalPart = normalizedValue.split(".")[1];

  return {
    target,
    decimals: decimalPart?.length ?? 0,
    prefix: rawValue.slice(0, numericMatch.index ?? 0),
    suffix: rawValue.slice((numericMatch.index ?? 0) + matchedValue.length),
  };
}

export function ScrollMotionRuntime({ routeKey }: ScrollMotionRuntimeProps) {
  useEffect(() => {
    const contentRoot = document.getElementById("site-content");
    if (!contentRoot) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      document.documentElement.classList.remove("motion-runtime-ready");
      return;
    }

    const animationFrames = new Set<number>();
    const pendingRevealElements = new Set<Element>();
    const pendingRevealAnimations = new Map<Element, Animation>();
    const revealAnimations = new Set<Animation>();
    const revealDelays = new WeakMap<Element, number>();
    let revealCheckFrame: number | null = null;

    const isInsideInitialViewport = (element: Element) => {
      const bounds = element.getBoundingClientRect();

      return bounds.top < window.innerHeight && bounds.bottom > 0;
    };

    const applyStaggerDelays = (grid: Element) => {
      const items = Array.from(grid.children).filter((child) =>
        child.matches("[data-reveal]"),
      ) as HTMLElement[];

      if (items.length < 2) {
        return;
      }

      const maximumDelay = 200;
      const delayStep = Math.min(45, maximumDelay / (items.length - 1));

      items.forEach((item, index) => {
        revealDelays.set(item, Math.round(delayStep * index));
      });
    };

    const revealElement = (element: Element) => {
      pendingRevealAnimations.get(element)?.play();
      pendingRevealAnimations.delete(element);
      pendingRevealElements.delete(element);
      revealObserver.unobserve(element);
    };

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealElement(entry.target);
        });
      },
      { rootMargin: "0px 0px 160px 0px", threshold: 0.1 },
    );

    const animateCounter = (element: HTMLElement) => {
      const rawValue = element.dataset.countUp;
      const parsedValue = rawValue ? parseCounterValue(rawValue) : null;

      if (!rawValue || !parsedValue || element.dataset.counted === "true") {
        return;
      }

      element.dataset.counted = "true";
      const duration = 850;
      const startedAt = window.performance.now();

      const update = (timestamp: number) => {
        const progress = Math.min((timestamp - startedAt) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = parsedValue.target * easedProgress;
        const formattedValue = currentValue.toLocaleString("tr-TR", {
          minimumFractionDigits: parsedValue.decimals,
          maximumFractionDigits: parsedValue.decimals,
        });

        element.textContent = `${parsedValue.prefix}${formattedValue}${parsedValue.suffix}`;

        if (progress < 1) {
          const frameId = window.requestAnimationFrame(update);
          animationFrames.add(frameId);
        } else {
          element.textContent = rawValue;
        }
      };

      element.textContent = `${parsedValue.prefix}0${parsedValue.suffix}`;
      const frameId = window.requestAnimationFrame(update);
      animationFrames.add(frameId);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCounter(entry.target as HTMLElement);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.35 },
    );

    const registerReveal = (element: Element) => {
      if (
        isInsideInitialViewport(element) ||
        pendingRevealAnimations.has(element) ||
        !(element instanceof HTMLElement)
      ) {
        return;
      }

      const animation = element.animate(
        [
          { opacity: 0, transform: "translate3d(0, 16px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ],
        {
          duration: 280,
          delay: revealDelays.get(element) ?? 0,
          easing: "ease-out",
          fill: "both",
        },
      );

      animation.pause();
      pendingRevealElements.add(element);
      pendingRevealAnimations.set(element, animation);
      revealAnimations.add(animation);
      revealObserver.observe(element);
    };

    const revealApproachingElements = () => {
      pendingRevealElements.forEach((element) => {
        const bounds = element.getBoundingClientRect();

        if (bounds.top >= window.innerHeight + 160 || bounds.bottom <= -160) {
          return;
        }

        revealElement(element);
      });
    };

    const scheduleRevealCheck = () => {
      if (revealCheckFrame !== null) {
        return;
      }

      revealCheckFrame = window.requestAnimationFrame(() => {
        revealCheckFrame = null;
        revealApproachingElements();
      });
    };

    const registerElement = (element: Element) => {
      if (element.matches(".stagger-grid")) {
        applyStaggerDelays(element);
      }

      element
        .querySelectorAll(".stagger-grid")
        .forEach(applyStaggerDelays);

      if (element.matches("[data-reveal]")) {
        registerReveal(element);
      }

      if (element.matches("[data-count-up]")) {
        counterObserver.observe(element);
      }

      element
        .querySelectorAll("[data-reveal]")
        .forEach(registerReveal);
      element
        .querySelectorAll("[data-count-up]")
        .forEach((candidate) => counterObserver.observe(candidate));
    };

    let mutationObserver: MutationObserver | null = null;
    let initializationFrame: number | null = null;

    const initializeRuntime = () => {
      initializationFrame = window.requestAnimationFrame(() => {
        initializationFrame = null;

        if (!contentRoot.isConnected) {
          return;
        }

        registerElement(contentRoot);
        mutationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof Element) {
                registerElement(node);
              }
            });
          });
        });

        mutationObserver.observe(contentRoot, {
          childList: true,
          subtree: true,
        });

        window.addEventListener("scroll", scheduleRevealCheck, {
          passive: true,
        });
        window.addEventListener("resize", scheduleRevealCheck);
      });
    };

    if (document.readyState === "complete") {
      initializeRuntime();
    } else {
      window.addEventListener("load", initializeRuntime, { once: true });
    }

    return () => {
      window.removeEventListener("load", initializeRuntime);
      window.removeEventListener("scroll", scheduleRevealCheck);
      window.removeEventListener("resize", scheduleRevealCheck);
      if (initializationFrame !== null) {
        window.cancelAnimationFrame(initializationFrame);
      }
      if (revealCheckFrame !== null) {
        window.cancelAnimationFrame(revealCheckFrame);
      }
      revealObserver.disconnect();
      counterObserver.disconnect();
      mutationObserver?.disconnect();
      revealAnimations.forEach((animation) => animation.cancel());
      animationFrames.forEach((frameId) =>
        window.cancelAnimationFrame(frameId),
      );
    };
  }, [routeKey]);

  return null;
}
