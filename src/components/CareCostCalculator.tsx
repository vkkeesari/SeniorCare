'use client';

import { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';

const careLevels = [
  { name: 'Independent living', nc: [2800, 4800], national: [3200, 5500] },
  { name: 'Assisted living', nc: [4300, 6800], national: [4800, 7200] },
  { name: 'Memory care', nc: [5600, 8600], national: [6000, 9200] },
  { name: 'Skilled nursing', nc: [8500, 12500], national: [9000, 14000] },
];

export default function CareCostCalculator() {
  const [careIndex, setCareIndex] = useState(1);
  const [region, setRegion] = useState<'nc' | 'national'>('nc');
  const [budget, setBudget] = useState(5500);
  const selected = careLevels[careIndex];
  const [low, high] = selected[region];
  const amount = (value: number) => `$${value.toLocaleString()}`;

  return <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">Care cost snapshot</p><h3 className="mt-2 font-serif text-3xl">A clearer place to start.</h3></div><div className="flex rounded-full border border-slate-200 p-1" role="group" aria-label="Choose cost region">{[['nc', 'North Carolina'], ['national', 'National']] .map(([key, label]) => <button key={key} aria-pressed={region === key} onClick={() => setRegion(key as 'nc' | 'national')} className={`min-h-10 rounded-full px-3 text-sm font-bold ${region === key ? 'bg-ink text-white' : 'text-slate-600'}`}>{label}</button>)}</div></div>
    <div className="mt-6 grid grid-cols-2 gap-2">{careLevels.map((level, index) => <button key={level.name} onClick={() => setCareIndex(index)} aria-pressed={careIndex === index} className={`min-h-12 rounded-xl border px-3 py-2 text-left text-sm font-bold ${careIndex === index ? 'border-moss bg-sage text-ink' : 'border-slate-200 text-slate-600'}`}>{level.name}</button>)}</div>
    <div className="mt-6 rounded-2xl bg-[#f6f4ed] p-5"><p className="flex items-center gap-2 text-sm font-bold text-slate-600"><MapPin size={16} /> Typical monthly range</p><p className="mt-2 font-serif text-4xl">{amount(low)}–{amount(high)}</p><p className="mt-2 text-sm leading-6 text-slate-600">Planning estimates vary by care needs, room type, and community. A local advisor can help you compare options.</p></div>
    <label htmlFor="monthly-budget" className="mt-6 flex items-center justify-between gap-3 text-sm font-bold"><span>Monthly budget to plan around</span><span className="text-moss">{amount(budget)}</span></label>
    <input id="monthly-budget" type="range" min="2000" max="14000" step="250" value={budget} onChange={event => setBudget(Number(event.target.value))} className="mt-3 w-full accent-[#527060]" />
    <div className="mt-5 flex items-start justify-between gap-4 border-t border-slate-100 pt-5"><p className="max-w-sm text-sm leading-6 text-slate-600">Costs are estimates, not quotes. We&apos;ll help you ask the right questions.</p><button onClick={() => window.dispatchEvent(new Event('open-care-chat'))} className="flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-4 text-sm font-bold text-white">Ask an advisor <ArrowRight size={16} /></button></div>
  </div>;
}
