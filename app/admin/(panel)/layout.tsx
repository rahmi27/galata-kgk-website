import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    default: "Yönetim Paneli | Galata KGK",
    template: "%s | Galata KGK Yönetim",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/giris");
  }

  return (
    <AdminShell
      userName={session.user.name ?? "Yönetici"}
      userEmail={session.user.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
