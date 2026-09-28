import CareCostCalculator from '@/components/CareCostCalculator';
import OpenCareChatButton from '@/components/OpenCareChatButton';

export default function CareCosts() {
  return <>
    <section className="rounded-[2rem] bg-ink px-6 py-14 text-white sm:px-10 sm:py-20"><p className="eyebrow text-[#c2d7c8]">Care costs hub</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">Clarity feels better than guessing.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">Compare planning ranges for North Carolina and the national average. Actual costs vary by care needs and community.</p></section>
    <section className="py-10"><CareCostCalculator /></section>
    <section className="rounded-2xl bg-[#f5f3ed] p-6 sm:p-8"><h2 className="font-serif text-3xl">Ways families may pay</h2><div className="mt-5 grid gap-4 sm:grid-cols-3"><div><h3 className="font-bold">Private pay</h3><p className="mt-2 text-sm leading-6 text-slate-600">Savings, income, or proceeds from a home sale.</p></div><div><h3 className="font-bold">VA benefits</h3><p className="mt-2 text-sm leading-6 text-slate-600">Eligible veterans or surviving spouses may qualify for Aid and Attendance.</p></div><div><h3 className="font-bold">Long-term care insurance</h3><p className="mt-2 text-sm leading-6 text-slate-600">Coverage depends on the individual policy and care eligibility.</p></div></div><OpenCareChatButton className="mt-7 flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 font-bold text-white">Talk through your budget</OpenCareChatButton></section>
  </>;
}
