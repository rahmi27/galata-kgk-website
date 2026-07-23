import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function BrandLogo({
  alt = "",
  className,
  priority = false,
  sizes = "48px",
}: BrandLogoProps) {
  return (
    <Image
      src="/brand/galata-kgk-logo.webp"
      alt={alt}
      width={640}
      height={640}
      priority={priority}
      sizes={sizes}
      className={cn(
        "shrink-0 rounded-full object-contain ring-1 ring-primary/10",
        className,
      )}
    />
  );
}
