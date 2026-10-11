import { prisma } from "@/lib/prisma";
import { openPositionWhere } from "@/lib/recruitment-availability";

export function getOpenPositions() {
  return prisma.recruitmentPosition.findMany({
    where: openPositionWhere(),
    orderBy: [{ order: "asc" }, { id: "asc" }],
    include: {
      questions: { where: { isActive: true }, orderBy: [{ order: "asc" }, { id: "asc" }] },
      media: { orderBy: [{ order: "asc" }, { id: "asc" }] },
    },
  });
}
