import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/admin-auth";

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
  const admin = await requireAdmin();

  return (
    <AdminShell
      userName={admin.name}
      username={admin.username}
    >
      {children}
    </AdminShell>
  );
}
