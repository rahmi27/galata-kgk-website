"use server";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminActionState } from "@/lib/admin-action-state";

export async function updateMembershipStatusAction(_id: number, _status: string): Promise<AdminActionState> {
  await requireAdmin();
  return { success: false, message: "Eski başvurular arşivdir; değiştirilemez." };
}

export async function deleteMembershipApplicationAction(_id: number): Promise<AdminActionState> {
  await requireAdmin();
  return { success: false, message: "Eski başvurular arşivdir; silinemez." };
}
