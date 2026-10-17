import CareCompanion from './CareCompanion';

export default function CompanionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-8 px-0 pb-28 pt-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-0 lg:pb-12 lg:pt-8">
      <div className="min-w-0">{children}</div>
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Care Companion conversation">
        <CareCompanion />
      </aside>
    </div>
  );
}
