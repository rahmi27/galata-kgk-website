import { Skeleton } from "@/components/ui/skeleton";

export default function CollaborationsLoading() {
  return (
    <main className="bg-background">
      <section className="border-b border-primary/10 bg-primary-50/65 py-20 dark:border-white/10 dark:bg-primary-900/30 sm:py-28">
        <div className="mx-auto max-w-7xl space-y-5 px-5 sm:px-8 lg:px-10">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-14 w-full max-w-md" />
          <Skeleton className="h-6 w-full max-w-2xl" />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:grid-cols-2 sm:px-8 sm:py-28 lg:grid-cols-3 lg:px-10">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-[1.75rem] border border-primary/10 bg-card dark:border-white/10"
          >
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-4 p-7">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-7 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
