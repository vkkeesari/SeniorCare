import CareCompanion from './CareCompanion';

export default function CompanionLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto grid w-full max-w-[1560px] grid-cols-1 items-start gap-8 px-4 pb-28 pt-5 sm:px-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(360px,440px)] lg:gap-8 lg:px-8 lg:pb-12 lg:pt-8">
      <div className="min-w-0">{children}</div>
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Care Companion conversation">
        <CareCompanion />
      </aside>
    </div>
  );
}
