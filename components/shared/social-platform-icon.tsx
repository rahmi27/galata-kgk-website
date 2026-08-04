import { Globe2 } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import type { SocialPlatform } from "@/lib/social-platforms";

const socialIcons = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  x: FaXTwitter,
  facebook: FaFacebookF,
  website: Globe2,
} satisfies Record<SocialPlatform, React.ComponentType<{ className?: string }>>;

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const Icon = socialIcons[platform as SocialPlatform] ?? Globe2;

  return <Icon className={className} aria-hidden="true" />;
}
