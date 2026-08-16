"use client";

import { useActionState } from "react";
import { LoaderCircle, Save } from "lucide-react";

import { ActionMessage, FormField } from "@/components/admin/person-admin-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminActionState } from "@/lib/admin-action-state";
import { initialAdminActionState } from "@/lib/admin-action-state";

export function MembershipEditForm({ action, role, order, membershipId }: { action: (state: AdminActionState, formData: FormData) => Promise<AdminActionState>; role: string; order: number; membershipId: number }) {
  const [state, formAction, isPending] = useActionState(action, initialAdminActionState);
  return (
    <form action={formAction} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_7rem_auto] sm:items-end">
      <FormField label="Rol" htmlFor={`membership-role-${membershipId}`}><Input id={`membership-role-${membershipId}`} name="role" defaultValue={role} minLength={2} maxLength={140} required /></FormField>
      <FormField label="Sıra" htmlFor={`membership-order-${membershipId}`}><Input id={`membership-order-${membershipId}`} name="order" type="number" defaultValue={order} min={0} max={9999} required /></FormField>
      <Button type="submit" variant="outline" className="rounded-xl" disabled={isPending}>{isPending ? <LoaderCircle className="animate-spin" /> : <Save />}Kaydet</Button>
      <div className="sm:col-span-3"><ActionMessage state={state} /></div>
    </form>
  );
}
