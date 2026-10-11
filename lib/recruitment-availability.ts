export type PositionAvailability = {
  isOpen: boolean;
  isArchived: boolean;
  deadline: Date | string | null;
};

export function isPositionOpen(position: PositionAvailability, now = new Date()) {
  return position.isOpen && !position.isArchived &&
    (!position.deadline || new Date(position.deadline) > now);
}

export function openPositionWhere(now = new Date()) {
  return {
    isOpen: true,
    isArchived: false,
    OR: [{ deadline: null }, { deadline: { gt: now } }],
  };
}
