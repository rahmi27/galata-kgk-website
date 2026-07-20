"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowRight, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!username || !password) {
      setError("Kullanıcı adı ve şifre alanlarını doldurun.");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Kullanıcı adı veya şifre hatalı. Bilgilerinizi kontrol edin.");
        setIsSubmitting(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Giriş şu anda tamamlanamadı. Lütfen tekrar deneyin.");
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="space-y-2">
        <label
          htmlFor="admin-username"
          className="font-heading text-sm font-semibold text-primary-900"
        >
          Kullanıcı Adı
        </label>
        <div className="relative">
          <UserRound
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary-400"
            aria-hidden="true"
          />
          <Input
            id="admin-username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="admin"
            className="h-12 rounded-xl border-primary-100 bg-primary-50/45 pl-11 text-primary-950 placeholder:text-primary-300 focus-visible:ring-accent"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="admin-password"
          className="font-heading text-sm font-semibold text-primary-900"
        >
          Şifre
        </label>
        <div className="relative">
          <LockKeyhole
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary-400"
            aria-hidden="true"
          />
          <Input
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Şifrenizi girin"
            className="h-12 rounded-xl border-primary-100 bg-primary-50/45 pl-11 text-primary-950 placeholder:text-primary-300 focus-visible:ring-accent"
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="secondary"
        className="h-12 w-full rounded-xl"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />
            Giriş yapılıyor...
          </>
        ) : (
          <>
            Yönetim paneline gir
            <ArrowRight aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
}
