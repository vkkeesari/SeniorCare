import CareCostCalculator from '@/components/CareCostCalculator';
import OpenCareChatButton from '@/components/OpenCareChatButton';

export default function CareCosts() {
  return <>
    <section className="rounded-[2rem] border border-[#C3A46F]/50 bg-[#F4F0E7] px-6 py-14 text-[#304E43] sm:px-10 sm:py-20"><p className="eyebrow text-[#C3A46F]">Spokane care costs</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">Clarity feels better than guessing.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[#304E43]/85">Explore Spokane-area planning ranges. Actual costs vary by care needs, setting, and provider.</p></section>
    <section className="py-10"><CareCostCalculator /></section>
    <section className="rounded-2xl border border-[#C3A46F]/50 bg-[#F4F0E7] p-6 text-[#304E43] sm:p-8">
      <h2 className="font-serif text-3xl">Ways families may pay</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#C3A46F]/40 bg-white/5 p-4"><h3 className="font-bold text-[#C3A46F]">Private pay</h3><p className="mt-2 text-sm leading-6 text-[#304E43]/85">Monthly planning ranges are about $2,900–$16,700, depending on care level, setting, and provider. Families may use savings, income, or proceeds from a home sale.</p></div>
        <div className="rounded-xl border border-[#C3A46F]/40 bg-white/5 p-4"><h3 className="font-bold text-[#C3A46F]">Medicaid / State Assistance</h3><p className="mt-2 text-sm leading-6 text-[#304E43]/85">Medicaid assistance, WA Apple Health, or Medicaid waiver options may apply depending on facility type and care eligibility in Washington State. Eligibility and participating settings vary.</p></div>
        <div className="rounded-xl border border-[#C3A46F]/40 bg-white/5 p-4"><h3 className="font-bold text-[#C3A46F]">VA benefits</h3><p className="mt-2 text-sm leading-6 text-[#304E43]/85">Eligible veterans or surviving spouses may qualify for Aid and Attendance.</p></div>
        <div className="rounded-xl border border-[#C3A46F]/40 bg-white/5 p-4"><h3 className="font-bold text-[#C3A46F]">Long-term care insurance</h3><p className="mt-2 text-sm leading-6 text-[#304E43]/85">Coverage depends on the individual policy and care eligibility.</p></div>
      </div>
      <OpenCareChatButton className="mt-7 flex min-h-12 items-center gap-2 rounded-full bg-[#C3A46F] px-5 font-bold text-[#F4F0E7] transition hover:bg-[#d4b984] active:bg-[#b18f58]">Talk through your budget</OpenCareChatButton>
    </section>
  </>;
}
