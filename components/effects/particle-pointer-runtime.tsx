"use client";

import { useEffect } from "react";

export function ParticlePointerRuntime() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const finePointer = window.matchMedia("(pointer: fine)");

    if (reduceMotion.matches || !finePointer.matches) {
      return;
    }

    const root = document.documentElement;
    let pointerX = 0;
    let pointerY = 0;
    let animationFrame: number | null = null;

    const applyPointerOffset = () => {
      const normalizedX = (pointerX / window.innerWidth - 0.5) * 2;
      const normalizedY = (pointerY / window.innerHeight - 0.5) * 2;

      root.style.setProperty(
        "--particle-pointer-x",
        `${(normalizedX * 9).toFixed(2)}px`,
      );
      root.style.setProperty(
        "--particle-pointer-y",
        `${(normalizedY * 6).toFixed(2)}px`,
      );
      animationFrame = null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(applyPointerOffset);
      }
    };

    const resetPointerOffset = () => {
      root.style.setProperty("--particle-pointer-x", "0px");
      root.style.setProperty("--particle-pointer-y", "0px");
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("blur", resetPointerOffset);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointerOffset);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
      root.style.removeProperty("--particle-pointer-x");
      root.style.removeProperty("--particle-pointer-y");
    };
  }, []);

  return null;
}
