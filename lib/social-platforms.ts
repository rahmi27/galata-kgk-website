export const socialPlatformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X / Twitter" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Web Sitesi" },
] as const;

export type SocialPlatform = (typeof socialPlatformOptions)[number]["value"];

export const teamSocialPlatformOptions = socialPlatformOptions.filter(
  (platform) =>
    platform.value === "instagram" || platform.value === "linkedin",
);

export function isSocialPlatform(value: string): value is SocialPlatform {
  return socialPlatformOptions.some((platform) => platform.value === value);
}

export function getSocialPlatformLabel(value: string) {
  return (
    socialPlatformOptions.find((platform) => platform.value === value)?.label ??
    value
  );
}
