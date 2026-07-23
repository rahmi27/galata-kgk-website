import { Skeleton } from "@/components/ui/skeleton";

const categories = [0, 1];
const members = [0, 1, 2, 3];

function TeamMemberSkeleton() {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-primary-900 dark:border-white/10 dark:bg-primary-950">
      <div className="relative aspect-[5/6] overflow-hidden bg-primary-50 dark:bg-primary-900">
        <Skeleton className="absolute inset-0 rounded-none" />
        <Skeleton className="absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/55 dark:bg-white/10" />
      </div>
      <div className="relative flex min-h-40 flex-col justify-center bg-primary-900 px-6 pb-6 pt-8 dark:bg-primary-950">
        <span className="absolute left-6 top-0 h-8 w-1.5 rounded-b-full bg-accent/55" />
        <Skeleton className="h-6 w-4/5 bg-white/15" />
        <Skeleton className="mt-3 h-4 w-full bg-white/10" />
        <Skeleton className="mt-3 h-3 w-2/3 bg-white/[0.08]" />
      </div>
    </article>
  );
}

export default function TeamLoading() {
  return (
    <div className="min-h-screen bg-background">
      <main aria-busy="true" aria-label="Ekip bilgileri yükleniyor">
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
            {categories.map((category) => (
              <section key={category}>
                <div className="flex items-center gap-5">
                  <Skeleton className="h-4 w-6" />
                  <Skeleton className="h-8 w-64 max-w-[60vw]" />
                  <Skeleton className="h-px flex-1 rounded-none" />
                </div>
                <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {members.map((member) => (
                    <TeamMemberSkeleton key={member} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
