"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Unlink } from "lucide-react";

import { deleteMembershipAction } from "@/app/admin/(panel)/uyeler/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DeleteTeamMembershipButton({ membershipId, personName, categoryName }: { membershipId: number; personName: string; categoryName: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  function remove() {
    setError("");
    startTransition(async () => {
      const result = await deleteMembershipAction(membershipId);
      if (!result.success) return setError(result.message);
      setOpen(false);
      router.refresh();
    });
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button type="button" variant="ghost" size="sm" className="rounded-lg text-red-700 hover:bg-red-50"><Unlink />Kategoriden kaldır</Button></DialogTrigger>
      <DialogContent className="rounded-2xl border-primary-100 bg-white">
        <DialogHeader><DialogTitle className="font-heading text-xl text-primary-950">Kategori üyeliği kaldırılsın mı?</DialogTitle><DialogDescription className="leading-6 text-primary-600">“{personName}”, “{categoryName}” kategorisinden kaldırılacak. Kişi kaydı, fotoğrafı ve diğer kategori atamaları korunacak.</DialogDescription></DialogHeader>
        {error ? <p role="alert" className="text-sm font-medium text-red-700">{error}</p> : null}
        <DialogFooter className="gap-2 sm:space-x-0"><DialogClose asChild><Button type="button" variant="outline">Vazgeç</Button></DialogClose><Button type="button" variant="destructive" onClick={remove} disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : <Unlink />}Kaldır</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
