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

    document.documentElement.classList.add("motion-runtime-ready");
    const animationFrames = new Set<number>();

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
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

    const registerElement = (element: Element) => {
      if (element.matches("[data-reveal]")) {
        revealObserver.observe(element);
      }

      if (element.matches("[data-count-up]")) {
        counterObserver.observe(element);
      }

      element
        .querySelectorAll("[data-reveal]")
        .forEach((candidate) => revealObserver.observe(candidate));
      element
        .querySelectorAll("[data-count-up]")
        .forEach((candidate) => counterObserver.observe(candidate));
    };

    registerElement(contentRoot);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            registerElement(node);
          }
        });
      });
    });

    mutationObserver.observe(contentRoot, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      mutationObserver.disconnect();
      animationFrames.forEach((frameId) =>
        window.cancelAnimationFrame(frameId),
      );
    };
  }, [routeKey]);

  return null;
}
