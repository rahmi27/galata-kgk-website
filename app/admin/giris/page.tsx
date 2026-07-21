import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Yönetici Girişi | Galata KGK",
  description: "Galata KGK yönetim paneli giriş ekranı.",
};

export default async function AdminLoginPage() {
  const admin = await getCurrentAdmin();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-primary-950 px-5 py-12">
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(232,93,44,0.18),transparent_25%),radial-gradient(circle_at_85%_80%,rgba(109,127,190,0.2),transparent_30%)]"
        aria-hidden="true"
      />
      <div className="w-full max-w-md">
        <div className="mb-7 flex items-center justify-center gap-3 text-white">
          <span className="h-8 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="font-heading text-xl font-bold tracking-[-0.03em]">
            Galata KGK
          </span>
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white p-7 shadow-[0_30px_90px_-35px_rgba(0,0,0,0.8)] sm:p-9">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-7 font-heading text-xs font-bold uppercase tracking-[0.18em] text-accent-700">
            Güvenli yönetim alanı
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-[-0.04em] text-primary-950">
            Tekrar hoş geldiniz.
          </h1>
          <p className="mt-3 text-sm leading-6 text-primary-500">
            İçerikleri ve başvuruları yönetmek için hesabınızla giriş yapın.
          </p>

          <AdminLoginForm />
        </section>

        <p className="mt-6 text-center text-xs text-primary-300">
          Bu alan yalnızca yetkili Galata KGK yöneticileri içindir.
        </p>
      </div>
    </main>
  );
}
