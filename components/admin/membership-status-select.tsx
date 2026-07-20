"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { updateMembershipStatusAction } from "@/app/admin/(panel)/katilim-basvurulari/actions";
import { membershipStatuses } from "@/lib/membership-status";

export function MembershipStatusSelect({
  applicationId,
  currentStatus,
}: {
  applicationId: number;
  currentStatus: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleChange(status: string) {
    setError("");

    startTransition(async () => {
      const result = await updateMembershipStatusAction(applicationId, status);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div>
      <div className="relative">
        <select
          aria-label="Başvuru durumu"
          value={currentStatus}
          onChange={(event) => handleChange(event.target.value)}
          disabled={isPending}
          className="h-10 w-full min-w-40 appearance-none rounded-xl border border-primary-100 bg-white px-3 pr-9 text-sm font-semibold text-primary-800 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-100 disabled:opacity-60"
        >
          {membershipStatuses.map((status) => (
            <option key={status} value={status}>
              {status[0].toLocaleUpperCase("tr-TR") + status.slice(1)}
            </option>
          ))}
        </select>
        {isPending ? (
          <LoaderCircle
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-accent-600"
            aria-hidden="true"
          />
        ) : (
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-400"
            aria-hidden="true"
          >
            ▾
          </span>
        )}
      </div>
      {error ? (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
