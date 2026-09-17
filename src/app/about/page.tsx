import Link from 'next/link';
import { ArrowRight, HeartHandshake, LucideIcon, MapPin, ShieldCheck } from 'lucide-react';

const values: Array<[LucideIcon, string, string]> = [
  [MapPin, 'Local perspective', 'Guidance grounded in the communities around Raleigh, Durham, and Cary.'],
  [HeartHandshake, 'No cost to families', 'Our provider partner network funds the service, so your guidance is free.'],
  [ShieldCheck, 'Your choice stays yours', 'We recommend options. You decide what feels right for your family.'],
];

export default function About() {
  return <>
    <section className="bg-sage"><div className="container-shell grid gap-10 py-20 md:grid-cols-[1fr_.8fr] md:items-end md:py-28"><div><p className="eyebrow">Our approach</p><h1 className="mt-4 font-serif text-6xl leading-none">Less pressure. More presence.</h1></div><p className="text-lg leading-8 text-slate-600">Gabe's LLC exists to make a complicated decision feel more personal, more transparent, and much less lonely.</p></div></section>
    <section className="container-shell grid gap-12 py-20 md:grid-cols-2 md:py-28"><div><p className="eyebrow">A local difference</p><h2 className="mt-4 font-serif text-5xl leading-tight">A real person in your corner.</h2><p className="mt-6 leading-8 text-slate-600">Traditional referral services can feel like cold calls and endless lists. Gabe takes a different approach: face-to-face conversations, thoughtful recommendations, and the time to explain the why behind every option.</p><p className="mt-5 leading-8 text-slate-600">We know the Triangle communities because we live and work here. That local context helps families choose with their eyes open.</p></div><div className="grid gap-4">{values.map(([Icon, title, text]) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-sage text-moss"><Icon size={19} /></span><h3 className="font-extrabold">{title}</h3></div><p className="mt-4 text-sm leading-6 text-slate-500">{text}</p></div>)}</div></section>
    <section className="bg-ink text-white"><div className="container-shell flex flex-col gap-7 py-20 md:flex-row md:items-center md:justify-between"><div><p className="eyebrow text-[#b7d0bd]">Ready when you are</p><h2 className="mt-3 font-serif text-4xl">Let's make the next step lighter.</h2></div><Link href="/assessment" className="flex items-center gap-2 rounded-full bg-white px-6 py-4 font-bold text-ink">Take the assessment <ArrowRight size={17} /></Link></div></section>
  </>;
}
