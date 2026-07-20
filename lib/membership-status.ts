export const membershipStatuses = [
  "beklemede",
  "onaylandı",
  "reddedildi",
] as const;

export type MembershipStatus = (typeof membershipStatuses)[number];
