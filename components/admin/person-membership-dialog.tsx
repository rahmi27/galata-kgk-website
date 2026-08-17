"use client";

import { Layers3 } from "lucide-react";

import { MembershipAssignmentForm } from "@/components/admin/membership-assignment-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminActionState } from "@/lib/admin-action-state";

export function PersonMembershipDialog({
  action,
  person,
  categories,
}: {
  action: (
    state: AdminActionState,
    formData: FormData,
  ) => Promise<AdminActionState>;
  person: { id: number; name: string; department: string };
  categories: Array<{ id: number; name: string; nextOrder: number }>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="rounded-lg">
          <Layers3 aria-hidden="true" />
          Kategoriye ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-primary-100 bg-white dark:border-white/15 dark:bg-primary-950 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-primary-950 dark:text-white">
            {person.name} için kategori ekle
          </DialogTitle>
          <DialogDescription className="leading-6 text-primary-600 dark:text-primary-200">
            Yeni kategorideki rolü ve sırası bu kişiye özel kaydedilir.
          </DialogDescription>
        </DialogHeader>
        <MembershipAssignmentForm
          action={action}
          people={[]}
          fixedPerson={person}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
