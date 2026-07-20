"use client";

import { useActionState, useEffect, useRef } from "react";
import { KeyRound, LoaderCircle, UserPlus } from "lucide-react";

import { createAdminUserAction } from "@/app/admin/(panel)/kullanicilar/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initialAdminActionState } from "@/lib/admin-action-state";

export function AdminUserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    createAdminUserAction,
    initialAdminActionState,
  );

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="new-admin-username"
          className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
        >
          Kullanıcı Adı
        </label>
        <Input
          id="new-admin-username"
          name="username"
          type="text"
          autoComplete="off"
          placeholder="örn. etkinlik.admin"
          minLength={3}
          maxLength={32}
          pattern="[a-z0-9._-]+"
          required
        />
        <p className="text-xs leading-5 text-primary-500 dark:text-primary-200">
          Küçük harf, rakam, nokta, tire ve alt çizgi kullanabilirsiniz.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="new-admin-password"
          className="font-heading text-sm font-semibold text-primary-900 dark:text-primary-50"
        >
          Geçici Şifre
        </label>
        <div className="relative">
          <KeyRound
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-primary-500"
            aria-hidden="true"
          />
          <Input
            id="new-admin-password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="En az 12 karakter"
            className="pl-10"
            minLength={12}
            required
          />
        </div>
      </div>

      {state.message ? (
        <p
          role={state.success ? "status" : "alert"}
          className={
            state.success
              ? "rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
              : "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          }
        >
          {state.message}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="primary"
        className="rounded-xl"
        disabled={isPending}
      >
        {isPending ? (
          <LoaderCircle className="animate-spin" aria-hidden="true" />
        ) : (
          <UserPlus aria-hidden="true" />
        )}
        Admin kullanıcı oluştur
      </Button>
    </form>
  );
}
