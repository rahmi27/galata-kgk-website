import { Skeleton } from "@/components/ui/skeleton";

const eventSkeletons = Array.from({ length: 6 }, (_, index) => index);

function EventCardSkeleton() {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card dark:border-white/10 dark:bg-white/[0.035]">
      <div className="relative aspect-[16/10] overflow-hidden bg-primary-800/80">
        <Skeleton className="absolute inset-0 rounded-none bg-primary-700/70 dark:bg-primary-800/80" />
        <div className="absolute left-5 top-5 space-y-2">
          <Skeleton className="h-8 w-36 rounded-2xl bg-background/75 dark:bg-white/15" />
          <Skeleton className="h-8 w-24 rounded-full bg-primary-900/60 dark:bg-white/10" />
        </div>
      </div>

      <div className="flex min-h-60 flex-1 flex-col p-6">
        <Skeleton className="h-6 w-4/5" />
        <div className="mt-4 space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[92%]" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-auto h-5 w-28" />
      </div>
    </article>
  );
}

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main aria-busy="true" aria-label="Etkinlikler yükleniyor">
        <section className="relative overflow-hidden border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-6 h-12 w-full max-w-xl sm:h-16" />
            <Skeleton className="mt-5 h-5 w-full max-w-2xl" />
            <Skeleton className="mt-2.5 h-5 w-4/5 max-w-xl" />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-5 border-b border-primary/10 pb-8 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <div className="flex flex-wrap gap-2.5">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
                <Skeleton className="h-11 w-40 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventSkeletons.map((item) => (
                <EventCardSkeleton key={item} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
