import Image from "next/image";

export function PersonAvatar({
  name,
  photoUrl,
  photoAlt,
  size = 48,
}: {
  name: string;
  photoUrl?: string | null;
  photoAlt?: string | null;
  size?: number;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("tr-TR");

  return (
    <div
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50 font-heading text-sm font-bold text-primary-700 ring-1 ring-primary-100 dark:bg-primary-800 dark:text-primary-100 dark:ring-white/10"
      style={{ width: size, height: size }}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt={photoAlt || `${name} portresi`}
          fill
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
