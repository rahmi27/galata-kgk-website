import Link from "next/link";
import { ArrowLeft, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <main className="relative isolate flex min-h-[70vh] items-center overflow-hidden border-b border-primary/10 px-5 py-24 dark:border-white/10">
        <div
          className="absolute -right-36 top-10 -z-10 size-[30rem] rounded-full border-[70px] border-accent/10"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-52 -left-36 -z-10 size-[34rem] rounded-full border-[80px] border-primary/5 dark:border-white/[0.035]"
          aria-hidden="true"
        />

        <div className="mx-auto w-full max-w-3xl text-center">
          <p className="font-heading text-7xl font-bold tracking-[-0.07em] text-primary sm:text-9xl dark:text-white">
            4<span className="text-accent">0</span>4
          </p>
          <h1 className="mt-5 font-heading text-3xl font-bold tracking-[-0.04em] text-primary sm:text-5xl dark:text-white">
            Aradığın sayfa burada değil.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Bağlantı değişmiş veya sayfa kaldırılmış olabilir. Ana sayfaya
            dönebilir ya da yaklaşan etkinlikleri keşfedebilirsin.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button asChild variant="primary" size="lg">
              <Link href="/">
                <ArrowLeft aria-hidden="true" />
                Ana sayfaya dön
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/etkinliklerimiz">
                <CalendarDays aria-hidden="true" />
                Etkinlikleri gör
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
