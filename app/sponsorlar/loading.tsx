import { Skeleton } from "@/components/ui/skeleton";

const featuredSponsors = [0, 1, 2];
const compactSponsors = [0, 1, 2, 3];

function SponsorSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <article>
      <div
        className={
          featured
            ? "flex min-h-48 items-center justify-center rounded-2xl border border-primary/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.06] sm:min-h-56 sm:p-10"
            : "flex min-h-32 items-center justify-center rounded-2xl border border-primary/10 bg-white p-6 dark:border-white/10 dark:bg-white/[0.06] sm:min-h-36"
        }
      >
        <Skeleton className={featured ? "h-20 w-3/5" : "h-14 w-1/2"} />
      </div>
      <Skeleton className={featured ? "mt-5 h-7 w-2/3" : "mt-4 h-5 w-1/2"} />
      <Skeleton className="mt-3 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-4/5" />
    </article>
  );
}

export default function SponsorsLoading() {
  return (
    <div className="bg-background">
      <main aria-busy="true" aria-label="Sponsor bilgileri yükleniyor">
        <section className="border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-6 h-12 w-full max-w-2xl sm:h-16" />
            <Skeleton className="mt-5 h-5 w-full max-w-xl" />
            <Skeleton className="mt-2.5 h-5 w-3/4 max-w-lg" />
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl space-y-20 px-5 sm:px-8 lg:px-10">
            <section>
              <div className="flex items-center gap-5">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-8 w-52" />
                <Skeleton className="h-px flex-1 rounded-none" />
              </div>
              <div className="mt-9 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {featuredSponsors.map((sponsor) => (
                  <SponsorSkeleton key={sponsor} featured />
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-5">
                <Skeleton className="h-4 w-6" />
                <Skeleton className="h-8 w-44" />
                <Skeleton className="h-px flex-1 rounded-none" />
              </div>
              <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {compactSponsors.map((sponsor) => (
                  <SponsorSkeleton key={sponsor} />
                ))}
              </div>
            </section>
          </div>
        </section>

        <section className="border-t border-white/10 bg-primary-900 py-20 dark:bg-[#080d20] sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-10">
            <div>
              <Skeleton className="h-4 w-44 bg-white/10" />
              <Skeleton className="mt-6 h-12 w-full max-w-xl bg-white/15 sm:h-16" />
              <Skeleton className="mt-5 h-5 w-full max-w-2xl bg-white/10" />
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-44 bg-white/[0.08]" />
                <Skeleton className="h-44 bg-white/[0.08]" />
              </div>
            </div>
            <div className="grid gap-3 self-center">
              <Skeleton className="h-24 bg-white/[0.08]" />
              <Skeleton className="h-24 bg-white/[0.08]" />
              <Skeleton className="h-24 bg-white/[0.08]" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
