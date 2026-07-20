type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({
  eyebrow = "Yönetim Paneli",
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-heading text-xs font-bold uppercase tracking-[0.18em] text-accent-700">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-primary-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-500 sm:text-base">
          {description}
        </p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  );
}
