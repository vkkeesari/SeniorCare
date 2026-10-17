'use client';

import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

const careLevels = [
  { name: 'Assisted Living', range: [3500, 10800] },
  { name: 'Adult Family Home', range: [2900, 14500] },
  { name: 'Skilled Nursing', range: [9500, 16700] },
];

export default function CareCostCalculator() {
  const [careIndex, setCareIndex] = useState(0);
  const [budget, setBudget] = useState(8000);
  const selected = careLevels[careIndex];
  const [low, high] = selected.range;
  const amount = (value: number) => `$${value.toLocaleString()}`;

  return <div className="rounded-3xl border border-[#C3A46F]/50 bg-[#F4F0E7] p-6 text-[#304E43] shadow-soft sm:p-8">
    <div><p className="eyebrow text-[#C3A46F]">Spokane care cost snapshot</p><h3 className="mt-2 font-serif text-3xl">A clearer place to start.</h3></div>
    <div className="mt-6 grid gap-2 sm:grid-cols-3">{careLevels.map((level, index) => <button key={level.name} onClick={() => setCareIndex(index)} aria-pressed={careIndex === index} className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-bold transition hover:border-[#C3A46F] active:scale-[.98] ${careIndex === index ? 'border-[#C3A46F] bg-[#C3A46F] text-[#F4F0E7]' : 'border-white/25 bg-white/5 text-[#304E43] hover:bg-white/10'}`}>{level.name}</button>)}</div>
    <div className="mt-6 rounded-2xl bg-[#E7E1D5] p-5 text-[#304E43]"><p className="flex items-center gap-2 text-sm font-bold text-[#304E43]"><MapPin size={16} /> Typical Spokane-area monthly range</p><p className="mt-2 font-serif text-4xl text-[#304E43]">{amount(low)}–{amount(high)}</p><p className="mt-2 text-sm leading-6 text-[#304E43]/80">Planning estimates vary by care needs, room type, and provider. A local advisor can help you compare options.</p></div>
    <label htmlFor="monthly-budget" className="mt-6 flex items-center justify-between gap-3 text-sm font-bold"><span>Monthly budget to plan around</span><span className="text-[#C3A46F]">{amount(budget)}</span></label>
    <input id="monthly-budget" type="range" min="2000" max="17000" step="250" value={budget} onChange={event => setBudget(Number(event.target.value))} className="mt-3 w-full accent-[#C3A46F]" />
    <div className="mt-5 flex items-start justify-between gap-4 border-t border-[#C3A46F]/40 pt-5"><p className="max-w-sm text-sm leading-6 text-[#304E43]/80">Costs are estimates, not quotes. We&apos;ll help you ask the right questions.</p><button onClick={() => window.dispatchEvent(new Event('open-care-chat'))} className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#C3A46F] px-4 text-sm font-bold text-[#F4F0E7] transition hover:bg-[#d4b984] active:scale-[.98] active:bg-[#b18f58]">Ask an advisor <ArrowRight size={16} /></button></div>
  </div>;
}
