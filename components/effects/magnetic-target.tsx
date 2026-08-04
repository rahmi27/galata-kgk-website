"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type MagneticTargetProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticTarget({
  children,
  className,
  strength = 7,
}: MagneticTargetProps) {
  const targetRef = useRef<HTMLSpanElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    const target = targetRef.current;
    if (
      !target ||
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = target.getBoundingClientRect();
    const offsetX = (event.clientX - (bounds.left + bounds.width / 2)) * 0.14;
    const offsetY = (event.clientY - (bounds.top + bounds.height / 2)) * 0.14;
    const translateX = Math.max(-strength, Math.min(strength, offsetX));
    const translateY = Math.max(-strength, Math.min(strength, offsetY));

    target.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
  };

  const resetPosition = () => {
    targetRef.current?.style.setProperty("transform", "translate3d(0, 0, 0)");
  };

  return (
    <span
      ref={targetRef}
      className={cn("magnetic-target inline-flex", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPosition}
      onPointerCancel={resetPosition}
    >
      {children}
    </span>
  );
}
